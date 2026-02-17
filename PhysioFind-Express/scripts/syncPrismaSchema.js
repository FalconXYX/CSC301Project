const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

async function run() {
    try {
        await execAsync("npx prisma db pull");
        await execAsync("npx prisma generate");
    } catch (error) {
        console.error("Schema sync failed:", error.message);
        process.exit(1);
    }
}

run();
