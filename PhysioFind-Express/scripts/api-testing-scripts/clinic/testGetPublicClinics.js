require("dotenv").config();

const baseUrl =
  process.env.API_BASE_URL || process.env.BASE_URL || "http://localhost:3000";

const endpoint = `${baseUrl.replace(/\/$/, "")}/clinics/public?limit=10&offset=0`;

async function run() {
  const response = await fetch(endpoint, {
    method: "GET",
  });

  let body;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    console.error("Request failed:", response.status, body);
    process.exit(1);
  }

  console.log("Public clinics:", body);
}

run().catch((error) => {
  console.error("Request error:", error.message);
  process.exit(1);
});
