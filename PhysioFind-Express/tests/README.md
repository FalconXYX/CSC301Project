# PhysioFind Testing Guide

This guide explains how to run tests locally and against the remote database, and provides a description of the project's key scripts and test files.

## Environment Setup

Before running any tests, ensure your `.env` file is configured correctly, it must have correct connection string.


### 1. Remote Testing (Supabase)
- **Database:** Hosted Supabase instance
- **Data base url:** `postgresql://postgres.blpcmrlpudoglgpkmwmo:Physiofind301!@aws-1-us-east-1.pooler.supabase.com:6543/postgres`

### 2. Local Testing (Docker)
- **Database:** Local PostgreSQL container (`physiofind-db`)
- **Data base url:** `postgresql://physiofind:physiofind@localhost:5432/physiofind`

---

## How to Run Tests

### 1. Database Consistency Check
Verifies that all required tables, columns, and foreign key relationships exist.
```bash
npm run test:db-consistency
```

### 2. API Tests
Tests individual API endpoints. Note that most of these will fail until the corresponding backend routes are implemented.

**User Tests:**
```bash
node tests/api-tests/users/testCreateUser.js
node tests/api-tests/users/testGetUser.js <user_id>
node tests/api-tests/users/testUpdateUser.js <user_id>
node tests/api-tests/users/testDeleteUser.js <user_id>
```

**Practitioner Tests:**
```bash
node tests/api-tests/practitioners/testCreatePractitioner.js <user_id>
```

**Appointment Tests:**
```bash
node tests/api-tests/appointments/testCreateAppointment.js <patient_id> <clinic_id>
```

**Clinic Tests:**
```bash
node scripts/api-testing-scripts/testGetClinics.js
node scripts/api-testing-scripts/testCreateClinic.js
```

### 4. Run All Tests
Executes the full test suite in order.
```bash
npm run test:all
```

---

## File Descriptions

Below is a breakdown of the custom scripts and test files created for this project.

### Scripts (`scripts/`)
*   **`seedDatabase.js`**:
    *   **Purpose:** Populates the database with initial data derived from `find-provider-results.json`.
    *   **Details:** Inserts Insurances, Clinics, Users, and Practitioner profiles. Handles potential duplicates using `upsert` or checks.
*   **`syncPrismaSchema.js`**:
    *   **Purpose:** Helper script to synchronize the local Prisma schema with the remote database.
    *   **Details:** Runs `prisma db pull` followed by `prisma generate`.
*   **`runSqlMigration.js`**:
    *   **Purpose:** Applies raw SQL migration files to the database.
    *   **Details:** Reads `.sql` files from `migrations/` and executes them using the `pg` client.

### Tests (`tests/`)
*   **`db-consistency-test.js`**:
    *   **Purpose:** Validates the database schema structure.
    *   **Details:** Checks for the existence of `clinics`, `users`, `practitioners`, `insurances`, etc., and verifies column names and foreign key constraints.
*   **`test-runner.js`**:
    *   **Purpose:** Orchestrates the execution of multiple tests.
    *   **Details:** Runs `db-consistency-test.js` followed by API tests, reporting a summary of passes/failures.

### API Tests (`tests/api-tests/`)
*   **`users/`**: Contains scripts to test CRUD operations for User accounts (`create`, `get`, `update`, `delete`).
*   **`practitioners/`**: Tests creation of Practitioner profiles linked to Users.
*   **`insurances/`**: Tests creation of Insurance providers.
*   **`appointments/`**: Tests creation of Appointment requests.

---

## Current Test Status (Feb 15, 2026)

### 1. Database & Seeding (PASSED)
Both **Remote** (Supabase) and **Local** (Docker) environments have been verified.
- Schema is consistent.
- Seed data (Clinics, Insurances) populates correctly.

### 2. API Endpoints (PENDING)
Most API tests are currently failing because the backend routes (Controllers/Routes) have not yet been implemented in the Express application.
- **Action Required:** Implement routes in `routes/` directory to satisfy these tests.