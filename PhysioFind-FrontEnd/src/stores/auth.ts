import { supabase, type SupabaseSession, type SupabaseUser } from '@/lib/supabase'

import * as API from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<SupabaseUser | null>(null)
  const session = ref<SupabaseSession | null>(null)
  const profile = ref<UserProfile | null>(null)

  const isReady = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  let authSubscription: ReturnType<typeof supabase.auth.onAuthStateChange> | null = null

  // Restore session on app load and listen for auth state changes.
  // onAuthStateChange fires immediately with INITIAL_SESSION.
  // All state updates are centralized here — action functions only perform
  // API calls and sync the Supabase session; the listener handles the rest.
  function init() {
    authSubscription = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null

      if (user.value) {
        profile.value = await API.getProfile()
      } else {
        profile.value = null
      }

      isReady.value = true
    })
  }

  function dispose() {
    authSubscription?.data.subscription.unsubscribe()
    authSubscription = null
  }

  async function signIn(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await API.signIn(email, password)
      await supabase.auth.setSession(response.session)
    } catch (err) {
      error.value = (err as Error).message ?? 'An error occurred during sign in'
    } finally {
      isLoading.value = false
    }
  }

  async function signOut() {
    isLoading.value = true
    error.value = null

    try {
      await API.signOut()
      await supabase.auth.signOut()
    } catch (err) {
      error.value = (err as Error).message ?? 'An error occurred during sign out'
    } finally {
      isLoading.value = false
    }
  }

  async function signUp(email: string, password: string, profileData: NewUserProfile) {
    isLoading.value = true
    error.value = null

    try {
      await API.createUser(email, password, profileData)

      // Sign in after successful sign up — the listener handles state updates
      const response = await API.signIn(email, password)
      await supabase.auth.setSession(response.session)
    } catch (err) {
      error.value = (err as Error).message ?? 'An error occurred during sign up'
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user.value) {
      error.value = 'No authenticated user'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      await API.updateProfile(updates)
      profile.value = await API.getProfile()
    } catch (err) {
      error.value = (err as Error).message ?? 'An error occurred while updating profile'
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    session,
    profile,
    isAuthenticated,
    isReady,
    isLoading,
    error,
    init,
    dispose,
    signIn,
    signOut,
    signUp,
    updateProfile,
  }
})
