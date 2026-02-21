export const PERMISSIONS = {
  // Applications
  'applications:read':   'View applications',
  'applications:write':  'Create/edit applications',
  'applications:status': 'Change application status',
  'applications:import': 'Import CSV applications',
  'applications:delete': 'Delete applications',

  // Newsletter
  'newsletter:read':        'View newsletters & subscribers',
  'newsletter:compose':     'Compose newsletters',
  'newsletter:send':        'Send newsletters',
  'newsletter:subscribers': 'Manage subscribers',

  // Media
  'media:read':   'View media library',
  'media:upload': 'Upload media files',
  'media:delete': 'Delete media files',

  // Users
  'users:read':  'View users',
  'users:write': 'Create and edit users',
  'users:roles': 'Assign user roles',

  // Content
  'content:write': 'Edit page content',
} as const

export type Permission = keyof typeof PERMISSIONS

export type RolePermissions = Record<string, Permission[]>
