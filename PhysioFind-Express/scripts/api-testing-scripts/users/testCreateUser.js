require("dotenv").config();

const baseUrl =
  "https://csc-301-project-rlvrjo44l-parths-projects-1ea3fb9a.vercel.app";
const endpoint = `${baseUrl}/users`;

async function run() {
  console.log(`Testing POST ${endpoint}...`);

  const uniqueEmail = `testuser_${Date.now()}@example.com`;

  const payload = {
    email: uniqueEmail,
    password_hash: "Password123!",
    role: "patient",
    first_name: "Test",
    last_name: "User",
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("User created successfully:");
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.error(`Failed to create user. Status: ${response.status}`);
      const text = await response.text();
      console.error("Response:", text);
      process.exit(1);
    }
  } catch (error) {
    console.error("Request failed:", error.message);
    process.exit(1);
  }
}

run();
