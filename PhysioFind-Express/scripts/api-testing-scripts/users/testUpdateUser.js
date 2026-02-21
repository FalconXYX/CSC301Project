const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";

async function run(email, password) {
  email = email || process.argv[2];
  password = password || process.argv[3];

  if (!email || !password) {
    console.error("Usage: node testUpdateUser.js <email> <password>");
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

  console.log(`Testing PUT ${baseUrl}/users...`);
  const response = await fetch(`${baseUrl}/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ first_name: "UpdatedName", phone: "555-999-8888" }),
  });

  if (response.ok) {
    console.log("✅ User updated");
  } else {
    console.error(`❌ Failed to update user. Status: ${response.status}`);
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

  // Update user with token
  console.log(`Testing PUT ${baseUrl}/users...`);
  const response = await fetch(`${baseUrl}/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      first_name: "UpdatedName",
      phone: "555-999-8888",
    }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log("User updated successfully:");
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.error(`Failed to update user. Status: ${response.status}`);
    console.error("Response:", await response.text());
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Request failed:", err.message);
  process.exit(1);
});
