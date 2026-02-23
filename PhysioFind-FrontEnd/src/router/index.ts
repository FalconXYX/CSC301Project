import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import NavLayout from '@/layouts/NavLayout.vue'

// Pages
import HomePage from '@/pages/HomePage.vue'
import FindProviderPage from '@/pages/patients/FindProviderPage.vue'
import ProviderResultsPage from '@/pages/patients/ProviderResultsPage.vue'

import AuthPage from '@/pages/auth/AuthPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: NavLayout,
      children: [
        { path: '', component: HomePage },
        {
          path: 'find-provider',
          children: [
            { path: '', component: FindProviderPage },
            { path: 'results', component: ProviderResultsPage, meta: { requiresAuth: true } },
          ],
        },
      ],
    },
    {
      path: '/login',
      component: AuthPage,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Wait for INITIAL_SESSION to fire before making auth decisions.
  // Without this, a page refresh sees isAuthenticated=false before the
  // onAuthStateChange listener has had a chance to restore the session.
  if (!authStore.isReady) {
    await new Promise<void>((resolve) => {
      const stop = watch(
        () => authStore.isReady,
        (ready) => {
          if (ready) {
            stop()
            resolve()
          }
        },
      )
    })
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const { isAuthenticated } = authStore

  if (requiresAuth && !isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
