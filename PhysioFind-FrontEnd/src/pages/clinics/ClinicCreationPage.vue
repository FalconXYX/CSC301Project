<script setup lang="ts">
import * as API from '@/api'

const authStore = useAuthStore()
const router = useRouter()

const postalCodePattern = /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/
const provinceCodePattern = /^[A-Z]{2}$/
const phonePattern = /^(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const form = reactive({
  name: '',
  address_line1: '',
  address_line2: '',
  city: '',
  province: 'ON',
  postal_code: '',
  phone: '',
  email: '',
  website: '',
  offers_direct_billing: false,
})

const touched = reactive({
  name: false,
  address_line1: false,
  city: false,
  province: false,
  postal_code: false,
  phone: false,
  email: false,
  website: false,
})

const isSubmitting = ref(false)
const formError = ref<string | null>(null)
const formSuccess = ref<string | null>(null)

const validationErrors = computed(() => {
  const province = normalizeProvinceCode(form.province)
  const postalCode = normalizePostalCode(form.postal_code)
  const phone = form.phone.trim()
  const email = form.email.trim().toLowerCase()
  const website = form.website.trim()

  return {
    name: form.name.trim() ? '' : 'Clinic name is required.',
    address_line1: form.address_line1.trim() ? '' : 'Address line 1 is required.',
    city: form.city.trim() ? '' : 'City is required.',
    province: provinceCodePattern.test(province)
      ? ''
      : 'Province must be a 2-letter code (for example: ON).',
    postal_code: postalCodePattern.test(postalCode) ? '' : 'Enter a valid postal code.',
    phone: !phone || phonePattern.test(phone) ? '' : 'Enter a valid phone number.',
    email: !email || emailPattern.test(email) ? '' : 'Enter a valid email address.',
    website:
      !website || isValidWebsite(website)
        ? ''
        : 'Enter a valid website URL that starts with http:// or https://.',
  }
})

const isFormValid = computed(() =>
  Object.values(validationErrors.value).every((errorMessage) => !errorMessage),
)

function markTouched(field: keyof typeof touched) {
  touched[field] = true
}

function markAllTouched() {
  for (const field of Object.keys(touched) as Array<keyof typeof touched>) {
    touched[field] = true
  }
}

function normalizeProvinceCode(value: string): string {
  return value.trim().toUpperCase()
}

function normalizePostalCode(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, ' ')
}

function normalizeOptional(value: string): string | null {
  const normalized = value.trim()
  return normalized ? normalized : null
}

