import { useSearchParams } from 'react-router-dom';
import React, { useState } from 'react';

// Import the map component that will show unverified providers.
import PlacesSearchMap from '../../components/PlacesSearchMap';

// Types and placeholder data for verified providers.  These imports
// mirror the structure of the original application and may be adjusted
// based on the project's actual file locations.
import type { Clinic } from '../../components/patients/types';
import providerResults from '../../data/find-provider-results.json';

import './SearchResults.css';

import Section from '../../components/Section';
import VerifiedClinicCell from '../../components/patients/search/VerifiedClinicCell';
import GoogleMapsClinicCell from '../../components/patients/search/GoogleMapsClinicCell';

/**
 * Results page component.  It reads query parameters from the URL
 * including the postal code and selected specialty.  The specialty
 * determines the initial search query sent to Google Places.  The
 * postal code is used to geocode the search center.  Verified
 * providers are shown using their own component while unverified
 * providers are loaded via the Places API.
 */
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

  // Placeholder clinic data loaded from JSON.  In the future this
  // will be replaced with results from the back-end API that takes
  // filters such as insurance, appointment type and urgency into
  // account.
  const [clinics] = useState<Clinic[]>(providerResults as unknown as Clinic[]);

  const showDetails = (clinic: Clinic) => {
    // Placeholder: could route to a clinic detail page or open a modal.
    alert(`Not implemented. Clinic ID: ${clinic.id}`);
  };

  return (
    <>
      {/* Pass both the postal code and the derived query to the map */}
      <PlacesSearchMap initialPostalCode={postalCode} initialQuery={initialQuery} />
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