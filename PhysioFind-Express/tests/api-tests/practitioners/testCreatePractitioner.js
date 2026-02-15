require("dotenv").config();

const userId = process.argv[2] || "USER_ID_HERE";
const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
const endpoint = `${baseUrl}/practitioners`;

async function run() {
    console.log(`Testing POST ${endpoint}...`);

    if (userId === "USER_ID_HERE") {
        console.log("User ID required. Usage: node testCreatePractitioner.js <user_id>");
    }

    const payload = {
        user_id: userId,
        profession: "Physiotherapist",
        bio: "I fix backs and necks.",
        is_active: true,
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Practitioner created successfully:");
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log(`Request failed with status: ${response.status}`);
            console.error(`Status: ${response.status}`);
            process.exit(1);
        }
    } catch (error) {
        console.error("Request failed:", error.message);
        process.exit(1);
    }
}

run();
