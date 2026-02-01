-- PhysioFind Database Schema Migration
-- Based on existing schema provided by user

-- Enable uuid generation (usually already enabled in Supabase)
create extension if not exists "pgcrypto";

create table if not exists clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  website text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  province text not null default 'ON',
  postal_code text not null,
  latitude numeric,
  longitude numeric,
  booking_provider text,
  booking_url text,
  offers_direct_billing boolean not null default false,
  specialties_json jsonb,
  services_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  phone text,
  password_hash text not null,
  role text not null,
  first_name text,
  last_name text,
  date_of_birth date,
  clinic_id uuid references clinics(id),
  clinic_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists practitioners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  profession text not null,
  bio text,
  clinic_id uuid references clinics(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists insurances (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists clinic_insurances (
  clinic_id uuid not null references clinics(id) on delete cascade,
  insurance_id uuid not null references insurances(id) on delete cascade,
  supports_direct_billing boolean not null default false,
  notes text,
  primary key (clinic_id, insurance_id)
);

create index if not exists idx_clinic_insurances_insurance_direct
  on clinic_insurances (insurance_id, supports_direct_billing);

create table if not exists appointment_requests (
  id uuid primary key default gen_random_uuid(),
  patient_user_id uuid not null references users(id) on delete restrict,
  clinic_id uuid not null references clinics(id) on delete cascade,
  practitioner_id uuid references practitioners(id) on delete set null,
  preferred_start timestamptz,
  preferred_end timestamptz,
  constraints_json jsonb,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_appointment_requests_clinic_status_created
  on appointment_requests (clinic_id, status, created_at);

create index if not exists idx_appointment_requests_patient_created
  on appointment_requests (patient_user_id, created_at);
