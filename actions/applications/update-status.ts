'use server'

import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/rbac/check'
import { statusUpdateSchema } from '@/lib/validations/application'
import { sendEmail } from '@/lib/email/client'
import { AcceptanceEmail } from '@/lib/email/templates/acceptance'
import { RejectionEmail } from '@/lib/email/templates/rejection'
import { render } from '@react-email/render'
import { ok, fail } from '@/lib/utils/response'
import { ValidationError, NotFoundError, AppError } from '@/lib/utils/errors'
import type { ActionResult, ApplicationStatus, Application } from '@/types/app'
import { revalidatePath } from 'next/cache'

const VALID_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  draft:        ['submitted', 'withdrawn'],
  submitted:    ['under_review', 'accepted', 'declined', 'waitlisted'],
  under_review: ['accepted', 'declined', 'waitlisted'],
  waitlisted:   ['accepted', 'declined', 'withdrawn'],
  accepted:     ['withdrawn'],
  declined:     [],
  withdrawn:    [],
}

export async function updateApplicationStatus(
  formData: FormData,
): Promise<ActionResult<void>> {
  try {
    const profile = await requirePermission('applications:status')

    const raw = Object.fromEntries(formData.entries())
    const result = statusUpdateSchema.safeParse(raw)
    if (!result.success) {
      throw new ValidationError('Invalid request', result.error.flatten().fieldErrors)
    }

    const { application_id, new_status, note } = result.data
    const supabase = await createClient()

    // Fetch current application
    const { data: appRaw, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', application_id)
      .is('deleted_at', null)
      .single()

    if (fetchError || !appRaw) throw new NotFoundError('Application not found')
    const app = appRaw as unknown as Application

    // Enforce valid transitions
    if (app.status === new_status) {
      throw new AppError(`Application is already '${new_status}'`, 'NO_CHANGE', 422)
    }

    const allowed = VALID_TRANSITIONS[app.status as ApplicationStatus] ?? []
    if (!allowed.includes(new_status)) {
      throw new AppError(
        `Cannot transition from '${app.status}' to '${new_status}'`,
        'INVALID_TRANSITION',
        422,
      )
    }

    const now = new Date().toISOString()

    // Update application
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        status:       new_status,
        processed_by: profile.id,
        processed_at: now,
        updated_at:   now,
      })
      .eq('id', application_id)

    if (updateError) throw updateError

    // Record history
    await supabase.from('application_status_history').insert({
      application_id,
      from_status: app.status as ApplicationStatus,
      to_status:   new_status,
      changed_by:  profile.id,
      note:        note ?? null,
      email_sent:  false,
    })

    // Send emails for terminal decisions
    const studentName = `${app.student_first_name} ${app.student_last_name}`

    if (new_status === 'accepted') {
      const html = await render(
        AcceptanceEmail({
          parentName:   app.parent_name,
          studentName,
          className:    app.applying_for_class,
          academicYear: app.academic_year,
        }),
      )
      sendEmail({
        to:      app.parent_email,
        subject: `Congratulations! ${studentName}'s Application Accepted — Kyanja Junior School`,
        html,
      }).catch((e) => console.error('[email] acceptance send failed', e))
    }

    if (new_status === 'declined') {
      const html = await render(
        RejectionEmail({
          parentName:   app.parent_name,
          studentName,
          className:    app.applying_for_class,
          academicYear: app.academic_year,
        }),
      )
      sendEmail({
        to:      app.parent_email,
        subject: `Update on ${studentName}'s Application — Kyanja Junior School`,
        html,
      }).catch((e) => console.error('[email] rejection send failed', e))
    }

    revalidatePath('/dashboard/applications')
    revalidatePath(`/dashboard/applications/${application_id}`)
    return ok(undefined, 'Status updated successfully')
  } catch (err) {
    return fail(err)
  }
}

export async function deleteApplication(id: string): Promise<ActionResult<void>> {
  try {
    await requirePermission('applications:delete')
    const supabase = await createClient()

    const { error } = await supabase
      .from('applications')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/applications')
    return ok(undefined, 'Application deleted')
  } catch (err) {
    return fail(err)
  }
}
