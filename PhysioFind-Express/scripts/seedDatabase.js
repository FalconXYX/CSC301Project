const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CLINICS = [
    {
        name: "PhysioFind Downtown",
        phone: "416-555-0100",
        email: "contact@physiofind.example",
        website: "https://physiofind.example",
        address_line1: "123 King St W",
        city: "Toronto",
        province: "ON",
        postal_code: "M5H 1J9",
        offers_direct_billing: false,
    },
    {
        name: "Toronto Family Health Centre",
        phone: "(416) 555-0123",
        email: "info@torontofamilyhealth.ca",
        website: "https://torontofamilyhealth.ca",
        address_line1: "123 Queen Street West",
        address_line2: "Suite 400",
        city: "Toronto",
        province: "ON",
        postal_code: "M5H 2M9",
        offers_direct_billing: true,
        services_json: ["Pediatrics", "Physical Exams"],
    },
    {
        name: "Bloor Medical Clinic",
        phone: "(416) 555-0456",
        email: "appointments@bloormedical.com",
        website: "https://bloormedical.com",
        address_line1: "789 Bloor Street East",
        city: "Toronto",
        province: "ON",
        postal_code: "M4W 1A9",
        offers_direct_billing: false,
        services_json: ["Minor Procedures", "Lab Services", "X-Ray"],
    },
    {
        name: "Scarborough Women's Health Clinic",
        phone: "(416) 555-0789",
        email: "info@scarboroughwomenshealth.ca",
        address_line1: "2450 Lawrence Avenue East",
        address_line2: "Unit 12",
        city: "Scarborough",
        province: "ON",
        postal_code: "M1P 2R7",
        offers_direct_billing: true,
        services_json: ["Family Planning", "Women's Health"],
    },
    {
        name: "North York Urgent Care",
        phone: "(416) 555-0321",
        website: "https://nyurgentcare.ca",
        address_line1: "5500 Yonge Street",
        city: "North York",
        province: "ON",
        postal_code: "M2N 5S3",
        offers_direct_billing: true,
        services_json: ["Urgent Care", "Wound Care", "IV Therapy"],
    },
];

const INSURANCES = [
    { name: "Sun Life" },
    { name: "Manulife" },
    { name: "Canada Life" },
    { name: "Blue Cross" },
    { name: "Green Shield" },
];

const USERS = [
    { email: "practitioner1@example.com", role: "practitioner", first_name: "Alice", last_name: "Smith" },
    { email: "practitioner2@example.com", role: "practitioner", first_name: "Bob", last_name: "Jones" },
    { email: "patient1@example.com", role: "patient", first_name: "Charlie", last_name: "Brown" },
    { email: "patient2@example.com", role: "patient", first_name: "Diana", last_name: "Prince" },
    { email: "admin1@example.com", role: "admin", first_name: "Eve", last_name: "Admin" },
];

async function main() {
    console.log("Seeding database...");

    try {
        for (const clinic of CLINICS) {
            await prisma.clinics.upsert({
                where: { name: clinic.name },
                update: clinic,
                create: clinic,
            });
        }
        console.log("Clinics seeded");

        for (const ins of INSURANCES) {
            await prisma.insurances.upsert({
                where: { name: ins.name },
                update: {},
                create: ins,
            });
        }
        console.log("Insurances seeded");

        const createdUsers = [];
        for (const user of USERS) {
            const u = await prisma.users.upsert({
                where: { email: user.email },
                update: {},
                create: { ...user, password: "Password123!" },
            });
            createdUsers.push(u);
        }
        console.log("Users seeded");

        const practitioners = [
            { user_id: createdUsers[0].id, profession: "Physiotherapist", bio: "Expert in sports injuries." },
            { user_id: createdUsers[1].id, profession: "Massage Therapist", bio: "Relaxation and recovery." },
            { user_id: createdUsers[0].id, profession: "Chiropractor", bio: "Spinal adjustments." },
            { user_id: createdUsers[1].id, profession: "Osteopath", bio: "Holistic approach." },
            { user_id: createdUsers[0].id, profession: "Acupuncturist", bio: "Traditional Chinese Medicine." },
        ];

        for (const prac of practitioners) {
            try {
                await prisma.practitioners.create({ data: { ...prac, is_active: true } });
            } catch (err) { }
        }
        console.log("Practitioners seeded");

        const patientId = createdUsers[2].id;
        const clinic = await prisma.clinics.findFirst({ where: { name: "PhysioFind Downtown" } });

        if (clinic) {
            for (let i = 0; i < 5; i++) {
                await prisma.appointment_requests.create({
                    data: {
                        patient_user_id: patientId,
                        clinic_id: clinic.id,
                        status: "pending",
                        preferred_start: new Date(),
                        preferred_end: new Date(Date.now() + 3600000),
                    },
                });
            }
            console.log("Appointments seeded");
        }

        console.log("Seeding complete.");
    } catch (e) {
        console.error("Seeding error:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
