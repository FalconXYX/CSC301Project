<script setup lang="ts">
import { questions as qs } from '@/data/find-provider-questionnaire.json'

const router = useRouter()

const questions = qs as Question[]

function onFormSubmit(answers: QuestionnaireAnswers) {
  console.log('Form submitted with answers:', answers)

  // Navigate to results page with postal code as query parameter
  router.push({ path: '/find-provider/results', query: { postalCode: answers['location'] } })
}
</script>

<template>
  <section id="questionnaire">
    <FindProviderForm :questions="questions" @submit="onFormSubmit" />
  </section>
</template>

<style scoped>
#questionnaire {
  display: grid;
  place-items: stretch;
}
</style>
