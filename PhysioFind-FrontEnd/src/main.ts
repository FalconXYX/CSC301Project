import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { useAuthStore } from '@/stores/auth'

import '@/assets/css/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
await authStore.init() // restore session before mounting

app.mount('#app')
