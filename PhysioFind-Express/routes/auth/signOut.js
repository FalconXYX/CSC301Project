var express = require("express");
var router = express.Router();

var { createClient } = require("@supabase/supabase-js");

router.post("/signOut", async function (req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return next(new Error("No authorization token provided"));

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
    const { error } = await supabase.auth.signOut();
    if (error) {
      next(error);
    } else {
      res.status(200).json({ message: "Signed out successfully" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
