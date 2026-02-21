import { createClient } from '@/lib/supabase/server'

/**
 * Read a single site setting by key.
 * Returns an empty string if the key does not exist.
 * Safe to call from public server components — site_settings has an anon read policy.
 */
export async function getSetting(key: string): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()
  return (data?.value as string | null | undefined) ?? ''
}
