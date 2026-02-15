require("dotenv").config();

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
const endpoint = `${baseUrl}/insurances`;

async function run() {
    console.log(`Testing POST ${endpoint}...`);

    const uniqueName = `Insurance Company ${Date.now()}`;

    const payload = {
        name: uniqueName,
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Insurance created successfully:");
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
