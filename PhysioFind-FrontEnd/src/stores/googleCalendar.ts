import * as API from '@/api'

export const useGoogleCalendarStore = defineStore('googleCalendar', () => {
  const isConnected = ref(false)
  const calendars = ref<{ id: string; summary: string; primary: boolean }[]>([])
  const selectedCalendarId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCalendars() {
    isLoading.value = true
    error.value = null

    try {
      calendars.value = await API.getGoogleCalendars()
      isConnected.value = true
    } catch {
      isConnected.value = false
      calendars.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function connect() {
    isLoading.value = true
    error.value = null

    try {
      const url = await API.getGoogleAuthUrl()
      window.location.href = url
    } catch {
      error.value = 'Failed to connect Google Calendar'
    } finally {
      isLoading.value = false
    }
  }

  async function disconnect() {
    isLoading.value = true
    error.value = null

    try {
      await API.disconnectGoogleCalendar()
      isConnected.value = false
      calendars.value = []
      selectedCalendarId.value = null
    } catch {
      error.value = 'Failed to disconnect Google Calendar'
    } finally {
      isLoading.value = false
    }
  }

  async function selectCalendar(calendarId: string) {
    isLoading.value = true
    error.value = null

    try {
      await API.selectGoogleCalendar(calendarId)
      selectedCalendarId.value = calendarId
    } catch {
      error.value = 'Failed to select calendar'
    } finally {
      isLoading.value = false
    }
  }

  return {
    isConnected,
    calendars,
    selectedCalendarId,
    isLoading,
    error,
    fetchCalendars,
    connect,
    disconnect,
    selectCalendar,
  }
})
