require("dotenv").config();

const userId = process.argv[2];

if (!userId) {
    console.error("User ID required. Usage: node testDeleteUser.js <user_id>");
    process.exit(1);
}

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
const endpoint = `${baseUrl}/users/${userId}`;

async function run() {
    console.log(`Testing DELETE ${endpoint}...`);

    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
        });

        if (response.ok) {
            console.log("User deleted successfully.");
        } else {
            console.error(`Failed to delete user. Status: ${response.status}`);
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
