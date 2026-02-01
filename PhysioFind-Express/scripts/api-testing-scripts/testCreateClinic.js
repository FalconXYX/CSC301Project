require("dotenv").config();

const baseUrl =
  process.env.API_BASE_URL || process.env.BASE_URL || "http://localhost:3000";

const endpoint = `${baseUrl.replace(/\/$/, "")}/createclinic`;

const payload = {
  name: "PhysioFind Downtown",
  address_line1: "123 King St W",
  city: "Toronto",
  province: "ON",
  postal_code: "M5H 1J9",
  phone: "416-555-0100",
  email: "contact@physiofind.example",
  website: "https://physiofind.example",
};

async function run() {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

  console.log("Created clinic:", body);
}

run().catch((error) => {
  console.error("Request error:", error.message);
  process.exit(1);
});
