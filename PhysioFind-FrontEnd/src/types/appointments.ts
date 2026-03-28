export interface AppointmentRequest {
  id: string,
  patient_user_id: string,
  clinic_id: string,
  practitioner_id: string | null,
  preferred_start: string | null,
  preferred_end: string | null,
  constraints_json: string | null,
  status: string,
  google_event_id: string | null,
  created_at: string,
  updated_at: string
}

export interface FreeBusyResponse {
  busy: Busy[]
}

export interface Busy {
  start: string,
  end: string,
}
