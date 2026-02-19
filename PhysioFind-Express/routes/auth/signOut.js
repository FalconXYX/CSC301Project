var express = require("express");
var router = express.Router();

var { createClient } = require("@supabase/supabase-js")
const supabase = createClient(process.env.PROJECT_URL, process.env.DATABASE_KEY)

router.post("/signOut", async function (req, res, next) {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) { 
            next(error);
        }
        else {
            res.status(201);
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;