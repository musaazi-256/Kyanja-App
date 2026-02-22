'use server'

import { revalidatePath } from 'next/cache'
import { render } from '@react-email/render'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { requirePermission, getAuthenticatedProfile } from '@/lib/rbac/check'
import { sendEmail } from '@/lib/email/client'
import { StaffInviteEmail } from '@/lib/email/templates/staff-invite'
import {
  createUserSchema, inviteUserSchema, updateUserRoleSchema,
  updateUserStatusSchema, setUserPasswordSchema, userIdSchema,
} from '@/lib/validations/users'
import { ok, fail } from '@/lib/utils/response'
import { AppError, ConflictError, NotFoundError, ValidationError } from '@/lib/utils/errors'
import type { ActionResult } from '@/types/app'

function toFormObject(formData: FormData) {
  return Object.fromEntries(formData.entries())
}

// Maps a Zod v4 error to fieldErrors keyed by field name.
function fieldErrors(e: { flatten: (fn: (iss: { message: string }) => string) => { fieldErrors: Record<string, string[]> } }) {
  return e.flatten((iss) => iss.message).fieldErrors
}

function mapAuthError(error: { message?: string } | null, fallback: string) {
  if (!error) return null
  const msg = error.message ?? fallback
  if (msg.toLowerCase().includes('already')) {
    return new ConflictError('A user with this email already exists')
  }
  return new AppError(msg, 'AUTH_ERROR', 400)
}

export async function createUserWithPassword(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    await requirePermission('users:write')
    const parsed = createUserSchema.safeParse(toFormObject(formData))
    if (!parsed.success) {
      throw new ValidationError('Please fix errors', fieldErrors(parsed.error))
    }

    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: {
        full_name: parsed.data.full_name,
        role: parsed.data.role,
      },
    })

    const mapped = mapAuthError(error, 'Failed to create user')
    if (mapped) throw mapped
    if (!data.user) throw new AppError('Failed to create user', 'AUTH_ERROR', 400)

    revalidatePath('/dashboard/users')
    return ok({ id: data.user.id }, 'User created successfully')
  } catch (err) {
    return fail(err)
  }
}

export async function inviteUser(formData: FormData): Promise<ActionResult<void>> {
  try {
    const inviter = await requirePermission('users:write')
    const parsed = inviteUserSchema.safeParse(toFormObject(formData))
    if (!parsed.success) {
      throw new ValidationError('Please fix errors', fieldErrors(parsed.error))
    }

    const admin = createAdminClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
    if (!siteUrl) {
      throw new AppError(
        'NEXT_PUBLIC_SITE_URL is not set. Add it to your Vercel environment variables (e.g. https://www.kyanjajuniorschool.com) and redeploy.',
        'CONFIG_ERROR',
        500,
      )
    }
    const redirectTo = `${siteUrl}/auth/callback?next=/auth/set-password`

    // Generate the invite link without Supabase sending any email.
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'invite',
      email: parsed.data.email,
      options: {
        data: { full_name: parsed.data.full_name, role: parsed.data.role },
        redirectTo,
      },
    })

    const mapped = mapAuthError(linkError, 'Failed to generate invite link')
    if (mapped) throw mapped
    if (!linkData?.properties?.action_link) {
      throw new AppError('Invite link was not generated', 'INVITE_FAILED', 500)
    }

    // Render and send the branded Kyanja Junior School invite email via Resend.
    const html = await render(
      StaffInviteEmail({
        fullName:  parsed.data.full_name,
        role:      parsed.data.role,
        inviteUrl: linkData.properties.action_link,
        invitedBy: inviter.full_name ?? 'The Administration',
      })
    )

    await sendEmail({
      to:      parsed.data.email,
      subject: `You're invited to the Kyanja Junior School Staff Portal`,
      html,
    })

    revalidatePath('/dashboard/users')
    return ok(undefined, `Invite sent to ${parsed.data.email}`)
  } catch (err) {
    return fail(err)
  }
}

