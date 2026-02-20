var express = require("express");

var { createClient } = require("@supabase/supabase-js");

async function authorize_user(req) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return user.id;
  } else {
    throw new Error(
      "Invalid Request: User does not have permission to complete this request",
    );
  }
}

module.exports = {
  authorize_user,
};
