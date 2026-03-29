<script setup lang="ts">
// Provider results page
//
// This page displays a map and a list of matched healthcare providers based on
// the user's questionnaire responses. The script uses the route's query
// parameters to trigger a search in the provider search store when a postal
// code is present.

// Vite's `<script setup>` automatically imports utilities like `useRoute`,
// `computed` and `watch` if the project is configured with auto‑imports. We
// intentionally mirror the upstream implementation from the repository to
// preserve functionality while adjusting styles below.

const route = useRoute()
const store = useProviderSearchStore()

const preferencesStr = computed(() => route.query.preferences as string | undefined)

function showProviderDetails(provider: Clinic) {
  // Logic to show clinic details
  alert(`Provider: ${provider.name}`)
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
              :provider="clinic"
              @show-details="showProviderDetails"
              v-if="clinic.type === 'verified'"
            />
            <GoogleMapsProviderCell
              :provider="clinic"
              @show-details="showProviderDetails"
              v-else-if="clinic.type === 'google-maps'"
            />
          </template>
        </div>
      </section>
      <ProviderMap
        v-if="store.center"
        :clinics="store.clinics"
        :center="store.center"
        class="provider-map"
      />
    </section>
  </main>
</template>

<style>
@scope (#provider-results-page) {
  #matches {
    padding-block: calc(var(--g-navbar-height) + 0.75rem) 0.75rem;

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

    overflow-y: auto;

    display: flex;
    flex-direction: column;
    gap: 1.5rem;

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
    border: 1px solid var(--c-separator);
    border-radius: 1.5rem;
    box-shadow: 0 2px 3rem oklch(0 0 0 / 0.12);
  }
}
</style>
