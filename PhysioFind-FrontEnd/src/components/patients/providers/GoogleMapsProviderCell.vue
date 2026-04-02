<script setup lang="ts">
import { formatProviderAddress } from '@/utils'
import './ProviderCell.css'

const { provider } = defineProps<{
  provider: GoogleMapsClinic
}>()

defineEmits<{
  showDetails: [provider: GoogleMapsClinic]
}>()

const addressLines = formatProviderAddress(provider.address, 'multi-line')
</script>

<template>
  <button class="provider-cell" @click="$emit('showDetails', provider)">
    <h3 class="provider-name">
      <span class="text">{{ provider.name }}</span>
    </h3>
    <a :href="provider.mapsUrl" target="_blank" rel="noopener noreferrer" class="maps-link">
      See on Google Maps&nbsp;<span class="material-symbols-outlined sm icon">arrow_outward</span>
    </a>
    <p class="provider-address">
      <span v-for="line in addressLines.slice(0, 2)" :key="line">{{ line }}</span>
    </p>
  </button>
</template>

<style scoped>
.provider-cell {
  .maps-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--c-text-secondary);
    text-wrap: balance;
    max-width: max-content;

    transition: opacity 75ms ease;

    &:hover {
      opacity: 0.75;
    }

    .icon {
      font-size: 1rem;
      vertical-align: text-top;
    }
  }

  .details-btn {
    background-color: transparent;
    color: var(--c-accent);
    border: 2px solid var(--c-accent);
  }
}
</style>
