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
      }

            const newClinics = await searchClinics(preferences)
      clinics.value = newClinics.map(c => ({
        id: c.id,
        name: c.name,
        type: 'verified',
        services: Array.isArray(c.specialties_json) ? c.specialties_json : (Array.isArray(c.services_json) ? c.services_json : ['General Care']),
        address: {
          line1: c.address_line1,
          line2: c.address_line2 || undefined,
          city: c.city,
          province: c.province,
          postalCode: c.postal_code
        },
        contact: {
          phone: c.phone || undefined,
          email: c.email || undefined,
          website: c.website || undefined
        }
      })) as Clinic[];
    } catch (err) {
      error.value = 'Failed to search for providers. Please try again.'
      console.error('Provider search error:', err)
    } finally {
      isLoading.value = false
    }
  }

  return { clinics, center, isLoading, error, searchByPreferences }
})
