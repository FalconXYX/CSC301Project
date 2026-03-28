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
  <main id="auth">
    <div class="splash-wrapper">
      <img src="/images/auth-splash.jpg" alt="Welcome to PhysioFind" class="splash-image" />
    </div>
    <AuthView @sign-in="onSignIn" :mode :role id="auth-view" />
  </main>
</template>

<style>
#auth {
  display: grid;
  grid-template-columns: auto minmax(calc(var(--g-card-max-width) + 6rem), 1fr);
  align-items: center;
  height: 100dvh;

  .splash-wrapper {
    position: relative;
    height: 100%;

    &::after {
      content: '';

      position: absolute;
      inset: 0;

      background: oklch(from var(--c-bg) l c h / calc(0.33 + var(--opacity-diff, 0)));

      z-index: 2;
    }

    @media (prefers-color-scheme: dark) {
      --opacity-diff: 0.25;
    }
  }

  .splash-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  #auth-view {
    padding: 3rem;
    max-width: 100%;
  }
}
</style>
