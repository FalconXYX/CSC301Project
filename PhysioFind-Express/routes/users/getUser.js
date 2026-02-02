var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

/**
 * GET /users/:id
 * Get a user by ID
 */
router.get("/:id", async function (req, res, next) {
  try {
    
    const userId = req.params.id;

    const user = await prisma.users.findFirst({ where: { id: userId } });

    res.json({ message: "Get user by ID", userId: userId,  user: user });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /users
 * Get all users
 */
router.get("/", async function (req, res, next) {
  try {
    
    const user = await prisma.users.findMany({});

    res.json({ message: "Get all users",  user: user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
