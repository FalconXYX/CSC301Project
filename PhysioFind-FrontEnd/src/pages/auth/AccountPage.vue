<script setup lang="ts">
import { toDateString } from '@/utils'

const authStore = useAuthStore()
const googleStore = useGoogleCalendarStore()

const profile = computed(() => authStore.profile)

const firstName = ref(profile.value?.first_name ?? '')
const lastName = ref(profile.value?.last_name ?? '')
const email = ref(profile.value?.email ?? '')
const dateOfBirth = ref(toDateString(profile.value?.date_of_birth || ''))

const selectedCalendarId = ref(profile.value?.google_calendar_id ?? '')

const hasChanges = computed(
  () =>
    firstName.value !== profile.value?.first_name ||
    lastName.value !== profile.value?.last_name ||
    email.value !== profile.value?.email ||
    dateOfBirth.value !== toDateString(profile.value?.date_of_birth || ''),
)

async function updateAccount() {
  await authStore.updateProfile({
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    date_of_birth: dateOfBirth.value ? toDateString(dateOfBirth.value) : undefined,
  })
}

async function signOut() {
  await authStore.signOut()
}

onMounted(async () => {
  await googleStore.fetchCalendars()
})

watch(
  profile,
  (newProfile) => {
    firstName.value = newProfile?.first_name ?? ''
    lastName.value = newProfile?.last_name ?? ''
    email.value = newProfile?.email ?? ''
    dateOfBirth.value = newProfile?.date_of_birth ? toDateString(newProfile.date_of_birth) : ''
  },
  { immediate: true },
)

watch(
  selectedCalendarId,
  async (newCalendarId) => {
    if (newCalendarId) {
      await authStore.updateProfile({ google_calendar_id: newCalendarId })
    }
  },
  { immediate: true },
)
</script>

<template>
  <main id="account-page" class="content-lanes">
    <header v-if="profile">
      <h2 class="title">Hello, {{ profile.first_name }}</h2>
    </header>
    <div v-if="profile" class="user-profile">
      <section id="user-info">
        <form @submit.prevent="updateAccount" class="profile-form">
          <h3 class="title">Your Information</h3>
          <label>
            <span class="label">First Name</span>
            <input v-model="firstName" type="text" required />
          </label>
          <label>
            <span class="label">Last Name</span>
            <input v-model="lastName" type="text" required />
          </label>
          <label>
            <span class="label">Email</span>
            <input v-model="email" type="email" required />
          </label>
          <label>
            <span class="label">Date of Birth</span>
            <input v-model.lazy="dateOfBirth" type="date" />
          </label>
          <div class="action-row">
            <button type="submit" class="action-btn bordered" :disabled="!hasChanges">
              Update Profile
            </button>
            <button type="button" class="action-btn bordered secondary" @click="signOut">
              Sign Out
            </button>
          </div>
        </form>
      </section>
      <section id="connections">
        <h3 class="title">Connected Accounts</h3>
        <ul class="connections-list">
          <li class="connection-item">
            <span class="label">Google Calendar</span>
            <div class="status-box">
              <span v-if="googleStore.isConnected" class="indicator connected">Connected</span>
              <span v-else class="indicator not-connected">Not Connected</span>
              <div v-if="googleStore.calendars.length > 0" class="calendar-select">
                <select v-model="selectedCalendarId">
                  <option disabled selected value="">Select Calendar</option>
                  <option
                    v-for="calendar in googleStore.calendars"
                    :key="calendar.id"
                    :value="calendar.id"
                  >
                    {{ calendar.summary }}
                  </option>
                </select>
              </div>
              <button v-else class="connect-btn" @click="googleStore.connect">Connect</button>
            </div>
          </li>
          <!-- Future connections can be added here -->
        </ul>
      </section>
    </div>
    <template v-else>
      <p class="loading">Loading your account...</p>
    </template>
  </main>
</template>

<style>
@scope (#account-page) {
  header {
    padding-block: calc(5rem + var(--g-navbar-height)) 5rem;
  }

  .label {
    font-size: 1rem;
    font-weight: 500;
    color: var(--c-secondary);
  }

  .user-profile {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5rem 3rem;

    #user-info {
      .profile-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        input[type='text'],
        input[type='email'],
        input[type='date'] {
          all: unset;

          height: 2.5rem;
          padding-inline: 1rem;

          background: var(--c-fill);
          border: 1px solid var(--c-separator);
          border-radius: calc(1.25rem + 1px);

          font-size: 1rem;
          color: var(--c-primary);

          display: flex;
          align-items: center;

          transition: border-color 0.15s;

          cursor: text;
        }

        input[type='text']:focus,
        input[type='email']:focus,
        input[type='date']:focus {
          border-color: var(--c-accent);
        }

        .action-row {
          margin-block-start: 0.75rem;

          display: flex;
          gap: 0.75rem;
        }
      }
    }

    #connections {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .connections-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .connection-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          .status-box {
            padding: 0.5rem 1rem;

            background: var(--c-fill);
            border: 1px solid var(--c-separator);
            border-radius: calc(1.25rem + 1px);

            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1.5rem;
          }

          .indicator {
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;

            display: flex;
            align-items: center;
            gap: 0.75rem;

            &::before {
              content: '';
              width: 0.5rem;
              height: 0.5rem;
              border-radius: 50%;
              background-color: currentColor;
            }

            &.connected {
              color: var(--c-green);
            }

            &.not-connected {
              color: var(--c-secondary);
            }
          }

          .calendar-select {
            display: flex;
            align-items: center;
            gap: 0.375rem;

            font-size: 0.875rem;

            &::after {
              content: '\203A';
              display: inline-block;
              font-size: 1em;
              color: var(--c-secondary);
            }

            select {
              margin: 0;
              background: none;
              border: none;
              outline: none;
              appearance: none;

              font-size: 1em;
              text-align-last: right;
              text-transform: none;

              transition: opacity 150ms ease;

              &:hover {
                opacity: 0.75;
                cursor: pointer;
              }
            }
          }

          .connect-btn {
            font-weight: 500;
            color: var(--c-accent);

            transition: opacity 150ms;

            &:hover {
              opacity: 0.83;
            }
          }
        }
      }
    }
  }

  .loading {
    place-self: center;
    padding-block: calc(5rem + var(--g-navbar-height)) 5rem;

    font-size: 1.25rem;
    line-height: 1.4;
    text-wrap: balance;
    color: var(--c-secondary);
  }
}
</style>
