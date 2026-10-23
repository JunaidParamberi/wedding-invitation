/** Saves an RSVP to Supabase. Does nothing when Supabase isn't configured. */

export interface RsvpRecord {
  name: string;
  attending: boolean;
  guests: number;
  from_where: string | null;
  message: string | null;
}

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const rsvpStorageEnabled = Boolean(url && key);

export function saveRsvp(record: RsvpRecord): Promise<boolean> {
  if (!url || !key) return Promise.resolve(false);
  // keepalive lets the request finish even while the page hands off to WhatsApp
  return fetch(`${url}/rest/v1/rsvps`, {
    method: 'POST',
    keepalive: true,
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(record),
  })
    .then((r) => r.ok)
    .catch(() => false);
}
