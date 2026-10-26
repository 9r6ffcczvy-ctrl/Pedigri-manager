import { createBrowserClient } from '@supabase/ssr'

// PEDIGRI Manager uses this existing Supabase project.
const projectUrl = 'https://ohtmstjrxgbtldwuoleh.supabase.co'

export function supabase() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!key) {
    throw new Error('Falta configurar la clave publicable de Supabase en las variables de compilación de Cloudflare.')
  }
  return createBrowserClient(projectUrl, key)
}
