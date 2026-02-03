# User Stories
# TODO: Add Acceptance Criteria 
## User Story 1.1: Setup-DB
As a developer, I want to set up a Postgres database schema for users and clinics so that we have a foundation for storing and retrieving data later.

**Priority:** Time&#8209;sensitive

**Estimate:** 8

**Action Items:**
- **1.1.1: Confirm DB Hosting Platform**
    -  **Description:** 
        - Research database hosting options to compare against Supabase so the group can make an informed decision on the final platform.
    - **Action Items:**
        - Research features and pricing for Supabase and a few alternative platforms.
        - Prepare a comparison of the options to present to the group.
        - Facilitate a discussion to confirm the final choice of platform.
    - **Estimate:** 2

- **1.1.2: Accounts and Environment Variables**
    - **Description:**
        - Set up the shared platform account and configure environment variables to secure credentials for both local and hosted testing.
    - **Action Items:**
        - Create the platform account and store the credentials where the whole group can access them.
        - Establish an environment variable file to handle database passwords and access keys.
        - Upload variables to the host and verify connections without exposing secrets on GitHub.
    - **Estimate:** 1

- **1.1.3: Draft DB Schema**
    - **Description:**
        - Design the database tables for users and service providers by identifying the necessary attributes and data types for each entity.
    - **Action Items:**
        - Determine the specific columns and data types needed for the User table.
        - Identify the required attributes for the Provider table such as specialization and availability.
        - Document the proposed schema designs for team approval.
    - **Estimate:** 3
    
- **1.1.4: Implement Schema**
    - **Description:**
        - Determine whether to use an Object-Relational Mapper or raw SQL and implement the final schema accordingly.
    - **Action Items:**
        - Compare ORM options versus raw SQL and decide on the approach with the group.
        - Translate the drafted table designs into the actual database or ORM definitions.
        - Verify the schema implementation works as expected.
    - **Estimate:** 2

- **1.1.5: Configure Migrations**
    - **Description:**
        - Set up and verify that database schema migrations run correctly across local, testing, and cloud environments.
    - **Action Items:**
        - Configure the migration scripts to handle connections for both local and cloud databases.
        - Run test migrations on the local environment and the hosted testing database to ensure consistency.
        - Verify that schema updates propagate successfully to production without errors.
    - **Estimate:** 1

- **1.1.6: Create Testing Files**
    - **Description:**
        - Develop standalone test files to verify that database interactions and API changes function correctly across local and hosted environments.
    - **Action Items:**
        - Write isolated test scripts to validate database consistency and recent API updates.
        - Configure the tests to run against both local and hosted database instances.
        - Establish a process to run these tests successfully before closing the sprint.
    - **Estimate:** 2

**User Story 1.1 Acceptance Criteria:**
- A PostgreSQL database is selected, provisioned, and accessible for local, testing, and hosted environments.
- Secure environment variables are configured for all environments, and no credentials are committed to version control.
- Database schemas for Users and Providers/Clinics are finalized, documented, and approved by the team.
- The schemas are successfully implemented using the agreed-upon approach (ORM or raw SQL).
- Database migrations are configured and can be run consistently across local, testing, and production environments.
- Test scripts exist and can verify basic database connectivity and schema correctness in both local and hosted environments.
- A developer can create, query, and migrate the database without errors using the documented setup.

## User Story 1.2: Create-Front-End
As a developer, I want to set up our React frontend development environment so that we can begin implementing UI features.

**Priority:** Time&#8209;sensitive

**Estimate:** 8

**Action Items:**
- **1.2.1: Confirm Web Framework**
    - **Description:**
        - Research and present front-end web framework options that meet project requirements so the team can select the best one.
    - **Action Items:**
        - Research front-end frameworks that best fit the system requirements.
        - Present a few suitable options to the group for review.
        - Facilitate a team vote or discussion to select the final framework.
    - **Estimate:** 1

- **1.2.2: Framework Setup**
    - **Description:**
        - Initialize the chosen web framework by configuring the base project structure and standardizing code quality tools.
    - **Action Items:**
        - Review the documentation and initialize the empty project structure.
        - Configure linting rules and other necessary project settings.
        - Verify the setup is ready for the team to start development.
    - **Estimate:** 1

