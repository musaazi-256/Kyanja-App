'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requirePermission } from '@/lib/rbac/check'
import { composeNewsletterSchema } from '@/lib/validations/newsletter'
import { ok, fail } from '@/lib/utils/response'
import { ValidationError, NotFoundError, AppError } from '@/lib/utils/errors'
import { sendEmail } from '@/lib/email/client'
import type { ActionResult, Newsletter, SubscriberSelectItem } from '@/types/app'
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
  subscriberIds?: string[],
  additionalEmails?: string[],
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
    const nl = newsletter as unknown as Newsletter
    if (nl.status !== 'draft') throw new Error('Newsletter has already been sent')

    // Fetch active subscribers — filtered to selected IDs when provided
    let subscriberQuery = supabase
      .from('newsletter_subscribers')
      .select('id, email, full_name, unsubscribe_token')
      .eq('is_active', true)
    if (subscriberIds && subscriberIds.length > 0) {
      subscriberQuery = subscriberQuery.in('id', subscriberIds)
    }
    const { data: subscribers, error: subError } = await subscriberQuery

    if (subError) throw subError

    const subscriberCount  = subscribers?.length ?? 0
    const extraCount       = additionalEmails?.length ?? 0
    const recipientCount   = subscriberCount + extraCount
    if (recipientCount === 0) throw new Error('No recipients selected')

    // Create a send record for every subscriber (not for ad-hoc emails)
    const sends = (subscribers ?? []).map((s) => ({
      newsletter_id: newsletterId,
      subscriber_id: s.id,
      status:        'pending',
    }))

    const { error: sendsError } = await supabase.from('newsletter_sends').insert(sends)
    if (sendsError) throw sendsError

    // Fetch the inserted records so we have their IDs for per-record updates
    const { data: sendRecords } = await supabase
      .from('newsletter_sends')
      .select('id, subscriber_id')
      .eq('newsletter_id', newsletterId)

    // Mark newsletter as sending before we start dispatching
    await supabase
      .from('newsletters')
      .update({ status: 'sending', recipient_count: recipientCount })
      .eq('id', newsletterId)

    revalidatePath('/dashboard/newsletter')

    // Build a subscriber lookup for O(1) access inside the loop
    const subscriberMap = new Map((subscribers ?? []).map((s) => [s.id, s]))

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kyanjajuniorschool.com'
    const now = new Date().toISOString()
    let sentCount   = 0
    let failedCount = 0

    for (const sendRecord of sendRecords ?? []) {
      const subscriber = subscriberMap.get(sendRecord.subscriber_id)
      if (!subscriber) continue

      const unsubscribeUrl =
        `${siteUrl}/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`

      const html = `
        ${nl.body_html}
        <br/><br/>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="font-size:12px;color:#9ca3af;text-align:center">
          Kyanja Junior School · 500 M from West Mall, Kyanja ·
          Plot 43a Katumba Zone-Kyanja Nakawa Division<br/>
          <a href="${unsubscribeUrl}" style="color:#9ca3af">Unsubscribe</a>
        </p>
      `

      try {
        const { messageId } = await sendEmail({
          to:      subscriber.email,
          subject: nl.subject,
          html,
          text:    nl.body_text ?? undefined,
        })

        await supabase
          .from('newsletter_sends')
          .update({ status: 'sent', sent_at: now, provider_msg_id: messageId })
          .eq('id', sendRecord.id)

        sentCount++
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Send failed'
        await supabase
          .from('newsletter_sends')
          .update({ status: 'failed', failed_at: now, error_message: message, retry_count: 1 })
          .eq('id', sendRecord.id)

        failedCount++
      }
    }

    // Send to additional (ad-hoc) emails — no subscriber record, no unsubscribe link
    const footerHtml = `
      <br/><br/>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="font-size:12px;color:#9ca3af;text-align:center">
        Kyanja Junior School · 500 M from West Mall, Kyanja ·
        Plot 43a Katumba Zone-Kyanja Nakawa Division
      </p>
    `
    for (const email of additionalEmails ?? []) {
      const html = `${nl.body_html}${footerHtml}`
      try {
        await sendEmail({ to: email, subject: nl.subject, html, text: nl.body_text ?? undefined })
        sentCount++
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Send failed'
        console.error(`Failed to send to ${email}:`, message)
        failedCount++
      }
    }

    // Update newsletter with final outcome
    const finalStatus = failedCount === recipientCount ? 'failed' : 'sent'
    await supabase
      .from('newsletters')
      .update({ status: finalStatus, sent_at: now, sent_count: sentCount, failed_count: failedCount })
      .eq('id', newsletterId)

    revalidatePath('/dashboard/newsletter')

    const label = failedCount > 0
      ? `Sent to ${sentCount} of ${recipientCount} · ${failedCount} failed`
      : `Newsletter sent to ${sentCount} ${recipientCount === 1 ? 'recipient' : 'recipients'}`
    return ok(undefined, label)
  } catch (err) {
    return fail(err)
  }
}

