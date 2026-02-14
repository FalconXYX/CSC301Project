/**
 * A simplified representation of a healthcare provider returned by the
 * Google Places API.  This interface matches the minimal set of fields
 * required by the application to display search results.
 */
export interface ProviderResult {
  /** Name of the clinic or provider as returned by the Places API. */
  name: string;
  /** Formatted street address of the provider. */
  address: string;
  /** Geographic location of the provider. */
  location: {
    lat: number;
    lng: number;
  };
  /** Unique Place ID used by Google for future lookups. */
  placeId: string;
  /** Array of place types returned by the API (optional). */
  types?: string[];
}

/**
 * Searches for physiotherapy or healthcare providers near a given point using
 * the Google Places Text Search endpoint.  The function builds a URL
 * containing the query, location, search radius and API key, performs
 * a fetch request and parses the results into ProviderResult objects.
 *
 * @param lat  Latitude of the user's current location.
 * @param lng  Longitude of the user's current location.
 * @param options  Optional search parameters: radius in metres and
 *                 keyword to refine results.
 * @returns A list of providers matching the query; an empty array if no
 *          results are found.
 * @throws  Throws an error if the API key is missing or the request fails.
 */
export async function searchProviders(
  lat: number,
  lng: number,
  options?: {
    /** Search radius in metres (default 5 000 m). */
    radius?: number;
    /** Keyword to refine the search query (default "physiotherapy clinic"). */
    keyword?: string;
  },
): Promise<ProviderResult[]> {
  const apiKey: string | undefined = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error(
      'searchProviders: missing VITE_GOOGLE_MAPS_API_KEY.\n' +
        'Add the API key to your .env file as VITE_GOOGLE_MAPS_API_KEY before using this service.',
    );
  }
  const radius = options?.radius ?? 5000;
  const keyword = options?.keyword ?? 'physiotherapy clinic';

  // Build the URL for the Places Text Search endpoint.  We use the older
  // `textsearch` API because it accepts simple GET requests.  The query can
  // be adjusted to target other types of providers (e.g. "chiropractor" or
  // "physical therapy clinic").  You may also adjust the `type` parameter
  // to further filter results; see the Google Places documentation for
  // supported values.
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', keyword);
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', radius.toString());
  // Limit to physiotherapist or health services; comment out or change this
  // value for broader searches.  Valid types include "doctor", "hospital",
  // "pharmacy", etc.  See Place Types documentation for more options.
  url.searchParams.set('type', 'physiotherapist');
  url.searchParams.set('key', apiKey);

  // Perform the HTTP request.  Using fetch ensures support in modern browsers
  // and Node environments.  Handle non‑OK responses gracefully.
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`searchProviders: HTTP error ${response.status}`);
  }
  const data = await response.json();

  // The Places API returns a status string and an array of results.  If the
  // status is anything other than 'OK' or 'ZERO_RESULTS', treat it as an
  // error.  See https://developers.google.com/maps/documentation/places/web-service/search#PlacesSearchStatusCodes
  if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`searchProviders: API error ${data.status} – ${data.error_message ?? 'No message'}`);
  }
  // Map the returned places into the application's domain model.  We pick out
  // only the fields we need.  If no results are returned, return an empty
  // array instead of null/undefined.
  const results: ProviderResult[] = (data.results ?? []).map((place: any) => {
    return {
      name: place.name,
      address: place.formatted_address,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      placeId: place.place_id,
      types: place.types,
    };
  });

  return results;
}