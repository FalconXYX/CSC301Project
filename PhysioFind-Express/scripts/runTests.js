#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const args = process.argv.slice(2);
const env = args[0] || "local";
const testType = args[1] || "all";

// Map environment names
const envMap = {
  local: ".env.local",
  development: ".env.local",
  production: ".env.production",
  prod: ".env.production",
};

const envFile = envMap[env];
if (!envFile) {
  console.error(`❌ Invalid environment: ${env}`);
  console.error(`Valid options: local, development, production, prod`);
  process.exit(1);
}

const envPath = path.join(__dirname, "..", envFile);
if (!fs.existsSync(envPath)) {
  console.error(`❌ Environment file not found: ${envFile}`);
  process.exit(1);
}

console.log(`🔧 Using environment: ${env} (${envFile})`);

const tests = {
  clinic: [
    "node ./scripts/api-testing-scripts/testGetClinics.js",
    "node ./scripts/api-testing-scripts/testGetPublicClinics.js",
    "node ./scripts/api-testing-scripts/testCreateClinic.js",
    "node ./scripts/api-testing-scripts/testUpdateClinic.js",
    "node ./scripts/api-testing-scripts/testDeleteClinic.js",
  ],
  user: [
    "node ./tests/api-tests/users/testCreateUser.js",
    "node ./tests/api-tests/users/testGetUser.js",
    "node ./tests/api-tests/users/testUpdateUser.js",
    "node ./tests/api-tests/users/testDeleteUser.js",
  ],
  db: ["node ./tests/db-consistency-test.js"],
};

const runTests = (testList) => {
  const env = `NODE_ENV=${env.includes("prod") ? "production" : "development"}`;

  testList.forEach((test, idx) => {
    console.log(`\n[${idx + 1}/${testList.length}] Running: ${test}`);
    try {
      execSync(`${env} ${test}`, {
        stdio: "inherit",
        env: {
          ...process.env,
          NODE_ENV: env.includes("prod") ? "production" : "development",
        },
      });
    } catch (e) {
      console.error(`❌ Test failed: ${test}`);
    }
  });
};

const allTests = [...tests.db, ...tests.clinic, ...tests.user];

console.log(`\n📋 Running ${testType} tests...\n`);

switch (testType) {
  case "clinic":
    runTests(tests.clinic);
    break;
  case "user":
    runTests(tests.user);
    break;
  case "db":
    runTests(tests.db);
    break;
  case "all":
    runTests(allTests);
    break;
  default:
    console.error(`❌ Invalid test type: ${testType}`);
    console.error(`Valid options: clinic, user, db, all`);
    process.exit(1);
}

console.log(`\n✅ Test suite complete!`);
