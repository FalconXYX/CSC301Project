var { createClient } = require("@supabase/supabase-js");

async function authorize_user(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    throw new Error("Invalid Request: No authorization token provided");
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error(
      "Invalid Request: User does not have permission to complete this request",
    );
  }

  return user.id;
}

module.exports = {
  authorize_user,
};
