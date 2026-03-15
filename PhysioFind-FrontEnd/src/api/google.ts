import { authenticatedFetch } from './client'

export async function getGoogleAuthUrl(): Promise<string> {
  const response = await authenticatedFetch('/api/google/auth-url')

  if (response.status !== 200) {
    throw new Error('Failed to get Google auth URL')
  }

  const data = await response.json()
  return data.url
}

export async function getGoogleCalendars(): Promise<{ id: string; summary: string; primary: boolean }[]> {
  const response = await authenticatedFetch('/api/google/calendars')

  if (response.status !== 200) {
    throw new Error('Failed to fetch calendars')
  }

  const data = await response.json()
  return data.calendars
}

export async function selectGoogleCalendar(calendarId: string): Promise<void> {
  const response = await authenticatedFetch('/api/google/calendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ calendarId }),
  })

  if (response.status !== 200) {
    throw new Error('Failed to select calendar')
  }
}

export async function disconnectGoogleCalendar(): Promise<void> {
  const response = await authenticatedFetch('/api/google/disconnect', { method: 'DELETE' })

  if (response.status !== 200) {
    throw new Error('Failed to disconnect Google Calendar')
  }
}
