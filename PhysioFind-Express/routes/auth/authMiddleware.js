var express = require("express");
var router = express.Router();

var { createClient } = require("@supabase/supabase-js")
const supabase = createClient(process.env.PROJECT_URL, process.env.DATABASE_KEY)

async function authorize_user(req) {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    req.body.id = user.id
    return req
  }
  else {
    throw new Error("Invalid Request: User does not have permission to complete this request")
  }
}

module.exports = router;