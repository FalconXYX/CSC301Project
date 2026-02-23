import { useAuthStore } from '@/stores/auth'

/**
 * Fetch wrapper that attaches the current session's access token.
 * Reads the token from the auth store (already validated via onAuthStateChange)
 * instead of calling supabase.auth.getSession() which only reads local storage.
 */
export async function authenticatedFetch(url: string, options?: RequestInit): Promise<Response> {
  const { session } = useAuthStore()
  if (!session) {
    throw new Error('No active session')
  }

  const optionsWithAuth: RequestInit = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${session.access_token}`,
    },
  }

  return await fetch(url, optionsWithAuth)
}
