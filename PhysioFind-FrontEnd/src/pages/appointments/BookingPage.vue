<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const appointmentStore = useAppointmentStore()
const route = useRoute()
const router = useRouter()
const practitionerId = route.query.pracId as string
const editApptId = route.query.apptId as string | undefined
const editMode = !!editApptId

const name = ref('')
const clinicId = ref('')
const appointmentDate = ref((route.query.date as string) || new Date().toJSON().slice(0, 10))
const timeslots = ref<string[]>([])
const currentTimeslot = ref((route.query.timeslot as string) || '')
const picked = ref('')
const showSuccessModal = ref(false)
const conflictError = ref(false)

async function bookAppointment() {
  if (!currentTimeslot.value || !picked.value) return
  conflictError.value = false

  const { start: fbStart, end: fbEnd } = localFreeBusyRange(appointmentDate.value)
  await appointmentStore.fetchFreeBusy(practitionerId, fbStart, fbEnd, editApptId)

  const [startStr, endStr] = currentTimeslot.value.split('-')
  const slotStart = new Date(appointmentDate.value + 'T' + startStr + 'Z')
  const slotEnd = new Date(appointmentDate.value + 'T' + endStr + 'Z')
  const busy = appointmentStore.freeBusy

  const hasConflict =
    Array.isArray(busy) &&
    busy.some((b) => slotStart < new Date(b.end) && new Date(b.start) < slotEnd)

  if (hasConflict) {
    conflictError.value = true
    currentTimeslot.value = ''
    updateTimeSlots()
    return
  }

  if (editMode && editApptId) {
    await appointmentStore.updateAppointment(
      editApptId,
      clinicId.value,
      practitionerId,
      appointmentDate.value + 'T' + startStr + 'Z',
      appointmentDate.value + 'T' + endStr + 'Z',
      'booked',
    )
  } else {
    await appointmentStore.createAppointment(
      clinicId.value,
      practitionerId,
      appointmentDate.value + 'T' + startStr + 'Z',
      appointmentDate.value + 'T' + endStr + 'Z',
      'booked',
      picked.value,
    )
  }
  if (appointmentStore.appointment) {
    showSuccessModal.value = true
  }
}

function localFreeBusyRange(date: string) {
  return {
    start: new Date(date + 'T09:00:00').toISOString(),
    end: new Date(date + 'T17:00:00').toISOString(),
  }
}

function formatTimeslot(timeslot: string): string {
  const [startUTC, endUTC] = timeslot.split('-')
  const start = new Date(appointmentDate.value + 'T' + startUTC + 'Z')
  const end = new Date(appointmentDate.value + 'T' + endUTC + 'Z')
  const fmt = (d: Date) => {
    const h = d.getHours(),
      m = d.getMinutes()
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return h12 + (m ? ':' + m.toString().padStart(2, '0') : '') + ' ' + ampm
  }
  return fmt(start) + ' – ' + fmt(end)
}

async function updateTimeSlots() {
  timeslots.value.length = 0
  const selected = new Date(appointmentDate.value + 'T00:00:00') // local midnight
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (selected < today) return
  const day = selected.getDay()
  if (day === 0 || day === 6) return

  const busy = appointmentStore.freeBusy
  const slotStart = new Date(appointmentDate.value + 'T09:00:00') // 9am local
  const slotEnd = new Date(appointmentDate.value + 'T10:00:00') // 10am local
  const dayEnd = new Date(appointmentDate.value + 'T17:00:00') // 5pm local

  while (slotEnd <= dayEnd) {
    const value = slotStart.toISOString().slice(11, 19) + '-' + slotEnd.toISOString().slice(11, 19)
    if (!busy) {
      timeslots.value.push(value)
    } else {
      let canAdd = true
      for (const b of busy) {
        if (slotStart < new Date(b.end) && new Date(b.start) < slotEnd) {
          canAdd = false
          break
        }
      }
      if (canAdd) timeslots.value.push(value)
    }
    slotStart.setHours(slotStart.getHours() + 1)
    slotEnd.setHours(slotEnd.getHours() + 1)
  }
}

onMounted(async () => {
  const response = await fetch('/api/practitioners/' + practitionerId)
  const data = await response.json()
  name.value = data.practitioner.user.first_name + ' ' + data.practitioner.user.last_name
  clinicId.value = data.practitioner.clinic_id
  const { start: mountStart, end: mountEnd } = localFreeBusyRange(appointmentDate.value)
  await appointmentStore.fetchFreeBusy(practitionerId, mountStart, mountEnd, editApptId)
  updateTimeSlots()
})

