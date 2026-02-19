var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");

var { createClient } = require("@supabase/supabase-js")
const supabase = createClient(process.env.PROJECT_URL, process.env.DATABASE_KEY)

router.post("/signIn", async function (req, res, next) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: req.body.email,
            password: req.body.password_hash
        })
        if (error) { 
            next(error);
        }
        else {
            res.status(201).json({ data });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;