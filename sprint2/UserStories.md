# Sprint 2 User Stories
# TODO: Add Acceptance Criteria 

## User Story 2.1: Resolve Unfinished Tickets #54
As a **developer**, I want to complete all unfinished tickets from Sprint 1 so that the project remains on schedule and the foundational implementation is fully realized.

**Priority:** High

**Estimate:** 8

**Action Items:**
- **2.1.2: Implement External Provider Query #37**
    - **Description:** 
        - As a **patient**, I want the system to search for healthcare providers using external sources so that I can discover clinics that are not yet verified partners.
    - **Action Items:**
        - Implement Google Maps / Places API query.
        - Filter for healthcare provider categories.
        - Normalize external provider data.
    - **Estimate:** 3

- **2.1.3: Integrate and Merge Provider Data Sources #38**
    - **Description:**
        - As a **patient**, I want to see a unified list of providers so that I can compare verified clinics and external providers in one place.
    - **Action Items:**
        - Connect to internal Provider API.
        - Fetch external provider results.
        - Merge and sort provider datasets.
        - Add verified/unverified indicators in UI.
    - **Estimate:** 5

**User Story 2.1 Acceptance Criteria:**
- All linked Sprint 1 tickets are moved to **Done**.
- Any blockers from Sprint 1 are identified and resolved.
- No partially implemented core functionality remains.
- Codebase reflects the intended Sprint 1 scope.
- Google Maps / Places API is queried using user location.
- Only relevant healthcare providers are returned.
- External providers are marked as unverified.
- Data format matches internal provider display requirements.
- Internal verified providers are fetched from backend API.
- External providers are fetched from Google Maps API.
- Results are merged into a single list.
- Verified providers are clearly labeled or prioritized.
- Sorting and rendering behave consistently.

---

## User Story 2.2: Create User Authentication #55
As a **developer**, I want to implement backend authentication and database security using Supabase so that all API requests are verified and patient data is protected from unauthorized access.

**Priority:** P0

**Estimate:** 10

**Action Items:**
- **2.2.1: Configure Supabase Auth providers #61**
    - **Description:**
         - correct configuration of Supabase Auth providers.
    - **Action Items:**
        - Configure Supabase Auth providers.
   
- **2.2.2: Create backend auth middleware #63**
    - **Description:**
         - create backend auth middleware.
    - **Action Items:**
        - Create backend auth middleware.

- **2.2.3: Apply auth middleware to API endpoints #64**
    - **Description:**
         - apply auth middleware to API endpoints.
    - **Action Items:**
        - Apply auth middleware to API endpoints.

- **2.2.4: Enable Row Level Security (RLS) #65**
    - **Description:**
         - enable Row Level Security (RLS).
    - **Action Items:**
        - Enable Row Level Security (RLS).

- **2.2.5: Configure CORS restrictions #66**
    - **Description:**
         - configure CORS restrictions.
    - **Action Items:**
        - Configure CORS restrictions.

**User Story 2.2 Acceptance Criteria:**
- Supabase authentication providers are correctly configured.
- Backend verifies user identity before processing requests.
- Database Row Level Security (RLS) is enforced.
- Unauthorized access attempts are blocked.
- Authenticated user ID is enforced at API and database layers.

---

## User Story 2.3: Account Management Front End Implementation #56
As a **user**, I want to create an account, log in, and manage my account details so that I can securely access the platform.

**Priority:** P0

**Estimate:** 11

**Action Items:**
- **2.3.1: Implement React Auth Context #67**
    - **Description:**
         - Implement React Auth Context.
    - **Action Items:**
        - Implement React Auth Context.

- **2.3.2: Implement Sign-Up page #68**
    - **Description:**
         - Implement Sign-Up page.
    - **Action Items:**
        - Implement Sign-Up page.

- **2.3.3: Implement Login page #69**
    - **Description:**
         - Implement Login page.
    - **Action Items:**
        - Implement Login page.

- **2.3.4: Create Protected Route wrapper #70**
    - **Description:**
         - Create Protected Route wrapper.
    - **Action Items:**
        - Create Protected Route wrapper.

