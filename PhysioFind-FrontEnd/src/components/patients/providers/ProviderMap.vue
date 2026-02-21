<script setup lang="ts">
const { clinics, center } = defineProps<{
  clinics: Clinic[]
  center: ClinicLocation
}>()

const mapElement = useTemplateRef('mapElement')
const { mapsLib, markerLib } = useGoogleMaps()

onMounted(async () => {
  const [{ Map, InfoWindow }, { AdvancedMarkerElement }] = await Promise.all([mapsLib, markerLib])

  const map = new Map(mapElement.value!, {
    center: center,
    zoom: 13,
    mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID',
    disableDefaultUI: true,
    zoomControl: true,
  })

  const infoWindow = new InfoWindow()
  const markers: google.maps.marker.AdvancedMarkerElement[] = []

  // Reactively re-render markers when clinics change
  watchEffect(() => {
    markers.forEach((m) => (m.map = null))
    markers.length = 0

    for (const clinic of clinics) {
      if (clinic.type !== 'google-maps') continue

      const pin = document.createElement('div')
      pin.className = `map-pin map-pin--${clinic.type}`

      const marker = new AdvancedMarkerElement({
        map,
        position: clinic.location,
        content: pin,
        title: clinic.name,
      })

      marker.addListener('click', () => {
        infoWindow.setContent(`
          <div class="map-info-window">
            <strong>${clinic.name}</strong>
            <p>${clinic.address.line1}</p>
            <a href="${clinic.mapsUrl}" target="_blank" rel="noopener">View on Google Maps</a>
          </div>
        `)
        infoWindow.open({ map, anchor: marker })
      })

      markers.push(marker)
    }
  })
})
</script>

<template>
  <div ref="mapElement" class="provider-map" />
</template>

<style scoped>
.provider-map {
  width: 100%;
  height: 480px;
  border-radius: 0.75rem;
  overflow: hidden;

  :deep(.map-pin) {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px hsl(0 0 0 / 0.3);
  }

  :deep(.map-pin--google-maps) {
    background: var(--c-text-primary);
  }

  :deep(.map-pin--verified) {
    background: var(--c-green);
  }
}
</style>
