'use server'

import { createClient } from '@/lib/supabase/server'
import { requirePermission, getAuthenticatedProfile } from '@/lib/rbac/check'
import { applicationSchema } from '@/lib/validations/application'
import { sendEmail } from '@/lib/email/client'
import { ConfirmationEmail } from '@/lib/email/templates/confirmation'
import { render } from '@react-email/render'
import { ok, fail } from '@/lib/utils/response'
import { ValidationError } from '@/lib/utils/errors'
import type { ActionResult } from '@/types/app'
import { revalidatePath } from 'next/cache'

/** Public submission from the website form — no auth required */
export async function submitPublicApplication(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const raw = Object.fromEntries(formData.entries())
    const result = applicationSchema.safeParse(raw)

    if (!result.success) {
      throw new ValidationError('Please fix the errors below', result.error.flatten().fieldErrors)
    }

    const supabase = await createClient()
    const { data: app, error } = await supabase
      .from('applications')
      .insert({
        ...result.data,
        status: 'submitted',
        source: 'online',
      })
      .select('id')
      .single()

    if (error || !app) throw new Error(error?.message ?? 'Failed to save application')

    // Insert initial status history
    await supabase.from('application_status_history').insert({
      application_id: app.id,
      from_status:    null,
      to_status:      'submitted',
    })

    // Send parent confirmation (non-blocking — fire and forget)
    const html = await render(
      ConfirmationEmail({
        parentName:  result.data.parent_name,
        studentName: `${result.data.student_first_name} ${result.data.student_last_name}`,
        className:   result.data.applying_for_class,
        referenceId: app.id.slice(0, 8).toUpperCase(),
      }),
    )

    sendEmail({ to: result.data.parent_email, subject: 'Application Received — Kyanja Junior School', html }).catch(
      (e) => console.error('[email] confirmation send failed', e),
    )

    return ok({ id: app.id }, 'Application submitted successfully')
  } catch (err) {
    return fail(err)
  }
}

/** Admin / staff manual application entry — requires auth */
export async function createManualApplication(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const profile = await requirePermission('applications:write')
    const raw = Object.fromEntries(formData.entries())
    const result = applicationSchema.safeParse(raw)

    if (!result.success) {
      throw new ValidationError('Please fix the errors below', result.error.flatten().fieldErrors)
    }

    const supabase = await createClient()
    const { data: app, error } = await supabase
      .from('applications')
      .insert({
        ...result.data,
        status:     'submitted',
        source:     'manual',
        created_by: profile.id,
      })
      .select('id')
      .single()

    if (error || !app) throw new Error(error?.message ?? 'Failed to create application')

    await supabase.from('application_status_history').insert({
      application_id: app.id,
      from_status:    null,
      to_status:      'submitted',
      changed_by:     profile.id,
    })

    revalidatePath('/dashboard/applications')
    return ok({ id: app.id }, 'Application created')
  } catch (err) {
    return fail(err)
  }
}
