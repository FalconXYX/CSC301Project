import type { VerifiedClinic } from "../types";
import { formatClinicAddress } from "../clinics.util";

import "./ClinicCell.css";
import { useRef } from "react";

interface VerifiedClinicCellProps {
  clinic: VerifiedClinic;
  showDetails?: () => void;
}

function VerifiedClinicCell({ clinic, showDetails }: VerifiedClinicCellProps) {
  const addressLines = formatClinicAddress(clinic.address, "multi-line");

  const tooltipAnchorName = `--tooltip-${clinic.id}`;

  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>(undefined);

  const showPopover = () => {
    clearTimeout(timeoutRef.current);
    tooltipRef.current?.showPopover();
  };

  const hidePopover = () => {
    timeoutRef.current = window.setTimeout(() => {
      tooltipRef.current?.hidePopover();
    }, 100);
  };

  return (
    <div
      className="clinic-cell verified"
      style={{ "--badge-anchor": tooltipAnchorName } as React.CSSProperties}
    >
      <h3 className="clinic-name">
        {clinic.name}&nbsp;
        <span
          className="material-symbols-outlined sm badge"
          onMouseEnter={showPopover}
          onMouseLeave={hidePopover}
        >
          verified
        </span>
        <div ref={tooltipRef} popover="auto" className="tooltip">
          Verified partner clinic
        </div>
      </h3>
      <p className="clinic-address">
        {addressLines.map((line, index) => (
          <span key={index}>{line}</span>
        ))}
      </p>
      <div className="bottom-row">
        <div className="services">
          {clinic.services.map((service) => (
            <span key={service} className="service">
              {service}
            </span>
          ))}
        </div>
        <button className="details-button" onClick={showDetails}>
          See Details
        </button>
      </div>
    </div>
  );
}

export default VerifiedClinicCell;
