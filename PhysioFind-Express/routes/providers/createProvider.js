var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

/**
 * POST /clinics
 * Create a new clinic
 */
router.post("/", async function (req, res, next) {
  try {
    const clinic = await prisma.clinics.create({ data: req.body });

    res.status(201).json({ clinic });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
