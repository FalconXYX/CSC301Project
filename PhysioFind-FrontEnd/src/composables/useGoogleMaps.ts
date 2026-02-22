import type { ClinicLocation } from '@/types/providers'
import { formatGoogleMapsAddress } from '@/utils/format'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

// Configure once at module level
setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  v: 'weekly',
})

// Preload libraries once at module level as shared promises
const mapsLib = importLibrary('maps')
const placesLib = importLibrary('places')
const geocodingLib = importLibrary('geocoding')
const markerLib = importLibrary('marker')

export function useGoogleMaps() {
  async function geocodePostalCode(postalCode: string): Promise<ClinicLocation> {
    const { Geocoder } = await geocodingLib
    const geocoder = new Geocoder()
    const { results } = await geocoder.geocode({ address: `${postalCode}, Canada` })

    const firstResult = results[0]
    if (!firstResult) throw new Error(`No results found for postal code: ${postalCode}`)

    const { lat, lng } = firstResult.geometry.location

    return { lat: lat(), lng: lng() }
  }

  const toLocation = (latLng: google.maps.LatLng): ClinicLocation => ({
    lat: latLng.lat(),
    lng: latLng.lng(),
  })

  async function searchNearbyClinics(location: ClinicLocation): Promise<GoogleMapsClinic[]> {
    const { Place, SearchNearbyRankPreference } = await placesLib

    const { places } = await Place.searchNearby({
      fields: [
        'id',
        'displayName',
        'location',
        'addressComponents',
        'googleMapsURI',
        'nationalPhoneNumber',
        'websiteURI',
      ],
      locationRestriction: {
        center: location,
        radius: 5000, // 5 km radius
      },
      includedPrimaryTypes: ['physiotherapist'],
      rankPreference: SearchNearbyRankPreference.DISTANCE,
    })

    return places.map((place, i) => ({
      id: place.id ?? `gm-${i}`,
      type: 'google-maps' as const,
      name: place.displayName ?? 'Unknown',
      location: toLocation(place.location!),
      mapsUrl: place.googleMapsURI ?? '',
      address: formatGoogleMapsAddress(place.addressComponents ?? []),
      distance: 0, // Distance can be calculated later if needed
      contact: {
        phone: place.nationalPhoneNumber ?? '',
        website: place.websiteURI ?? '',
      },
    }))
  }

  return {
    geocodePostalCode,
    searchNearbyClinics,
    mapsLib,
    markerLib,
  }
}
