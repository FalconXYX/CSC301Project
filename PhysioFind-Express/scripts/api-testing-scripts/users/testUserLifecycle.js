/**
 * Full user lifecycle test: create → sign in → get → update → delete
 * Leaves no test data in the database.
 */

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";

const randomStr = Math.random().toString(36).substring(2, 7);
const testEmail = `testuser${randomStr}@gmail.com`;
const testPassword = "Password123!";

async function post(endpoint, body, token) {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
  return res;
}

async function run() {
  let token;

  // 1. Create user
  console.log(`\n[1/5] Creating user ${testEmail}...`);
  const createRes = await post("/users", {
    email: testEmail,
    password_hash: testPassword,
    role: "patient",
    first_name: "Test",
    last_name: "User",
  });
  if (!createRes.ok) {
    console.error("❌ Create failed:", await createRes.text());
    process.exit(1);
  }
  const { user } = await createRes.json();
  console.log(`✅ User created: ${user.id}`);

  // 2. Sign in
  console.log("\n[2/5] Signing in...");
  const signInRes = await post("/auth/signIn", {
    email: testEmail,
    password: testPassword,
  });
  if (!signInRes.ok) {
    console.error("❌ Sign in failed:", await signInRes.text());
    process.exit(1);
  }
  const { data } = await signInRes.json();
  token = data.session.access_token;
  console.log("✅ Signed in, token received");

  // 3. Get user
  console.log("\n[3/5] Getting user...");
  const getRes = await fetch(`${baseUrl}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!getRes.ok) {
    console.error("❌ Get failed:", await getRes.text());
    process.exit(1);
  }
  const getJson = await getRes.json();
  console.log(
    `✅ Got user: ${getJson.user.first_name} ${getJson.user.last_name}`,
  );

  // 4. Update user
  console.log("\n[4/5] Updating user...");
  const updateRes = await fetch(`${baseUrl}/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ first_name: "Updated", phone: "555-999-8888" }),
  });
  if (!updateRes.ok) {
    console.error("❌ Update failed:", await updateRes.text());
    process.exit(1);
  }
  console.log("✅ User updated");

  // 5. Delete user
  console.log("\n[5/5] Deleting user...");
  const deleteRes = await fetch(`${baseUrl}/users`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!deleteRes.ok) {
    console.error("❌ Delete failed:", await deleteRes.text());
    process.exit(1);
  }
  console.log("✅ User deleted");

  console.log("\n✅ User lifecycle test complete — no test data left behind.");
}

run().catch((err) => {
  console.error("❌ Unexpected error:", err.message);
  process.exit(1);
});
