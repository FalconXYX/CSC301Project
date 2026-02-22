import { createClient } from '@supabase/supabase-js'
import type { User, Session, AuthError } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  // Restore session on app load
  async function init() {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user || null

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user || null
    })
  }

  async function signIn(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err

      session.value = data.session
      user.value = data.user
    } catch (err) {
      error.value = (err as AuthError).message ?? 'An error occurred during sign in'
    } finally {
      isLoading.value = false
    }
  }

  async function signUp(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase.auth.signUp({ email, password })
      if (err) throw err

      session.value = data.session
      user.value = data.user
    } catch (err) {
      error.value = (err as AuthError).message ?? 'An error occurred during sign up'
    } finally {
      isLoading.value = false
    }
  }

  async function signOut() {
    isLoading.value = true
    error.value = null

    try {
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err

      session.value = null
      user.value = null
    } catch (err) {
      error.value = (err as AuthError).message ?? 'An error occurred during sign out'
    } finally {
      isLoading.value = false
    }
  }

  return { user, session, isLoading, error, isAuthenticated, init, signIn, signUp, signOut }
})
