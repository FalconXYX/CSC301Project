# Sprint 2 Daily Standups

> Standups were conducted via the team's Discord channel. Five standups are documented below from Sprint 2 (Feb 8 – Feb 20, 2026).

---

## Standup 1 — February 11, 2026

**Platform:** Discord
**Participants:** Parth Jain, Martin Stric, Jordan Jones, Saahil Pandit, Drew Nerbas

| Member | Update |
|---|---|
| **Parth Jain** | Quick check-in on progress. Flagged that ticket 2.1 needs to be completed soon as it blocks work on subsequent stories. |
| **Martin Stric** | Will start on his frontend portions over reading week. |
| **Jordan Jones** | Has two midterms this Friday; will begin sprint work on the weekend. |
| **Saahil Pandit** | Working on assigned Sprint 2 tasks. |
| **Drew Nerbas** | Working on assigned Sprint 2 tasks. |

---

## Standup 2 — February 13, 2026

**Platform:** Discord
**Participants:** Parth Jain, Martin Stric, Jordan Jones, Saahil Pandit, Drew Nerbas

| Member | Update |
|---|---|
| **Parth Jain** | Supabase account was banned (temp email flagged as a bot). Created a new account; new credentials updated in secrets. Deadline set: temp data must be ready before Sunday so the team can continue. |
| **Martin Stric** | Announced hard deadline — ticket 2.1 must be completed by Sunday, February 15. |
| **Jordan Jones** | Acknowledged the deadline. |
| **Saahil Pandit** | Acknowledged update, continuing Sprint 2 tasks. |
| **Drew Nerbas** | Acknowledged update, continuing Sprint 2 tasks. |

---

## Standup 3 — February 14, 2026

**Platform:** Discord
**Participants:** Parth Jain, Martin Stric, Jordan Jones, Saahil Pandit, Drew Nerbas

| Member | Update |
|---|---|
| **Parth Jain** | Reviewed Jordan's PR. Noted that tickets 2.1.1 and 2.1.2 were combined in one branch — provided guidance on proper branching and PR process going forward. Also flagged frontend changes in the PR to Martin for review. |
| **Jordan Jones** | Completed implementation of external API search and results based on postal code. API key kept out of repo (not pushed). Acknowledged branching feedback; will use separate branches going forward. Created PR and will branch off main to continue with 2.1.3. |
| **Martin Stric** | Reviewed frontend-impacting changes in Jordan's PR. |
| **Saahil Pandit** | Working on assigned Sprint 2 tasks. |
| **Drew Nerbas** | Working on assigned Sprint 2 tasks. |

---

## Standup 4 — February 18, 2026

**Platform:** Discord
**Participants:** Parth Jain, Martin Stric, Jordan Jones, Saahil Pandit, Drew Nerbas

| Member | Update |
|---|---|
| **Drew Nerbas** | Ticket 2.2.1 (Configure Supabase Auth providers) complete. All work done in Supabase config (no code PR). Left a comment on the ticket summarizing what was done. |
| **Parth Jain** | Reviewed Drew's summary comment and marked 2.2.1 as done on the board. |
| **Martin Stric** | Confirmed no PR needed when there are no file changes; reviewing PRs as needed. |
| **Saahil Pandit** | Has a deferred exam Friday Feb 21 and other projects due this week. Will have all docs fully updated by Friday 10 PM. |
| **Jordan Jones** | Continuing Sprint 2 tasks. |

---

## Standup 5 — February 19–20, 2026

**Platform:** Discord
**Participants:** Parth Jain, Martin Stric, Jordan Jones, Saahil Pandit, Drew Nerbas

| Member | Update |
|---|---|
| **Drew Nerbas** | Submitted PR for 2.2.2 (backend auth middleware). Sign-up and sign-in working; sign-out behavior being investigated (browser session vs. Postman limitations). Immediately started 2.2.3 (apply auth middleware to endpoints) after 2.2.2 was approved. |
| **Parth Jain** | Reviewed and approved Drew's 2.2.2 PR. Debugged production deployment: fixed Vercel env variables, removed Pug dependency causing errors, fixed Supabase client lifecycle timing. User creation now fully working on live database. Submitted new PR consolidating all fixes. Email confirmation temporarily disabled to avoid rate limiting — to be re-enabled before demo. |
| **Martin Stric** | Reviewed Parth's PR. Updated GitHub PR workflow: linking an issue to a PR now auto-marks it "in review" and closes it on merge. |
| **Saahil Pandit** | Monitoring progress; documentation updates will be completed by Friday after deferred exam. |
| **Jordan Jones** | Continuing Sprint 2 tasks. |
