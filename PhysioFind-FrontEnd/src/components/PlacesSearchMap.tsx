import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ControlPosition,
  Map,
  MapControl,
  Marker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

/**
 * Representation of an unverified provider returned from Google Places.
 *
 * This type mirrors the subset of fields we care about from the
 * `google.maps.places.PlaceResult` object.  Only properties needed for
 * display and marker placement are included.
 */
export type ProviderListing = {
  placeId: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  rating?: number;
  userRatingsTotal?: number;
};

/**
 * Props for the PlacesSearchMap component.
 * - initialPostalCode and initialQuery prefill the search fields.
 * - onResults is invoked whenever a new list of Places results is found.
 * - onCenterResolved is invoked when the geocoded search center is determined.
 */
type PlacesSearchMapProps = {
  initialPostalCode: string;
  initialQuery: string;
  onResults?: (results: ProviderListing[]) => void;
  onCenterResolved?: (center: { lat: number; lng: number }) => void;
};

// Fallback map center (Toronto) used if geocoding fails.
const DEFAULT_CENTER = { lat: 43.6532, lng: -79.3832 };

/**
 * Normalize a Google Maps LatLng object or literal into a plain object.
 */
function toLatLngLiteral(loc: any): { lat: number; lng: number } | null {
  if (!loc) return null;
  const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
  const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  return { lat, lng };
}

/**
 * Control component rendered in the Google Maps `MapControl` area.  It
 * encapsulates the search inputs and initiates a Places search when
 * the user clicks the search button.
 *
 * Props:
 *  - onResults: callback invoked with a list of parsed provider results.
 *  - onCenterResolved: callback invoked with the geocoded search center.
 *  - initialPostalCode: optional postal code to prefill the search field.
 *  - initialQuery: optional search term (e.g. specialty) to prefill the query field.
 */
