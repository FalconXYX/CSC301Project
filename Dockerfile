FROM postgres:16-alpine

ENV POSTGRES_USER=physiofind \
    POSTGRES_PASSWORD=physiofind \
    POSTGRES_DB=physiofind

COPY PhysioFind-Express/migrations/20260201074556_initial_schema.sql /docker-entrypoint-initdb.d/001_initial_schema.sql
COPY PhysioFind-Express/migrations/20260315000000_google_calendar_oauth.sql /docker-entrypoint-initdb.d/002_google_calendar_oauth.sql

EXPOSE 5432
