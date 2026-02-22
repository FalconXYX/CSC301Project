<script setup lang="ts">
const { question } = defineProps<{
  question: Question
}>()

const answer = defineModel<FormAnswerValue>({ required: true })
</script>

<template>
  <fieldset class="question-card">
    <legend :id="`question-${question.id}`">
      {{ question.prompt }}
    </legend>
    <p class="question-prompt" aria-hidden="true">{{ question.prompt }}</p>
    <FindProviderFormResponse :question="question" v-model="answer" />
  </fieldset>
</template>

<style scoped>
.question-card {
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  position: relative;

  background-color: var(--c-bg-secondary);
  border: none;
  border-radius: 2rem;
  padding: 1.75rem 2.5rem 2.5rem;

  legend:not(:focus):not(:active) {
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    width: 1px;
    height: 1px;
    white-space: nowrap;
  }

  .question-prompt {
    display: block;

    max-width: 36rem;
    text-wrap: pretty;

    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
  }
}
</style>
