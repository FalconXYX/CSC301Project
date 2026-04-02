var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
var bcrypt = require("bcrypt");

const { createClient } = require("@supabase/supabase-js");

router.post("/", async function (req, res, next) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );

  let authUser = null;
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(req.body.password_hash, saltRounds);

  try {
    // 1. Try to sign up the user in Supabase Auth
    let { data, error } = await supabase.auth.signUp({
      email: req.body.email,
      password: hashedPassword,
    });

    if (error) {
      // 🚨 GHOST ACCOUNT RECOVERY LOGIC 🚨
      // If a previous Prisma failure left this user stranded in Supabase Auth without a
      // database record, we catch the "Already registered" error and log them in to recover their ID!
      if (
        error.message.toLowerCase().includes("already registered") ||
        error.message.toLowerCase().includes("already exists")
      ) {
        console.log(
          "Ghost account detected. Attempting to recover and sync ID...",
        );

        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: req.body.email,
            password: hashedPassword,
          });

        // If login failed, they just provided a bad password to an actual existing account
        if (signInError) {
          return res.status(400).json({
            error: "Email already registered. If this is you, please sign in.",
          });
        }

        // We successfully grabbed the ghost account!
        authUser = signInData.user;
      } else {
        return res.status(400).json({ error: error.message });
      }
    } else {
      authUser = data.user;
    }

    if (!authUser) {
      return res.status(400).json({ error: "Supabase sign up failed." });
    }

    // Checking if they are already fully synced in the database
    const existingDBUser = await prisma.users.findUnique({
      where: { id: authUser.id },
    });

    if (existingDBUser) {
      return res.status(400).json({ error: "User already registered." });
    }

    // 2. Safely map fields to avoid Prisma crashes from unexpected frontend data
    // Spreading `...req.body` directly into Prisma is what causes it to crash initially if
    // the frontend passes things like "confirm_password" or other unmatched schema variables.
    const safeData = {
      id: authUser.id,
      email: req.body.email,
      password_hash: "00000000000",
      role: req.body.role || "patient",
      first_name: req.body.first_name || null,
      last_name: req.body.last_name || null,
      phone: req.body.phone || null,
      date_of_birth: req.body.date_of_birth
        ? new Date(req.body.date_of_birth)
        : null,
      clinic_id: req.body.clinic_id || null,
      clinic_role: req.body.clinic_role || null,
    };

    // Strip out null values so we just rely on Prisma defaults where appropriate
    Object.keys(safeData).forEach((key) => {
      if (safeData[key] === null) {
        delete safeData[key];
      }
    });

    // 3. Create Prisma record using the recovered/new Supabase Auth UUID
    const user = await prisma.users.create({
      data: safeData,
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error("Prisma Creation Error:", error);

    // Theoretical rollback: If Prisma STILL fails, delete the user from Supabase.
    // (Note: This relies on SUPABASE_SERVICE_ROLE_KEY being set in .env to actually work)
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
