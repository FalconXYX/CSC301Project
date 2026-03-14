<script setup lang="ts">
const props = withDefaults(
  defineProps<{ popover?: boolean; mode?: 'signIn' | 'signUp'; role?: 'patient' | 'clinic' }>(),
  {
    popover: false,
    mode: 'signIn',
    role: 'patient',
  },
)

const emit = defineEmits<{ signIn: [] }>()

const authStore = useAuthStore()

// State

const mode = ref(props.mode) // 'signIn' or 'signUp'
const step = ref(1) // sign-up: 1 = credentials, 2 = profile info

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const dateOfBirth = ref('')

const errorMessage = ref<string | null>(null)

// Helpers

function switchMode() {
  mode.value = mode.value === 'signIn' ? 'signUp' : 'signIn'
  step.value = 1

  errorMessage.value = null
  authStore.error = null
}

function resetForm() {
  email.value = ''
  password.value = ''
  firstName.value = ''
  lastName.value = ''
  phone.value = ''
  dateOfBirth.value = ''
  errorMessage.value = null
}

// Actions

async function handleSignIn() {
  errorMessage.value = null

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  await authStore.signIn(email.value, password.value)

  if (authStore.error) {
    errorMessage.value = authStore.error
    return
  }

  resetForm()
  emit('signIn')
}

function handleSignUpContinue() {
  errorMessage.value = null

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  step.value = 2
}

async function handleSignUp() {
  errorMessage.value = null

  if (!firstName.value || !lastName.value) {
    errorMessage.value = 'Please enter your first and last name.'
    return
  }

  const newUserProfile: NewUserProfile = {
    role: props.role,
    first_name: firstName.value,
    last_name: lastName.value,
    date_of_birth: dateOfBirth.value ? new Date(dateOfBirth.value).toISOString() : undefined,
    phone: phone.value,
  }

  await authStore.signUp(email.value, password.value, newUserProfile)

  if (authStore.error) {
    errorMessage.value = authStore.error
    return
  }

  resetForm()
  emit('signIn')
}

function handleSubmit() {
  if (mode.value === 'signIn') {
    handleSignIn()
  } else if (step.value === 1) {
    handleSignUpContinue()
  } else {
    handleSignUp()
  }
}
</script>

