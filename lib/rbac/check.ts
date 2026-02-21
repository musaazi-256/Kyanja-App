import { createClient } from '@/lib/supabase/server'
import { hasPermission } from './permissions'
import { UnauthorizedError, ForbiddenError } from '@/lib/utils/errors'
import type { Permission } from '@/types/rbac'
import type { Profile } from '@/types/app'

/**
 * Returns the current user's profile, or throws UnauthorizedError.
 * Use at the top of Server Actions and Route Handlers.
 */
export async function getAuthenticatedProfile(): Promise<Profile> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new UnauthorizedError()

  const { data: profileRaw, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profileRaw) throw new UnauthorizedError()
  const profile = profileRaw as unknown as Profile
  if (!profile.is_active) throw new UnauthorizedError('Account has been disabled')

  return profile
}

/**
 * Throws if the current user does not have the required permission.
 */
export async function requirePermission(permission: Permission): Promise<Profile> {
  const profile = await getAuthenticatedProfile()

  if (!hasPermission(profile.role, permission)) {
    throw new ForbiddenError(`Missing permission: ${permission}`)
  }

  return profile
}

/**
 * Returns true/false without throwing — useful for conditional UI rendering
 * from Server Components.
 */
export async function checkPermission(permission: Permission): Promise<boolean> {
  try {
    await requirePermission(permission)
    return true
  } catch {
    return false
  }
}