export async function updateUserRole(formData: FormData): Promise<ActionResult<void>> {
  try {
    await requirePermission('users:roles')
    const parsed = updateUserRoleSchema.safeParse(toFormObject(formData))
    if (!parsed.success) {
      throw new ValidationError('Please fix errors', fieldErrors(parsed.error))
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from('profiles')
      .update({ role: parsed.data.role })
      .eq('id', parsed.data.user_id)

    if (error) throw new AppError(error.message, 'DB_ERROR', 400)

    revalidatePath('/dashboard/users')
    return ok(undefined, 'Role updated')
  } catch (err) {
    return fail(err)
  }
}

export async function updateUserStatus(formData: FormData): Promise<ActionResult<void>> {
  try {
    await requirePermission('users:write')
    const me = await getAuthenticatedProfile()
    const parsed = updateUserStatusSchema.safeParse(toFormObject(formData))
    if (!parsed.success) {
      throw new ValidationError('Please fix errors', fieldErrors(parsed.error))
    }
    if (parsed.data.user_id === me.id && !parsed.data.is_active) {
      throw new AppError('You cannot disable your own account', 'INVALID_OPERATION', 422)
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from('profiles')
      .update({ is_active: parsed.data.is_active })
      .eq('id', parsed.data.user_id)

    if (error) throw new AppError(error.message, 'DB_ERROR', 400)

    revalidatePath('/dashboard/users')
    return ok(undefined, parsed.data.is_active ? 'User enabled' : 'User disabled')
  } catch (err) {
    return fail(err)
  }
}

export async function setUserPassword(formData: FormData): Promise<ActionResult<void>> {
  try {
    await requirePermission('users:write')
    const parsed = setUserPasswordSchema.safeParse(toFormObject(formData))
    if (!parsed.success) {
      throw new ValidationError('Please fix errors', fieldErrors(parsed.error))
    }

    const admin = createAdminClient()
    const { error } = await admin.auth.admin.updateUserById(parsed.data.user_id, {
      password: parsed.data.password,
    })

    const mapped = mapAuthError(error, 'Failed to set password')
    if (mapped) throw mapped

    return ok(undefined, 'Password updated')
  } catch (err) {
    return fail(err)
  }
}

export async function sendPasswordResetEmail(formData: FormData): Promise<ActionResult<void>> {
  try {
    await requirePermission('users:write')
    const parsed = userIdSchema.safeParse(toFormObject(formData))
    if (!parsed.success) {
      throw new ValidationError('Invalid user', fieldErrors(parsed.error))
    }

    const admin = createAdminClient()
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('email')
      .eq('id', parsed.data.user_id)
      .single()

    if (profileError || !profile) throw new NotFoundError('User not found')

    const supabase = await createClient()
    const siteUrlReset = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
    if (!siteUrlReset) {
      throw new AppError(
        'NEXT_PUBLIC_SITE_URL is not set. Add it to your Vercel environment variables (e.g. https://www.kyanjajuniorschool.com) and redeploy.',
        'CONFIG_ERROR',
        500,
      )
    }
    const redirectTo = `${siteUrlReset}/auth/callback`

    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, { redirectTo })
    if (error) throw new AppError(error.message, 'AUTH_ERROR', 400)

    return ok(undefined, 'Password reset email sent')
  } catch (err) {
    return fail(err)
  }
}

export async function deleteUser(formData: FormData): Promise<ActionResult<void>> {
  try {
    await requirePermission('users:write')
    const me = await getAuthenticatedProfile()
    const parsed = userIdSchema.safeParse(toFormObject(formData))
    if (!parsed.success) {
      throw new ValidationError('Invalid user', fieldErrors(parsed.error))
    }
    if (parsed.data.user_id === me.id) {
      throw new AppError('You cannot delete your own account', 'INVALID_OPERATION', 422)
    }

    const admin = createAdminClient()
    const { error } = await admin.auth.admin.deleteUser(parsed.data.user_id)

    if (error) {
      const msg = error.message ?? 'Failed to delete user'
      if (msg.toLowerCase().includes('foreign key')) {
        throw new AppError('User has related records. Disable the account instead of deleting.', 'FK_CONFLICT', 409)
      }
      throw new AppError(msg, 'AUTH_ERROR', 400)
    }

    revalidatePath('/dashboard/users')
    return ok(undefined, 'User deleted')
  } catch (err) {
    return fail(err)
  }
}
