import { authenticatedFetch, endpointURL } from '.'

import type { CreateUserPayload, NewUserProfile, UserProfile } from '@/types/user'
import type { User, Session } from '@supabase/supabase-js'

export async function createUser(
  email: string,
  password: string,
  profile: NewUserProfile,
): Promise<UserProfile> {
  const endpoint = endpointURL('/users')
  const payload: CreateUserPayload = {
    email,
    password_hash: hashPassword(password),
    ...profile,
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  console.log(response.status, response.bodyUsed, response.body)

  // Ensure successful creation
  if (response.status !== 201) {
    throw new Error('Failed to create user')
  }

  return await response.json()
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ session: Session; user: User }> {
  const endpoint = endpointURL('/auth/signIn')
  const payload = {
    email,
    password,
  }

  const response = await fetch(endpoint, {
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
  const endpoint = endpointURL('/auth/signOut')
  await authenticatedFetch(endpoint, { method: 'POST' })
}

// MARK: Helper functions

function hashPassword(password: string): string {
  // TODO: Implement proper password hashing
  return password
}
