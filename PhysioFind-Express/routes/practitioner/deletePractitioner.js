var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

/**
 * DELETE /practitioners/:id
 * Delete a practitioners by ID
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const practitionerId = req.params.id;

    await prisma.practitioners.delete({ where: { id: practitionerId } });

    res.json({ message: "Practitioner deleted", practitionerId: practitionerId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;