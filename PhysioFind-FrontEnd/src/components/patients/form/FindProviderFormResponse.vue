<script setup lang="ts">
const { question } = defineProps<{
  question: Question
}>()

const model = defineModel<FormAnswerValue>({ required: true })

// Computed wrapper for text inputs that need uppercase transformation
const textModel = computed({
  get: () => (typeof model.value === 'string' ? model.value : ''),
  set: (v: string) => {
    model.value = question.type === 'text' ? v.toUpperCase() : v
  },
})

const isPatternInvalid = computed(() => {
  if (question.type !== 'text' || !question.validation?.pattern) return false

  const val = textModel.value
  return val.length > 0 && !new RegExp(question.validation.pattern).test(val)
})
</script>

<template>
  <div class="response-area" role="group" :aria-labelledby="`question-${question.id}`">
    <template v-if="question.type === 'multi-select'">
      <label
        v-for="option in question.options"
        :key="option.value"
        :for="`${question.id}-${option.value}`"
        class="select-option bordered"
      >
        <input
          type="checkbox"
          :id="`${question.id}-${option.value}`"
          :value="option.value"
          v-model="model"
        />
        {{ option.label }}
      </label>
    </template>
    <template v-else-if="question.type === 'radio'">
      <label
        v-for="option in question.options"
        :key="option.value"
        :for="`${question.id}-${option.value}`"
        class="select-option bordered"
      >
        <input
          type="radio"
          :id="`${question.id}-${option.value}`"
          :name="`response-${question.id}`"
          :value="option.value"
          v-model="model"
        />
        {{ option.label }}
      </label>
    </template>
    <template v-else>
      <input
        type="text"
        :id="`${question.id}-text`"
        class="text-input bordered"
        :class="{ invalid: isPatternInvalid }"
        :placeholder="question.placeholder"
        :pattern="question.validation?.pattern"
        v-model="textModel"
      />
    </template>
  </div>
</template>

<style scoped>
.response-area {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    cursor: pointer;
  }

  .bordered {
    padding: 0.75rem;
    border: 1.5px solid var(--c-separator);
    border-radius: 0.75rem;

    transition: border-color 150ms ease;

    &:hover {
      border-width: 2px;
      border-color: var(--c-text-secondary);
    }
  }

  .select-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    padding: 1rem;

    &:has(input:checked) {
      border-color: var(--c-accent);
    }

    input {
      width: 1.25rem;
      height: 1.25rem;

      accent-color: var(--c-accent);
    }
  }

  .text-input {
    font-size: 1rem;
  }
}
</style>
