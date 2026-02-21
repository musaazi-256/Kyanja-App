'use server'

import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/rbac/check'
import { composeNewsletterSchema } from '@/lib/validations/newsletter'
import { ok, fail } from '@/lib/utils/response'
import { ValidationError } from '@/lib/utils/errors'
import type { ActionResult } from '@/types/app'
import { revalidatePath } from 'next/cache'

export async function saveNewsletterDraft(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const profile = await requirePermission('newsletter:compose')

    const raw = Object.fromEntries(formData.entries())
    const result = composeNewsletterSchema.safeParse(raw)
    if (!result.success) {
      throw new ValidationError('Please fix errors', result.error.flatten().fieldErrors)
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('newsletters')
      .insert({ ...result.data, status: 'draft', created_by: profile.id })
      .select('id')
      .single()

    if (error || !data) throw error

    revalidatePath('/dashboard/newsletter')
    return ok({ id: data.id }, 'Draft saved')
  } catch (err) {
    return fail(err)
  }
}

export async function sendNewsletter(
  newsletterId: string,
): Promise<ActionResult<void>> {
  try {
    await requirePermission('newsletter:send')
    const supabase = await createClient()

    // Fetch newsletter
    const { data: newsletter, error: nlError } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', newsletterId)
      .single()

    if (nlError || !newsletter) throw new Error('Newsletter not found')
    const nl = newsletter as unknown as import('@/types/app').Newsletter
    if (nl.status !== 'draft') throw new Error('Newsletter has already been sent')

    // Fetch active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('is_active', true)

    if (subError) throw subError

    const recipientCount = subscribers?.length ?? 0
    if (recipientCount === 0) throw new Error('No active subscribers to send to')

    // Create send records for all subscribers
    const sends = (subscribers ?? []).map((s) => ({
      newsletter_id: newsletterId,
      subscriber_id: s.id,
      status:        'pending',
    }))

    const { error: sendsError } = await supabase.from('newsletter_sends').insert(sends)
    if (sendsError) throw sendsError

    // Update newsletter status to queued
    await supabase
      .from('newsletters')
      .update({ status: 'queued', recipient_count: recipientCount })
      .eq('id', newsletterId)

    // Invoke Edge Function to do the actual sending (async)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    fetch(`${supabaseUrl}/functions/v1/send-newsletter`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        Authorization:   `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ newsletter_id: newsletterId }),
    }).catch((e) => console.error('[edge-fn] send-newsletter invoke failed', e))

    revalidatePath('/dashboard/newsletter')
    return ok(undefined, `Newsletter queued for ${recipientCount} subscribers`)
  } catch (err) {
    return fail(err)
  }
}
