import { createClient } from '@/lib/supabase/server'
import type { Download } from '@/types/app'

// The `downloads` table is added via migration 010. Cast to `any` to bypass
// the stale auto-generated types until `supabase gen types` is re-run.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = (sb: any) => sb.from('downloads')

/** Published downloads for the public page — build-safe. */
export async function getPublishedDownloads(): Promise<Download[]> {
  try {
    const supabase = await createClient()
    const { data } = await table(supabase)
      .select('*')
      .eq('published', true)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    return (data ?? []) as Download[]
  } catch {
    return []
  }
}

/** All downloads (including drafts) for the admin panel. */
export async function getAllDownloads(): Promise<Download[]> {
  const supabase = await createClient()
  const { data, error } = await table(supabase)
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) {
    // Table may not exist yet (migration 010 pending) — surface a clear message.
    const msg = (error as { message?: string }).message ?? ''
    if (msg.includes('relation') && msg.includes('does not exist')) {
      throw new Error(
        'The downloads table does not exist. Please run migration 010 in the Supabase SQL Editor.',
      )
    }
    throw error
  }
  return (data ?? []) as Download[]
}
