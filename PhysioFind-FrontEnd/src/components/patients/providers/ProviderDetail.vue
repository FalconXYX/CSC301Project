<script setup lang="ts">
import { formatProviderAddress } from '@/utils'

const { provider } = defineProps<{
  provider: Clinic
}>()

defineEmits<{
  close: []
}>()

const specialties = computed(
  () => (provider.type === 'verified' && provider.services ? provider.services : []),
  // provider.type === 'verified' && provider.services
  //   ? provider.services
  //       .filter((s) => s.startsWith('specialty:'))
  //       .map((s) => s.replace('specialty:', ''))
  //   : [],
)

const acceptedInsurance = computed(
  () => (provider.type === 'verified' && provider.insurances ? provider.insurances : []),
  // provider.type === 'verified' && provider.services
  //   ? provider.services
  //       .filter((s) => s.startsWith('insurance:'))
  //       .map((s) => s.replace('insurance:', ''))
  //   : [],
)

const hours = computed(
  () => provider.type === 'verified' && provider.hours,
  // () => provider.type === 'verified' && provider.services?.find((s) => s.startsWith('hours:')),
)

function bookAppointment() {
  // TODO: Add booking functionality
  alert('Implement booking functionality')
}

onMounted(() => {
  console.log('SERVICES')
  console.log(provider.type === 'verified' && provider)
})
</script>

<template>
  <section class="provider-detail">
    <h2>{{ provider.name }}</h2>
    <template v-if="provider.type === 'verified'">
      <h3>Profile</h3>
      <div class="provider-row">
        <p class="label">Address</p>
        <p class="value multiline">
          <span v-for="line in formatProviderAddress(provider.address, 'multi-line')" :key="line">
            {{ line }}
          </span>
        </p>
      </div>
      <div class="provider-row" v-if="provider.location">
        <p class="label">Coordinates</p>
        <p class="value">{{ provider.location.lat }}, {{ provider.location.lng }}</p>
      </div>
      <template v-if="provider.services">
        <h3>Services</h3>
        <div class="provider-row" v-if="specialties.length > 0">
          <p class="label">Specialties</p>
          <ul class="value">
            <li v-for="(specialty, idx) in specialties" :key="idx">
              {{ specialty }}
            </li>
          </ul>
        </div>
        <div class="provider-row" v-if="hours">
          <p class="label">Hours</p>
          <p class="value">{{ hours }}</p>
        </div>
        <div class="provider-row" v-if="acceptedInsurance.length > 0">
          <p class="label">Accepted Insurance</p>
          <ul class="value">
            <li v-for="(insurance, idx) in acceptedInsurance" :key="idx">
              {{ insurance }}
            </li>
          </ul>
        </div>
      </template>
    </template>
    <template v-else>
      <h3>Profile</h3>
      <div class="provider-row">
        <p class="label">Address</p>
        <p class="value multiline">
          <span v-for="line in formatProviderAddress(provider.address, 'multi-line')" :key="line">
            {{ line }}
          </span>
        </p>
      </div>
      <div class="provider-row" v-if="provider.location">
        <p class="label">Coordinates</p>
        <p class="value">{{ provider.location.lat }}, {{ provider.location.lng }}</p>
      </div>
    </template>
    <div class="action-row">
      <button class="close-btn bordered secondary" @click="$emit('close')">Close</button>
      <button class="bordered" @click="bookAppointment">Book Appointment</button>
    </div>
  </section>
</template>

<style scoped>
.provider-detail {
  padding: 1.5rem;

  background: var(--c-bg-secondary);
  border-radius: 1.5rem;

  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  header {
    display: flex;
    gap: 0.75rem;

    h2 {
      margin-inline-end: auto;
    }
  }

  h3 {
    margin-block-start: 1.25rem;
  }

  .provider-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .label {
      font-size: 0.875rem;
      color: var(--c-secondary);
    }

    .value {
      &.multiline {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }
    }

    ul.value {
      list-style: inside disc;
    }
  }

  .action-row {
    margin-block-start: auto;

    display: flex;
    justify-content: end;
    gap: 0.75rem;
  }
}
</style>
