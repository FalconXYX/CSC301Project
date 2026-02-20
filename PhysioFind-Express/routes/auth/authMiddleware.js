var express = require("express");

var { createClient } = require("@supabase/supabase-js")
const supabase = createClient(process.env.PROJECT_URL, process.env.DATABASE_KEY)

async function authorize_user(req) {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    return user.id
  }
  else {
    throw new Error("Invalid Request: User does not have permission to complete this request")
  }
}

module.exports = {
  authorize_user
};