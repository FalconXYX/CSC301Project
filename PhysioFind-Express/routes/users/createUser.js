var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

var { createClient } = require("@supabase/supabase-js");

/**
 * POST /users
 * Create a new user
 */
router.post("/", async function (req, res, next) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
    );

    // Sign up in Supabase Auth first to get the authoritative UUID
    const { data, error } = await supabase.auth.signUp({
      email: req.body.email,
      password: req.body.password_hash,
    });

    if (error) return next(error);
    if (!data.user) return next(new Error("Supabase sign up failed"));

    // Create Prisma record using the Supabase Auth UUID
    const user = await prisma.users.create({
      data: { ...req.body, id: data.user.id },
    });

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
