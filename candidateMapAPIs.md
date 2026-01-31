# 4 Candidate APIs for healthcare provider data
## Google Places API

- **Category support**. Google’s Places API (new Places) supports a large taxonomy of place types. The Health and wellness category includes specific types such as chiropractor, massage and physiotherapist, ensuring that searches can be restricted to the types relevant to Physiofind.

- **Search methods.**
  - Nearby Search (POST): accepts an array of includedTypes (e.g., physiotherapist) and a location restriction (a circle defined by centre lat/long and radius). The request returns places within the area and uses a field mask to specify which attributes to return (e.g., name, rating, phone number).

  - Text Search (POST): accepts a free‑form textQuery and returns places that match the query; the same field mask applies.

  - Place Details (GET): retrieves detailed information for a given place_id and again uses a field mask to control which fields (rating, address, etc.) are returned.

- **Coverage & data quality.** Google has extensive global coverage and includes user ratings and review counts. Ratings and review counts are particularly useful for ranking providers by quality.

- **Pricing.** Google moved to a pay‑per‑API model. Before March 1 2025, there was a US$200 monthly credit; afterwards the “Essentials” category offers 10 000 free calls per API per month and then charges per call. Historical pricing indicates that Places data cost roughly US$17 per 1 000 calls and map loads were US$7 per 1 000 calls. Developers must manage usage carefully and specify field masks to avoid unnecessary costs.

- **Security considerations.** Google recommends restricting API keys by domain, IP address or application and storing keys outside client‑side code. Using separate keys for client and server and restricting each key to the specific APIs required helps mitigate misuse. Google also supports server‑to‑server calls using OAuth/App Check, which can further protect keys.

Pros: Very large dataset, high‑quality ratings/reviews, support for our specific categories and detailed field masks; widely adopted with robust SDKs.

Cons: Costs can accumulate after the free tier; must ensure compliance with Google’s terms of service (data cannot be stored permanently outside caching guidelines); key must be protected; latency can be higher when proxied through the server.

## Foursquare Places API

- **Category support.** Foursquare’s taxonomy includes categories for Chiropractor and Physical Therapist under the Professional & Other Places/Medical Center group. Categories are hierarchical and can be used to filter search results. Massage facilities are part of Foursquare’s broader “Health & Fitness Service” categories.

- **Search methods.** Foursquare provides endpoints for searching venues, retrieving details and exploring by category. The API returns place names, categories, addresses, coordinates and can return additional premium fields (hours, ratings, photos) depending on the plan.

- **Pricing and limits.**

  - Free tier: Up to 10 000 calls per month on pro endpoints; each account is limited to 50 queries per second for pay‑as‑you‑go customers.

  - Premium fields: To access ratings, hours or photos, premium endpoints cost about US$18.75 per 1 000 calls.

  - Volume discounts: After the free tier, pro endpoints cost roughly US$0.015 per call for 10 001–100 000 calls and decrease with higher volume.

- **Data quality.** Foursquare’s dataset is strong in urban areas and includes categories not found in Google. However, the free tier does not include ratings or review counts; those are only available via premium fields. Foursquare may be useful as a secondary data source to enrich provider lists but would require a paid plan for ratings.

Pros: Generous free tier for basic data; categories include our provider types; simpler pricing at low volumes; less restrictive terms for storing data.

Cons: Ratings require premium plan; dataset coverage may be weaker in suburban/rural Ontario; API responses may contain less detail than Google; still requires key management.

## Mapbox Search Box API

- **Category support.** Mapbox’s Search Box API supports general categories and can list categories via /list/category, returning high‑level categories such as health_services and services. Specific categories like physiotherapist or chiropractor are not present, so it may not easily distinguish between our provider types.

- **Search methods.** The API provides /suggest and /retrieve endpoints for interactive search (autocomplete), /forward for text search, /category for category search and /reverse for reverse geocoding. When using /suggest and /retrieve, Mapbox bills per session; /category and /reverse calls are billed per request.

- **Pricing.** Mapbox documentation states that the free tier includes 50 000 map loads and 100 000 address searches per month. After the free tier, map loads are US$5 per 1 000 and searches (geocoding requests) are US$0.75 per 1 000. The company offers further volume discounts. The Search Box API’s suggest/retrieve endpoints group multiple calls into one session for billing.

Pros: Generous free tier; strong developer tools; highly customizable maps; integrated with Mapbox GL JS for vector maps; good for address search/geocoding.

Cons: Lack of granular health‑care‑provider categories; may not return user ratings; the dataset often relies on OpenStreetMap data, which may lack uniform coverage.

## OpenStreetMap (OSM) via Overpass/Nominatim

- **Category support.** OSM uses tags rather than categories. The tag healthcare=physiotherapist identifies places where physiotherapists practise; healthcare:speciality=chiropractic is an additional speciality tag used with healthcare=alternative for chiropractors; and shop=massage describes massage shops. These tags can be queried via the Overpass API or Nominatim geocoder.

- **Search methods.** Overpass supports flexible queries for nodes and ways with given tags within bounding boxes or radii. The Nominatim service provides geocoding (forward/reverse) and can be self‑hosted.

- **Pricing and limits.** OSM data is free and open. Public Overpass and Nominatim servers have usage policies and rate limits (often ~1 request/s) to prevent abuse. Organisations can self‑host Overpass and Nominatim to remove rate limits, but this requires maintenance.

- **Data quality.** Coverage for professional services like physiotherapists varies; crowd‑sourced data may be incomplete or inaccurate in some regions. OSM does not provide ratings or review counts, so ranking would need to rely on other data.

Pros: Free; no usage fees; full data download and caching permitted; can be self‑hosted; open licence.

Cons: Data quality and completeness vary; no rating information; requires more development effort to query and parse; must ensure compliance with OSM’s attribution requirements.


# conclusion of comparison  
From the comparison, Google Places offers the most comprehensive dataset for our provider types, including ratings and review counts, albeit with higher costs and stricter terms. Foursquare can serve as a secondary source of provider data or fallback when Google’s quota is exceeded, but ratings require a paid plan. Mapbox excels at map rendering and geocoding but does not meet the healthcare provider requirement. OpenStreetMap provides free data but lacks ratings and complete coverage.
