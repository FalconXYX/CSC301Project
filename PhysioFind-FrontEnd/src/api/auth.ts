import { type SupabaseUser, type SupabaseSession } from '@/lib/supabase'
import { authenticatedFetch } from './client'

import type { CreateUserPayload, NewUserProfile, UserProfile } from '@/types/user'
import { removeEmptyFields } from '@/utils'

export async function createUser(
  email: string,
  password: string,
  profile: NewUserProfile,
): Promise<UserProfile> {
  const payload: CreateUserPayload = {
    email,
    password_hash: hashPassword(password),
    ...removeEmptyFields(profile, ['date_of_birth', 'phone', 'clinic_id', 'clinic_role']),
  }

  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  // Ensure successful creation
  if (response.status == 422) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? 'User Already Exists')
  } else if (response.status !== 201) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? 'Failed to create user')
  }

  const data = await response.json()
  if (!data || !data.user) {
    throw new Error('Invalid response from server')
  }

  return data.user
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ session: SupabaseSession; user: SupabaseUser }> {
  const payload = {
    email,
    password,
  }

  const response = await fetch('/api/auth/signIn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (response.status !== 201) {
    // TODO: Change to 200 after backend is updated
    throw new Error('Failed to sign in')
  }

  const { data } = await response.json()
  return data
}

export async function signOut(): Promise<void> {
  await authenticatedFetch('/api/auth/signOut', { method: 'POST' })
}

// MARK: Helper functions

function hashPassword(password: string): string {
  // TODO: Implement proper password hashing
  return password
}
