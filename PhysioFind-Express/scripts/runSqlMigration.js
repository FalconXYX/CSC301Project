require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const sqlFilePath = path.resolve(
  __dirname,
  "..",
  "migrations",
  "20260315000000_google_calendar_oauth.sql",
);

function buildConnectionString() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "5432";
  const database = process.env.DB_NAME || "physiofind";
  const user = process.env.DB_USER || "physiofind";
  const password = process.env.DB_PASSWORD || "physiofind";

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

async function run() {
  const connectionString = buildConnectionString();
  const client = new Client({ connectionString });

  const sql = fs.readFileSync(sqlFilePath, "utf8");

  try {
    await client.connect();
    await client.query(sql);
    console.log("Migration applied:", sqlFilePath);
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
