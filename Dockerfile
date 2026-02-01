FROM postgres:16-alpine

ENV POSTGRES_USER=physiofind \
    POSTGRES_PASSWORD=physiofind \
    POSTGRES_DB=physiofind

COPY supabase/migrations/20260201074556_initial_schema.sql /docker-entrypoint-initdb.d/001_initial_schema.sql

EXPOSE 5432
