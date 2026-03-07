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

const postalCode = computed(() => route.query.postalCode as string | undefined)

function showProviderDetails(provider: Clinic) {
  // Logic to show clinic details
  alert(`Provider: ${provider.name}`)
}

watch(
  postalCode,
  async (newPostalCode) => {
    if (!newPostalCode) return
    await store.searchByPostalCode(newPostalCode)
  },
  { immediate: true },
)
</script>

<template>
  <section id="provider-results">
    <ProviderMap
      v-if="store.center"
      :clinics="store.clinics"
      :center="store.center"
      class="provider-map"
    />
    <div class="title-area">
      <h1 class="heading">Your Matches</h1>
      <p class="subheading">
        We tried our best to match you with healthcare providers based on your
        responses to the questionnaire.
      </p>
    </div>
    <div class="results">
      <template v-for="clinic in store.clinics" :key="clinic.id">
        <!-- Provider result cards will go here -->
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
</template>

<style scoped>
/*
 * Provider Results Page
 *
 * Adjust the colour scheme to match the refreshed landing page. Use a
 * dark blue for the heading and subheading for improved contrast on
 * light backgrounds, replacing the default variable‑based colours. The
 * layout and spacing mirror the upstream implementation.
 */

#provider-results {
  margin-block: 2rem;

  .title-area {
    text-align: center;
    margin: 0.5rem auto 2rem;
    max-width: max-content;

    .heading {
      font: 700 var(--f-heading-size)/1.2 var(--f-serif);
      margin-bottom: 0.5rem;
      color: #0a2441;
    }

    .subheading {
      font-size: var(--f-subheading-size);
      line-height: 1.4;
      text-wrap: balance;
      /* Override the default secondary text colour with a dark tone for better
       * readability on light backgrounds. */
      color: #0a2441;
      max-width: 64ch;
    }
  }

  .provider-map {
    border-radius: 0.5rem;
    border: 1px solid var(--c-separator);
    margin-bottom: 2rem;
  }

  .results {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
    gap: 1.5rem;
  }
}
</style>