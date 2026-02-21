'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

/** Singleton browser client — safe to call in Client Components */
export function createClient() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error(
        'Missing Supabase env vars. Copy .env.example to .env.local and fill in your project URL and anon key.',
      )
    }
    client = createBrowserClient<Database>(url, key)
  }
  return client
}
