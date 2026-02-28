-- ── 010: Carousel media context + Downloads table & bucket ──────────────────
--
-- 1. Add 'carousel' value to the media_context enum so carousel images can be
--    tracked in media_files with their own context.
-- 2. Create the `downloads` table for admin-managed downloadable files.
-- 3. Create a public `downloads` storage bucket.
-- 4. Set RLS policies on the downloads table & storage bucket.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Extend the media_context enum
ALTER TYPE media_context ADD VALUE IF NOT EXISTS 'carousel';

-- 2. Downloads table
CREATE TABLE IF NOT EXISTS public.downloads (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  subcopy      text,
  icon         text        NOT NULL DEFAULT 'file-text',
  storage_path text        NOT NULL UNIQUE,
  public_url   text        NOT NULL,
  file_name    text        NOT NULL,
  file_size    bigint      NOT NULL,
  mime_type    text        NOT NULL,
  published    boolean     NOT NULL DEFAULT false,
  sort_order   integer     NOT NULL DEFAULT 0,
  uploaded_by  uuid        NOT NULL REFERENCES public.profiles(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  deleted_at   timestamptz
);

CREATE INDEX IF NOT EXISTS idx_downloads_published
  ON public.downloads(published) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_downloads_uploaded_by
  ON public.downloads(uploaded_by);

-- 3. RLS
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can read published, non-deleted downloads
CREATE POLICY "downloads_public_select" ON public.downloads
  FOR SELECT USING (published = true AND deleted_at IS NULL);

-- Authenticated admins & staff can read everything (including drafts)
CREATE POLICY "downloads_admin_select" ON public.downloads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'staff')
    )
  );

-- Only admins can insert
CREATE POLICY "downloads_insert" ON public.downloads
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Only admins can update (edit, publish/unpublish, soft-delete)
CREATE POLICY "downloads_update" ON public.downloads
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 4. Downloads storage bucket (public so files are directly downloadable)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'downloads',
  'downloads',
  true,
  10485760, -- 10 MB
  ARRAY[
    'application/pdf',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Anyone can read files from the downloads bucket
CREATE POLICY "downloads_storage_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'downloads');

-- Only admins can upload to the downloads bucket
CREATE POLICY "downloads_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'downloads' AND
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Only admins can delete from the downloads bucket
CREATE POLICY "downloads_storage_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'downloads' AND
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
