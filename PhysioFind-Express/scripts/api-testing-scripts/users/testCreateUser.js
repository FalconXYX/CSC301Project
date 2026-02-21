const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";

async function run() {
  const randomStr = Math.random().toString(36).substring(2, 7);
  const email = `testuser${randomStr}@gmail.com`;
  const password = "Password123!";

  console.log(`Testing POST ${baseUrl}/users...`);

  const response = await fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password_hash: password,
      role: "patient",
      first_name: "Test",
      last_name: "User",
    }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log("✅ User created:", data.user.id);
    return { email, password };
  } else {
    console.error(`❌ Failed to create user. Status: ${response.status}`);
    console.error("Response:", await response.text());
    process.exit(1);
  }
}

if (require.main === module) {
  run().catch((err) => { console.error("Request failed:", err.message); process.exit(1); });
}

module.exports = { run };
