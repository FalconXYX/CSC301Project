<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const mode = computed(() => (route.query.mode === 'sign-up' ? 'signUp' : 'signIn'))
const role = computed(() => (route.query.role === 'clinic' ? 'clinic' : 'patient'))
const redirect = computed(() => route.query.redirect as string | undefined)

function onSignIn() {
  if (mode.value === 'signUp' && role.value === 'clinic') {
    return void router.push('/clinic/create')
  }

  router.push(redirect.value ?? '/')
}
</script>

<template>
  <AuthView @sign-in="onSignIn" :mode :role />
</template>
