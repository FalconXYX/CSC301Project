import type { Clinic, VerifiedClinic } from '../components/patients/types';

// Define the type of clinic returned by the Express API.
interface PublicClinicFromApi {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  province: string;
  postal_code: string;
  latitude?: number | null;
  longitude?: number | null;
  booking_provider?: string | null;
  booking_url?: string | null;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '') || 'http://localhost:3000';

export async function getVerifiedClinics(limit = 20, offset = 0): Promise<VerifiedClinic[]> {
  const url = `${API_BASE}/clinics/public?limit=${limit}&offset=${offset}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch verified clinics: ${res.status}`);
  const { clinics } = await res.json() as { clinics: PublicClinicFromApi[] };

  // Convert API fields to the front‑end VerifiedClinic shape.
  return clinics.map((c): VerifiedClinic => ({
    id: c.id,
    type: 'verified',
    name: c.name,
    address: {
      line1: c.address_line1,
      line2: c.address_line2 ?? '',
      city: c.city,
      province: c.province,
      postalCode: c.postal_code
    },
    contact: {
      phone: c.phone ?? undefined,
      email: c.email ?? undefined,
      website: c.website ?? undefined
    },
    services: [] // populate with real services when available
  }));
}
