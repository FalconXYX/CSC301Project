<script setup lang="ts">
const { clinics, center } = defineProps<{
  clinics: Clinic[]
  center: ClinicLocation
}>()

const mapElement = useTemplateRef('mapElement')
const { mapsLib, markerLib } = useGoogleMaps()

const map = shallowRef<google.maps.Map | null>(null)

onMounted(async () => {
  const { Map } = await mapsLib
  map.value = new Map(mapElement.value!, {
    center,
    zoom: 13,
    mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID',
    disableDefaultUI: true,
    zoomControl: true,
    colorScheme: google.maps.ColorScheme.FOLLOW_SYSTEM,
  })
})

onActivated(async () => {
  await nextTick()
  if (map.value) {
    google.maps.event.trigger(map.value, 'resize')
    triggerRef(map) // force watchEffect to re-add markers to the reattached overlay layer
  }
})

watchEffect((onCleanup) => {
  const currentMap = map.value
  if (!currentMap) return

  // Read clinics synchronously so watchEffect tracks it, then snapshot for async use
  const snapshot = clinics.map((c) => c)

  let cancelled = false
  const markers: google.maps.marker.AdvancedMarkerElement[] = []

  Promise.all([mapsLib, markerLib]).then(([{ InfoWindow }, { AdvancedMarkerElement }]) => {
    if (cancelled) return

    const infoWindow = new InfoWindow()

    for (const clinic of snapshot) {
      if (!clinic.location) continue

      const pin = document.createElement('div')
      pin.classList.add('map-pin', `map-pin--${clinic.type}`)

      const marker = new AdvancedMarkerElement({
        map: currentMap,
        position: clinic.location,
        content: pin,
        title: clinic.name,
      })

      const { lat: loclat, lng: loclng } = clinic.location
      marker.addListener('gmp-click', () => {
        infoWindow.setContent(`
          <div class="map-info-window">
            <strong>${clinic.name}</strong>
            <p>${clinic.address.line1}</p>
            <a href="${clinic.type === 'google-maps' ? clinic.mapsUrl : `https://www.google.com/maps/search/?api=1&query=${loclat},${loclng}`}" target="_blank" rel="noopener">View on Google Maps</a>
          </div>
        `)
        infoWindow.open({ map: currentMap, anchor: marker })
      })

      markers.push(marker)
    }
  })

  onCleanup(() => {
    cancelled = true
    markers.forEach((m) => (m.map = null))
  })
})
</script>

<template>
  <div ref="mapElement" class="provider-map" />
</template>

<style>
.provider-map {
  .map-pin {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 1.5px solid white;
    box-shadow: 0 0 0.25rem hsl(0 0 0 / 0.5);
  }

  .map-pin--google-maps {
    background: hsl(0 0% 50%);
  }

  .map-pin--verified {
    background: var(--c-green);
  }

  .map-info-window {
    z-index: 5;
  }
}
</style>
