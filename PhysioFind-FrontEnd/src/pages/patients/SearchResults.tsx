import { useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

// Import the map component that will show unverified providers.
import PlacesSearchMap, { type ProviderListing } from '../../components/PlacesSearchMap';

import { getVerifiedClinics } from '../../services/providersService';
import type { Clinic, VerifiedClinic, GoogleMapsClinic } from '../../components/patients/types';

// Load the placeholder data (for fallback and initial state)
import providerResults from '../../data/find-provider-results.json';

import './SearchResults.css';

import Section from '../../components/Section';
import VerifiedClinicCell from '../../components/patients/search/VerifiedClinicCell';
import GoogleMapsClinicCell from '../../components/patients/search/GoogleMapsClinicCell';

// Fallback map center (Toronto) used if geocoding fails or is not provided
const DEFAULT_CENTER = { lat: 43.6532, lng: -79.3832 };

// helper to compute distance in km between two coordinates
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function SearchResults() {
  const [params] = useSearchParams();
  const postalCode = params.get('postalCode') ?? '';
  const specialty = params.get('specialty') ?? '';

  // Map the specialty value (as defined in the questionnaire JSON) to
  // a human-friendly search query.  Default to physiotherapy clinic
  // when no mapping exists or no specialty was selected.  The keys
  // here should match the `value` fields defined under the
  // "specialty" question in find-provider-questionnaire.json.
  const specialtyQueryMap: Record<string, string> = {
    family_doctor: 'family doctor',
    dentist: 'dentist',
    physiotherapist: 'physiotherapy clinic',
    psychologist: 'psychologist',
    chiropractor: 'chiropractor',
    dermatologist: 'dermatologist',
  };
  const initialQuery = specialtyQueryMap[specialty] ?? 'physiotherapy clinic';

  // Verified providers from DB
  const [verifiedClinics, setVerifiedClinics] = useState<VerifiedClinic[]>([]);

  // Unverified providers from Google Places (received via PlacesSearchMap callback)
  const [placesProviders, setPlacesProviders] = useState<ProviderListing[]>([]);
  const [searchCenter, setSearchCenter] = useState(DEFAULT_CENTER);

  // The combined list of clinics that the component renders
  // Start with placeholder data so the UI is not empty
  const [clinics, setClinics] = useState<Clinic[]>(providerResults as unknown as Clinic[]);

  // Load verified clinics from backend when postal code or specialty changes
  useEffect(() => {
    async function loadVerified() {
      try {
        const verified = await getVerifiedClinics(50, 0);
        setVerifiedClinics(verified);
      } catch (err) {
        console.error('Failed to load verified clinics', err);
        // If backend fails, we leave verifiedClinics empty; placeholders remain in clinics
        setVerifiedClinics([]);
      }
    }
    loadVerified();
  }, [postalCode, specialty]);

  // Whenever verified or places results change, merge them into one list
  useEffect(() => {
    try {
      // Convert unverified providers into the Clinic shape
      const googleClinics: GoogleMapsClinic[] = placesProviders.map((p) => {
        const distanceKm = haversineDistance(
          searchCenter.lat,
          searchCenter.lng,
          p.location.lat,
          p.location.lng,
        );
        return {
          id: p.placeId,
          type: 'google-maps',
          name: p.name,
          address: {
            line1: p.address,
            line2: '',
            city: '',
            province: '',
            postalCode: '',
          },
          contact: {},
          distance: Number(distanceKm.toFixed(1)),
          mapsUrl: `https://www.google.com/maps/place/?q=place_id:${p.placeId}`,
        };
      });

      // De-duplicate any unverified providers that might match a verified clinic
      const key = (c: { name: string; address: { line1: string } }) =>
        `${c.name}`.trim().toLowerCase() + '|' + `${c.address.line1}`.trim().toLowerCase();

      const verifiedKeys = new Set(verifiedClinics.map((v) => key(v)));
      const googleDeduped = googleClinics.filter((g) => !verifiedKeys.has(key(g)));

      const merged = [...verifiedClinics, ...googleDeduped];

      // If we have merged results, use them; otherwise keep the placeholder data
      if (merged.length > 0) {
        setClinics(merged);
      } else {
        setClinics(providerResults as unknown as Clinic[]);
      }
    } catch (err) {
      console.error('Failed to merge providers', err);
      // On error, fall back to the placeholder data
      setClinics(providerResults as unknown as Clinic[]);
    }
  }, [verifiedClinics, placesProviders, searchCenter]);

  const showDetails = (clinic: Clinic) => {
    // Placeholder: could route to a clinic detail page or open a modal.
    alert(`Not implemented. Clinic ID: ${clinic.id}`);
  };

  return (
    <>
      {/* Pass both the postal code and the derived query to the map.
          The map will call onResults and onCenterResolved when it has data. */}
      <PlacesSearchMap
        initialPostalCode={postalCode}
        initialQuery={initialQuery}
        onResults={setPlacesProviders}
        onCenterResolved={setSearchCenter}
      />
      <Section id="search-results">
        <div className="title">
          <h1 className="heading">Your Matches</h1>
          <p className="subheading">
            We tried our best to match you with healthcare providers based on your
            responses to the questionnaire.
          </p>
        </div>
        <div className="results">
          {clinics.map((clinic) => {
            switch (clinic.type) {
              case 'verified':
                return (
                  <VerifiedClinicCell
                    key={clinic.id}
                    clinic={clinic}
                    showDetails={() => showDetails(clinic)}
                  />
                );
              case 'google-maps':
                return (
                  <GoogleMapsClinicCell
                    key={clinic.id}
                    clinic={clinic}
                    showDetails={() => showDetails(clinic)}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      </Section>
    </>
  );
}

export default SearchResults;