export async function updateNewsletterDraft(
  newsletterId: string,
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

    const { data: existing, error: existingError } = await supabase
      .from('newsletters')
      .select('id, status, created_by')
      .eq('id', newsletterId)
      .single()

    if (existingError || !existing) throw new NotFoundError('Draft not found')
    if (existing.status !== 'draft') throw new AppError('Only draft newsletters can be edited', 'INVALID_STATE', 422)
    if (existing.created_by !== profile.id && profile.role !== 'admin') {
      throw new AppError('You can only edit your own drafts', 'FORBIDDEN', 403)
    }

    const { error: updateError } = await supabase
      .from('newsletters')
      .update({ ...result.data })
      .eq('id', newsletterId)

    if (updateError) throw updateError

    revalidatePath('/dashboard/newsletter')
    revalidatePath('/dashboard/newsletter/compose')
    return ok({ id: newsletterId }, 'Draft updated')
  } catch (err) {
    return fail(err)
  }
}

export async function deleteNewsletterDraft(
  newsletterId: string,
): Promise<ActionResult<void>> {
  try {
    const profile = await requirePermission('newsletter:compose')
    const supabase = await createClient()

    const { data: existing, error: existingError } = await supabase
      .from('newsletters')
      .select('id, status, created_by')
      .eq('id', newsletterId)
      .single()

    if (existingError || !existing) throw new NotFoundError('Draft not found')
    if (existing.status !== 'draft') throw new AppError('Only draft newsletters can be deleted', 'INVALID_STATE', 422)
    if (existing.created_by !== profile.id && profile.role !== 'admin') {
      throw new AppError('You can only delete your own drafts', 'FORBIDDEN', 403)
    }

    const admin = createAdminClient()
    const { error: deleteError } = await admin
      .from('newsletters')
      .delete()
      .eq('id', newsletterId)

    if (deleteError) throw deleteError

    revalidatePath('/dashboard/newsletter')
    revalidatePath('/dashboard/newsletter/compose')
    return ok(undefined, 'Draft deleted')
  } catch (err) {
    return fail(err)
  }
}

/**
 * Delete a newsletter that is in draft, queued, or failed status.
 * Sent / currently-sending newsletters cannot be deleted.
 * The newsletter_sends rows cascade-delete automatically (ON DELETE CASCADE).
 */
export async function deleteNewsletter(
  newsletterId: string,
): Promise<ActionResult<void>> {
  try {
    const profile = await requirePermission('newsletter:compose')
    const supabase = await createClient()

    const { data: existing, error: existingError } = await supabase
      .from('newsletters')
      .select('id, status, created_by')
      .eq('id', newsletterId)
      .single()

    if (existingError || !existing) throw new NotFoundError('Newsletter not found')
    if (existing.status === 'sent' || existing.status === 'sending') {
      throw new AppError('Sent newsletters cannot be deleted', 'INVALID_STATE', 422)
    }
    if (existing.created_by !== profile.id && profile.role !== 'admin') {
      throw new AppError('You do not have permission to delete this newsletter', 'FORBIDDEN', 403)
    }

    const admin = createAdminClient()
    const { error: deleteError } = await admin
      .from('newsletters')
      .delete()
      .eq('id', newsletterId)

    if (deleteError) throw deleteError

    revalidatePath('/dashboard/newsletter')
    return ok(undefined, 'Newsletter deleted')
  } catch (err) {
    return fail(err)
  }
}

export async function getActiveSubscribersForSelect(): Promise<ActionResult<SubscriberSelectItem[]>> {
  try {
    await requirePermission('newsletter:send')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, full_name')
      .eq('is_active', true)
      .order('email', { ascending: true })

    if (error) throw error
    return ok((data ?? []) as unknown as SubscriberSelectItem[])
  } catch (err) {
    return fail(err)
  }
}