- **2.3.5: Implement User Profile & Settings UI #71**
    - **Description:**
         - Implement User Profile & Settings UI.
    - **Action Items:**
        - Implement User Profile & Settings UI.

**User Story 2.3 Acceptance Criteria:**
- Users can sign up and log in successfully.
- Authentication state persists across refreshes.
- Protected routes redirect unauthenticated users.
- Users can update password and sign out.

---

## User Story 2.4: Clinic Management Front End #57
As a **clinic manager**, I want to create and manage my clinic’s public profile so that patients can view accurate and detailed clinic information.

**Priority:** P1

**Estimate:** 19

**Action Items:**
- **2.4.1: Implement role-based route protection #72**
    - **Description:**
         - Implement role-based route protection.
    - **Action Items:**
        - Implement role-based route protection.

- **2.4.2: Develop clinic creation wizard #73**
    - **Description:**
         - Develop clinic creation wizard.
    - **Action Items:**
        - Develop clinic creation wizard.

- **2.4.3: Implement clinic management dashboard #74**
    - **Description:**
         - Implement clinic management dashboard.
    - **Action Items:**
        - Implement clinic management dashboard.

- **2.4.4: Implement edit clinic details feature #75**
    - **Description:**
         - Implement edit clinic details feature.
    - **Action Items:**
        - Implement edit clinic details feature.

- **2.4.5: Implement clinic image/logo upload #76**
    - **Description:**
         - Implement clinic image/logo upload.
    - **Action Items:**
        - Implement clinic image/logo upload.

**User Story 2.4 Acceptance Criteria:**
- Clinic managers can create a clinic profile.
- Clinic dashboard displays current clinic data.
- Clinic details can be edited and saved.
- Clinic logo/image can be uploaded.

---

## User Story 2.5: Front-End / Back-End Integration #59
As a **developer**, I want to configure and verify frontend-backend integration across environments so that the application works correctly in both development and production.

**Priority:** P0

**Estimate:** 10

**Action Items:**
- **2.5.1: Configure environment variables #77**
    - **Description:**
         - Configure environment variables.
    - **Action Items:**
        - Configure environment variables.

- **2.5.2: Implement dynamic API client #78**
    - **Description:**
         - Implement dynamic API client.
    - **Action Items:**
        - Implement dynamic API client.

- **2.5.3: Verify CORS & network security #79**
    - **Description:**
         - Verify CORS & network security.
    - **Action Items:**
        - Verify CORS & network security.

- **2.5.4: Perform production build & integration test #80**
    - **Description:**
         - Perform production build & integration test.
    - **Action Items:**
        - Perform production build & integration test.

**User Story 2.5 Acceptance Criteria:**
- Environment variables are correctly configured.
- Frontend dynamically selects correct backend URL.
- CORS allows only approved origins.
- Production build works end-to-end.

---

## User Story 2.6: Create Search Functionality #60
As a **patient**, I want my questionnaire responses to be matched against the clinic database so that I receive a ranked list of providers that meet my needs.

**Priority:** P0

**Estimate:** 16

**Action Items:**
- **2.6.1: Implement search API endpoint (Prisma) #81**
    - **Description:**
         - Implement search API endpoint (Prisma).
    - **Action Items:**
        - Implement search API endpoint (Prisma).

- **2.6.2: Implement location sorting logic #82**
    - **Description:**
         - Implement location sorting logic.
    - **Action Items:**
        - Implement location sorting logic.

- **2.6.3: Integrate search results page #83**
    - **Description:**
         - Integrate search results page.
    - **Action Items:**
        - Integrate search results page.

- **2.6.4: Connect questionnaire submission to search #84**
    - **Description:**
         - Connect questionnaire submission to search.
    - **Action Items:**
        - Connect questionnaire submission to search.

- **2.6.5: Add availability placeholder UI #85**
    - **Description:**
         - Add availability placeholder UI.
    - **Action Items:**
        - Add availability placeholder UI.

**User Story 2.6 Acceptance Criteria:**
- Questionnaire submission triggers a search request.
- Clinics are filtered by services and specialties.
- Clinics are ranked by distance.
- Real data is displayed in search results.
- “No results” state is handled correctly.
