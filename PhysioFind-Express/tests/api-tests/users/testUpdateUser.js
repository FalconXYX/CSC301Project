require("dotenv").config();

const userId = process.argv[2];

if (!userId) {
    console.error("User ID required. Usage: node testUpdateUser.js <user_id>");
    process.exit(1);
}

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
const endpoint = `${baseUrl}/users/${userId}`;

async function run() {
    console.log(`Testing PUT ${endpoint}...`);

    const payload = {
        first_name: "UpdatedName",
        phone: "555-999-8888",
    };

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("User updated successfully:");
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.error(`Failed to update user. Status: ${response.status}`);
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
