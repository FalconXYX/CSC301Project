require("dotenv").config();

const patientId = process.argv[2] || "PATIENT_ID";
const clinicId = process.argv[3] || "CLINIC_ID";

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
const endpoint = `${baseUrl}/appointments`;

async function run() {
    console.log(`Testing POST ${endpoint}...`);

    if (patientId === "PATIENT_ID" || clinicId === "CLINIC_ID") {
        console.log("Patient ID and Clinic ID required. Example: node testCreateAppointment.js <patient_id> <clinic_id>");
    }

    const payload = {
        patient_user_id: patientId,
        clinic_id: clinicId,
        status: "pending",
        preferred_start: new Date().toISOString(),
        preferred_end: new Date(Date.now() + 3600000).toISOString(),
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Appointment created successfully:");
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
