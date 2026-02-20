var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

var { createClient } = require("@supabase/supabase-js")
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

/**
 * POST /users
 * Create a new user
 */
router.post("/", async function (req, res, next) {
  try {
    const user = await prisma.users.create({ data: req.body });

    const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password_hash
    })

    await prisma.users.update({ data: { id: data.user.id }, where: { id: user.id } });

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;