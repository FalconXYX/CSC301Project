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
// Newly added About page
import AboutPage from '@/pages/AboutPage.vue'
import ClinicCreationPage from '@/pages/clinics/ClinicCreationPage.vue'
import ClinicDashboardPage from '@/pages/clinics/ClinicDashboardPage.vue'

import ErrorPage from '@/pages/error/ErrorPage.vue'

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
        // Account
        {
          // Route for the About page
          path: 'about',
          component: AboutPage,
        },
        {
          path: 'account',
          component: AccountPage,
          meta: { auth: 'any' },
        },
        // Clinics
        {
          path: 'clinic',
          meta: { auth: 'clinic' },
          children: [
            {
              path: 'create',
              component: ClinicCreationPage,
            },
            {
              path: 'dashboard',
              component: ClinicDashboardPage,
            },
          ],
        },
      ],
    },
    {
      path: '/auth',
      component: AuthPage,
    },
    {
      path: '/error',
      component: ErrorPage,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (!to.matched.length) {
    next({ path: '/error', query: { code: 404 } })
    return
  }

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
      next({ path: '/auth', query: { redirect: to.fullPath } })
    } else if (requiredRole !== 'any' && profile?.role !== requiredRole) {
      next({ path: '/error', query: { code: 403 } })
    } else {
      next()
    }
  } else if (to.path === '/auth' && isAuthenticated) {
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