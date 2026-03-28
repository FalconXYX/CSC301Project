import { authenticatedFetch } from './client'

import type { AppointmentRequest, Busy } from '@/types/appointments'

export async function getAllUserAppointments(): Promise<AppointmentRequest[]> {
  const response = await authenticatedFetch('/api/appointments')

  if (response.status !== 200 && response.status !== 304) {
    throw new Error('Failed to get user appointments')
  }

  const data = await response.json()

  return data.appointment
}

export async function getUserAppointment(appointment_id: string): Promise<AppointmentRequest> {
  const response = await authenticatedFetch(`/api/appointments/${appointment_id}`)

  if (response.status !== 200 && response.status !== 304) {
    throw new Error('Failed to get user appointment')
  }

  const data = await response.json()

  return data.appointment
}

export async function getFreeBusy(practitioner_id: string, dateStart: string, dateEnd: string, excludeId?: string): Promise<Busy[]> {
  const payload: Record<string, string> = {
    dateStart,
    dateEnd,
    ...(excludeId ? { excludeId } : {}),
  }
  const response = await fetch(`/api/appointments/freeBusy/${practitioner_id}`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (response.status !== 200 && response.status !== 304) {
    throw new Error('Failed to get practitioner\'s schedule')
  }

  const data = await response.json()
  return data.response
}

export async function createAppointment(clinic_id: string, practitioner_id: string, preferred_start: string, preferred_end: string, status: string, meeting_type?: string): Promise<AppointmentRequest> {
  const payload = {
    clinic_id,
    practitioner_id,
    preferred_start,
    preferred_end,
    status,
    ...(meeting_type ? { meeting_type } : {}),
  }
  const response = await authenticatedFetch('/api/appointments/user', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (response.status !== 201) {
    throw new Error('Failed to create appointment')
  }
  const response2 = await authenticatedFetch('/api/appointments/practitioner', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (response2.status !== 201) {
    throw new Error('Failed to create appointment')
  }
  const data = await response.json()
  return data.appointment
}

export async function updateAppointment(appointment_id: string, clinic_id: string, practitioner_id: string, preferred_start: string, preferred_end: string, status: string ): Promise<AppointmentRequest> {
  const payload = {
    clinic_id,
    practitioner_id,
    preferred_start,
    preferred_end,
    status,
  }
  const response = await authenticatedFetch(`/api/appointments/${appointment_id}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (response.status !== 200) {
    throw new Error('Failed to create appointment')
  }
  const data = await response.json()
  return data.appointment
}

export async function deleteAppointment(appointment_id: string): Promise<string> {

  const response = await authenticatedFetch(`/api/appointments/${appointment_id}`, {
    method: "DELETE",
    headers: { 'Content-Type': 'application/json' },
  })
  if (response.status !== 200) {
    throw new Error('Failed to create delete')
  }
  const data = await response.json()
  return data.appointment
}