watch(appointmentDate, async (newDate) => {
  appointmentDate.value = newDate
  const { start: watchStart, end: watchEnd } = localFreeBusyRange(newDate)
  await appointmentStore.fetchFreeBusy(practitionerId, watchStart, watchEnd, editApptId)
  updateTimeSlots()
})
</script>

<template>
  <main id="booking-page" class="content-lanes">
    <section class="container1">
      <div id="child">
        <h2>{{ editMode ? 'Edit appointment with' : 'Book an appointment with' }} {{ name }}</h2>
        <div class="field-group">
          <label>Select preferred appointment date</label>
          <input v-model="appointmentDate" type="date" class="field" />
        </div>
        <div class="field-group">
          <label>Select preferred appointment time</label>
          <select v-model="currentTimeslot" :disabled="!appointmentStore.querried">
            <option value="" disabled>Select a time slot</option>
            <option v-for="timeslot in timeslots" :key="timeslot" :value="timeslot">
              {{ formatTimeslot(timeslot) }}
            </option>
          </select>
        </div>
        <div>
          <span class="meeting-type-heading">Preferred meeting type</span>
          <div class="container1">
            <input type="radio" id="In-Person" value="In-Person" v-model="picked" />
            <label for="In-Person">In-Person</label>
            <input type="radio" id="Online" value="Online" v-model="picked" />
            <label for="Online">Online</label>
          </div>
        </div>
        <p v-if="conflictError" class="conflict-error">
          That time slot is no longer available. Please select another.
        </p>
        <div class="book-btn-row">
          <button
            type="button"
            class="book-btn"
            @click="bookAppointment"
            :disabled="
              appointmentStore.isLoading ||
              appointmentStore.isUpdating ||
              !currentTimeslot ||
              !picked
            "
          >
            {{
              appointmentStore.isLoading || appointmentStore.isUpdating
                ? editMode
                  ? 'Updating...'
                  : 'Booking...'
                : editMode
                  ? 'Update appointment'
                  : 'Book appointment'
            }}
          </button>
        </div>
      </div>
    </section>

    <section v-if="showSuccessModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ editMode ? 'Appointment Updated!' : 'Appointment Booked!' }}</h2>
        <p>Your appointment has been successfully {{ editMode ? 'updated' : 'scheduled' }}.</p>
        <div class="modal-actions">
          <button type="button" @click="router.push('/')">Return to Home</button>
          <button type="button" @click="router.push('/appointments')">My Appointments</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
@scope (#booking-page) {
  .container1 {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
  }
  .field {
    background: var(--c-fill);
    border: 1px solid var(--c-separator);
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: var(--c-text);
    font-family: var(--f-body);
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--c-accent);
    }
  }
  .conflict-error {
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    background-color: oklch(from var(--c-red) l c h / 0.1);
    color: var(--c-red);
  }
  .book-btn-row {
    display: flex;
    justify-content: center;
  }
  .book-btn {
    padding: 0.67rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    text-align: center;
    background-color: var(--c-accent);
    color: var(--c-bg);
    min-width: 10rem;
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
  }
  .meeting-type-heading {
    font-size: 1.125rem;
    font-weight: 600;
  }
  #child {
    align-self: center;

    max-width: 420px;
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
    h2 {
      font-family: var(--f-serif);
      font-size: 1.5rem;
      font-weight: 700;

      text-align: center;
    }
    label {
      font-size: 1.125rem;
      font-weight: 600;
    }
    .container1 label {
      font-weight: 400;
      font-size: 1rem;
    }
    select {
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      border: 0.5px solid var(--c-separator);
      background-color: var(--c-bg);
      color: var(--c-text);
      font-size: 0.9375rem;
      margin-top: 0.25rem;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
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
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: hsl(0 0% 0% / 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }
  .modal {
    background-color: var(--c-bg-secondary);
    border: 0.5px solid var(--c-separator);
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 2px 2rem hsl(0 0% 0% / 0.2);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 360px;
    width: 100%;
    text-align: center;

    h2 {
      font-family: var(--f-serif);
      font-size: 1.5rem;
      font-weight: 700;
    }

    p {
      color: var(--c-text-secondary);
    }
  }
  .modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;

    button {
      padding: 0.6rem 1.25rem;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      background-color: var(--c-accent);
      color: var(--c-bg);
      transition: opacity 150ms ease;

      &:hover {
        opacity: 0.83;
      }
    }
  }
}
</style>
