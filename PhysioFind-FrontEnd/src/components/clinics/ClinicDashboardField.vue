<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'

withDefaults(
  defineProps<{
    id: string
    label: string
    type?: InputTypeHTMLAttribute
    disabled: boolean
    placeholder?: string
  }>(),
  {
    type: 'text',
    disabled: false,
    placeholder: '(none)',
  },
)

const model = defineModel<string | boolean | null>({ required: true })
</script>

<template>
  <label :for="id">
    <span>{{ label }}</span>
    <input :id :type :placeholder :disabled v-model="model" />
  </label>
</template>

<style scoped>
label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  span {
    font-weight: 500;
    max-lines: 1;
    white-space: nowrap;
  }
}

input[type='text'],
input[type='email'],
input[type='tel'],
input[type='url'] {
  all: unset;
  text-align: right;
  display: block;
  width: 50%;

  padding: 0.25rem 0.5rem;
  background: var(--c-bg);
  border-radius: 0.25rem;

  color: var(--c-text-secondary);
  cursor: text;

  transition: background 150ms ease;
}

input[type='checkbox'] {
  width: 1.125rem;
  height: 1.125rem;
  margin: 0.25rem 0.5rem;
}

input:disabled {
  background: none;
  cursor: not-allowed;
}
</style>