function PlacesSearchControl(props: {
  onResults: (r: ProviderListing[]) => void;
  onCenterResolved?: (center: { lat: number; lng: number }) => void;
  initialPostalCode?: string;
  initialQuery?: string;
}) {
  const map = useMap(); // map instance created by <Map>
  const placesLib = useMapsLibrary('places'); // loads Places library

  // Initialize query based on the provided specialty.  Default to
  // physiotherapy clinic if nothing is provided.
  const [query, setQuery] = useState(props.initialQuery ?? 'physiotherapy clinic');
  const [radius, setRadius] = useState(5000);
  const [status, setStatus] = useState<string>('');
  const [postalCode, setPostalCode] = useState(props.initialPostalCode ?? '');

  // Ensure we only automatically run a search once on mount.
  const autoRan = useRef(false);

  const placesService = useMemo(() => {
    if (!map || !placesLib) return null;
    return new placesLib.PlacesService(map);
  }, [map, placesLib]);

  // Automatically perform an initial search when the map, Places library,
  // and postal code are all available.  This provides an immediate set
  // of results when the results page loads.
  useEffect(() => {
    if (autoRan.current) return;
    if (!placesService || !placesLib || !map) return;
    if (!postalCode.trim()) return;

    autoRan.current = true;
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesService, placesLib, map]);

  /**
   * Geocode the given postal code using Google Maps Geocoder.
   * Returns a promise resolving to a latitude/longitude pair.
   */
  const geocodePostalCode = (pc: string): Promise<{ lat: number; lng: number }> =>
    new Promise((resolve, reject) => {
      const g = (window as any).google;
      if (!g?.maps?.Geocoder) return reject(new Error('Geocoder not available'));

      const geocoder = new g.maps.Geocoder();
      geocoder.geocode(
        { address: pc, componentRestrictions: { country: 'CA' } },
        (results: any[] | undefined, status: string) => {
          if (status !== 'OK' || !results?.[0])
            return reject(new Error(`Geocode failed: ${status}`));
          const loc = results[0].geometry.location;
          resolve({ lat: loc.lat(), lng: loc.lng() });
        }
      );
    });

  /**
   * Perform a Places text search using the current query, postal code and
   * radius.  Geocodes the postal code first to determine a search center.
   */
  const runSearch = async () => {
    if (!placesService || !map || !placesLib) return;
    try {
      // Determine the center of the search.  If no postal code is entered
      // we fall back to the current map center or the default center.
      let center = toLatLngLiteral(map.getCenter()) ?? DEFAULT_CENTER;

      const pc = postalCode.trim();
      if (pc) {
        setStatus('Geocoding...');
        center = await geocodePostalCode(pc);
        map.panTo(center as any);
        map.setZoom(12);
        // Notify parent about the resolved center
        props.onCenterResolved?.(center);
      } else {
        // Even if we don't geocode, let the parent know the center we used
        props.onCenterResolved?.(center);
      }

      setStatus('Searching...');
      placesService.textSearch(
        { query, location: center as any, radius },
        (results: any[] | null, s: any) => {
          setStatus(String(s));
          if (!results || s !== placesLib.PlacesServiceStatus.OK) {
            props.onResults([]);
            return;
          }

          const parsed: ProviderListing[] = results
            .map((p) => {
              const loc = toLatLngLiteral(p.geometry?.location);
              if (!loc || !p.place_id) return null;
              return {
                placeId: p.place_id,
                name: p.name ?? '(no name)',
                address: p.formatted_address ?? '(no address)',
                location: loc,
                rating: p.rating,
                userRatingsTotal: p.user_ratings_total,
              } as ProviderListing;
            })
            .filter(Boolean) as ProviderListing[];

          props.onResults(parsed);
        }
      );
    } catch (e: any) {
      setStatus(e?.message ?? 'Error');
      props.onResults([]);
    }
  };

  return (
    <div style={{ background: 'white', padding: 10, borderRadius: 8, width: 320 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Find unverified providers (Places)
      </div>
      <label style={{ display: 'block', fontSize: 12 }}>Postal code</label>
      <input
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <label style={{ display: 'block', fontSize: 12 }}>Query</label>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <label style={{ display: 'block', fontSize: 12 }}>Radius (meters)</label>
      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button onClick={runSearch} disabled={!placesService} style={{ width: '100%' }}>
        Search near map center
      </button>
      <div style={{ fontSize: 12, marginTop: 6 }}>Status: {status || '(idle)'}</div>
    </div>
  );
}

/**
 * Wrapper component that renders a Google Map and a search control.  It
 * collects provider results and renders them as markers and a simple
 * results list beneath the map.  The initial postal code and query
 * values may be provided by the parent component to pre-populate the
 * search fields.  It also forwards results and the resolved center to its parent.
 */
export default function PlacesSearchMap({
  initialPostalCode,
  initialQuery,
  onResults,
  onCenterResolved,
}: PlacesSearchMapProps) {
  const [results, setResults] = useState<ProviderListing[]>([]);
  return (
    <div>
      <div style={{ width: '100%', height: 300 }}>
        <Map defaultCenter={DEFAULT_CENTER} defaultZoom={11}>
          <MapControl position={ControlPosition.TOP_LEFT}>
            <PlacesSearchControl
              onResults={(listings) => {
                // update our own state and notify parent
                setResults(listings);
                onResults?.(listings);
              }}
              onCenterResolved={(center) => {
                onCenterResolved?.(center);
              }}
              initialPostalCode={initialPostalCode}
              initialQuery={initialQuery}
            />
          </MapControl>
          {results.map((r) => (
            <Marker key={r.placeId} position={r.location} title={r.name} />
          ))}
        </Map>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>
          Results ({results.length})
        </div>
        <ul>
          {results.map((r) => (
            <li key={r.placeId}>
              <b>{r.name}</b> — {r.address}
              {typeof r.rating === 'number' ? ` (⭐ ${r.rating})` : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
