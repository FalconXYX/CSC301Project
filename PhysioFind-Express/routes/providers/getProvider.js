var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

var publicSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  website: true,
  address_line1: true,
  address_line2: true,
  city: true,
  province: true,
  postal_code: true,
  latitude: true,
  longitude: true,
  booking_provider: true,
  booking_url: true,
};

/**
 * GET /clinics/:id
 * Get a clinic by ID (full)
 */
router.get("/:id", async function (req, res, next) {
  try {
    const clinicId = req.params.id;
    const clinic = await prisma.clinics.findUnique({ where: { id: clinicId } });

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    res.json({ clinic: clinic });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /clinics
 * Get all clinics (full)
 */
router.get("/", async function (req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = parseInt(req.query.offset, 10) || 0;

    const clinics = await prisma.clinics.findMany({
      skip: offset,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    res.json({ clinics: clinics, limit: limit, offset: offset });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /clinics/public/:id
 * Get a clinic by ID (public)
 */
router.get("/public/:id", async function (req, res, next) {
  try {
    const clinicId = req.params.id;
    const clinic = await prisma.clinics.findUnique({
      where: { id: clinicId },
      select: publicSelect,
    });

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    res.json({ clinic: clinic });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /clinics/public
 * Get all clinics (public)
 */
router.get("/public", async function (req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = parseInt(req.query.offset, 10) || 0;

    const clinics = await prisma.clinics.findMany({
      skip: offset,
      take: limit,
      orderBy: { created_at: "desc" },
      select: publicSelect,
    });

    res.json({ clinics: clinics, limit: limit, offset: offset });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
