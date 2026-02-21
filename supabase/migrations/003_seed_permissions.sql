-- ============================================================
-- Migration 003: Seed permissions table
-- ============================================================

INSERT INTO permissions (key, description) VALUES
  ('applications:read',        'View applications'),
  ('applications:write',       'Create/edit applications'),
  ('applications:status',      'Change application status'),
  ('applications:import',      'Import CSV applications'),
  ('applications:delete',      'Delete applications'),
  ('newsletter:read',          'View newsletters & subscribers'),
  ('newsletter:compose',       'Compose newsletters'),
  ('newsletter:send',          'Send newsletters'),
  ('newsletter:subscribers',   'Manage subscribers'),
  ('media:read',               'View media library'),
  ('media:upload',             'Upload media files'),
  ('media:delete',             'Delete media files'),
  ('users:read',               'View users'),
  ('users:write',              'Create and edit users'),
  ('users:roles',              'Assign user roles'),
  ('content:write',            'Edit page content')
ON CONFLICT (key) DO NOTHING;

-- Admin gets all permissions
INSERT INTO role_permissions (role, permission)
SELECT 'admin'::user_role, key FROM permissions
ON CONFLICT DO NOTHING;

-- Staff permissions
INSERT INTO role_permissions (role, permission) VALUES
  ('staff', 'applications:read'),
  ('staff', 'applications:write'),
  ('staff', 'applications:status'),
  ('staff', 'applications:import'),
  ('staff', 'newsletter:read'),
  ('staff', 'media:read'),
  ('staff', 'media:upload')
ON CONFLICT DO NOTHING;

-- Teacher permissions
INSERT INTO role_permissions (role, permission) VALUES
  ('teacher', 'applications:read'),
  ('teacher', 'media:read')
ON CONFLICT DO NOTHING;
