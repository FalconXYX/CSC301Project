import { authenticatedFetch } from './client'

import type { UserProfile } from '@/types/user'

export async function getProfile(): Promise<UserProfile> {
  const response = await authenticatedFetch('/api/users')

  if (response.status !== 200) {
    throw new Error('Failed to fetch profile')
  }

  const data = await response.json()
  if (!data || !data.user) {
    throw new Error('Invalid response from server')
  }

  return data.user
}

export async function updateProfile(payload: Partial<UserProfile>): Promise<void> {
  const response = await authenticatedFetch('/api/users', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

  if (response.status !== 200) {
    throw new Error('Failed to update profile')
  }
}

export async function deleteAccount(): Promise<void> {
  const response = await authenticatedFetch('/api/users', { method: 'DELETE' })

  if (response.status !== 200) {
    throw new Error('Failed to delete account')
  }
}