<template>
  <div v-if="popover" class="auth-overlay">
    <div class="auth-card">
      <h2>
        {{ mode === 'signIn' ? 'Sign In' : 'Sign Up' }}
      </h2>

      <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- Step 1: credentials (always visible) -->
        <template v-if="mode === 'signIn' || step === 1">
          <label>
            Email
            <input
              v-model="email"
              type="email"
              class="field"
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              v-model="password"
              type="password"
              class="field"
              placeholder="••••••••"
              required
            />
          </label>
        </template>

        <!-- Step 2: profile info (sign-up only) -->
        <template v-if="mode === 'signUp' && step === 2">
          <label>
            First Name
            <input v-model="firstName" type="text" class="field" placeholder="Jane" required />
          </label>
          <label>
            Last Name
            <input v-model="lastName" type="text" class="field" placeholder="Doe" required />
          </label>
          <label>
            Phone Number
            <input v-model="phone" type="tel" class="field" placeholder="(416) 555-0123" />
          </label>
          <label>
            Date of Birth
            <input v-model="dateOfBirth" type="date" class="field" />
          </label>
        </template>

        <div class="auth-actions">
          <button
            v-if="mode === 'signUp' && step === 2"
            type="button"
            class="auth-btn secondary"
            @click="step = 1"
          >
            Back
          </button>
          <button type="submit" class="auth-btn primary" :disabled="authStore.isLoading">
            <template v-if="authStore.isLoading">Loading…</template>
            <template v-else-if="mode === 'signIn'">Sign In</template>
            <template v-else-if="step === 1">Continue</template>
            <template v-else>Sign Up</template>
          </button>
        </div>
      </form>

      <p class="auth-switch" v-if="role !== 'clinic'">
        <template v-if="mode === 'signIn'">
          Don't have an account? <button class="link" @click="switchMode">Sign Up</button>
        </template>
        <template v-else>
          Already have an account? <button class="link" @click="switchMode">Sign In</button>
        </template>
      </p>
    </div>
  </div>

  <div v-else id="auth-view" popover="auto" class="auth-card">
    <h2>
      {{ mode === 'signIn' ? 'Sign In' : 'Sign Up' }}
      <i v-if="mode === 'signUp' && role === 'clinic'">as Clinic</i>
    </h2>

    <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <template v-if="mode === 'signIn' || step === 1">
        <label>
          Email
          <input
            v-model="email"
            type="email"
            class="field"
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Password
          <input v-model="password" type="password" class="field" placeholder="••••••••" required />
        </label>
      </template>

      <template v-if="mode === 'signUp' && step === 2">
        <label>
          First Name
          <input v-model="firstName" type="text" class="field" placeholder="Jane" required />
        </label>
        <label>
          Last Name
          <input v-model="lastName" type="text" class="field" placeholder="Doe" required />
        </label>
        <label>
          Phone Number
          <input v-model="phone" type="tel" class="field" placeholder="(416) 555-0123" />
        </label>
        <label>
          Date of Birth
          <input v-model="dateOfBirth" type="date" class="field" />
        </label>
      </template>

      <div class="auth-actions">
        <button
          v-if="mode === 'signUp' && step === 2"
          type="button"
          class="auth-btn secondary"
          @click="step = 1"
        >
          Back
        </button>
        <button type="submit" class="auth-btn primary" :disabled="authStore.isLoading">
          <template v-if="authStore.isLoading">Loading…</template>
          <template v-else-if="mode === 'signIn'">Sign In</template>
          <template v-else-if="step === 1">Continue</template>
          <template v-else>Sign Up</template>
        </button>
      </div>
    </form>

    <p class="auth-switch" v-if="role !== 'clinic'">
      <template v-if="mode === 'signIn'">
        Don't have an account? <button class="link" @click="switchMode">Sign Up</button>
      </template>
      <template v-else>
        Already have an account? <button class="link" @click="switchMode">Sign In</button>
      </template>
    </p>
  </div>
</template>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: oklch(0% 0 0 / 0.42);
  backdrop-filter: blur(0.25rem);
  z-index: 100;
}

.auth-card {
  max-width: var(--g-card-max-width);
  width: 100%;

  background-color: var(--c-bg-secondary);
  border: 0.5px solid var(--c-separator);
  border-radius: 1.5rem;
  box-shadow: 0 2px 2rem hsl(0 0% 0% / 0.08);
  padding: 2rem;

  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Popover centering */
#auth-view[popover] {
  margin: auto;
}

h2 {
  font-family: var(--f-serif);
  font-size: 1.5rem;

  i {
    font: italic 0.75em/1 var(--f-body);
    color: var(--c-text-secondary);
  }
}

.auth-error {
  background: oklch(55% 0.2 25 / 0.15);
  color: oklch(55% 0.2 25);
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--c-text-secondary);
}

.field {
  all: unset;
  background: var(--c-fill);
  border: 1px solid var(--c-separator);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--c-text);
  font-family: var(--f-body);
  transition: border-color 0.15s;
}

.field:focus {
  border-color: var(--c-accent);
}

.auth-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.auth-btn {
  all: unset;
  cursor: pointer;
  user-select: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  transition: opacity 0.15s;
  flex: 1;
}

.auth-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-btn.primary {
  background: var(--c-accent);
  color: var(--c-bg);
}

.auth-btn.secondary {
  background: var(--c-fill);
  border: 1px solid var(--c-separator);
  color: var(--c-text);
}

.auth-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.auth-switch {
  font-size: 0.8125rem;
  color: var(--c-text-secondary);
  text-align: center;
}

.link {
  all: unset;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  color: var(--c-text);
  font-weight: 500;
}
</style>
