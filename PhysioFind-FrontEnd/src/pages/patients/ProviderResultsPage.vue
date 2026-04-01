<script setup lang="ts">
const route = useRoute()
const store = useProviderSearchStore()

const preferencesStr = computed(() => route.query.preferences as string | undefined)

const selectedClinic = ref<Clinic | null>(null)

function showProviderDetails(provider: Clinic) {
  selectedClinic.value = provider
}

watch(
  preferencesStr,
  async (newPrefsStr) => {
    if (!newPrefsStr) return
    try {
      const preferences = JSON.parse(newPrefsStr)
      await store.searchByPreferences(preferences)
    } catch (e) {
      console.error('Failed to parse preferences', e)
    }
  },
  { immediate: true },
)
</script>

<template>
  <main id="provider-results-page" class="content-lanes">
    <section id="matches">
      <section class="results">
        <div class="title-area">
          <h2 class="heading">Your Matches</h2>
          <p class="subheading">
            We tried our best to match you with healthcare providers based on your responses to the
            questionnaire.
          </p>
        </div>

        <div v-if="store.isLoading" class="state-message">
          <p>Searching for providers...</p>
        </div>

        <div v-else-if="store.error" class="state-message error">
          <p>{{ store.error }}</p>
        </div>

        <div v-else-if="store.clinics.length === 0" class="state-message">
          <p>
            No providers were found matching your criteria. Try adjusting your preferences or
            expanding your location.
          </p>
        </div>

        <div v-else class="results-list">
          <template v-for="clinic in store.clinics" :key="clinic.id">
            <VerifiedProviderCell
              v-if="clinic.type === 'verified'"
              :provider="clinic"
              @show-details="showProviderDetails"
              :class="{ selected: selectedClinic === clinic }"
            />
            <GoogleMapsProviderCell
              v-else-if="clinic.type === 'google-maps'"
              :provider="clinic"
              @show-details="showProviderDetails"
              :class="{ selected: selectedClinic === clinic }"
            />
          </template>
        </div>
      </section>
      <Transition name="detail-map" mode="out-in">
        <KeepAlive include="ProviderMap">
          <ProviderDetail
            v-if="selectedClinic"
            :provider="selectedClinic"
            :key="selectedClinic.id"
            @close="selectedClinic = null"
          />
          <ProviderMap
            v-else-if="store.center"
            :clinics="store.clinics"
            :center="store.center"
            class="provider-map"
          />
        </KeepAlive>
      </Transition>
    </section>
  </main>
</template>

<style>
@scope (#provider-results-page) {
  #matches {
    padding-block: calc(var(--g-navbar-height) + 0.75rem) 0.75rem;
    height: calc(100dvh - var(--g-navbar-height));

    display: grid;
    grid-template-columns: 3fr 5fr;
    gap: 1.5rem;
  }

  .title-area {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    text-wrap: pretty;
  }

  .results {
    padding: 1.5rem;

    background: var(--c-bg-secondary);
    border-radius: 1.5rem;

    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    overflow-y: auto;

    .results-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .state-message {
      text-align: center;
      padding: 3rem 1rem;
      background-color: var(--c-surface-1);
      border-radius: 0.5rem;
      border: 1px dashed var(--c-separator);
      color: var(--c-text-2);
      font-size: 1.1rem;

      &.error {
        color: var(--c-error, #d32f2f);
        background-color: var(--c-error-bg, #fdedea);
      }
    }
  }

  .provider-map {
    border: 0.5px solid var(--c-separator);
    border-radius: 1.5rem;
    box-shadow: 0 2px 3rem oklch(0 0 0 / 0.08);
  }

  /* Transitions */

  .detail-map-enter-active,
  .detail-map-leave-active {
    transition:
      filter 250ms ease,
      opacity 250ms ease,
      scale 250ms ease;
  }

  .detail-map-enter-from,
  .detail-map-leave-to {
    filter: blur(4px);
    opacity: 0;
    scale: 0.98;
  }
}
</style>
