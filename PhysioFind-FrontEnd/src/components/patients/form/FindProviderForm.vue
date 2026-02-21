<script setup lang="ts">
const { questions } = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits<{
  submit: [answers: FormAnswers]
}>()

const {
  currentStep,
  totalSteps,
  answers,
  currentQuestion,
  isFirstStep,
  isLastStep,
  progress,
  canAdvance,
  next,
  previous,
  submit,
} = useFindProviderForm(questions)

const slideDirection = ref<'forward' | 'backward'>('forward')

function handleNext() {
  slideDirection.value = 'forward'
  next()
}

function handlePrevious() {
  slideDirection.value = 'backward'
  previous()
}

function handleSubmit() {
  const result = submit()
  if (result) emit('submit', result)
}
</script>

<template>
  <form class="find-provider-form" @submit.prevent="handleSubmit">
    <div class="form-progress">
      <span class="step-indicator">Step {{ currentStep + 1 }} of {{ totalSteps }}</span>
      <div class="progress-bar" role="progressbar" :aria-valuenow="progress">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <div class="carousel-viewport">
      <Transition :name="`slide-${slideDirection}`">
        <FindProviderFormQuestion
          :key="currentQuestion.id"
          :question="currentQuestion"
          v-model="answers[currentQuestion.id]!"
          class="question-card"
        />
      </Transition>
    </div>

    <nav class="form-nav">
      <button v-show="!isFirstStep" type="button" class="secondary" @click="handlePrevious">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>

      <!-- Spacer -->
      <!-- <span v-show="!isFirstStep" /> -->

      <button
        v-if="!isLastStep"
        type="button"
        class="primary"
        :disabled="!canAdvance"
        @click="handleNext"
      >
        <span class="label">Next</span>
        &nbsp;
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>

      <button v-else type="submit" class="primary" :disabled="!canAdvance">
        <span class="label">Submit</span>
        &nbsp;
        <span class="material-symbols-outlined">check</span>
      </button>
    </nav>
  </form>
</template>

<style scoped>
.find-provider-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  width: 100%;
  max-width: 36rem;
  margin: 0 auto;

  min-height: calc(100dvh - var(--g-navbar-height));

  padding-block: 1.5rem;
}

.form-progress {
  max-width: 16rem;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  .step-indicator {
    font-size: 0.875rem;
    color: var(--c-text-secondary);
  }

  .progress-bar {
    align-self: center;

    width: 100%;

    height: 0.375rem;
    background: var(--c-bar);
    border-radius: 0.375rem;
    overflow: hidden;

    .progress-fill {
      min-width: 0.375rem;
      height: 100%;
      background: var(--c-accent);
      border-radius: inherit;
      transition: width 300ms ease;
    }
  }
}

/* The viewports clips the cards */
.carousel-viewport {
  --slide-distance: 25%;
  --opacity-start: 0;
  --blur-radius: 0.5rem;

  flex: 1;
  width: 100%;

  align-items: center;
  align-content: center;

  position: relative;

  display: grid;
  grid-template-columns: 1fr;

  > .question-card {
    grid-area: 1 / 1;
  }
}

/* Transitions */
:deep(.slide-forward-enter-active),
:deep(.slide-forward-leave-active),
:deep(.slide-backward-enter-active),
:deep(.slide-backward-leave-active) {
  transition: all 300ms ease;
}

/* slide-forward: next enters from right, current exits to left */
:deep(.slide-forward-enter-from) {
  transform: translateX(var(--slide-distance));
  opacity: var(--opacity-start);
  filter: blur(var(--blur-radius));
}

:deep(.slide-forward-leave-to) {
  transform: translateX(calc(-1 * var(--slide-distance)));
  opacity: var(--opacity-start);
  filter: blur(var(--blur-radius));
}

/* slide-backward: previous enters from left, current exits to right */
:deep(.slide-backward-enter-from) {
  transform: translateX(calc(-1 * var(--slide-distance)));
  opacity: var(--opacity-start);
  filter: blur(var(--blur-radius));
}

:deep(.slide-backward-leave-to) {
  transform: translateX(var(--slide-distance));
  opacity: var(--opacity-start);
  filter: blur(var(--blur-radius));
}

.form-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  button {
    display: flex;
    align-items: center;

    padding: 0.5rem 1rem;
    border-radius: 16rem;

    border: none;
    background-color: var(--c-accent);
    color: var(--c-bg);
    font-weight: 500;

    cursor: pointer;

    transition:
      background-color 150ms ease,
      color 150ms ease,
      opacity 150ms ease,
      scale 150ms ease;

    &:not(:disabled):hover {
      scale: 1.05;
    }

    &:has(span) {
      padding: 0.5rem;
    }

    &:has(.label) {
      padding-inline: 0.83rem 0.42rem;
    }

    &:disabled {
      cursor: not-allowed;
      filter: grayscale(100%);
      opacity: 0.5;
    }

    &.secondary {
      background-color: var(--c-bar);
      color: var(--c-text-secondary);
    }
  }
}
</style>
