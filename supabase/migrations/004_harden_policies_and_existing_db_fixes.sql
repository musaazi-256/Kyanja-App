-- ============================================================
-- Migration 004: Harden policies on already deployed databases
-- ============================================================

-- 1) application_status_history insert policy hardening
DROP POLICY IF EXISTS "history: system insert" ON application_status_history;
CREATE POLICY "history: system insert"
  ON application_status_history FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND get_my_role() IN ('admin', 'staff')
  );

-- 2) newsletter_subscribers public update lock-down
DROP POLICY IF EXISTS "subscribers: public unsubscribe" ON newsletter_subscribers;

-- Keep admin full control and add explicit staff/admin update policy
DROP POLICY IF EXISTS "subscribers: staff update" ON newsletter_subscribers;
CREATE POLICY "subscribers: staff update"
  ON newsletter_subscribers FOR UPDATE
  USING (get_my_role() IN ('admin', 'staff'))
  WITH CHECK (get_my_role() IN ('admin', 'staff'));

-- 3) storage.objects policy hardening for write/delete paths
DROP POLICY IF EXISTS "gallery: staff upload" ON storage.objects;
CREATE POLICY "gallery: staff upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery'
    AND auth.uid() IS NOT NULL
    AND get_my_role() IN ('admin', 'staff')
  );

DROP POLICY IF EXISTS "gallery: admin delete" ON storage.objects;
CREATE POLICY "gallery: admin delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gallery'
    AND get_my_role() IN ('admin', 'staff')
  );

DROP POLICY IF EXISTS "media: staff upload" ON storage.objects;
CREATE POLICY "media: staff upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND auth.uid() IS NOT NULL
    AND get_my_role() IN ('admin', 'staff')
  );

DROP POLICY IF EXISTS "documents: staff write" ON storage.objects;
CREATE POLICY "documents: staff write"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid() IS NOT NULL
    AND get_my_role() IN ('admin', 'staff')
  );

DROP POLICY IF EXISTS "imports: auth write own" ON storage.objects;
CREATE POLICY "imports: auth write own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'imports'
    AND auth.uid() IS NOT NULL
    AND get_my_role() IN ('admin', 'staff')
  );
