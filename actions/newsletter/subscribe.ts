'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { subscribeSchema } from '@/lib/validations/newsletter'
import { ok, fail } from '@/lib/utils/response'
import { ValidationError } from '@/lib/utils/errors'
import type { ActionResult } from '@/types/app'

export async function subscribeToNewsletter(
  formData: FormData,
): Promise<ActionResult<void>> {
  try {
    const raw = Object.fromEntries(formData.entries())
    const result = subscribeSchema.safeParse(raw)

    if (!result.success) {
      throw new ValidationError('Please fix the errors below', result.error.flatten().fieldErrors)
    }

    const admin = createAdminClient()

    const { data: existing, error: existingError } = await admin
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', result.data.email)
      .maybeSingle()

    if (existingError) throw existingError

    if (existing?.id) {
      const { error: updateError } = await admin
        .from('newsletter_subscribers')
        .update({
          full_name:       result.data.full_name ?? null,
          is_active:       true,
          unsubscribed_at: null,
          source:          'website',
        })
        .eq('id', existing.id)

      if (updateError) throw updateError
    } else {
      const { error: insertError } = await admin
        .from('newsletter_subscribers')
        .insert({
          email:           result.data.email,
          full_name:       result.data.full_name ?? null,
          is_active:       true,
          unsubscribed_at: null,
          source:          'website',
        })

      if (insertError) throw insertError
    }

    return ok(undefined, 'You have been subscribed successfully!')
  } catch (err) {
    return fail(err)
  }
}

export async function unsubscribeByToken(token: string): Promise<ActionResult<void>> {
  try {
    const admin = createAdminClient()

    const { data, error } = await admin
      .from('newsletter_subscribers')
      .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
      .eq('unsubscribe_token', token)
      .select('id')

    if (error) throw error
    if (!data || data.length === 0) throw new Error('Invalid or expired unsubscribe link')

    return ok(undefined, 'You have been unsubscribed')
  } catch (err) {
    return fail(err)
  }
}
