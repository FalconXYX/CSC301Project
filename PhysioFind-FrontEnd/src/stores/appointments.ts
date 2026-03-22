import * as API from '@/api'
import type { AppointmentRequest } from '@/types/appointments'

export const useAppointmentStore = defineStore('appointments', () => {
  const isFetching = ref(false)
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)
  const gotten = ref(false)
  const appointments = ref<AppointmentRequest[]>([])
  const appointment = ref<AppointmentRequest | null>(null)
  const appointmentId = ref<string | null>(null)

  async function fetchAppointments() {
    isFetching.value = true
    try {
      appointments.value = await API.getAllUserAppointments()
    } catch {
      appointments.value = []
    } finally {
      isFetching.value = false
    }

  }

  async function fetchAppointmentById(appointmentId: string) {
    isFetching.value = true
    gotten.value = true
    try {
      appointment.value = await API.getUserAppointment(appointmentId)
      gotten.value = true
    } catch {
      appointment.value = null
      gotten.value = false
    }
    isFetching.value = false
  }

  async function createAppointment(clinicId: string, practitionerId: string, startTime: string, endTime: string, status: string) {
    isLoading.value = true

    try {
      appointment.value = await API.createAppointment(clinicId, practitionerId, startTime, endTime, status)
    } catch {

    } finally {
      isLoading.value = false
    }
  }

  async function updateAppointment(appointmentId: string, clinicId: string, practitionerId: string, startTime: string, endTime: string, status: string) {
    isUpdating.value = true

    try {
      appointment.value = await API.updateAppointment(appointmentId, clinicId, practitionerId, startTime, endTime, status)
    } catch {

    } finally {
      isUpdating.value = false
    }
  }

  async function deleteAppointment(appointmentId: string) {
    isDeleting.value = true

    try {
      appointmentId = await API.deleteAppointment(appointmentId)
    } catch {

    } finally {
      isDeleting.value = false
    }
  }

  return {
    isFetching,
    isLoading,
    isUpdating,
    isDeleting,
    gotten,
    appointments,
    appointment,
    appointmentId,
    fetchAppointments,
    fetchAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  }
})
