var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
var { authorize_user } = require("../auth/authMiddleware.js");

/**
 * PUT /users/
 * Update a user by ID and Body
 */
router.put("/", async function (req, res, next) {
  try {

    const userId = await authorize_user(req)

    await prisma.users.update({ data: req.body, where: { id: userId } });

    res.json({ message: "User updated", userId: userId });
  } catch (error) {
    console.log(error)
    next(error);
  }
});

module.exports = router;