var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

/**
 * GET /practitioners/:id
 * Get a practitioner by ID
 */
router.get("/:id", async function (req, res, next) {
  try {
    
    const practitionerId = req.params.id;

    const practitioner = await prisma.practitioners.findFirst({ where: { id: practitionerId } });

    res.json({ message: "Get practitioner by ID", practitionerId: practitionerId,  practitioner: practitioner });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /practitioners
 * Get all practitioners. 
 */
router.get("/", async function (req, res, next) {
    try {
    
        const practitioner = await prisma.practitioners.findMany({});

        res.json({ message: "Get all practitioners",  practitioners: practitioner });
    } catch (error) {
        next(error);
    }
});

module.exports = router;