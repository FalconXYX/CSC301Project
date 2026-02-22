<script setup lang="ts">
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
        We tried our best to match you with healthcare providers based on your responses to the
        questionnaire.
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
#provider-results {
  margin-block: 2rem;

  .title-area {
    text-align: center;
    margin: 0.5rem auto 2rem;
    max-width: max-content;

    .heading {
      font: 700 var(--f-heading-size)/1.2 var(--f-serif);
      margin-bottom: 0.5rem;
    }

    .subheading {
      font-size: var(--f-subheading-size);
      line-height: 1.4;
      text-wrap: balance;
      color: var(--c-text-secondary);
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
