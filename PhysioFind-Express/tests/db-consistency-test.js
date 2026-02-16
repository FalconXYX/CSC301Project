const { Client } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL not found in .env file.");
    process.exit(1);
}

const EXPECTED_TABLES = [
    "clinics",
    "users",
    "practitioners",
    "insurances",
    "clinic_insurances",
    "appointment_requests",
];

const EXPECTED_COLUMNS = {
    clinics: [
        "id",
        "name",
        "phone",
        "email",
        "address_line1",
        "city",
        "province",
        "postal_code",
        "offers_direct_billing",
    ],
    users: ["id", "email", "password_hash", "role", "created_at"],
    practitioners: ["id", "user_id", "profession", "is_active"],
    insurances: ["id", "name"],
    clinic_insurances: ["clinic_id", "insurance_id", "supports_direct_billing"],
    appointment_requests: ["id", "patient_user_id", "clinic_id", "status"],
};

const EXPECTED_FOREIGN_KEYS = [
    { table: "users", column: "clinic_id", foreignTable: "clinics" },
    { table: "practitioners", column: "user_id", foreignTable: "users" },
    { table: "practitioners", column: "clinic_id", foreignTable: "clinics" },
    {
        table: "clinic_insurances",
        column: "clinic_id",
        foreignTable: "clinics",
    },
    {
        table: "clinic_insurances",
        column: "insurance_id",
        foreignTable: "insurances",
    },
    {
        table: "appointment_requests",
        column: "patient_user_id",
        foreignTable: "users",
    },
    {
        table: "appointment_requests",
        column: "clinic_id",
        foreignTable: "clinics",
    },
    {
        table: "appointment_requests",
        column: "practitioner_id",
        foreignTable: "practitioners",
    },
];

async function runTest() {
    console.log("Starting database consistency check...");

    const maskedString = connectionString.replace(/:[^:]*@/, ":***@");
    console.log(`Connecting to: ${maskedString}`);

    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();
        console.log("Connected to database.");

        let hasError = false;

        console.log("Checking tables...");
        const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        const existingTables = tablesRes.rows.map((r) => r.table_name);

        for (const table of EXPECTED_TABLES) {
            if (!existingTables.includes(table)) {
                console.error(`Missing table: ${table}`);
                hasError = true;
            }
        }

        if (EXPECTED_TABLES.every(t => existingTables.includes(t))) {
            console.log("All expected tables exist.");
        }

        console.log("Checking columns...");
        for (const [table, columns] of Object.entries(EXPECTED_COLUMNS)) {
            if (!existingTables.includes(table)) continue;

            const columnsRes = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
      `, [table]);

            const existingColumns = columnsRes.rows.map((r) => r.column_name);

            const missingColumns = columns.filter(col => !existingColumns.includes(col));

            if (missingColumns.length === 0) {
                console.log(`Table '${table}' has all expected columns.`);
            } else {
                console.error(`Table '${table}' is missing columns: ${missingColumns.join(", ")}`);
                hasError = true;
            }
        }

        console.log("Checking foreign keys...");
        const fksRes = await client.query(`
      SELECT
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY';
    `);

        const existingFKs = fksRes.rows;
        let fkError = false;

        for (const expectedFK of EXPECTED_FOREIGN_KEYS) {
            const found = existingFKs.find(
                (fk) =>
                    fk.table_name === expectedFK.table &&
                    fk.column_name === expectedFK.column &&
                    fk.foreign_table_name === expectedFK.foreignTable
            );

            if (!found) {
                console.error(`Missing Foreign Key: ${expectedFK.table}.${expectedFK.column} -> ${expectedFK.foreignTable}`);
                fkError = true;
                hasError = true;
            }
        }

        if (!fkError) {
            console.log("All expected foreign keys exist.");
        }

        console.log("==================================================");
        if (hasError) {
            console.error("Database consistency check failed.");
            process.exit(1);
        } else {
            console.log("Database consistency check PASSED.");
        }
        console.log("==================================================");

    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runTest();
