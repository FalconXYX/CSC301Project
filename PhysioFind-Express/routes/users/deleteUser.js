var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

/**
 * DELETE /users/:id
 * Delete a user by ID
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const userId = req.params.id;

    await prisma.users.delete({ where: { id: userId } });

    res.json({ message: "User deleted", userId: userId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
