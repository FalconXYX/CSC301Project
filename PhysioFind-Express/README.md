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

## Run the server

From this folder:

```bash
npm start
```

The server listens on the port defined by `PORT` in `.env` (default: 3000).

## Testing

Set `NODE_ENV=test` and ensure `.env.test` is configured, then run:

```bash
npm test
```