- **1.2.3: Create Landing Page**
    - **Description:**
        - Implement the basic layout for the landing page including navigation, hero section, and footer using placeholder assets to establish the rough styling.
    - **Action Items:**
        - Build the navigation header, footer, and main hero section.
        - Implement the layout for promotional information and call-to-action areas.
        - Apply rough styling with placeholder text and images to visualize the design structure.
    - **Estimate:** 3

- **1.2.4: Create User Flow**
    - **Description:**
        - Develop the user interface and logic for the question-and-answer flow using placeholder data, without requiring backend API integration yet.
    - **Action Items:**
        - Create the UI components for displaying questions and selecting answers.
        - Implement the logic to navigate through the sequence of questions.
        - Test the flow using mock data to ensure the user experience is smooth.
    - **Estimate:** 3

- **1.2.5: Create Search Results Flow**
    - **Description:**
        - Build the search results page layout to display verified clinics and Google Maps entries using placeholder data to visualize the final design.
    - **Action Items:**
        - Construct the layout to distinguish between verified partner clinics and general Google Maps results.
        - Populate the interface with placeholder text and images to simulate the user experience.
        - Style the visual elements to ensure the page structure is ready for real data integration.
    - **Estimate:** 2

**User Story 1.2 Acceptance Criteria:**
- A front-end framework is selected, documented, and agreed upon by the team.
- The front-end project initializes successfully with a standardized folder structure and linting/code-quality rules.
- The application runs locally without errors and is ready for feature development.
- A landing page exists with navigation, hero section, and footer using placeholder content.
- A complete user question-and-answer flow is implemented using mock data and functions correctly from start to finish.
- A search results page layout exists that visually distinguishes verified clinics from external listings using placeholder data.
- All implemented UI flows are navigable and testable without backend integration.

## User Story 1.3: API-Design
As a developer, I want to define basic API endpoints for providers and booking so that frontend and backend communication is clear.

**Priority:** Time&#8209;sensitive

**Estimate:** 8

**Items to Consider:**
- User
- Provider

**Action Items:**
- **1.3.1: Implement User Creation**
    - **Description:**
        - Implement the API endpoint to create new user records with all required personal fields and system-generated metadata.
    - **Action Items:**
        - Create the API route to accept attributes like name, email, password, medical data,address, age, and location.
        - Ensure the system automatically generates the ID and meta fields such as creation date and deletion status.
        - Verify that the user entry is correctly saved in the database.
    - **Estimate:** 3

- **1.3.2: Delete User**
    - **Description:**
        - Implement an API endpoint that supports both soft deletion (marking the record as deleted) and hard deletion (permanently removing the record from the database).
    - **Action Items:**
        - Implement the logic for soft deletion (e.g., updating an is_deleted flag).
        - Implement the logic for hard deletion to permanently remove user data.
        - Verify that the endpoint correctly handles both deletion types based on the request parameters.
    - **Estimate:** 2

- **1.3.3: Modify User**
    - **Description:**
        - Create API endpoints to handle user profile updates, such as changing location or updating passwords, to accommodate various modification scenarios.
    - **Action Items:**
        - Specific endpoints or methods to handle different types of updates (e.g., address vs. password).
        - Implement secure handling for sensitive updates like password changes.    
        - Verify that the user record is correctly updated in the database.
    - **Estimate:** 2

- **1.3.4: Get User**
    - **Description:**
        - Develop an endpoint to retrieve user data for the frontend, ensuring strictly limited data exposure due to the presence of sensitive PII and medical information.
    - **Action Items:**
        - Create the endpoint to fetch user details.
        - Implement a filtering layer (DTO or serializer) to strip out unnecessary sensitive data before the response is sent.
        - Verify that only the absolutely required non-sensitive data is exposed to the client.
    - **Estimate:** 3
    
- **1.3.5: Create Provider Entity**
    - **Description:**
        - Implement the functionality to create a provider profile, capturing all necessary business details, account credentials, and descriptive attributes such as specialties and operating hours.
    - **Action Items:**
        - Create the structure to store provider basics: business name, location, slogan, and account holder details.
        - Implement secure storage for account credentials (username and password).
        - Add specific fields for medical specialty, number of practitioners, and an object for opening hours.
        - Include fields for both a short summary and a detailed description of the practice.
    - **Estimate:** 3

