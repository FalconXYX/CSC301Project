<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    const requiresAuth = router.currentRoute.value.matched.some((r) => r.meta.requiresAuth)
    if (!isAuthenticated && requiresAuth) {
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
