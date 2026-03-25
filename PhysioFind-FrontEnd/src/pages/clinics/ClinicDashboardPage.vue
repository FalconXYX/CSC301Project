<script setup lang="ts">
import * as API from '@/api'

const auth = useAuthStore()
const router = useRouter()

const clinicId = computed(() => auth.profile?.clinic_id)
const clinic = ref<ClinicRecord>()
const clinicBackup = ref<ClinicRecord>()

const formattedDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-CA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Toronto',
  })
}

const isEditing = ref(false)
const disabled = computed(() => !isEditing.value)

const specialtiesString = ref('')
const specialtiesArray = computed(() =>
  specialtiesString.value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0),
)

const servicesInPerson = ref(false)
const servicesVirtual = ref(false)
const insurancesList = ref<string[]>([])
const hoursText = ref('')

const isLoading = ref(false)

async function startEditing() {
  if (!clinic.value) return

  clinicBackup.value = { ...clinic.value }
  isEditing.value = true
}

function unpackServices(clinicData: any) {
  let servicesArray: string[] = []
  try {
    servicesArray = JSON.parse(clinicData?.services_json || '[]')
  } catch {
    // keep empty
  }

  servicesInPerson.value = servicesArray.includes('in_person')
  servicesVirtual.value = servicesArray.includes('virtual')

  insurancesList.value = []
  hoursText.value = ''

  servicesArray.forEach((item: string) => {
    if (item.startsWith('insurance:')) {
      insurancesList.value.push(item.replace('insurance:', ''))
    } else if (item.startsWith('hours:')) {
      hoursText.value = item.replace('hours:', '')
    }
  })
}

function cancelEditing() {
  clinic.value = { ...clinicBackup.value } as any
  specialtiesString.value = JSON.parse(
    (clinicBackup.value?.specialties_json as string) || '[]',
  ).join(', ')
  unpackServices(clinicBackup.value)
  isEditing.value = false
}

async function submitChanges() {
  if (!clinic.value) return
  isLoading.value = true
  isEditing.value = false

  const services: string[] = []
  if (servicesInPerson.value) services.push('in_person')
  if (servicesVirtual.value) services.push('virtual')
  if (hoursText.value) services.push(`hours:${hoursText.value}`)
  insurancesList.value.forEach((ins) => services.push(`insurance:${ins}`))

  // Update clinic details via API
  const updatedClinic = await API.updateClinic(clinic.value.id, {
    ...clinic.value,
    specialties_json: JSON.stringify(specialtiesArray.value),
    services_json: JSON.stringify(services),
    updated_at: new Date().toISOString(),
  })
  clinic.value = updatedClinic
  clinicBackup.value = { ...updatedClinic }

  isLoading.value = false
}

onMounted(() => {
  if (!auth.profile?.clinic_id) {
    // If the user doesn't have a clinic, redirect to the clinic creation page
    router.push({ path: '/clinic/create' })
  }
})

