import { createClient } from '@/lib/supabase/server'
import type { Newsletter, NewsletterSubscriber } from '@/types/app'

export async function getNewsletters(): Promise<Newsletter[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as Newsletter[]
}

export async function getNewsletterById(id: string): Promise<Newsletter | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('newsletters')
    .select('*')
    .eq('id', id)
    .single()
  return (data ?? null) as unknown as Newsletter | null
}

export async function getSubscribers(activeOnly = true): Promise<NewsletterSubscriber[]> {
  const supabase = await createClient()
  let query = supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false })
  if (activeOnly) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as NewsletterSubscriber[]
}

export async function getSubscriberCount(): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
  return count ?? 0
}
