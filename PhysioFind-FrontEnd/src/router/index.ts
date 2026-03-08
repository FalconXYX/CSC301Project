import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import NavLayout from '@/layouts/NavLayout.vue'

// Pages
import HomePage from '@/pages/HomePage.vue'
import FindProviderPage from '@/pages/patients/FindProviderPage.vue'
import ProviderResultsPage from '@/pages/patients/ProviderResultsPage.vue'
import AccountPage from '@/pages/auth/AccountPage.vue'
import AuthPage from '@/pages/auth/AuthPage.vue'
import PatientsValuePage from '@/pages/patients/PatientsValuePage.vue'

const AUTH_ROLES = ['admin', 'clinic', 'patient', 'any'] as const

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
            { path: 'results', component: ProviderResultsPage, meta: { auth: 'any' } },
          ],
        },
        {
          path: 'patients',
          component: PatientsValuePage,
        },
        {
          path: 'account',
          component: AccountPage,
          meta: { auth: 'any' },
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

  const requiredRole = to.matched.find((record) => record.meta.auth)?.meta.auth
  const { profile, isAuthenticated } = authStore

  if (requiredRole) {
    if (!isAuthenticated) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else if (requiredRole !== 'any' && profile?.role !== requiredRole) {
      next('/')
    } else {
      next()
    }
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

declare module 'vue-router' {
  interface RouteMeta {
    auth?: (typeof AUTH_ROLES)[number]
  }
}

export default router
