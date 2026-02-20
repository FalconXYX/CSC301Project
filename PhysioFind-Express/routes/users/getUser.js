var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
var { authorize_user } = require("../auth/authMiddleware.js");

/**
 * GET /users/
 * Get a user by ID
 */
router.get("/", async function (req, res, next) {
  try {
    
    const userId = await authorize_user(req);

    const user = await prisma.users.findFirst({ where: { id: userId } });

    res.json({ message: "Get user by ID", userId: userId,  user: user });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /users
 * Get all users. Currently not working due to auth middleware, could be reimplemented once user permissions 
 * are added (when clinic auth is done).
 */
// router.get("/", async function (req, res, next) {
//   try {
    
//     const user = await prisma.users.findMany({});

//     res.json({ message: "Get all users",  user: user });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
