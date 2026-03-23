These are the new files I created in this user story
- migrations/20260315000000_google_calendar_oauth .sql — adds Google token columns to users and google_event_id to appointment_requests
- utils/encrypt.js — AES-256 encrypt/decrypt for storing tokens securely
- utils/googleCalendar.js — Google Calendar helpers (auth client, token refresh, create/update/delete events)
- routes/google/authUrl.js — generates the Google OAuth consent URL
- routes/google/callback.js — handles Google's redirect, stores encrypted tokens
- routes/google/disconnect.js — wipes stored tokens
- routes/google/calendars.js — fetches user's Google Calendar list
- routes/google/selectCalendar.js — saves chosen calendar ID
Frontend:
- api/google.ts — API functions for all Google routes                                           
- stores/googleCalendar.ts — Pinia store managing connection state, calendar list, selection
                                                     ---                                    Existing Files Edited                                                                               
- prisma/schema.prisma — added Google token fields to users + google_event_id to            appointment_requests                             
- app.js — registered all 5 Google routes
- api/index.ts — exported google.ts              
- pages/auth/AccountPage.vue — added Google Calendar section                                 
- scripts/runSqlMigration.js — fixed dotenv path + pointed to new migration file 
                 
- to env local (I posted it on disc) add these GOOGLE_CLIENT_ID,             GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, ENCRYPTION_KEY       

I haven't changed the supa base tables yet but run it on docker and then let me know if I can alter supa base tables

Run instructions
0. ENV files with the keys added from discord
1. Start docker
docker start physiofind-db

2. Start backend and front end

3. Go on /account page or just click the profile button and press set up calandar. Make sure the keys are added to the .env.local in the express and the frontend