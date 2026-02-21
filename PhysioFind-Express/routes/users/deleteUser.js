var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
var { authorize_user } = require("../auth/authMiddleware.js");

/**
 * DELETE /users/
 * Delete a user by ID
 */
router.delete("/", async function (req, res, next) {
  try {
    const userId = await authorize_user(req);

    await prisma.users.delete({ where: { id: userId } });

    res.json({ message: "User deleted", userId: userId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
