import { authenticatedFetch } from './client'

import type { ClinicRecord, CreateClinicPayload } from '@/types/providers'

export async function createClinic(payload: CreateClinicPayload): Promise<ClinicRecord> {
  const response = await authenticatedFetch('/api/clinics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (response.status !== 201) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? 'Failed to create clinic')
  }

  const data = await response.json().catch(() => null)
  if (!data || !data.clinic) {
    throw new Error('Invalid response from server')
  }

  return data.clinic
}
