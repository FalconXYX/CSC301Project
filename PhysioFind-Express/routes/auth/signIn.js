var express = require("express");
var router = express.Router();
var bcrypt = require('bcrypt');

var { createClient } = require("@supabase/supabase-js");

router.post("/signIn", async function (req, res, next) {
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
    );
    const { data, error } = await supabase.auth.signInWithPassword({
      email: req.body.email,
      password: hashedPassword,
    });
    if (error) {
      next(error);
    } else {
      res.status(201).json({ data });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
