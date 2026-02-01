The main decision is whether to call the external mapping APIs from the front end (client‑side) or back end (server‑side).

# Client‑side calls

Advantages: Direct calls can reduce server workload and latency; easier to integrate with map SDKs (e.g., Google Maps JavaScript API). Users’ browsers perform geolocation and call the Places API; the API key is loaded via script tag.

Risks: Exposes the API key to the client. Even with HTTP referrer restrictions, keys can be scraped from the code, leading to potential misuse and unexpected costs. Browser geolocation requires the site to be served over HTTPS and must request location permission on a user gesture, not automatically. Using geolocation on insecure contexts is disallowed. Under PIPEDA/PHIPA, the app must obtain informed consent and describe how location data will be used, maintain privacy policies and secure transmission.

# Server‑side calls

Advantages: Keeps API keys secret—calls are made from the server to Google/Foursquare and results are sent to the client. Keys can be restricted to server IP addresses and rotated easily. The server can cache results (e.g., for common locations) to reduce API calls and costs. The server can also merge internal provider data with external results before returning to the client (task 1.4.4) and apply business logic (e.g., deduplication, ranking).

Risks: Adds latency since the client must wait for the server to forward the request. The server becomes a single point of failure; scaling may be needed for high query volumes. Must implement rate limiting and caching to avoid hitting API quotas. Data storage must adhere to terms of use (e.g., Google prohibits storing Places data beyond caching). In addition, because user location is transmitted to the server, the back end must implement encryption and privacy measures to comply with Canadian privacy laws.

# My Recommendation: 
## For Physiofind, a hybrid approach can balance security and performance:

1. The front end obtains the user’s location via the browser’s Geolocation API after a user gesture, explaining why the location is needed and providing a fallback (e.g., manual address entry).

2. Send the location to the server (e.g., /api/search-providers?lat=..&lng=..) via HTTPS. The server will call the external API(s) (Google Places first; Foursquare as backup) using server‑restricted API keys and apply caching to reduce calls.

3. The server returns a unified list of providers with additional metadata (verified vs. external, rating, distance). This hides API keys from the client and allows more control over costs and data merging.