function isValidWebsite(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function resetForm() {
  form.name = ''
  form.address_line1 = ''
  form.address_line2 = ''
  form.city = ''
  form.province = 'ON'
  form.postal_code = ''
  form.phone = ''
  form.email = ''
  form.website = ''
  form.offers_direct_billing = false

  for (const field of Object.keys(touched) as Array<keyof typeof touched>) {
    touched[field] = false
  }
}

async function createClinic() {
  formError.value = null
  formSuccess.value = null

  form.province = normalizeProvinceCode(form.province)
  form.postal_code = normalizePostalCode(form.postal_code)
  form.email = form.email.trim().toLowerCase()

  markAllTouched()
  if (!isFormValid.value) {
    formError.value = 'Please fix the highlighted fields before creating your clinic.'
    return
  }

  isSubmitting.value = true

  try {
    const clinic = await API.createClinic({
      name: form.name.trim(),
      address_line1: form.address_line1.trim(),
      address_line2: normalizeOptional(form.address_line2),
      city: form.city.trim(),
      province: normalizeProvinceCode(form.province),
      postal_code: normalizePostalCode(form.postal_code),
      phone: normalizeOptional(form.phone),
      email: normalizeOptional(form.email),
      website: normalizeOptional(form.website),
      offers_direct_billing: form.offers_direct_billing,
    })

    await authStore.updateProfile({
      clinic_id: clinic.id,
      clinic_role: 'manager',
    })

    useToaster().success(`Clinic "${clinic.name}" was created successfully.`)
    resetForm()
  } catch (error) {
    useToaster().error('Failed to create clinic. Please try again later.')
    console.error('Error creating clinic:', error)
  } finally {
    isSubmitting.value = false
    router.push({ path: '/clinic/dashboard' })
  }
}
</script>

<template>
  <div id="clinic-creation">
    <h1 class="title">Create Clinic</h1>

    <section class="clinic-section">
      <h2 class="heading">Clinic Information</h2>
      <p class="subheading">
        Add your clinic details so your profile is ready for provider and patient experiences.
      </p>

      <form @submit.prevent="createClinic" novalidate>
        <label>
          <span>Clinic Name <span class="required">*</span></span>
          <input
            v-model="form.name"
            type="text"
            class="field"
            :class="{ invalid: touched.name && !!validationErrors.name }"
            placeholder="PhysioFind Downtown"
            autocomplete="organization"
            @blur="markTouched('name')"
          />
          <span v-if="touched.name && validationErrors.name" class="field-error">
            {{ validationErrors.name }}
          </span>
        </label>

        <label>
          <span>Address Line 1 <span class="required">*</span></span>
          <input
            v-model="form.address_line1"
            type="text"
            class="field"
            :class="{ invalid: touched.address_line1 && !!validationErrors.address_line1 }"
            placeholder="123 King St W"
            autocomplete="address-line1"
            @blur="markTouched('address_line1')"
          />
          <span v-if="touched.address_line1 && validationErrors.address_line1" class="field-error">
            {{ validationErrors.address_line1 }}
          </span>
        </label>

        <label>
          Address Line 2
          <input
            v-model="form.address_line2"
            type="text"
            class="field"
            placeholder="Suite 400"
            autocomplete="address-line2"
          />
        </label>

        <div class="field-row">
          <label>
            <span>City <span class="required">*</span></span>
            <input
              v-model="form.city"
              type="text"
              class="field"
              :class="{ invalid: touched.city && !!validationErrors.city }"
              placeholder="Toronto"
              autocomplete="address-level2"
              @blur="markTouched('city')"
            />
            <span v-if="touched.city && validationErrors.city" class="field-error">
              {{ validationErrors.city }}
            </span>
          </label>

          <label>
            <span>Province <span class="required">*</span></span>
            <input
              v-model="form.province"
              type="text"
              maxlength="2"
              class="field"
              :class="{ invalid: touched.province && !!validationErrors.province }"
              placeholder="ON"
              autocomplete="address-level1"
              @blur="
                () => {
                  form.province = normalizeProvinceCode(form.province)
                  markTouched('province')
                }
              "
            />
            <span v-if="touched.province && validationErrors.province" class="field-error">
              {{ validationErrors.province }}
            </span>
          </label>

          <label>
            <span>Postal Code <span class="required">*</span></span>
            <input
              v-model="form.postal_code"
              type="text"
              class="field"
              :class="{ invalid: touched.postal_code && !!validationErrors.postal_code }"
              placeholder="M5V 3A8"
              autocomplete="postal-code"
              @blur="
                () => {
                  form.postal_code = normalizePostalCode(form.postal_code)
                  markTouched('postal_code')
                }
              "
            />
            <span v-if="touched.postal_code && validationErrors.postal_code" class="field-error">
              {{ validationErrors.postal_code }}
            </span>
          </label>
        </div>

        <label>
          Phone
          <input
            v-model="form.phone"
            type="tel"
            class="field"
            :class="{ invalid: touched.phone && !!validationErrors.phone }"
            placeholder="(416) 555-0100"
            autocomplete="tel"
            @blur="markTouched('phone')"
          />
          <span v-if="touched.phone && validationErrors.phone" class="field-error">
            {{ validationErrors.phone }}
          </span>
        </label>

        <label>
          Email
          <input
            v-model="form.email"
            type="email"
            class="field"
            :class="{ invalid: touched.email && !!validationErrors.email }"
            placeholder="contact@clinic.ca"
            autocomplete="email"
            @blur="markTouched('email')"
          />
          <span v-if="touched.email && validationErrors.email" class="field-error">
            {{ validationErrors.email }}
          </span>
        </label>

        <label>
          Website
          <input
            v-model="form.website"
            type="url"
            class="field"
            :class="{ invalid: touched.website && !!validationErrors.website }"
            placeholder="https://clinic.ca"
            autocomplete="url"
            @blur="markTouched('website')"
          />
          <span v-if="touched.website && validationErrors.website" class="field-error">
            {{ validationErrors.website }}
          </span>
        </label>

        <label class="checkbox-field">
          <input v-model="form.offers_direct_billing" type="checkbox" />
          <span>Offers direct billing</span>
        </label>

        <button type="submit" :disabled="isSubmitting || !isFormValid">
          {{ isSubmitting ? 'Creating...' : 'Create Clinic' }}
        </button>
      </form>
    </section>
  </div>
</template>

<style>
#clinic-creation {
  align-self: center;

  max-width: min(42rem, 100%);
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

    form {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;

      margin-top: 0.5rem;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--c-text-secondary);
    }

    .field-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .required {
      color: var(--c-red);
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

    .field.invalid {
      border-color: var(--c-red);
    }

    .field-error {
      font-size: 0.75rem;
      color: var(--c-red);
      line-height: 1.33;
    }

    .checkbox-field {
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;

      color: var(--c-text);

      input[type='checkbox'] {
        width: 1rem;
        height: 1rem;
        accent-color: var(--c-accent);
      }
    }

    .form-alert {
      border-radius: 0.5rem;
      padding: 0.625rem 0.75rem;
      font-size: 0.8125rem;
      line-height: 1.4;

      &.error {
        background: oklch(55% 0.2 25 / 0.15);
        color: oklch(55% 0.2 25);
      }

      &.success {
        background: oklch(from var(--c-green) l c h / 0.15);
        color: var(--c-green);
      }
    }

    button {
      place-content: center;
      padding: 0.67rem 0.75rem;
      margin-top: 0.25rem;

      background-color: var(--c-accent);
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
    }
  }
}

@media (width <= 44rem) {
  #clinic-creation {
    .clinic-section {
      .field-row {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
