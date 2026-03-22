<script setup lang="ts">

import { ref } from 'vue'

const appointmentStore = useAppointmentStore()
const authStore = useAuthStore()
const profile = computed(() => authStore.profile)

const timezoneOffset = new Date().getTimezoneOffset() / 60

function editAppointment() {
  alert('Not implemented yet!')
}

const practitionerNames = ref<Record<string, string>>({})

async function getPractitionerName(practitionerId: string | null): Promise<string> {
  if (!practitionerId) return 'Unknown practitioner'
  // cache check
  if (practitionerNames.value[practitionerId]) {
    return practitionerNames.value[practitionerId]
  }
  const response = await fetch('/api/practitioners/' + practitionerId)
  const data = await response.json()
  const name = data.practitioner.user.first_name + " " + data.practitioner.user.last_name
  practitionerNames.value[practitionerId] = name
  return name
}

onMounted(async () => {
  await appointmentStore.fetchAppointments()
  appointmentStore.appointments.sort((a, b) => {
    const ta = a.preferred_start ? new Date(a.preferred_start).getTime() : 0
    const tb = b.preferred_start ? new Date(b.preferred_start).getTime() : 0
    return ta - tb
  })

  const ids = Array.from(new Set(appointmentStore.appointments.map(a => a.practitioner_id).filter(Boolean)))
  await Promise.all(ids.map((id) => getPractitionerName(id)))
})

</script>

<template>
  <div class="container1" v-if="profile">
    <div id="child">
      <h1 class="title">Here are your upcoming appointments, {{ profile.first_name }}</h1>
      <div id="child" v-show="Date.now() < (appt.preferred_start ? new Date(appt.preferred_start).getTime() : 0)" v-for="appt in appointmentStore.appointments" :key="appt.id" :value="appt.id">
        <h3>
          {{ appt.preferred_start ? appt.preferred_start.split('T')[0] : 'Unknown date' }} - Appointment with practitioner {{ appt.practitioner_id ? (practitionerNames[appt.practitioner_id] || 'Loading...') : 'Unknown practitioner' }} from {{ appt.preferred_start ? new Date(appt.preferred_start).getUTCHours() - timezoneOffset : '' }}:{{ appt.preferred_start ? new Date(appt.preferred_start).getUTCMinutes() : '' }} to {{ appt.preferred_end ? new Date(appt.preferred_end).getUTCHours() - timezoneOffset : '' }}:{{ appt.preferred_end ? new Date(appt.preferred_end).getUTCMinutes() : '' }}
        </h3>
        <button type="button" @click="editAppointment">
          Edit appointment
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container1 {
  display: flex;
  padding: 100px
}
.child {
  flex: 1;
}
#child {
  align-self: center;

  max-width: 500;
  width: 100%;
  margin-inline: auto;

  background-color: var(--c-bg-secondary);
  border: 0.5px solid var(--c-separator);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 2rem hsl(0 0% 0% / 0.08);

  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h1 {
    font-family: var(--f-serif);
    font-size: 2rem;
    font-weight: 700;

    text-align: center;
  }
  section {
    --accent-color: var(--c-accent);

    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .heading {
      font-size: 1.125rem;
      font-weight: 600;
    }

    .subheading {
      font-size: 0.875rem;
      line-height: 1.4;
      color: var(--c-text-secondary);
    }

    button {
      place-content: center;
      padding: 0.67rem 0.75rem;
      margin-top: 0.25rem;

      background-color: var(--accent-color);
      color: var(--c-bg);
      border-radius: 0.5rem;

      font-size: 0.9375rem;
      font-weight: 600;
      text-align: center;

      transition:
        opacity 150ms ease,
        scale 150ms ease;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &:not(:disabled):hover {
        opacity: 0.83;
      }

      &:not(:disabled):active {
        scale: 0.96;
      }

      &.secondary {
        align-self: center;
        width: fit-content;

        background-color: transparent;
        color: var(--accent-color);
        padding: 0.25rem;
      }
    }
  }
}
</style>