- **1.3.6: Delete Provider**
    - **Description:**
        - Implement an API endpoint to remove provider accounts, supporting both soft deletion for data retention and hard deletion for permanent removal.
    - **Action Items:**
        - Implement the logic for soft deletion (e.g., updating an is_deleted flag).
        - Implement the logic for hard deletion to permanently remove the provider record.
        - Ensure the endpoint allows the caller to specify which deletion method to execute.
    - **Estimate:** 3

- **1.3.7: Modify Provider**
    - **Description:**
        - Create endpoints to allow providers to update their profile information, including account credentials, business descriptions, and operational details like opening hours and staff count.
    - **Action Items:**
        - Implement functionality to update sensitive account data like email and password.
        - Create methods to modify business details such as the slogan, short/long descriptions, and practitioner count.
        - Enable updates to the opening hours object.
    - **Estimate:** 3

- **1.3.8: Get Provider Details**
    - **Description:**
        - Develop endpoints to retrieve provider information, ensuring strict security controls for account details while allowing easy access to public data like business name, location, and hours.
    - **Action Items:**
        - Create a public-facing endpoint to fetch general business information (name, location, hours, slogan).
        - Implement a secure, authenticated endpoint for retrieving sensitive account details.
        - Apply data filtering to ensure private account data is never exposed in public queries.
    - **Estimate:** 3

**User Story 1.3 Acceptance Criteria:**
- RESTful API endpoints are defined and implemented for Users and Providers.
- Users can be created, retrieved, updated, and deleted via the API, with support for both soft and hard deletion.
- Providers can be created, retrieved, updated, and deleted via the API, with support for both soft and hard deletion.
- API requests correctly persist data to the database and return predictable, documented responses.
- Frontend developers can rely on the API contract without ambiguity or undocumented behavior.

## User Story 1.4: Create-Maps-API
As a developer, I want to create a API that gets provider profiles based on the location given so that patient-facing features can be used and tested.

**Priority:** Regular

**Estimate:** 5

**Action Items:**
- **1.4.1: Determine Maps API Implementation Strategy**
    - **Description:**
        - Evaluate the security and performance implications to decide whether Google Maps API requests should be handled directly on the front end or proxied through the back end.
    - **Action Items:**
        - Compare the security risks (e.g., exposing API keys) versus the latency benefits of client-side implementation.
        - Specific decision on the architectural approach (client-side vs. server-side).
        - Document the chosen method for the team.
    - **Estimate:** 2

- **1.4.2: Initialize Maps Integration and Secrets**
    - **Description:**
        - Set up the core Google Maps integration by creating the necessary code hooks and securing API credentials in the environment configuration.
    - **Action Items:**
        - Create the reusable Maps hook or service component in the code base.
        - Add the Google Maps API keys to the local .env file and the secure hosting environment.
        - Verify that the Maps service loads correctly without exposing keys in the source code.
    - **Estimate:** 3

- **1.4.3: Implement External Provider Query**
    - **Description:**
        - Develop a function to search for local healthcare providers via the Google Maps/Places API to capture clinics that are not yet registered as verified partners.
    - **Action Items:**
        - Implement the query logic to fetch local healthcare providers based on user location.
        - Ensure the function targets general listings (unverified providers).
        - Parse the external data into a format that matches our application's display requirements.
    - **Estimate:** 5

- **1.4.4: Integrate and Merge Provider Data Sources**
    - **Description:**
        - Combine the results from the internal verified provider API and the external Google Maps query to present a unified list of results to the user.
    - **Action Items:**
        - Connect the search flow to the internal Provider API (created in 1.3.x).
        - Implement logic to fetch data from both the internal database and the external Maps query.
        - Merge the datasets for display, ensuring a clear distinction or sorting between verified and external providers.
    - **Estimate:** 3

**User Story 1.4 Acceptance Criteria:**
- A documented decision exists on whether Google Maps API calls are handled client-side or server-side.
- Google Maps/Places API integration is functional, with API keys securely stored and not exposed in source code.
- The system can query external provider data based on a given user location.
- External provider results are parsed into a format compatible with the application’s UI.
- Internal verified provider data can be retrieved via the existing Provider API.
- Internal and external provider results are merged into a single response or flow.
- Verified providers are clearly distinguishable from unverified external listings in the results.
- The combined provider search can be used to test patient-facing features end-to-end.