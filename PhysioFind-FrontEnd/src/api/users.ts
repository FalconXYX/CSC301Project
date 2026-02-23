import { authenticatedFetch, endpointURL } from '.'

import type { UserProfile } from '@/types/user'

export async function getProfile(): Promise<UserProfile> {
  const endpoint = endpointURL('/users')
  const response = await authenticatedFetch(endpoint)

  if (response.status !== 200) {
    throw new Error('Failed to fetch profile')
  }

  return await response.json()
}

export async function updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
  const endpoint = endpointURL('/users')
  const response = await authenticatedFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

  if (response.status !== 200) {
    throw new Error('Failed to update profile')
  }

  return await response.json()
}

export async function deleteAccount(): Promise<void> {
  const endpoint = endpointURL('/users')
  const response = await authenticatedFetch(endpoint, { method: 'DELETE' })

  if (response.status !== 200) {
    throw new Error('Failed to delete account')
  }
}
