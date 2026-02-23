export interface UserProfile {
  id: string
  email: string
  phone: string | null
  role: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  clinic_id: string | null
  clinic_role: string | null
  created_at: string
  updated_at: string
}

export interface CreateUserPayload {
  email: string
  password_hash: string
  role: string
  first_name: string
  last_name: string
  phone: string | null
  date_of_birth: string | null
  clinic_id?: string
  clinic_role?: string
}

export interface NewUserProfile {
  first_name: string
  last_name: string
  date_of_birth: string | null
  role: string
  phone: string | null
  clinic_id?: string
  clinic_role?: string
}
