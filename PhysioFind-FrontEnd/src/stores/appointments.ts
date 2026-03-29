import * as API from '@/api'
import type { AppointmentRequest, Busy } from '@/types/appointments'

export const useAppointmentStore = defineStore('appointments', () => {
  const isFetching = ref(false)
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)
  const gotten = ref(false)
  const appointments = ref<AppointmentRequest[]>([])
  const appointment = ref<AppointmentRequest | null>(null)
  const appointmentId = ref<string | null>(null)
  const freeBusy = ref<Busy[] | null>(null)
  const querried = ref(true)

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

  async function fetchFreeBusy(practitionerId: string, dateStart: string, dateEnd: string, excludeId?: string) {
    isFetching.value = true
    try {
      freeBusy.value = await API.getFreeBusy(practitionerId, dateStart, dateEnd, excludeId)
      querried.value = true
    } catch {
      freeBusy.value = null
      querried.value = false
    }
    isFetching.value = false
  }

  async function createAppointment(clinicId: string, practitionerId: string, startTime: string, endTime: string, status: string, meetingType?: string) {
    isLoading.value = true

    try {
      appointment.value = await API.createAppointment(clinicId, practitionerId, startTime, endTime, status, meetingType)
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

  async function deleteAppointment(appointmentId: string): Promise<boolean> {
    isDeleting.value = true

    try {
      await API.deleteAppointment(appointmentId)
      appointments.value = appointments.value.filter(a => a.id !== appointmentId)
      return true
    } catch {
      return false
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
    freeBusy,
    querried,
    fetchAppointments,
    fetchAppointmentById,
    fetchFreeBusy,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  }
})
