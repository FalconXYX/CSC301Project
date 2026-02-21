import previewProviderResults from '@/data/find-provider-results.json'

export const useProviderSearchStore = defineStore('providerSearch', () => {
  const { geocodePostalCode, searchNearbyClinics } = useGoogleMaps()

  const clinics = ref<Clinic[]>(previewProviderResults as Clinic[]) // Using preview data
  const center = ref<ClinicLocation>()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function searchByPostalCode(postalCode: string) {
    isLoading.value = true
    error.value = null

    try {
      center.value = await geocodePostalCode(postalCode)

      const newClinics = await searchNearbyClinics(center.value)
      clinics.value = [...(previewProviderResults as Clinic[]), ...newClinics]
    } catch (err) {
      error.value = 'Failed to search for providers. Please try again.'
      console.error('Provider search error:', err)
    } finally {
      isLoading.value = false
    }
  }

  return { clinics, center, isLoading, error, searchByPostalCode }
})
