var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

/**
 * POST /practitioners
 * Create a new practitioner
 */
router.post("/", async function (req, res, next) {
  try {
    const practitioner = await prisma.practitioners.create({ data: req.body });

    res.status(201).json({ practitioner });
  } catch (error) {
    next(error);
  }
});

module.exports = router;