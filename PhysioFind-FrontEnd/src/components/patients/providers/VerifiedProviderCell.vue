<script setup lang="ts">
import { formatProviderAddress } from '@/utils'
import './ProviderCell.css'

const { provider } = defineProps<{
  provider: VerifiedClinic
}>()

defineEmits<{
  showDetails: [provider: VerifiedClinic]
}>()

const addressLines = formatProviderAddress(provider.address, 'multi-line')

const tooltipRef = useTemplateRef('tooltip')
const tooltipTimeout = ref<number>()

function showTooltip() {
  clearTimeout(tooltipTimeout.value)
  tooltipRef.value?.showPopover()
}

function hideTooltip() {
  tooltipTimeout.value = window.setTimeout(() => {
    tooltipRef.value?.hidePopover()
  }, 100)
}
</script>

<template>
  <div class="provider-cell verified">
    <h3 class="provider-name">
      {{ provider.name }}
      <span
        class="material-symbols-outlined verified-badge"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
        >verified</span
      >
      <div ref="tooltip" popover="auto" class="verified-tooltip">Verified partner clinic</div>
    </h3>
    <p class="provider-address">
      <span v-for="line in addressLines" :key="line">{{ line }}</span>
    </p>
    <div class="bottom-row">
      <div class="services">
        <span v-for="service in provider.services" :key="service" class="service">{{
          service
        }}</span>
      </div>
      <button class="details-btn" @click="$emit('showDetails', provider)">See Details</button>
    </div>
  </div>
</template>

<style scoped>
.verified-badge {
  anchor-name: --verified-badge;

  font-size: 1.25rem;
  font-variation-settings:
    'FILL' 1,
    'OPSZ' 20;
  font-weight: 400;
  color: var(--c-green);
  vertical-align: -2.5px;

  cursor: default;
}

.verified-tooltip {
  position: absolute;
  position-anchor: --verified-badge;
  position-area: top center;
  width: max-content;
  margin-bottom: 0.5rem;

  background-color: oklch(from var(--c-green) l c h / 0.92);
  backdrop-filter: blur(0.5rem);
  border: 0.5px solid var(--c-separator);
  border-radius: 0.5rem;
  box-shadow: 0 2px 0.5rem oklch(0% 0% 0 / 0.33);
  padding: 0.25rem 0.5rem;

  color: oklch(96% 0% 0);
  font-size: 0.875rem;
  font-weight: 500;

  opacity: 0;
  scale: 0.92;

  transition:
    opacity 150ms ease,
    scale 150ms ease,
    display 150ms ease allow-discrete,
    overlay 150ms ease allow-discrete;

  &:popover-open {
    opacity: 1;
    scale: 1;

    @starting-style {
      opacity: 0;
      scale: 0.92;
    }
  }
}
</style>
