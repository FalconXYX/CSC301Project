var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

/**
 * DELETE /providers/:id
 * Delete a provider by ID
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const clinicId = req.params.id;

    await prisma.clinics.delete({ where: { id: clinicId } });

    res.json({ message: "Clinic deleted", clinicId: clinicId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
