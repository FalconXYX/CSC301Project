import { supabase } from '@/lib/supabase'

export * from './auth'
export * from './users'

// MARK: Helper functions

export function endpointURL(endpoint: string): string {
  return `/api${endpoint}`
}

export async function authenticatedFetch(url: string, options?: RequestInit): Promise<Response> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
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
