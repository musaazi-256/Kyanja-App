-- ============================================================
-- Migration 002: Row Level Security Policies
-- ============================================================

-- ─── Helper function to get current user role ──────────────
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;

-- ─── profiles ──────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: self read"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: admin read all"
  ON profiles FOR SELECT
  USING (get_my_role() = 'admin');

CREATE POLICY "profiles: self update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "profiles: admin update all"
  ON profiles FOR UPDATE
  USING (get_my_role() = 'admin');

-- ─── applications ──────────────────────────────────────────
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Public form submissions
CREATE POLICY "applications: public insert online"
  ON applications FOR INSERT
  WITH CHECK (
    source = 'online'
    AND status = 'submitted'
    AND created_by IS NULL
    AND processed_by IS NULL
  );

-- Staff + admin can read all non-deleted
CREATE POLICY "applications: staff read"
  ON applications FOR SELECT
  USING (
    get_my_role() IN ('admin', 'staff')
    AND deleted_at IS NULL
  );

-- Staff + admin can insert manual/csv entries
CREATE POLICY "applications: staff insert"
  ON applications FOR INSERT
  WITH CHECK (
    get_my_role() IN ('admin', 'staff')
    AND source IN ('manual', 'csv_import')
  );

-- Staff + admin can update (status changes etc)
CREATE POLICY "applications: staff update"
  ON applications FOR UPDATE
  USING (get_my_role() IN ('admin', 'staff'));

-- Only admin can soft-delete
CREATE POLICY "applications: admin delete"
  ON applications FOR UPDATE
  USING (
    get_my_role() = 'admin'
    AND deleted_at IS NULL
  )
  WITH CHECK (deleted_at IS NOT NULL);

-- ─── application_status_history ────────────────────────────
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "history: staff read"
  ON application_status_history FOR SELECT
  USING (get_my_role() IN ('admin', 'staff'));

CREATE POLICY "history: system insert"
  ON application_status_history FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND get_my_role() IN ('admin', 'staff')
  );

-- ─── csv_import_batches ────────────────────────────────────
ALTER TABLE csv_import_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "batches: staff read"
  ON csv_import_batches FOR SELECT
  USING (get_my_role() IN ('admin', 'staff'));

CREATE POLICY "batches: staff insert"
  ON csv_import_batches FOR INSERT
  WITH CHECK (get_my_role() IN ('admin', 'staff'));

CREATE POLICY "batches: staff update"
  ON csv_import_batches FOR UPDATE
  USING (get_my_role() IN ('admin', 'staff'));

-- ─── newsletter_subscribers ────────────────────────────────
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public can subscribe
CREATE POLICY "subscribers: public insert"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (source = 'website');

-- Public updates are disabled. Unsubscribe is handled server-side with token validation.

-- Staff + admin read all
CREATE POLICY "subscribers: staff read"
  ON newsletter_subscribers FOR SELECT
  USING (get_my_role() IN ('admin', 'staff'));

-- Admin full control
CREATE POLICY "subscribers: admin manage"
  ON newsletter_subscribers FOR ALL
  USING (get_my_role() = 'admin');

CREATE POLICY "subscribers: staff update"
  ON newsletter_subscribers FOR UPDATE
  USING (get_my_role() IN ('admin', 'staff'))
  WITH CHECK (get_my_role() IN ('admin', 'staff'));

-- ─── newsletters ───────────────────────────────────────────
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletters: staff read"
  ON newsletters FOR SELECT
  USING (get_my_role() IN ('admin', 'staff'));

CREATE POLICY "newsletters: admin write"
  ON newsletters FOR INSERT
  WITH CHECK (get_my_role() IN ('admin', 'staff'));

CREATE POLICY "newsletters: admin update"
  ON newsletters FOR UPDATE
  USING (get_my_role() IN ('admin', 'staff'));

-- ─── newsletter_sends ──────────────────────────────────────
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sends: staff read"
  ON newsletter_sends FOR SELECT
  USING (get_my_role() IN ('admin', 'staff'));

CREATE POLICY "sends: system write"
  ON newsletter_sends FOR INSERT
  WITH CHECK (get_my_role() IN ('admin', 'staff'));

CREATE POLICY "sends: system update"
  ON newsletter_sends FOR UPDATE
  USING (get_my_role() IN ('admin', 'staff'));

-- ─── media_files ───────────────────────────────────────────
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Gallery and media are publicly readable
CREATE POLICY "media: public read gallery"
  ON media_files FOR SELECT
  USING (
    deleted_at IS NULL
    AND bucket IN ('gallery', 'media')
  );

-- Authenticated staff can read all
CREATE POLICY "media: staff read all"
  ON media_files FOR SELECT
  USING (
    deleted_at IS NULL
    AND get_my_role() IN ('admin', 'staff')
  );

-- Authenticated users can upload
CREATE POLICY "media: auth insert"
  ON media_files FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND uploaded_by = auth.uid()
    AND get_my_role() IN ('admin', 'staff')
  );

-- Owner or admin can soft-delete
CREATE POLICY "media: owner or admin delete"
  ON media_files FOR UPDATE
  USING (
    (uploaded_by = auth.uid() OR get_my_role() = 'admin')
  );

-- ─── permissions / role_permissions ────────────────────────
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "permissions: admin read"
  ON permissions FOR SELECT USING (get_my_role() = 'admin');

CREATE POLICY "role_permissions: admin read"
  ON role_permissions FOR SELECT USING (get_my_role() = 'admin');

-- ─── Storage bucket policies ───────────────────────────────

-- gallery: public read, staff write
CREATE POLICY "gallery: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "gallery: staff upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery'
    AND auth.uid() IS NOT NULL
    AND get_my_role() IN ('admin', 'staff')
  );

CREATE POLICY "gallery: admin delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gallery'
    AND get_my_role() IN ('admin', 'staff')
  );

-- media: public read, staff write
CREATE POLICY "media: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "media: staff upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND auth.uid() IS NOT NULL
    AND get_my_role() IN ('admin', 'staff')
  );

-- documents: private
CREATE POLICY "documents: auth read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "documents: staff write"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid() IS NOT NULL
    AND get_my_role() IN ('admin', 'staff')
  );

-- imports: authenticated only (own path prefix)
CREATE POLICY "imports: auth read own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'imports'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "imports: auth write own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'imports'
    AND auth.uid() IS NOT NULL
    AND get_my_role() IN ('admin', 'staff')
  );

-- avatars: public read, owner write
CREATE POLICY "avatars: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars: owner write"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
