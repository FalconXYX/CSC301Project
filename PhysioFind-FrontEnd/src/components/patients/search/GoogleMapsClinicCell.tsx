import type { GoogleMapsClinic } from "../types";
import { formatClinicAddress } from "../clinics.util";

import "./ClinicCell.css";

interface GoogleMapsClinicCellProps {
  clinic: GoogleMapsClinic;
  showDetails?: () => void;
}

function GoogleMapsClinicCell({
  clinic,
  showDetails,
}: GoogleMapsClinicCellProps) {
  const addressLines = formatClinicAddress(clinic.address, "multi-line");

  return (
    <div className="clinic-cell">
      <h3 className="clinic-name">{clinic.name}</h3>
      <a
        href={clinic.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="maps-link"
      >
        See on Google Maps&nbsp;
        <span className="material-symbols-outlined sm icon">arrow_outward</span>
      </a>
      <p className="clinic-address">
        {addressLines.map((line, index) => (
          <span key={index}>{line}</span>
        ))}
      </p>
      <div className="bottom-row">
        <button className="details-button" onClick={showDetails}>
          See Details
        </button>
      </div>
    </div>
  );
}

export default GoogleMapsClinicCell;
