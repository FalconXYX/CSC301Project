<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { AppointmentRequest } from '@/types/appointments'

const appointmentStore = useAppointmentStore()
const authStore = useAuthStore()
const router = useRouter()
const profile = computed(() => authStore.profile)

const hasAppointments = ref(false)

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  const h = d.getHours(),
    m = d.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return h12 + (m ? ':' + m.toString().padStart(2, '0') : '') + ' ' + ampm
}

function toLocalYMD(dateStr: string): string {
  const d = new Date(dateStr)
  return (
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    d.getDate().toString().padStart(2, '0')
  )
}

function editAppointment(appt: AppointmentRequest) {
  const date = appt.preferred_start ? toLocalYMD(appt.preferred_start) : ''
  const startTime = appt.preferred_start
    ? new Date(appt.preferred_start).toISOString().slice(11, 19)
    : ''
  const endTime = appt.preferred_end ? new Date(appt.preferred_end).toISOString().slice(11, 19) : ''
  router.push({
    path: '/booking',
    query: {
      pracId: appt.practitioner_id ?? '',
      apptId: appt.id,
      date,
      timeslot: `${startTime}-${endTime}`,
    },
  })
}

const showDeletedBanner = ref(false)
let bannerTimer: ReturnType<typeof setTimeout> | null = null

const confirmDeleteId = ref<string | null>(null)

function promptDelete(id: string) {
  confirmDeleteId.value = id
}

function cancelDelete() {
  confirmDeleteId.value = null
}

async function confirmDelete() {
  if (!confirmDeleteId.value) return
  const id = confirmDeleteId.value
  confirmDeleteId.value = null
  const success = await appointmentStore.deleteAppointment(id)
  if (success) {
    if (bannerTimer) clearTimeout(bannerTimer)
    showDeletedBanner.value = true
    bannerTimer = setTimeout(() => {
      showDeletedBanner.value = false
    }, 3000)
    if (
      appointmentStore.appointments.filter((a) => new Date(a.preferred_start ?? 0) > new Date())
        .length === 0
    ) {
      hasAppointments.value = false
    }
  }
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
  const name = data.practitioner.user.first_name + ' ' + data.practitioner.user.last_name
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
  if (appointmentStore.appointments.length !== 0) {
    hasAppointments.value = true
  }
  const ids = Array.from(
    new Set(appointmentStore.appointments.map((a) => a.practitioner_id).filter(Boolean)),
  )
  await Promise.all(ids.map((id) => getPractitionerName(id)))
})
</script>

<template>
  <main id="user-appointments-page" class="content-lanes">
    <div class="deleted-banner" v-if="showDeletedBanner">Appointment successfully deleted.</div>
    <div class="container1" v-if="profile">
      <div id="child">
        <h1 class="title">Here are your upcoming appointments, {{ profile.first_name }}</h1>
        <div
          id="child"
          v-show="
            Date.now() < (appt.preferred_start ? new Date(appt.preferred_start).getTime() : 0)
          "
          v-for="appt in appointmentStore.appointments"
          :key="appt.id"
          :value="appt.id"
        >
          <h3>
            {{ appt.preferred_start ? formatDate(appt.preferred_start) : 'Unknown date' }} —
            Appointment with
            {{
              appt.practitioner_id
                ? practitionerNames[appt.practitioner_id] || 'Loading...'
                : 'Unknown practitioner'
            }}
            from {{ appt.preferred_start ? formatTime(appt.preferred_start) : '' }} to
            {{ appt.preferred_end ? formatTime(appt.preferred_end) : '' }}
          </h3>
          <div class="buttons-row">
            <button
              type="button"
              class="appt-btn edit-btn"
              @click="editAppointment(appt)"
              :disabled="appointmentStore.isDeleting"
            >
              Edit appointment
            </button>
            <button
              type="button"
              class="appt-btn delete-btn"
              @click="promptDelete(appt.id)"
              :disabled="appointmentStore.isDeleting"
            >
              Delete appointment
            </button>
          </div>
        </div>
        <h2 v-if="!hasAppointments">No upcoming appointments</h2>
      </div>
    </div>

    <div v-if="confirmDeleteId" class="modal-overlay">
      <div class="confirm-modal">
        <p>Are you sure you want to delete this appointment?</p>
        <div class="buttons-row">
          <button type="button" class="appt-btn edit-btn" @click="cancelDelete">No</button>
          <button type="button" class="appt-btn delete-btn" @click="confirmDelete">
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
@scope (#user-appointments-page) {
  .deleted-banner {
    position: fixed;
    top: 1.25rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--c-bg-secondary);
    border: 0.5px solid var(--c-separator);
    border-radius: 0.75rem;
    padding: 0.6rem 1.25rem;
    box-shadow: 0 2px 1rem hsl(0 0% 0% / 0.12);
    font-size: 0.9375rem;
    font-weight: 600;
    z-index: 100;
    white-space: nowrap;
  }
  .buttons-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .appt-btn {
    padding: 0.67rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    text-align: center;
    color: var(--c-bg);
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
  .edit-btn {
    background-color: var(--c-accent);
  }
  .delete-btn {
    background-color: var(--c-red);
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
  .confirm-modal {
    background-color: var(--c-bg-secondary);
    border: 0.5px solid var(--c-separator);
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 2px 2rem hsl(0 0% 0% / 0.2);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 360px;
    width: 100%;

    p {
      font-size: 1.125rem;
      font-weight: 600;
      text-align: center;
    }

    .buttons-row {
      gap: 1.25rem;
    }

    .buttons-row .appt-btn {
      flex: 1;
      max-width: 40%;
    }
  }
  .container1 {
    display: flex;
    padding: 100px;
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
    h2 {
      font-family: var(--f-serif);
      font-size: 1.5rem;
      font-weight: 700;

      text-align: center;
    }
    section {
      --accent-color: var(--c-accent);

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
  }
}
</style>
