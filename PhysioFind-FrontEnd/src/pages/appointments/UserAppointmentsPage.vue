<script setup lang="ts">

import { ref } from 'vue'

const appointmentStore = useAppointmentStore()
// const googleStore = useGoogleCalendarStore()
// const route = useRoute()

const createClinic = ref('')
const createPrac = ref('')
const createStart = ref('')
const createEnd = ref('')
const createStatus = ref('')

const updateAppointment = ref('')
const updateClinic = ref('')
const updatePrac = ref('')
const updateStart = ref('')
const updateEnd = ref('')
const updateStatus = ref('')

const getAppointment = ref('')

const deleteAppointment = ref('')

</script>

<template>
  <div class="container1">
    <div id="child">
      <h1 class="title">Test Appointment Creation:</h1>
      <input v-model="createClinic" placeholder="Enter Clinic Id">
      <input v-model="createPrac" placeholder="Enter Practitioner Id">
      <input v-model="createStart" placeholder="Enter Start Time">
      <input v-model="createEnd" placeholder="Enter End Time">
      <input v-model="createStatus" placeholder="Enter Status">
      <h3 v-if="appointmentStore.appointment">Appointment Created. Id: {{ appointmentStore.appointment.id}}</h3>
      <button type="button" @click="appointmentStore.createAppointment(createClinic, createPrac, createStart, createEnd, createStatus)" :disabled="appointmentStore.isLoading">
        {{ appointmentStore.isLoading ? 'Creating Appointment...' : 'Create Appointment' }}
      </button>
    </div>
    <div id="child">
      <h1 class="title">Test Appointment Updating:</h1>
      <input v-model="updateAppointment" placeholder="Enter Appointment Id">
      <input v-model="updateClinic" placeholder="Enter Clinic Id">
      <input v-model="updatePrac" placeholder="Enter Practitioner Id">
      <input v-model="updateStart" placeholder="Enter Start Time">
      <input v-model="updateEnd" placeholder="Enter End Time">
      <input v-model="updateStatus" placeholder="Enter Status">
      <button type="button" @click="appointmentStore.updateAppointment(updateAppointment, updateClinic, updatePrac, updateStart, updateEnd, updateStatus)" :disabled="appointmentStore.isUpdating">
        {{ appointmentStore.isUpdating ? 'Updating Appointment...' : 'Update Appointment' }}
      </button>
    </div>
  </div>
  <div class="container1">
    <div id="child">
      <h1 class="title">Test Get Appointments:</h1>
      <input v-model="getAppointment" placeholder="Enter Appointment Id">
      <button type="button" @click="appointmentStore.fetchAppointmentById(getAppointment)" :disabled="appointmentStore.isFetching">
        {{ appointmentStore.isFetching ? 'Getting Appointment...' : 'Get Appointment by Id' }}
      </button>
      <h3 v-if="appointmentStore.appointment && appointmentStore.gotten">Appointment Information: {{ appointmentStore.appointment}}</h3>
      <button type="button" @click="appointmentStore.fetchAppointments()" :disabled="appointmentStore.isFetching">
        {{ appointmentStore.isFetching ? 'Getting Appointment...' : 'Get All Appointment Ids' }}
      </button>
      <h3 v-for="app in appointmentStore.appointments" :key="app.id" :value="app.id">
            {{ app.id }}
      </h3>
    </div>
    <div id="child">
      <h1 class="title">Test Appointment Deletion:</h1>
      <input v-model="deleteAppointment" placeholder="Enter Appointment Id">
      <button type="button" @click="appointmentStore.deleteAppointment(deleteAppointment)" :disabled="appointmentStore.isDeleting">
        {{ appointmentStore.isDeleting ? 'Deleting Appointment...' : 'Delete Appointment' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.container1 {
  display: flex;
}
.child {
  flex: 1;
}
#child {
  align-self: center;

  max-width: var(--g-card-max-width);
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
