-- ============================================================
-- Migration 006: Fix storage bucket file-size limits and MIME types
-- ============================================================
-- Patches buckets that were created by migration 005 without
-- file_size_limit or allowed_mime_types (Supabase defaults to 1 MB).

update storage.buckets
set
  file_size_limit    = 3145728, -- 3 MB
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id in ('gallery', 'media');

update storage.buckets
set
  file_size_limit    = 2097152, -- 2 MB
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'avatars';

update storage.buckets
set
  file_size_limit    = 52428800, -- 50 MB
  allowed_mime_types = array['application/pdf', 'text/csv']
where id = 'documents';

update storage.buckets
set
  file_size_limit    = 5242880, -- 5 MB
  allowed_mime_types = array['text/csv']
where id = 'imports';
