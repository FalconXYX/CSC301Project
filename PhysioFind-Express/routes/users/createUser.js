var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

const { createClient } = require("@supabase/supabase-js");

router.post("/", async function (req, res, next) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );

  let authUser = null;

  try {
    // Sign up in Supabase Auth first to get the authoritative UUID
    const { data, error } = await supabase.auth.signUp({
      email: req.body.email,
      password: req.body.password_hash,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(400).json({ error: "Supabase sign up failed" });
    }

    authUser = data.user;

    // Create Prisma record using the Supabase Auth UUID
    const user = await prisma.users.create({
      data: { ...req.body, id: authUser.id },
    });

    res.status(201).json({ user });
  } catch (error) {
    // Rollback: If Prisma fails, delete the user from Supabase to avoid orphaned accounts
    if (authUser && authUser.id) {
      try {
        const supabaseAdmin = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY ||
            process.env.SUPABASE_ANON_KEY, // fallback just in case, but usually needs service_role
        );
        await supabaseAdmin.auth.admin.deleteUser(authUser.id);
      } catch (rollbackError) {
        console.error("Failed to rollback Supabase user:", rollbackError);
      }
    }
    next(error);
  }
});

module.exports = router;
