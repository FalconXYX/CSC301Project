var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

/**
 * PUT /users/:id
 * Update a user by ID and Body
 */
router.put("/:id", async function (req, res, next) {
  try {
    const userId = req.params.id;

    await prisma.users.update({ data: req.body, where: { id: userId } });

    res.json({ message: "User updated", userId: userId });
  } catch (error) {
    console.log(error)
    next(error);
  }
});

module.exports = router;