<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated, wasAuthenticated) => {
    const requiresAuth = router.currentRoute.value.matched.some((r) => r.meta.auth != null)
    if (wasAuthenticated && !isAuthenticated && requiresAuth) {
      router.push({ path: '/login' })
    }
  },
)

onUnmounted(() => {
  authStore.dispose()
})
</script>

<template>
  <RouterView />
  <GlobalToast />
</template>
