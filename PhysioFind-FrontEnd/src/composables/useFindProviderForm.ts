export type FormAnswerValue = string | string[]

export type FormAnswers = Record<string, FormAnswerValue>

function getDefaultValue(question: Question): FormAnswerValue {
  return question.type === 'multi-select' ? [] : ''
}

function isAnswered(question: Question, value: FormAnswerValue | null): boolean {
  if (question.type === 'multi-select') {
    return Array.isArray(value) && value.length > 0
  }

  if (question.type === 'text' && question.validation?.pattern) {
    return typeof value === 'string' && new RegExp(question.validation.pattern).test(value)
  }

  return typeof value === 'string' && value.trim() !== ''
}

export function useFindProviderForm(questions: Question[]) {
  const currentStep = ref(0)
  const answers = reactive<FormAnswers>(
    Object.fromEntries(questions.map((q) => [q.id, getDefaultValue(q)])),
  )

  const totalSteps = questions.length
  const currentQuestion = computed(() => questions[currentStep.value]!)
  const isFirstStep = computed(() => currentStep.value === 0)
  const isLastStep = computed(() => currentStep.value === totalSteps - 1)
  const progress = computed(() => (currentStep.value / (totalSteps - 1)) * 100)

  const canAdvance = computed(
    () =>
      currentQuestion.value &&
      isAnswered(currentQuestion.value, answers[currentQuestion.value.id] ?? null),
  )

  function next() {
    if (canAdvance.value && !isLastStep.value) {
      currentStep.value += 1
    }
  }

  function previous() {
    if (!isFirstStep.value) {
      currentStep.value -= 1
    }
  }

  function submit() {
    if (!canAdvance.value) return null
    // Return plain copy so consumers don't get a reactive object
    return { ...answers }
  }

  return {
    currentStep: readonly(currentStep),
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
  }
}
