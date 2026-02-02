var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

/**
 * PUT /providers/:id
 * Update a provider by ID
 */
router.put("/:id", async function (req, res, next) {
  try {
    const clinicId = req.params.id;
    const clinic = await prisma.clinics.update({
      where: { id: clinicId },
      data: req.body,
    });

    res.json({ clinic: clinic });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