watch(
  clinicId,
  async (newClinicId) => {
    if (newClinicId) {
      try {
        const fetchedClinic = await API.getClinic(newClinicId)
        clinic.value = fetchedClinic
        specialtiesString.value = JSON.parse(fetchedClinic.specialties_json as string).join(', ')
        clinicBackup.value = { ...fetchedClinic }

        // Unpack services JSON
        unpackServices(fetchedClinic)
      } catch (error) {
        console.error(error)
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <form id="clinic-dashboard" v-if="clinic" @submit.prevent="submitChanges">
    <header>
      <h1 class="title">Your Clinic</h1>
      <div class="actions">
        <button v-if="isEditing" type="button" @click="cancelEditing" class="edit-btn secondary">
          Cancel
        </button>
        <button v-if="isEditing" type="submit" class="edit-btn active" :disabled="isLoading">
          Save
        </button>
        <button v-else type="button" @click="startEditing" class="edit-btn">Edit</button>
      </div>
    </header>
    <section class="clinic-info">
      <h2>Profile</h2>

      <ClinicDashboardField id="clinic--name" label="Name" v-model="clinic.name" :disabled />
      <ClinicDashboardField
        id="clinic--email"
        label="Email"
        type="email"
        v-model="clinic.email"
        :disabled
      />
      <ClinicDashboardField
        id="clinic--phone"
        label="Phone Number"
        type="tel"
        v-model="clinic.phone"
        :disabled
      />
      <ClinicDashboardField
        id="clinic--website"
        label="Website"
        type="url"
        v-model="clinic.website"
        :disabled
      />

      <h3>Location</h3>
      <ClinicDashboardField
        id="clinic--address-line1"
        label="Address Line 1"
        v-model="clinic.address_line1"
        :disabled
      />
      <ClinicDashboardField
        id="clinic--address-line2"
        label="Address Line 2"
        v-model="clinic.address_line2"
        :disabled
      />
      <ClinicDashboardField id="clinic--city" label="City" v-model="clinic.city" :disabled />
      <ClinicDashboardField
        id="clinic--province"
        label="Province"
        v-model="clinic.province"
        :disabled
      />

      <h3>Additional Information</h3>
      <ClinicDashboardField
        id="clinic--specialties"
        label="Specialties"
        v-model="specialtiesString"
        :disabled
      />
    </section>
    <section class="clinic-bookings">
      <h2>Booking & Billing</h2>

      <ClinicDashboardField
        id="clinic--booking-provider"
        label="Booking Provider"
        v-model="clinic.booking_provider"
        :disabled
      />
      <ClinicDashboardField
        id="clinic--booking-link"
        label="Booking URL"
        type="url"
        v-model="clinic.booking_url"
        :disabled
      />

      <h3>Offerings</h3>
      <ClinicDashboardField
        id="clinic--direct-billing"
        label="Offer Direct Billing"
        type="checkbox"
        v-model="clinic.offers_direct_billing"
        :disabled
      />
      <ClinicDashboardField
        id="clinic--services-in-person"
        label="In-Person Appointments"
        type="checkbox"
        v-model="servicesInPerson"
        :disabled
      />
      <ClinicDashboardField
        id="clinic--services-virtual"
        label="Virtual Appointments"
        type="checkbox"
        v-model="servicesVirtual"
        :disabled
      />

      <h3 style="margin-top: 1.5rem">Extended Details</h3>
      <ClinicDashboardField id="clinic--insurances" label="Insurances Accepted" :disabled="false">
        <div style="display: flex; flex-direction: column; text-align: right; gap: 0.5rem">
          <label
            v-for="ins in ['Sun Life', 'Manulife', 'Canada Life', 'Blue Cross', 'Green Shield']"
            :key="ins"
            style="justify-content: flex-end; gap: 0.5rem; cursor: pointer"
          >
            <span>{{ ins }}</span>
            <input
              type="checkbox"
              :value="ins"
              v-model="insurancesList"
              :disabled="disabled"
              style="width: 1.125rem; height: 1.125rem; margin: 0.25rem 0"
            />
          </label>
        </div>
      </ClinicDashboardField>

      <ClinicDashboardField
        id="clinic--hours"
        label="Opening Hours"
        :disabled="false"
        style="align-items: flex-start"
      >
        <textarea
          style="
            width: 50%;
            min-height: 80px;
            text-align: right;
            padding: 0.5rem;
            background: var(--c-bg);
            border-radius: 0.25rem;
            border: none;
            color: var(--c-text-secondary);
            resize: vertical;
            margin-top: 0;
          "
          v-model="hoursText"
          :disabled="disabled"
          placeholder="e.g. Mon-Fri: 9am - 5pm"
        ></textarea>
      </ClinicDashboardField>
    </section>
    <footer>
      <p class="last-updated">Last updated: {{ formattedDate(clinic.updated_at) }}</p>
      <p class="created-at">Created at: {{ formattedDate(clinic.created_at) }}</p>
    </footer>
  </form>
</template>

<style>
#clinic-dashboard {
  padding-block: 1.5rem;
  height: fit-content;

  display: grid;
  grid-template:
    'header header' max-content
    'info bookings' auto
    'footer footer' max-content / 1fr 1fr;
  gap: 1.125rem;

  header {
    grid-area: header;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    .title {
      font-size: 1.75rem;
      font-weight: 600;

      white-space: nowrap;
    }

    .actions {
      height: 100%;

      display: flex;
      gap: 0.5rem;

      .edit-btn {
        padding-inline: 1rem;

        background: var(--c-accent);
        border-radius: 100px;
        color: white;

        font-weight: 500;

        transition: opacity 150ms ease;

        &.secondary {
          background: none;
          border: 2px solid var(--c-separator);
          color: var(--c-text-secondary);
        }

        &.active {
          font-weight: 600;
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      }
    }
  }

  footer {
    grid-area: footer;

    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 0.25rem;

    color: var(--c-text-secondary);
  }

  section {
    padding: 1.125rem;

    background: var(--c-bg-secondary);
    border-radius: 1.125rem;
    box-shadow: 0 2px 48px hsl(0 0 0 / 0.08);

    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    h2 {
      margin-block: 0 0.25rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    h3 {
      margin-block: 0.5rem 0.125rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--c-text-secondary);
    }
  }

  .clinic-info {
    grid-area: info;
  }

  .clinic-bookings {
    grid-area: bookings;
  }

  @media (width < 768px) {
    grid-template:
      'header' auto
      'info' auto
      'bookings' auto
      'footer' auto / 1fr;

    footer {
      align-items: center;
    }
  }
}
</style>
