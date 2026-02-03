import React, { useState } from "react";
import type { Clinic } from "../../components/patients/types";
import providerResults from "../../data/find-provider-results.json";

import "./SearchResults.css";

import Section from "../../components/Section";
import VerifiedClinicCell from "../../components/patients/search/VerifiedClinicCell";
import GoogleMapsClinicCell from "../../components/patients/search/GoogleMapsClinicCell";

function SearchResults() {
  // Placeholder data - will be replaced with real data from API
  const [clinics] = useState<Clinic[]>(providerResults as Clinic[]);

  const showDetails = (clinic: Clinic) => {
    // Placeholder function - will be implemented later
    alert(`Not implemented. Clinic ID: ${clinic.id}`);
  };

  return (
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
            case "verified":
              return (
                <VerifiedClinicCell
                  clinic={clinic}
                  showDetails={() => showDetails(clinic)}
                />
              );
            case "google-maps":
              return (
                <GoogleMapsClinicCell
                  clinic={clinic}
                  showDetails={() => showDetails(clinic)}
                />
              );
          }
        })}
      </div>
    </Section>
  );
}

export default SearchResults;
