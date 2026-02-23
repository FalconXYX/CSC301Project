<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const redirect = route.query.redirect as string | undefined

function onSignIn() {
  router.push(redirect ?? '/')
}
</script>

<template>
  <AuthView @sign-in="onSignIn" />
</template>
