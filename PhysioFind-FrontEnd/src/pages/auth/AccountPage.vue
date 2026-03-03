<script setup lang="ts">
import AccountEditableCell from '@/components/auth/AccountEditableCell.vue'

type CellInstance = InstanceType<typeof AccountEditableCell>

const authStore = useAuthStore()
const profile = computed(() => authStore.profile)

const firstName = ref(profile.value?.first_name ?? '')
const lastName = ref(profile.value?.last_name ?? '')
const email = ref(profile.value?.email ?? '')

const firstNameCell = useTemplateRef<CellInstance>('firstNameCell')
const lastNameCell = useTemplateRef<CellInstance>('lastNameCell')
const emailCell = useTemplateRef<CellInstance>('emailCell')

const anyEditing = computed(
  () =>
    (firstNameCell.value?.isEditing ?? false) ||
    (lastNameCell.value?.isEditing ?? false) ||
    (emailCell.value?.isEditing ?? false),
)

const editsMade = computed(
  () =>
    (firstNameCell.value?.hasChanges ?? false) ||
    (lastNameCell.value?.hasChanges ?? false) ||
    (emailCell.value?.hasChanges ?? false),
)

async function updateAccount() {
  await authStore.updateProfile({
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
  })
}

async function signOut() {
  await authStore.signOut()
}

function deleteAccount() {
  alert('Not implemented yet!')
}

watch(
  profile,
  (newProfile) => {
    firstName.value = newProfile?.first_name ?? ''
    lastName.value = newProfile?.last_name ?? ''
    email.value = newProfile?.email ?? ''
  },
  { immediate: true },
)
</script>

<template>
  <div id="account" v-if="profile">
    <h1 class="title">Hi, {{ profile.first_name }}</h1>
    <section class="account-settings" :key="profile.updated_at">
      <h2 class="heading">Account Settings</h2>
      <p class="subheading">
        Here you can update your account information, change your password, and manage your
        preferences.
      </p>
      <form @submit.prevent="updateAccount">
        <AccountEditableCell
          ref="firstNameCell"
          title="First Name"
          type="text"
          v-model="firstName"
        />
        <AccountEditableCell ref="lastNameCell" title="Last Name" type="text" v-model="lastName" />
        <AccountEditableCell ref="emailCell" title="Email" type="email" v-model="email" />
        <button type="submit" :disabled="!editsMade || anyEditing || authStore.isLoading">
          {{ authStore.isLoading ? 'Updating...' : 'Update Account' }}
        </button>
      </form>
      <button type="button" class="secondary" @click="signOut">Sign Out</button>
    </section>
    <section class="danger-zone">
      <h2 class="heading">Danger Zone</h2>
      <p class="subheading">This action is irreversible. Please proceed with caution.</p>
      <button type="button" @click="deleteAccount">Delete Account</button>
    </section>
  </div>
</template>

<style scoped>
#account {
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

    &.danger-zone {
      --accent-color: var(--c-red);

      .heading {
        color: var(--c-red);
      }

      .subheading {
        color: oklch(from var(--c-red) l c h / 0.75);
      }
    }

    form {
      display: flex;
      flex-direction: column;

      font-size: 0.9375rem;

      label {
        display: flex;
        gap: 0.5rem;

        font-weight: 500;
        padding-block: 0.75rem;

        &:not(:last-of-type) {
          border-bottom: 0.5px solid var(--c-separator);
        }

        input {
          appearance: none;
          border: none;
          flex: 1;

          color: var(--c-text);

          outline: none;

          font-size: inherit;
          text-align: end;

          &:not(:focus),
          &:disabled {
            color: var(--c-text-secondary);
          }
        }
      }
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
