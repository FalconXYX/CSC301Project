var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
const { z } = require("zod");
const geolib = require("geolib");

// ─── Config ────────────────────────────────────────────────────────────────
const MAX_RESULTS = 4;
const MAX_SEARCH_RADIUS_M = 50_000; // 50 km hard cap — no cross-country results
const MIN_SCORE_THRESHOLD = 10; // Don't surface clinics with near-zero relevance

// Score weights — must sum to 100 for intuitive reading
const WEIGHTS = {
  specialty: 50,
  insurance: 30,
  appointment_type: 15,
  urgency: 5,
};

// Distance scoring: full points within NEAR_RADIUS, decays linearly to 0 at MAX_SEARCH_RADIUS_M
const NEAR_RADIUS_M = 5_000; // 5 km = full distance bonus

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
 */
router.post("/search", async function (req, res, next) {
  try {
    const preferences = searchSchema.parse(req.body || {});
    const { specialty, latitude, longitude, appointment_type, urgency } =
      preferences;

    const requestedInsurances = normalizeInsurances(preferences.insurance);
    const hasLocation = latitude != null && longitude != null;

    // ── 1. DATABASE PRE-FILTER ──────────────────────────────────────────────
    // Build a focused WHERE clause instead of a catch-all OR.
    // Pull only clinics that have at least a fighting chance of matching.
    const whereClause = buildWhereClause(specialty);

    const clinicsList = await prisma.clinics.findMany({
      where: whereClause,
      include: {
        practitioners: true,
        clinic_insurances: { include: { insurance: true } },
      },
    });

    // ── 2. SCORING ENGINE ───────────────────────────────────────────────────
    const scoredClinics = clinicsList
      .map((clinic) => {
        const distance = computeDistance(clinic, {
          latitude,
          longitude,
          hasLocation,
        });

        // Drop clinics outside the hard radius cap immediately
        if (hasLocation && distance != null && distance > MAX_SEARCH_RADIUS_M) {
          return null;
        }

        const score = computeScore(clinic, {
          specialty,
          requestedInsurances,
          appointment_type,
          urgency,
          distance,
          hasLocation,
        });

        return { ...clinic, matchScore: score, distance };
      })
      .filter((c) => c != null && c.matchScore >= MIN_SCORE_THRESHOLD);

    // ── 3. SORTING ──────────────────────────────────────────────────────────
    // Score and distance are kept separate throughout — no more mixing units.
    // Primary: matchScore desc. Tie-break: distance asc.
    scoredClinics.sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return (a.distance ?? Infinity) - (b.distance ?? Infinity);
    });

    res.json({ clinics: scoredClinics.slice(0, MAX_RESULTS) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid search parameters", details: error.errors });
    }
    next(error);
  }
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalizeInsurances(insurance) {
  if (!insurance) return [];
  const arr = Array.isArray(insurance) ? insurance : [insurance];
  return arr.map((i) => i.toLowerCase().trim());
}

/**
 * Build a WHERE clause that actually pre-filters by specialty.
 * When specialty is absent we still fetch all clinics, but we don't
 * accidentally negate the specialty filter with an open `{}` branch.
 */
function buildWhereClause(specialty) {
  if (!specialty) return {}; // No filter — caller asked for anything

  return {
    OR: [
      { services_json: { array_contains: specialty } },
      {
        practitioners: {
          some: { profession: { equals: specialty, mode: "insensitive" } },
        },
      },
    ],
  };
}

/**
 * Distance in metres, or null if coordinates are missing.
 */
function computeDistance(clinic, { latitude, longitude, hasLocation }) {
  if (!hasLocation || clinic.latitude == null || clinic.longitude == null) {
    return null;
  }
  return geolib.getDistance(
    { latitude, longitude },
    { latitude: Number(clinic.latitude), longitude: Number(clinic.longitude) },
  );
}

/**
 * Returns a normalised 0–100 score (+ small bonuses) for a single clinic.
 *
 * Distance is scored independently on its own 0–10 scale and never
 * subtracted from the relevance score — mixing metres with relevance
 * points was the root cause of the original sorting bug.
 */
function computeScore(
  clinic,
  {
    specialty,
    requestedInsurances,
    appointment_type,
    urgency,
    distance,
    hasLocation,
  },
) {
  let score = 0;
  const services = Array.isArray(clinic.services_json)
    ? clinic.services_json
    : [];
  const clinicSpecialties = Array.isArray(clinic.specialties_json)
    ? clinic.specialties_json
    : [];

  // ── Specialty (weight: 50) ─────────────────────────────────────────────
  if (specialty) {
    const specialtyLower = specialty.toLowerCase();
    const hasDirectSpecialty = clinicSpecialties.some(
      (s) => s.toLowerCase() === specialtyLower,
    );
    const hasPractitioner = clinic.practitioners.some(
      (p) => p.profession.toLowerCase() === specialtyLower,
    );

    if (hasDirectSpecialty) score += WEIGHTS.specialty;
    else if (hasPractitioner) score += WEIGHTS.specialty * 0.7; // 35 pts
  }

  // ── Insurance (weight: 30) ─────────────────────────────────────────────
  if (requestedInsurances.length > 0) {
    const supportedInsurances = clinic.clinic_insurances.map((ci) =>
      ci.insurance.name.toLowerCase().trim(),
    );

    // Exact token match — avoids "sun" matching "sunshine insurance"
    const matchCount = requestedInsurances.filter((req) =>
      supportedInsurances.some(
        (sup) =>
          sup === req || sup.startsWith(req + " ") || sup.endsWith(" " + req),
      ),
    ).length;

    score += (matchCount / requestedInsurances.length) * WEIGHTS.insurance;

    if (clinic.offers_direct_billing) score += 5; // Small UX bonus
  }

  // ── Appointment type (weight: 15) ──────────────────────────────────────
  if (appointment_type) {
    if (appointment_type === "either") {
      // Flexible patient: reward clinics that offer both modalities
      const hasInPerson = services.includes("in_person");
      const hasVirtual = services.includes("virtual");
      if (hasInPerson && hasVirtual) score += WEIGHTS.appointment_type;
      else if (hasInPerson || hasVirtual)
        score += WEIGHTS.appointment_type * 0.6;
    } else {
      if (services.includes(appointment_type))
        score += WEIGHTS.appointment_type;
    }
  }

  // ── Urgency (weight: 5) ────────────────────────────────────────────────
  // Staff count is a proxy for capacity — kept low-weight because it's imprecise.
  if (urgency === "asap") {
    const staffCount = clinic.practitioners.length;
    score += Math.min(staffCount, WEIGHTS.urgency); // 1 pt per staff member, capped
  }

  // ── Distance bonus (separate 0–10 scale, never mixed with relevance) ───
  // Full 10 pts within NEAR_RADIUS, linear decay to 0 at MAX_SEARCH_RADIUS_M.
  if (hasLocation && distance != null) {
    const distanceBonus =
      distance <= NEAR_RADIUS_M
        ? 10
        : Math.max(
            0,
            10 *
              (1 -
                (distance - NEAR_RADIUS_M) /
                  (MAX_SEARCH_RADIUS_M - NEAR_RADIUS_M)),
          );
    score += distanceBonus;
  }

  return Math.round(score * 10) / 10; // 1 decimal place is plenty
}

module.exports = router;
