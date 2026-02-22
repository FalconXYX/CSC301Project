import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import NavLayout from '@/layouts/NavLayout.vue'

// Pages
import HomePage from '@/pages/HomePage.vue'
import FindProviderPage from '@/pages/patients/FindProviderPage.vue'
import ProviderResultsPage from '@/pages/patients/ProviderResultsPage.vue'

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
            { path: 'results', component: ProviderResultsPage },
          ],
        },
      ],
    },
  ],
})

export default router
