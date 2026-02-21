# System Design

**Collaborators:** Parth Jain, Drew Nerbas, Martin Stric, Jordan Jones, Saahil Pandit

## Table of Contents

- [System Design](#system-design)
  - [Table of Contents](#table-of-contents)
  - [1. Introduction](#1-introduction)
    - [1.1. Purpose](#11-purpose)
  - [2. CRC Cards](#2-crc-cards)
    - [2.1. Database Models](#21-database-models)
    - [2.2. Backend Layer](#22-backend-layer)
    - [2.3. Frontend Layer](#23-frontend-layer)
    - [2.4. Testing Infrastructure](#24-testing-infrastructure)
  - [3. Software Architecture](#3-software-architecture)
    - [3.1. Architecture Overview](#31-architecture-overview)
    - [3.2. Technology Stack](#32-technology-stack)
    - [3.3. Architecture Diagram](#33-architecture-diagram)
    - [3.4. Data Flow](#34-data-flow)
    - [3.5. Design Rationale](#35-design-rationale)
  - [4. Conclusion](#4-conclusion)

## 1. Introduction

PhysioFind is a web application designed to connect patients in Ontario with allied health professionals, such as physiotherapists, chiropractors, and registered massage therapists. The platform aims to streamline the process of discovering and booking appointments with healthcare providers by offering a user-friendly interface and a robust backend system.

### 1.1. Purpose

The purpose of this document is to outline the software architecture and design principles of PhysioFind. It provides an overview of the system's structure, technology stack, and data flow, serving as a guide for developers and stakeholders involved in the project.

## 2. CRC Cards

### 2.1. Database Models

|**Class:** `clinics`|
|:-|
|**_Responsibilities_**|
|• Store clinic info (name, phone, email, website)|
|• Store address (address_line1/2, city, province, postal_code)|
|• Store geographic coordinates (latitude, longitude)|
|• Store booking info (booking_provider, booking_url)|
|• Store services and specialties as JSON (services_json, specialties_json)|
|• Track direct billing support (offers_direct_billing)|
|**_Collaborators_**|
|• `PrismaClient`|
|• `users`|
|• `practitioners`|
|• `clinic_insurances`|
|• `appointment_requests`|

|**Class:** `users`|
|:-|
|**_Responsibilities_**|
|• Store user authentication data (email, password_hash)|
|• Store user profile (first_name, last_name, phone, date_of_birth)|
|• Define system-level role (patient/admin/staff)|
|• Associate user with a clinic (clinic_id, clinic_role)|
|**_Collaborators_**|
|• `PrismaClient`|
|• `clinics`|
|• `practitioners`|
|• `appointment_requests`|

|**Class:** `practitioners`|
|:-|
|**_Responsibilities_**|
|• Extend a user as a healthcare practitioner (profession, bio)|
|• Associate practitioner with a clinic (clinic_id)|
|• Track active status (is_active)|
|**_Collaborators_**|
|• `PrismaClient`|
|• `users`|
|• `clinics`|
|• `appointment_requests`|

|**Class:** `insurances`|
|:-|
|**_Responsibilities_**|
|• Store insurance provider names|
|• Link to clinics through clinic_insurances join table|
|**_Collaborators_**|
|• `PrismaClient`|
|• `clinic_insurances`|

|**Class:** `clinic_insurances`|
|:-|
|**_Responsibilities_**|
|• Join table linking clinics to insurances|
|• Track whether direct billing is supported for this pairing|
|• Store optional notes|
|**_Collaborators_**|
|• `PrismaClient`|
|• `clinics`|
|• `insurances`|

|**Class:** `appointment_requests`|
|:-|
|**_Responsibilities_**|
|• Store appointment requests from patients to clinics|
|• Track preferred time window (preferred_start, preferred_end)|
|• Store scheduling constraints as JSON (constraints_json)|
|• Track request status (e.g., pending, confirmed)|
|**_Collaborators_**|
|• `PrismaClient`|
|• `users` (patient)|
|• `clinics`|
|• `practitioners`|

### 2.2. Backend Layer

|**Class:** `PrismaClient`|
|:-|
|**_Responsibilities_**|
|• Execute type-safe database queries against PostgreSQL|
|• Manage connection to Supabase PostgreSQL via DATABASE_URL|
|• Handle UUID generation and timestamps|
|• Shared singleton instance across all route handlers (config/prisma.js)|
|**_Collaborators_**|
|• All route handlers|
|• All database models|

|**Class:** `ClinicRouter` (routes/providers/)|
|:-|
|**_Responsibilities_**|
|• `GET /clinics` — retrieve all clinics (paginated)|
|• `GET /clinics/:id` — get a single clinic by ID|
|• `GET /clinics/public` — get all clinics (public fields only)|
|• `GET /clinics/public/:id` — get a single clinic (public fields only)|
|• `POST /clinics` — create a new clinic|
|• `PUT /clinics/:id` — update clinic details|
|• `DELETE /clinics/:id` — delete a clinic|
|**_Collaborators_**|
|• `PrismaClient`|
|• Express Router|
|• `clinics` model|

|**Class:** `UserRouter` (routes/users/)|
|:-|
|**_Responsibilities_**|
|• `POST /users` — create a new user|
|• `GET /users/:id` — retrieve a user profile|
|• `PUT /users/:id` — update user data|
|• `DELETE /users/:id` — delete a user|
|**_Collaborators_**|
|• `PrismaClient`|
|• Express Router|
|• `users` model|

|**Class:** `AuthMiddleware` (routes/auth/authMiddleware.js)|
|:-|
|**_Responsibilities_**|
|• Verify Supabase JWT tokens on protected routes|
|• Attach authenticated user info to request object|
|• Return 401 for invalid or missing tokens|
|• Configure CORS to allow only approved origins|
|**_Collaborators_**|
|• Express Router|
|• Supabase Auth (`supabase.auth.getUser()`)|
|• All protected route handlers|

|**Class:** `AuthRouter` (routes/auth/)|
|:-|
|**_Responsibilities_**|
|• `POST /auth/signIn` — Authenticate user via Supabase|
|• `POST /auth/signOut` — Terminate user session|
|**_Collaborators_**|
|• Supabase Auth|
|• Express Router|

|**Class:** `ErrorMiddleware` (utils/prismaErrorMapper.js)|
|:-|
|**_Responsibilities_**|
|• Intercept Prisma database errors|
|• Map internal error codes (P2002, P2025, etc.) to HTTP status codes|
|• Provide user-friendly error messages|
|**_Collaborators_**|
|• Express Error Handler|
|• Prisma Client|
|• All route handlers|

### 2.3. Frontend Layer

|**Class:** `App` (App.tsx)|
|:-|
|**_Responsibilities_**|
|• Initialize React application|
|• Set up routing using React Router|
|• Render main layout and page components|
|**_Collaborators_**|
|• React Router|
|• All page components|

|**Class:** `PlacesSearchMap` (components/PlacesSearchMap.tsx)|
|:-|
|**_Responsibilities_**|
|• Render interactive map with clinic search results|
|• Accept user location input and display nearby providers|
|• Show both verified (internal) and unverified (Google Maps) providers|
|**_Collaborators_**|
|• `GoogleMapsProvider`|
|• `placesService`|
|• Google Maps JavaScript API|

|**Class:** `GoogleMapsProvider` (components/GoogleMapsProvider.tsx)|
|:-|
|**_Responsibilities_**|
|• Load and initialize the Google Maps JavaScript SDK|
|• Provide the Maps context to child components|
|**_Collaborators_**|
|• `PlacesSearchMap`|
|• Google Maps API|

|**Class:** `placesService` (services/placesService.ts)|
|:-|
|**_Responsibilities_**|
|• Query the Google Maps Places API for nearby healthcare providers|
|• Filter results for healthcare-relevant categories|
|• Normalize external provider data for display|
|**_Collaborators_**|
|• `PlacesSearchMap`|
|• Google Maps Places API|

### 2.4. Testing Infrastructure

|**Class:** `TestRunner` (scripts/runTests.js)|
|:-|
|**_Responsibilities_**|
|• Standardize API testing execution|
|• Discover and run entity-specific test scripts|
|• Aggregate test results and handle reporting|
|**_Collaborators_**|
|• `APITests`|
|• Node.js Child Process|

|**Class:** `APITests` (scripts/api-testing-scripts/)|
|:-|
|**_Responsibilities_**|
|• Perform automated CRUD validation for Users and Clinics|
|• Verify database consistency and error handling|
|• Validate authorization logic for protected endpoints|
|**_Collaborators_**|
|• Express API|
|• `PrismaClient`|
|• `TestRunner`|

## 3. Software Architecture

### 3.1. Architecture Overview

PhysioFind follows the Model-View-Controller (MVC) architectural pattern, a widely-used design pattern in web applications. The system is structured in three tiers:

1. **Presentation Tier (View):** React-based frontend that handles user interface and user interactions.
2. **Application Tier (Controller):** Express.js backend API that processes requests, implements business logic, and coordinates between the view and model.
3. **Data Tier (Model):** PostgreSQL database (hosted on Supabase) that persists application data and manages data relationships.

### 3.2. Technology Stack

**Frontend (View):**
- React 19 — UI component framework
- React Router — Client-side routing
- TypeScript — Statically typed JavaScript
- Vite — Build tool and development server
- Google Maps JavaScript API — Interactive maps and places search

**Backend (Controller):**
- Node.js — Runtime environment
- Express.js — Web application framework
- Prisma ORM — Type-safe database client

**Database (Model):**
- PostgreSQL (via Supabase) — Relational database management system

**Auth:**
- Supabase Auth — JWT-based authentication and Row Level Security (RLS)

### 3.3. Architecture Diagram

The following diagram illustrates the MVC architecture of PhysioFind, showing the flow of data and interactions between the different layers:

![Architecture Diagram](./Images/architecture-diagram.png)

### 3.4. Data Flow

A typical request flow through the system follows these steps:
1. The user interacts with the React frontend (e.g., submits the search questionnaire).
2. The frontend calls either the internal Express.js API or the Google Maps Places API depending on the data needed.
3. For internal requests: Express.js validates the JWT via Supabase auth middleware, then uses Prisma to query PostgreSQL.
4. The database returns results to the backend, which forwards them to the frontend.
5. For external requests: `placesService` queries Google Maps directly and normalizes the response.
6. The frontend merges and renders results on the map and results page.

### 3.5. Design Rationale

The MVC architecture was chosen for its clear separation of concerns, which enhances maintainability and scalability. React provides a dynamic and responsive user interface, while Express.js offers a robust framework for building RESTful APIs. PostgreSQL (via Supabase) was selected for its reliability, support for Row Level Security, and built-in authentication primitives. Prisma ORM was added to provide type-safe database access and simplify schema management. The Google Maps Places API supplements internal clinic data with external provider discovery.

## 4. Conclusion

This system design document outlines the architecture and technology stack of PhysioFind, providing a foundation for the development and maintenance of the application. The MVC pattern ensures a modular structure, facilitating future enhancements and scalability.

As development progresses, this design will serve as a living foundation for implementing features, with further refinements made to address emerging requirements and optimize performance.
