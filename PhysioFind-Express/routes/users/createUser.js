var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

/**
 * POST /users
 * Create a new user
 */
router.post("/", async function (req, res, next) {
  try {
    const user = await prisma.users.create({ data: req.body });

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;