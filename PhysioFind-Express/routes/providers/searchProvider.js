var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
const { z } = require("zod");
const geolib = require("geolib");

// Schema for searching clinics
const searchSchema = z.object({
  specialty: z.string().optional(),
  insurance: z.union([z.array(z.string()), z.string()]).optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  appointment_type: z.enum(["in_person", "virtual", "either"]).optional(),
  urgency: z.enum(["asap", "two_weeks", "month", "flexible"]).optional(),
});

/**
 * POST /clinics/search
 * Search clinics based on questionnaire preferences using Prisma.
 */
router.post("/search", async function (req, res, next) {
  try {
    const preferences = searchSchema.parse(req.body || {});

    const requestedSpecialty = preferences.specialty;
    const rawInsurances = preferences.insurance;
    const requestedInsurances = Array.isArray(rawInsurances)
      ? rawInsurances
      : rawInsurances
        ? [rawInsurances]
        : [];

    // Build Prisma Where clause
    const whereClause = {};
    const OR_conditions = [];

    // 1. Specialty matching
    if (requestedSpecialty) {
      // Prisma's array_contains requires passing the exact match for an array of strings in JSON,
      // or we can use string contains if we are storing it as JSON string.
      // Easiest is to fall back to fetching if the JSON searching gets overly complicated
      // but Prisma standard for generic JSON in array_contains:
      const specialtyCondition = {
        OR: [
          {
            specialties_json: {
              array_contains: requestedSpecialty,
            },
          },
          {
            practitioners: {
              some: {
                profession: {
                  equals: requestedSpecialty,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      };

      OR_conditions.push(specialtyCondition);
    }

    // 2. Appointment Type
    if (preferences.appointment_type === "virtual") {
      // Use SQL-safe check or keep array_contains. Adding to OR or AND where needed.
      whereClause.services_json = {
        array_contains: "virtual",
      };
    }

    // 3. Location / Postal code starts with user's FSA
    if (preferences.location && preferences.location.length >= 3) {
      const fsa = preferences.location.substring(0, 3).toUpperCase();
      whereClause.postal_code = {
        startsWith: fsa,
        mode: "insensitive",
      };
    }

    // Merge OR conditions if present
    if (OR_conditions.length > 0) {
      whereClause.AND = OR_conditions;
    }

    const clinicsList = await prisma.clinics.findMany({
      where: whereClause,
      include: {
        practitioners: true,
        clinic_insurances: {
          include: {
            insurance: true,
          },
        },
      },
    });

    // Post processing for insurance since standard JSON matching doesn't fit standard relation matching as nicely
    let scoredClinics = clinicsList.map((clinic) => {
      let score = 0;

      // Insurance match score
      if (requestedInsurances.length > 0) {
        const supportedInsurances = clinic.clinic_insurances.map((ci) =>
          ci.insurance.name.toLowerCase().replace(/ /g, "_"),
        );
        let insuranceMatched = 0;
        requestedInsurances.forEach((ins) => {
          if (
            supportedInsurances.some((si) => si.includes(ins.toLowerCase()))
          ) {
            insuranceMatched++;
          }
        });
        score += insuranceMatched * 20;

        if (clinic.offers_direct_billing) {
          score += 10;
        }
      }

      // 5. Urgency
      if (preferences.urgency === "asap") {
        if (clinic.practitioners && clinic.practitioners.length > 3) {
          score += 15;
        }
      }

      // 6. Calculate distance if user coords provided
      let distance = null;
      if (
        preferences.latitude &&
        preferences.longitude &&
        clinic.latitude &&
        clinic.longitude
      ) {
        distance = geolib.getDistance(
          { latitude: preferences.latitude, longitude: preferences.longitude },
          {
            latitude: Number(clinic.latitude),
            longitude: Number(clinic.longitude),
          },
        );
      }

      return {
        ...clinic,
        matchScore: score,
        distance: distance,
      };
    });

    // Sort by distance and score combined
    scoredClinics.sort((a, b) => {
      let scoreA = a.matchScore;
      let scoreB = b.matchScore;

      // Penalize distance (farther = lower score). For example, subtract 1 point per km
      if (a.distance !== null) {
        scoreA -= a.distance / 1000;
      }
      if (b.distance !== null) {
        scoreB -= b.distance / 1000;
      }

      // If one has distance and another doesn't, prioritize the one with distance slightly
      if (a.distance !== null && b.distance === null) scoreA += 10;
      if (b.distance !== null && a.distance === null) scoreB += 10;

      return scoreB - scoreA; // descending
    });

    const topClinics = scoredClinics.slice(0, 10);

    res.json({ clinics: topClinics });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid search parameters", details: error.errors });
    }
    next(error);
  }
});

module.exports = router;
