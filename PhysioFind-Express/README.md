# PhysioFind Express

## Overview

This is the Express backend for the PhysioFind project. It provides HTTP routes, server configuration, and middleware for the application. Configuration is managed through environment variables loaded from `.env`.

## Prerequisites

- Node.js 18+ (recommended)
- Docker Desktop (for local Postgres)

## Install dependencies

```bash
npm install
```

## Environment variables

Create or update these files in this folder:

- `.env` for local development
- `.env.test` for tests

Example values:

```
NODE_ENV=development
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=physiofind
DB_USER=physiofind
DB_PASSWORD=physiofind
DATABASE_URL=postgresql://physiofind:physiofind@localhost:5432/physiofind
```

## Start a local database (Postgres)

The database schema is initialized from the SQL migration at:

- `supabase/migrations/20260201074556_initial_schema.sql`

From the repo root, build the database image:

```bash
docker build -t physiofind-postgres .
```

Run the container on port 5432:

```bash
docker run --name physiofind-db -p 5432:5432 -d physiofind-postgres
```

To stop and remove the container:

```bash
docker stop physiofind-db

docker rm physiofind-db
```

## Prisma setup

Generate the Prisma client after installing dependencies and when the schema changes:

```bash
npx prisma generate
```

If you update the database schema, keep Prisma in sync:

```bash
npx prisma db pull
npx prisma generate
```

## Run the server

From this folder:

```bash
npm start
```

The server listens on the port defined by `PORT` in `.env` (default: 3000).

## Testing

### Environment Setup

Tests use either `.env.local` (development) or `.env.production`. Ensure the correct environment file is configured before running tests.

### Running Tests

All tests are executed through npm with the syntax: `npm run test:<category>[:prod]`

**All tests:**

- `npm test` — runs all tests against local database
- `npm run test:prod` — runs all tests against production database

**By category:**

- `npm run test:clinic` — all clinic API tests (local)
- `npm run test:user` — all user API tests (local)
- `npm run test:db` — database consistency check (local)

Add `:prod` suffix to run against production (e.g., `npm run test:clinic:prod`)

### How It Works

The test runner (`scripts/runTests.js`) orchestrates test execution:

1. Loads the specified environment file (`.env.local` or `.env.production`)
2. Sets `NODE_ENV` appropriately (development or production)
3. Executes tests sequentially in the specified category
4. Reports results after all tests complete

Individual test files can still be run directly:

```bash
node tests/api-tests/users/testCreateUser.js
node scripts/api-testing-scripts/testGetClinics.js
```
