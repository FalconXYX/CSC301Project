require("dotenv").config();
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

const TESTS = [
    {
        name: "Database Consistency",
        command: "node ./tests/db-consistency-test.js",
        critical: true,
    },
    {
        name: "Get Clinics",
        command: "node ./scripts/api-testing-scripts/testGetClinics.js",
    },
];

async function runTests() {
    console.log("PhysioFind Test Runner");
    console.log(`Running in environment: ${process.env.TEST_ENV || "local"}`);
    console.log("==================================================\n");

    let passed = 0;
    let failed = 0;

    for (const test of TESTS) {
        console.log(`Running: ${test.name}`);

        try {
            const { stdout } = await execAsync(test.command);
            console.log(`${test.name} PASSED`);
            if (stdout) console.log(stdout.trim());

            passed++;
        } catch (error) {
            console.error(`${test.name} FAILED`);
            if (error.stdout) console.log(error.stdout.trim());
            if (error.stderr) console.error(error.stderr.trim());

            failed++;

            if (test.critical) {
                console.error("\nCritical test failed. Stopping execution.");
                break;
            }
        }
        console.log("--------------------------------------------------\n");
    }

    console.log("TEST SUMMARY");
    console.log("==================================================");
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total:  ${passed + failed}`);
    console.log("==================================================");

    if (failed > 0) {
        process.exit(1);
    }
}

runTests();
