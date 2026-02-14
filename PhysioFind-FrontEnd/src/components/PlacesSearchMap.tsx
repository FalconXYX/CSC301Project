import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ControlPosition,
  Map,
  MapControl,
  Marker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

type ProviderListing = {
  placeId: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  rating?: number;
  userRatingsTotal?: number;
};

const DEFAULT_CENTER = { lat: 43.6532, lng: -79.3832 }; // Toronto

function toLatLngLiteral(loc: any): { lat: number; lng: number } | null {
  if (!loc) return null;
  const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
  const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  return { lat, lng };
}

function PlacesSearchControl(props: { onResults: (r: ProviderListing[]) => void; initialPostalCode?: string;}) {  
  const map = useMap(); // map instance created by <Map> :contentReference[oaicite:1]{index=1}
  const placesLib = useMapsLibrary('places'); // loads Places library :contentReference[oaicite:2]{index=2}

  const [query, setQuery] = useState('physiotherapy clinic');
  const [radius, setRadius] = useState(5000);
  const [status, setStatus] = useState<string>('');
  const [postalCode, setPostalCode] = useState(props.initialPostalCode ?? "");


  const autoRan = useRef(false);
  
  const placesService = useMemo(() => {
    if (!map || !placesLib) return null;
    return new placesLib.PlacesService(map);
  }, [map, placesLib]);

  useEffect(() => {
    if (autoRan.current) return;
    if (!placesService || !placesLib || !map) return;
    if (!postalCode.trim()) return;

    autoRan.current = true;
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placesService, placesLib, map]);
  const geocodePostalCode = (pc: string): Promise<{ lat: number; lng: number }> =>
  new Promise((resolve, reject) => {
    const g = (window as any).google;
    if (!g?.maps?.Geocoder) return reject(new Error("Geocoder not available"));

    const geocoder = new g.maps.Geocoder();
    geocoder.geocode(
      { address: pc, componentRestrictions: { country: "CA" } },
      (results: any[], status: string) => {
        if (status !== "OK" || !results?.[0]) return reject(new Error(`Geocode failed: ${status}`));
        const loc = results[0].geometry.location;
        resolve({ lat: loc.lat(), lng: loc.lng() });
      }
    );
  });

const runSearch = async () => {
  if (!placesService || !map || !placesLib) return;

  try {
    let center = toLatLngLiteral(map.getCenter()) ?? DEFAULT_CENTER;

    const pc = postalCode.trim();
    if (pc) {
      setStatus("Geocoding...");
      center = await geocodePostalCode(pc);
      map.panTo(center as any);
      map.setZoom(12);
    }

    setStatus("Searching...");
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
              name: p.name ?? "(no name)",
              address: p.formatted_address ?? "(no address)",
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
    setStatus(e?.message ?? "Error");
    props.onResults([]);
  }
};


  return (
    <div style={{ background: 'white', padding: 10, borderRadius: 8, width: 320 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Find unverified providers (Places)</div>

    <label style={{ display: "block", fontSize: 12 }}>Postal code</label>
        <input
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
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

export default function PlacesSearchMap({ initialPostalCode }: { initialPostalCode?: string }) {
  const [results, setResults] = useState<ProviderListing[]>([]);

  return (
    <div>
      <div style={{ width: '100%', height: 300 }}>
        <Map defaultCenter={DEFAULT_CENTER} defaultZoom={11}>
          <MapControl position={ControlPosition.TOP_LEFT}>
            <PlacesSearchControl onResults={setResults} initialPostalCode={initialPostalCode} />
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
