var express = require("express");
var router = require("express").Router();
var prisma = require("../../config/prisma");
const { z } = require("zod");
const geolib = require("geolib");

// ─── Config ────────────────────────────────────────────────────────────────
const MAX_RESULTS = 4;
const MAX_SEARCH_RADIUS_M = 50_000; // 50 km hard cap
const MIN_SCORE_THRESHOLD = 10;
const NEAR_RADIUS_M = 5_000; // 5 km = full distance bonus

// Specialty is a HARD GATE — clinics that don't match are rejected outright,
// not just scored lower. These weights only apply to clinics that pass the gate.
const WEIGHTS = {
  insurance: 40,
  appointment_type: 35,
  direct_billing: 10, // bonus for ease-of-use
  // urgency: TODO — requires calendar/availability integration
};

const searchSchema = z.object({
  specialty: z.string().optional(),
  insurance: z.union([z.array(z.string()), z.string()]).optional(),
  location: z.string().optional(), // postal code / city string
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
    const { specialty, appointment_type } = preferences;
    let { latitude, longitude } = preferences;

    // Geocode postal code / city string if no explicit coords provided
    if ((latitude == null || longitude == null) && preferences.location) {
      const coords = await geocodeLocation(preferences.location);
      if (coords) ({ latitude, longitude } = coords);
    }

    const requestedInsurances = normalizeInsurances(preferences.insurance);
    const hasLocation = latitude != null && longitude != null;

    // ── 1. DATABASE FETCH ───────────────────────────────────────────────────
    // Fetch all clinics — no DB-level specialty filter.
    //
    // Why: services_json and specialties_json are stored as raw JSON *strings*
    // (double-encoded in some rows), so Prisma's array_contains silently fails.
    // All filtering happens in JS where we can parse properly.
    const clinicsList = await prisma.clinics.findMany({
      include: {
        practitioners: true,
        clinic_insurances: { include: { insurance: true } },
      },
    });

    // ── 2. FILTER + SCORE ───────────────────────────────────────────────────
    const scoredClinics = clinicsList
      .map((clinic) => {
        // Parse JSON fields once upfront — handles single AND double encoding
        const services = parseJsonField(clinic.services_json);
        const clinicSpecialties = parseJsonField(clinic.specialties_json);

        // ── HARD GATE: specialty ───────────────────────────────────────────
        // If the patient specified a specialty and this clinic doesn't match,
        // reject immediately — don't waste time scoring it.
        if (
          specialty &&
          !matchesSpecialty(clinic, specialty, services, clinicSpecialties)
        ) {
          return null;
        }

        // ── HARD GATE: distance ────────────────────────────────────────────
        const distance = computeDistance(clinic, {
          latitude,
          longitude,
          hasLocation,
        });
        if (hasLocation && distance != null && distance > MAX_SEARCH_RADIUS_M) {
          return null;
        }

        const score = computeScore(clinic, {
          requestedInsurances,
          appointment_type,
          services,
          distance,
          hasLocation,
        });

        return { ...clinic, matchScore: score, distance };
      })
      .filter((c) => c != null && c.matchScore >= MIN_SCORE_THRESHOLD);

    // ── 3. SORT ─────────────────────────────────────────────────────────────
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
 * FIX 5 — Double-encoded JSON.
 *
 * Some rows store fields like:  "\"[\\\"Physiotherapy\\\"]\""
 * One JSON.parse gives you:     "[\"Physiotherapy\"]"   <- still a string
 * Two JSON.parses give you:     ["Physiotherapy"]        <- the actual array
 *
 * We loop up to twice so we handle both single- and double-encoded rows.
 */
function parseJsonField(raw) {
  if (Array.isArray(raw)) return raw;
  let val = raw;
  for (let i = 0; i < 2; i++) {
    if (typeof val !== "string") break;
    try {
      val = JSON.parse(val);
    } catch {
      return [];
    }
  }
  return Array.isArray(val) ? val : [];
}

// ─── Specialty Synonym Map ─────────────────────────────────────────────────
//
// Maps every known alias to a shared canonical key.
// Both the patient search term AND the clinic stored values are normalized
// to the same key before comparison, so they always match regardless of how
// either side typed it.
//
// To add a new specialty: add a new block following the same pattern.
//
const SPECIALTY_SYNONYMS = {
  // Physiotherapy
  physiotherapy: "physiotherapy",
  physiotherapist: "physiotherapy",
  "physical therapy": "physiotherapy",
  "physical therapist": "physiotherapy",
  pt: "physiotherapy",

  // Massage Therapy
  "massage therapy": "massage_therapy",
  "massage therapist": "massage_therapy",
  "registered massage therapist": "massage_therapy",
  rmt: "massage_therapy",
  massage: "massage_therapy",

  // Chiropractic
  chiropractic: "chiropractic",
  chiropractor: "chiropractic",
  "chiropractic care": "chiropractic",
  chiro: "chiropractic",

  // Psychology
  psychology: "psychology",
  psychologist: "psychology",
  "registered psychologist": "psychology",
  "r.psych": "psychology",

  // Occupational Therapy
  "occupational therapy": "occupational_therapy",
  "occupational therapist": "occupational_therapy",
  ot: "occupational_therapy",

  // Naturopathy
  naturopathy: "naturopathy",
  naturopath: "naturopathy",
  "naturopathic doctor": "naturopathy",
  "naturopathic medicine": "naturopathy",
  nd: "naturopathy",

  // Acupuncture
  acupuncture: "acupuncture",
  acupuncturist: "acupuncture",
  "r.ac": "acupuncture",
  "registered acupuncturist": "acupuncture",

  // Podiatry
  podiatry: "podiatry",
  podiatrist: "podiatry",
  "foot care": "podiatry",
  chiropody: "podiatry",
  chiropodist: "podiatry",

  // Nutrition / Dietetics
  nutrition: "nutrition",
  nutritionist: "nutrition",
  dietitian: "nutrition",
  dietician: "nutrition",
  "registered dietitian": "nutrition",
  rd: "nutrition",

  // Speech Therapy
  "speech therapy": "speech_therapy",
  "speech therapist": "speech_therapy",
  "speech language pathologist": "speech_therapy",
  "speech-language pathologist": "speech_therapy",
  slp: "speech_therapy",

  // Kinesiology
  kinesiology: "kinesiology",
  kinesiologist: "kinesiology",
  kin: "kinesiology",

  // Mental Health / Counselling
  counselling: "counselling",
  counseling: "counselling",
  counsellor: "counselling",
  counselor: "counselling",
  therapist: "counselling",
  psychotherapy: "counselling",
  psychotherapist: "counselling",

  // General Practice
  "general practice": "general_practice",
  "general practitioner": "general_practice",
  "family medicine": "general_practice",
  "family doctor": "general_practice",
  gp: "general_practice",
};

/**
 * Normalizes any specialty string to a canonical key.
 * Returns null if the term is not in the map.
 */
function normalizeSpecialty(term) {
  if (!term) return null;
  return SPECIALTY_SYNONYMS[term.toLowerCase().trim()] ?? null;
}

/**
 * Returns true if the clinic matches the requested specialty.
 *
 * Both sides are normalized to canonical keys before comparison, so
 * "physiotherapist" (user) matches "Physiotherapy" (clinic) without
 * any substring heuristics or fuzzy magic.
 *
 * Falls back to case-insensitive substring matching only for terms that
 * are not in the synonym map yet, so unrecognized terms still have a chance
 * rather than silently returning zero results.
 */
function matchesSpecialty(clinic, specialty, services, clinicSpecialties) {
  const requestedKey = normalizeSpecialty(specialty);

  // Path A: canonical match (preferred)
  if (requestedKey) {
    const allClinicTerms = [
      ...clinicSpecialties,
      ...(clinic.practitioners || []).map((p) => p.profession),
      ...services,
    ].filter(Boolean);

    return allClinicTerms.some(
      (term) => normalizeSpecialty(term) === requestedKey,
    );
  }

  // Path B: unrecognized term — fall back to substring match.
  // Log a warning so you know to add it to the map.
  console.warn(
    `[specialty] Unrecognized term not in synonym map: "${specialty}" — falling back to substring match`,
  );
  const needle = specialty.toLowerCase().trim();
  const allClinicTerms = [
    ...clinicSpecialties,
    ...(clinic.practitioners || []).map((p) => p.profession),
    ...services,
  ].filter((s) => typeof s === "string");

  return allClinicTerms.some((term) => {
    const t = term.toLowerCase().trim();
    return t === needle || t.includes(needle) || needle.includes(t);
  });
}

/**
 * FIX 3 — Insurance embedded in services_json.
 *
 * Clinics store insurance as "insurance:Manulife" inside services_json rather
 * than (or in addition to) the clinic_insurances relation. Pull from both.
 */
function extractSupportedInsurances(clinic, services) {
  const fromRelation = (clinic.clinic_insurances || []).map((ci) =>
    ci.insurance.name.toLowerCase().trim(),
  );
  const fromServices = services
    .filter(
      (s) => typeof s === "string" && s.toLowerCase().startsWith("insurance:"),
    )
    .map((s) => s.slice("insurance:".length).toLowerCase().trim());

  return [...new Set([...fromRelation, ...fromServices])];
}

/**
 * FIX 4 — Geocode a location string (postal code, city) to lat/lng.
 * Uses Nominatim (OpenStreetMap) — free, no key needed.
 * Swap for Google Geocoding API if you need production-grade reliability.
 */
async function geocodeLocation(location) {
  try {
    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?q=${encodeURIComponent(location)}&countrycodes=ca&format=json&limit=1`;
    const resp = await fetch(url, {
      headers: { "User-Agent": "clinic-search-api/1.0" },
    });
    const data = await resp.json();
    if (data?.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
  } catch (err) {
    console.warn("Geocoding failed for:", location, err.message);
  }
  return null;
}

function computeDistance(clinic, { latitude, longitude, hasLocation }) {
  if (!hasLocation || clinic.latitude == null || clinic.longitude == null)
    return null;
  return geolib.getDistance(
    { latitude, longitude },
    { latitude: Number(clinic.latitude), longitude: Number(clinic.longitude) },
  );
}

/**
 * Score a clinic that has already passed the specialty gate.
 * Max possible: 40 (insurance) + 35 (appt type) + 10 (direct billing) + 15 (distance) = 100
 */
function computeScore(
  clinic,
  { requestedInsurances, appointment_type, services, distance, hasLocation },
) {
  let score = 0;

  // ── Insurance (weight: 40) ─────────────────────────────────────────────
  if (requestedInsurances.length > 0) {
    const supported = extractSupportedInsurances(clinic, services);
    const matchCount = requestedInsurances.filter((req) =>
      supported.some(
        (sup) =>
          sup === req || sup.startsWith(req + " ") || sup.endsWith(" " + req),
      ),
    ).length;
    score += (matchCount / requestedInsurances.length) * WEIGHTS.insurance;
  }

  // ── Direct billing bonus (weight: 10) ─────────────────────────────────
  if (clinic.offers_direct_billing) score += WEIGHTS.direct_billing;

  // ── Appointment type (weight: 35) ──────────────────────────────────────
  if (appointment_type) {
    if (appointment_type === "either") {
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

  // ── Urgency ────────────────────────────────────────────────────────────
  // TODO: implement once calendar/availability integration is ready

  // ── Distance bonus (0–15, independent scale) ───────────────────────────
  // Kept separate from relevance score — never subtract metres from points.
  if (hasLocation && distance != null) {
    const distBonus =
      distance <= NEAR_RADIUS_M
        ? 15
        : Math.max(
            0,
            15 *
              (1 -
                (distance - NEAR_RADIUS_M) /
                  (MAX_SEARCH_RADIUS_M - NEAR_RADIUS_M)),
          );
    score += distBonus;
  }

  return Math.round(score * 10) / 10;
}

module.exports = router;
