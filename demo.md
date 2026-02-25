Checklist
Feature 1: Landing Page & Navigation (User Story 1.2.3)
Feature 2: Questionnaire Flow (User Story 1.2.4)
Feature 3: Provider API Query (Backend) (User Story 1.3 / 1.4)
Feature 4: User/Clinic Management (Backend) (User Story 1.3)

Demo Script

Landing Page & Navigation (User Story 1.2.3)
Preparation: Frontend running (npm run dev). Open browser to http://localhost:5173
.

Hi, I will demo User Story 1.2.3 (Landing Page). I will pretend to be a patient visiting PhysioFind for the first time. I navigate to the home page and show the responsive landing page with the main navigation bar, hero section, and footer. This establishes the core layout of our application. I can navigate between different sections (if links are active), showing that our routing structure is in place.

Provider Search Flow / Questionnaire (User Story 1.2.4)
Preparation: Frontend running. Navigate to the Find Provider page (likely /find-provider or via a button on Home).

I will demo User Story 1.2.4 by acting as a patient who wants to find a physiotherapist suited to my needs. I click Find Provider, which takes me to the questionnaire flow. I click through a few dummy options/inputs. As you can see, the UI captures user input clearly. This allows us to filter providers based on patient needs before we hit the backend search API.

Provider Details API (User Story 1.3 / 1.4)
Preparation: Backend running (npm start) on port 3001. Use a terminal window.

I will demo User Stories 1.3 and 1.4 by simulating a client requesting provider data using curl.

Command (PowerShell):
curl http://localhost:3001/clinics?limit=5

I run the command, and the server returns a JSON list of providers from our database, proving the read-layer is active. Note: the list might be empty if the database is fresh, which is expected.

User Creation & Database Integration (User Story 1.3.1)
Preparation: Terminal window.

Finally, I will demo User Story 1.3.1 (Implement User Creation). I will create a new user via the API to verify database writes.

Command (PowerShell):
Invoke-RestMethod -Uri "http://localhost:3001/users
" -Method Post -ContentType "application/json" -Body '{"email": "demo_powershell@example.com
", "password_hash": "secret123", "role": "patient", "first_name": "Demo", "last_name": "User"}'