import { createClient } from '@supabase/supabase-js'

export type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
