/**
 * Base properties shared by all clinic types.
 * @internal
 */
interface ClinicBase {
  /** Unique identifier for the clinic */
  id: string
  /** Display name of the clinic */
  name: string
  /** Physical location of the clinic */
  address: ClinicAddress
  /** Contact information for the clinic */
  contact: ClinicContact
}

/**
 * Contact information for a clinic.
 * All fields are optional as clinics may not provide all contact methods.
 */
export interface ClinicContact {
  /** Email address */
  email?: string
  /** Phone number */
  phone?: string
  /** Website URL */
  website?: string
}

/**
 * Physical address of a clinic in Canada.
 */
export interface ClinicAddress {
  /** Street address (first line) */
  line1: string
  /** Street address (second line), e.g., suite or unit number */
  line2?: string
  /** City name */
  city: string
  /** Province or territory */
  province: string
  /** Postal code */
  postalCode: string
}

/**
 * Geographic location for a clinic.
 */
export type ClinicLocation = google.maps.LatLngLiteral

/**
 * A clinic that has been verified and curated with detailed service information.
 * These clinics have complete, validated data.
 */
export interface VerifiedClinic extends ClinicBase {
  type: 'verified'
  /** List of medical services offered by the clinic */
  services: string[]
}

/**
 * A clinic sourced from Google Maps search results.
 * These clinics include location data but may have limited service information.
 */
export interface GoogleMapsClinic extends ClinicBase {
  type: 'google-maps'
  /** Distance from the user's location, in kilometers */
  distance: number
  /** URL to view this clinic on Google Maps */
  mapsUrl: string
  /** Location (coordinates) of the clinic */
  location: ClinicLocation
}

/**
 * A clinic in the system, either verified with full details or sourced from Google Maps.
 *
 * @example
 * ```typescript
 * function displayClinic(clinic: Clinic) {
 *   if (clinic.type === "verified") {
 *     console.log(`Services: ${clinic.services.join(', ')}`);
 *   } else {
 *     console.log(`${clinic.distance}km away - ${clinic.mapsUrl}`);
 *   }
 * }
 * ```
 */
export type Clinic = VerifiedClinic | GoogleMapsClinic
