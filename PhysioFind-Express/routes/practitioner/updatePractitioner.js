var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

/**
 * PUT /practitioners/:id
 * Update a practitioner by ID
 */
router.put("/:id", async function (req, res, next) {
  try {
    const practitionerId = req.params.id;
    if (req.body.clinicId != null) {
        throw new Error("Body contains unupdatable fields: clinicId")
    }
    const practitioner = await prisma.practitioners.update({
      where: { id: practitionerId },
      data: req.body,
    });

    res.json({ practitioner: practitioner });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
