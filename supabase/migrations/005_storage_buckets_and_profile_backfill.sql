-- ============================================================
-- Migration 005: Ensure storage buckets and backfill profiles
-- ============================================================

-- Ensure required storage buckets exist with correct limits and MIME types
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('gallery',   'gallery',   true,  3145728,  array['image/jpeg','image/png','image/webp']),
  ('media',     'media',     true,  3145728,  array['image/jpeg','image/png','image/webp']),
  ('documents', 'documents', false, 52428800, array['application/pdf','text/csv']),
  ('imports',   'imports',   false, 5242880,  array['text/csv']),
  ('avatars',   'avatars',   true,  2097152,  array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Backfill missing profiles for existing auth users (needed for role checks in RLS)
insert into public.profiles (id, email, full_name, role, is_active)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as full_name,
  case
    when (u.raw_user_meta_data->>'role') in ('admin', 'staff', 'teacher', 'parent', 'student')
      then (u.raw_user_meta_data->>'role')::public.user_role
    else 'staff'::public.user_role
  end as role,
  true as is_active
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
