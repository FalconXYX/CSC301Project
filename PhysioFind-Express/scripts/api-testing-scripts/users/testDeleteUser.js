const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";

async function run(email, password) {
  email = email || process.argv[2];
  password = password || process.argv[3];

  if (!email || !password) {
    console.error("Usage: node testDeleteUser.js <email> <password>");
    process.exit(1);
  }

  const signInRes = await fetch(`${baseUrl}/auth/signIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!signInRes.ok) {
    console.error("❌ Sign in failed:", await signInRes.text());
    process.exit(1);
  }

  const { data } = await signInRes.json();
  const token = data.session.access_token;

  console.log(`Testing DELETE ${baseUrl}/users...`);
  const response = await fetch(`${baseUrl}/users`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    console.log("✅ User deleted");
  } else {
    console.error(`❌ Failed to delete user. Status: ${response.status}`);
    console.error("Response:", await response.text());
    process.exit(1);
  }
}

if (require.main === module) {
  run().catch((err) => { console.error("Request failed:", err.message); process.exit(1); });
}

module.exports = { run };


async function run() {
  // Sign in first to get a JWT
  console.log("Signing in to get token...");
  const signInRes = await fetch(`${baseUrl}/auth/signIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!signInRes.ok) {
    console.error("Sign in failed:", await signInRes.text());
    process.exit(1);
  }

  const { data } = await signInRes.json();
  const token = data.session.access_token;

  // Delete user with token
  console.log(`Testing DELETE ${baseUrl}/users...`);
  const response = await fetch(`${baseUrl}/users`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    console.log("User deleted successfully.");
  } else {
    console.error(`Failed to delete user. Status: ${response.status}`);
    console.error("Response:", await response.text());
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Request failed:", err.message);
  process.exit(1);
});
