import type { Permission, RolePermissions } from '@/types/rbac'

export const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    'applications:read',
    'applications:write',
    'applications:status',
    'applications:import',
    'applications:delete',
    'newsletter:read',
    'newsletter:compose',
    'newsletter:send',
    'newsletter:subscribers',
    'media:read',
    'media:upload',
    'media:delete',
    'users:read',
    'users:write',
    'users:roles',
    'content:write',
    'downloads:read',
    'downloads:upload',
    'downloads:edit',
    'downloads:delete',
    'downloads:publish',
  ],
  staff: [
    'applications:read',
    'applications:write',
    'applications:status',
    'applications:import',
    'newsletter:read',
    'media:read',
    'media:upload',
    'downloads:read',
  ],
  teacher: [
    'applications:read',
    'media:read',
  ],
  parent: [],
  student: [],
}

export function hasPermission(role: string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role] ?? []
  return perms.includes(permission)
}
