import { searchClinics } from '@/api/clinics'

export const useProviderSearchStore = defineStore('providerSearch', () => {
  const { geocodePostalCode, searchNearbyClinics } = useGoogleMaps()

  const clinics = ref<Clinic[]>([]) // Using preview data
  const center = ref<ClinicLocation>()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function searchByPreferences(preferences: Record<string, any>) {
    isLoading.value = true
    error.value = null

    try {
      const postalCode = preferences.location || ''
      if (postalCode) {
        center.value = await geocodePostalCode(postalCode)
        if (center.value) {
          preferences.latitude = center.value.lat
          preferences.longitude = center.value.lng
        }
      }

      const newClinics = await searchClinics(preferences)
      const formattedVerifiedClinics = newClinics.map((c) => {
        const rawServices = Array.isArray(c.services_json) ? c.services_json : ['General Care']
        const cleanServices = rawServices.filter(
          (s) => typeof s === 'string' && !s.startsWith('insurance:') && !s.startsWith('hours:'),
        )
        const parsedInsurances = rawServices
          .filter((s) => typeof s === 'string' && s.startsWith('insurance:'))
          .map((s) => s.replace('insurance:', ''))
        const parsedHoursMatch = rawServices.find(
          (s) => typeof s === 'string' && s.startsWith('hours:'),
        )

        return {
          id: c.id,
          name: c.name,
          type: 'verified',
          services:
            Array.isArray(c.specialties_json) && c.specialties_json.length > 0
              ? c.specialties_json
              : cleanServices.length > 0
                ? cleanServices
                : ['General Care'],
          insurances: parsedInsurances,
          hours: parsedHoursMatch ? parsedHoursMatch.replace('hours:', '') : undefined,
          address: {
            line1: c.address_line1,
            line2: c.address_line2 || undefined,
            city: c.city,
            province: c.province,
            postalCode: c.postal_code,
          },
          contact: {
            phone: c.phone || undefined,
            email: c.email || undefined,
            website: c.website || undefined,
          },
          location:
            c.latitude && c.longitude
              ? { lat: Number(c.latitude), lng: Number(c.longitude) }
              : undefined,
        }
      }) as Clinic[]

      // Fetch unaffiliated clinics via Google Maps API wrapper if center is available
      let googleClinics: Clinic[] = []
      if (center.value) {
        try {
          const mapResults = await searchNearbyClinics(center.value)

          // Filter to avoid duplicates if name roughly matches our verified clinics
          const verifiedNames = new Set(
            formattedVerifiedClinics.map((c) => c.name.toLowerCase().trim()),
          )

          googleClinics = mapResults.filter(
            (gc) => !verifiedNames.has(gc.name.toLowerCase().trim()),
          )
        } catch (mapErr) {
          console.error('Failed to fetch from Google Maps:', mapErr)
          // Continue execution, map failures shouldn't break the whole results block
        }
      }

      // Max out the database verified lists to up to 4 in case it returned more, then combine.
      clinics.value = [...formattedVerifiedClinics.slice(0, 4), ...googleClinics]
    } catch (err) {
      error.value = 'Failed to search for providers. Please try again.'
      console.error('Provider search error:', err)
    } finally {
      isLoading.value = false
    }
  }

  return { clinics, center, isLoading, error, searchByPreferences }
})
