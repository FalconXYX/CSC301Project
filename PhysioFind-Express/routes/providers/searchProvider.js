var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
const { z } = require('zod');

// Schema for searching clinics
const searchSchema = z.object({
  specialty: z.string().optional(),
  insurance: z.union([z.array(z.string()), z.string()]).optional(),
  location: z.string().optional(),
  appointment_type: z.enum(["in_person", "virtual", "either"]).optional(),
  urgency: z.enum(["asap", "two_weeks", "month", "flexible"]).optional()
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
       : (rawInsurances ? [rawInsurances] : []);
       
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
              array_contains: requestedSpecialty
            }
          },
          {
            practitioners: {
              some: {
                profession: {
                  equals: requestedSpecialty,
                  mode: 'insensitive'
                }
              }
            }
          }
        ]
      };
      
      // Merge into where clause
      Object.assign(whereClause, specialtyCondition);
    }

    // 2. Appointment Type
    if (preferences.appointment_type === 'virtual') {
      whereClause.services_json = {
        array_contains: "virtual"
      };
    }

    // 3. Location / Postal code starts with user's FSA
    if (preferences.location && preferences.location.length >= 3) {
      const fsa = preferences.location.substring(0, 3).toUpperCase();
      whereClause.postal_code = {
        startsWith: fsa,
        mode: 'insensitive'
      };
    }

    const clinicsList = await prisma.clinics.findMany({
      where: whereClause,
      include: {
        practitioners: true,
        clinic_insurances: {
          include: {
            insurance: true
          }
        }
      }
    });

    // Post processing for insurance since standard JSON matching doesn't fit standard relation matching as nicely
    let scoredClinics = clinicsList.map(clinic => {
      let score = 0;

      // Insurance match score
      if (requestedInsurances.length > 0) {
        const supportedInsurances = clinic.clinic_insurances.map(ci => ci.insurance.name.toLowerCase().replace(/ /g, "_"));
        let insuranceMatched = 0;
        requestedInsurances.forEach(ins => {
          if (supportedInsurances.some(si => si.includes(ins.toLowerCase()))) {
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

      return {
        ...clinic,
        matchScore: score
      };
    });

    // Sort by descending score
    scoredClinics.sort((a, b) => b.matchScore - a.matchScore);
    
    const topClinics = scoredClinics.slice(0, 10);

    res.json({ clinics: topClinics });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid search parameters", details: error.errors });
    }
    next(error);
  }
});

module.exports = router;
