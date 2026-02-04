/**
 * Express router that defines an API endpoint for searching nearby healthcare providers.
 *
 * This module exposes a single GET endpoint at `/api/search-providers` which accepts
 * `lat` and `lng` query parameters (and an optional `radius` parameter in metres).
 * The endpoint calls out to the Google Places API and, as a fallback, the Foursquare
 * Places API to retrieve nearby physiotherapists, chiropractors and massage therapists.
 *
 * Results from both services are normalised into a common shape and deduplicated
 * before being returned to the client.
 *
 * To use this module you must:
 *   1. Install dependencies: `express` for routing and a fetch implementation
 *      (Node.js 18+ includes a global `fetch` – otherwise install `node-fetch`).
 *   2. Add your API keys to a `.env` file in the root of your project with the
 *      names `GOOGLE_PLACES_API_KEY` and `FOURSQUARE_API_KEY`. See the project’s
 *      README for additional details on protecting these credentials.
 *   3. Mount the router in your Express app, e.g. `app.use(require('./searchProviders'));`.
 */

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


// Ensure environment variables are loaded.
require('dotenv').config();

// Define the provider types we want to search for. These correspond to Google Places
// category names; Foursquare searches will use the same strings as query terms.
const PROVIDER_TYPES = ['physiotherapist', 'chiropractor', 'massage therapist'];

// Google Places API endpoint for Nearby Search. This uses the new Places API (v1)
// endpoint which accepts POST requests with a JSON body. See Google’s documentation:
// https://developers.google.com/maps/documentation/places/web-service/search-nearby
const GOOGLE_NEARBY_ENDPOINT = 'https://places.googleapis.com/v1/places:searchNearby';

/**
 * Perform a nearby search using Google Places API.
 *
 * @param {number|string} lat Latitude of search centre.
 * @param {number|string} lng Longitude of search centre.
 * @param {number|string} radius Search radius in metres.
 * @returns {Promise<Array>} Array of normalised provider objects.
 */
async function searchGoogle(lat, lng, radius) {
  const body = {
    includedTypes: PROVIDER_TYPES,
    locationRestriction: {
      circle: {
        center: {
          latitude: Number(lat),
          longitude: Number(lng),
        },
        radius: Number(radius),
      },
    },
  };
  const res = await fetch(GOOGLE_NEARBY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // The API key is sent via header to avoid exposing it in the URL.
      'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
      // Specify which fields we want returned to reduce payload size and cost.
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Places API error ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const places = data.places || [];
  return places.map((p) => ({
    id: p.id,
    name: p.displayName?.text || '',
    address: p.formattedAddress || '',
    lat: p.location?.latitude,
    lng: p.location?.longitude,
    rating: p.rating,
    ratingsTotal: p.userRatingCount,
    source: 'google',
  }));
}

/**
 * Perform a search using Foursquare Places API.
 *
 * The Foursquare Search API accepts a `query` parameter to filter results by
 * keyword. Because the free tier of Foursquare does not include ratings, this
 * function provides basic location and name information. See Foursquare
 * documentation for details: https://developer.foursquare.com/reference/place-search
 *
 * @param {number|string} lat Latitude of search centre.
 * @param {number|string} lng Longitude of search centre.
 * @param {number|string} radius Search radius in metres.
 * @returns {Promise<Array>} Array of normalised provider objects.
 */
async function searchFoursquare(lat, lng, radius) {
  const results = [];
  for (const type of PROVIDER_TYPES) {
    const params = new URLSearchParams({
      ll: `${lat},${lng}`,
      radius: String(radius),
      query: type,
      limit: '15',
    });
    const res = await fetch(`https://api.foursquare.com/v3/places/search?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
        // Foursquare uses an Authorization header with your API key.
        Authorization: process.env.FOURSQUARE_API_KEY,
      },
    });
    if (!res.ok) {
      // Skip errors for individual calls; continue with remaining provider types.
      continue;
    }
    const data = await res.json();
    const items = data.results || [];
    for (const item of items) {
      results.push({
        id: item.fsq_id,
        name: item.name,
        address: item.location?.formatted_address || '',
        lat: item.geocodes?.main?.latitude,
        lng: item.geocodes?.main?.longitude,
        rating: item.rating, // undefined for free tier
        ratingsTotal: item.stats?.total_ratings, // undefined for free tier
        source: 'foursquare',
      });
    }
  }
  return results;
}

/**
 * Merge results from multiple sources, deduplicating by name and address (case
 * insensitive). When duplicates are found, prefer Google’s rating information
 * over Foursquare’s (which is often missing in the free tier).
 *
 * @param {Array} googleResults
 * @param {Array} foursquareResults
 * @returns {Array} Merged provider list.
 */
function mergeProviders(googleResults, foursquareResults) {
  const mergedMap = new Map();
  for (const provider of [...googleResults, ...foursquareResults]) {
    const key = `${provider.name.toLowerCase()}|${provider.address.toLowerCase()}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, provider);
    } else {
      const existing = mergedMap.get(key);
      // If existing entry lacks ratings but this one has ratings, update it.
      if ((!existing.rating || existing.rating === undefined) && provider.rating) {
        mergedMap.set(key, provider);
      }
    }
  }
  return Array.from(mergedMap.values());
}

/**
 * GET /api/search-providers
 *
 * Query parameters:
 *   lat {number} – latitude of search centre (required)
 *   lng {number} – longitude of search centre (required)
 *   radius {number} – search radius in metres (optional, default 5000)
 *
 * Example request: `/api/search-providers?lat=43.6532&lng=-79.3832&radius=10000`
 */
router.get('/api/search-providers', async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng query parameters are required' });
  }
  try {
    // First query Google Places. If the request fails we still attempt Foursquare.
    let googleResults = [];
    try {
      googleResults = await searchGoogle(lat, lng, radius);
    } catch (err) {
      console.warn('Google Places API error:', err.message);
    }
    // Next query Foursquare. If it fails we continue with Google results.
    let foursquareResults = [];
    try {
      foursquareResults = await searchFoursquare(lat, lng, radius);
    } catch (err) {
      console.warn('Foursquare API error:', err.message);
    }
    // Merge and return results
    const providers = mergeProviders(googleResults, foursquareResults);
    return res.json({ providers });
  } catch (err) {
    console.error('Unexpected error searching providers:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
