-- ============================================================
-- Migration 001: Initial Schema
-- Kyanja Junior School Platform
-- ============================================================

-- Enable pgcrypto for gen_random_bytes
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Enums ─────────────────────────────────────────────────
CREATE TYPE application_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'accepted',
  'declined',
  'waitlisted',
  'withdrawn'
);

CREATE TYPE user_role AS ENUM (
  'admin',
  'staff',
  'teacher',
  'parent',
  'student'
);

CREATE TYPE send_status AS ENUM (
  'draft',
  'queued',
  'sending',
  'sent',
  'failed'
);

CREATE TYPE media_context AS ENUM (
  'gallery',
  'admissions',
  'news',
  'page_content',
  'profile'
);

-- ─── profiles ──────────────────────────────────────────────
CREATE TABLE profiles (
  id            uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text        UNIQUE NOT NULL,
  full_name     text,
  role          user_role   NOT NULL DEFAULT 'staff',
  avatar_url    text,
  is_active     boolean     NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Auto-create profile on auth user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'staff')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─── permissions / role_permissions ────────────────────────
CREATE TABLE permissions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text        UNIQUE NOT NULL,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
  role        user_role NOT NULL,
  permission  text      NOT NULL REFERENCES permissions(key) ON DELETE CASCADE,
  PRIMARY KEY (role, permission)
);

-- ─── applications ──────────────────────────────────────────
CREATE TABLE applications (
  id                  uuid               PRIMARY KEY DEFAULT gen_random_uuid(),
  student_first_name  text               NOT NULL,
  student_last_name   text               NOT NULL,
  date_of_birth       date               NOT NULL,
  gender              text               CHECK (gender IN ('male', 'female', 'other')),
  nationality         text,
  applying_for_class  text               NOT NULL,
  academic_year       text               NOT NULL,
  parent_name         text               NOT NULL,
  parent_email        text               NOT NULL,
  parent_phone        text               NOT NULL,
  parent_relationship text               NOT NULL,
  address             text,
  previous_school     text,
  special_needs       text,
  notes               text,
  status              application_status NOT NULL DEFAULT 'submitted',
  source              text               NOT NULL DEFAULT 'online',
  import_batch_id     uuid,
  processed_by        uuid               REFERENCES profiles(id),
  processed_at        timestamptz,
  created_by          uuid               REFERENCES profiles(id),
  created_at          timestamptz        NOT NULL DEFAULT now(),
  updated_at          timestamptz        NOT NULL DEFAULT now(),
  deleted_at          timestamptz
);

CREATE INDEX idx_applications_status        ON applications(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_applications_academic_year ON applications(academic_year);
CREATE INDEX idx_applications_parent_email  ON applications(parent_email);
CREATE INDEX idx_applications_import_batch  ON applications(import_batch_id);
CREATE INDEX idx_applications_created_at    ON applications(created_at DESC);

CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── application_status_history ────────────────────────────
CREATE TABLE application_status_history (
  id              uuid               PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  uuid               NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  from_status     application_status,
  to_status       application_status NOT NULL,
  changed_by      uuid               REFERENCES profiles(id),
  note            text,
  email_sent      boolean            NOT NULL DEFAULT false,
  email_sent_at   timestamptz,
  created_at      timestamptz        NOT NULL DEFAULT now()
);

CREATE INDEX idx_app_history_application ON application_status_history(application_id);

-- ─── csv_import_batches ────────────────────────────────────
CREATE TABLE csv_import_batches (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name     text        NOT NULL,
  total_rows    integer     NOT NULL DEFAULT 0,
  success_count integer     NOT NULL DEFAULT 0,
  error_count   integer     NOT NULL DEFAULT 0,
  status        text        NOT NULL DEFAULT 'processing',
  errors        jsonb,
  uploaded_by   uuid        NOT NULL REFERENCES profiles(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  completed_at  timestamptz
);

-- ─── newsletter_subscribers ────────────────────────────────
CREATE TABLE newsletter_subscribers (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email             text        UNIQUE NOT NULL,
  full_name         text,
  unsubscribe_token text        UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  is_active         boolean     NOT NULL DEFAULT true,
  subscribed_at     timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at   timestamptz,
  source            text        DEFAULT 'website'
);

CREATE INDEX idx_subscribers_email  ON newsletter_subscribers(email);
CREATE INDEX idx_subscribers_active ON newsletter_subscribers(is_active);
CREATE INDEX idx_subscribers_token  ON newsletter_subscribers(unsubscribe_token);

-- ─── newsletters ───────────────────────────────────────────
CREATE TABLE newsletters (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subject         text        NOT NULL,
  body_html       text        NOT NULL,
  body_text       text,
  status          send_status NOT NULL DEFAULT 'draft',
  recipient_count integer     NOT NULL DEFAULT 0,
  sent_count      integer     NOT NULL DEFAULT 0,
  failed_count    integer     NOT NULL DEFAULT 0,
  scheduled_for   timestamptz,
  sent_at         timestamptz,
  created_by      uuid        NOT NULL REFERENCES profiles(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER newsletters_updated_at
  BEFORE UPDATE ON newsletters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── newsletter_sends ──────────────────────────────────────
CREATE TABLE newsletter_sends (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id   uuid        NOT NULL REFERENCES newsletters(id) ON DELETE CASCADE,
  subscriber_id   uuid        NOT NULL REFERENCES newsletter_subscribers(id),
  status          text        NOT NULL DEFAULT 'pending',
  sent_at         timestamptz,
  failed_at       timestamptz,
  error_message   text,
  retry_count     integer     NOT NULL DEFAULT 0,
  provider_msg_id text,
  UNIQUE (newsletter_id, subscriber_id)
);

CREATE INDEX idx_ns_newsletter  ON newsletter_sends(newsletter_id);
CREATE INDEX idx_ns_status      ON newsletter_sends(status);
CREATE INDEX idx_ns_subscriber  ON newsletter_sends(subscriber_id);

-- ─── media_files ───────────────────────────────────────────
CREATE TABLE media_files (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket       text          NOT NULL,
  storage_path text          NOT NULL UNIQUE,
  public_url   text,
  file_name    text          NOT NULL,
  file_size    bigint,
  mime_type    text,
  width        integer,
  height       integer,
  context      media_context,
  alt_text     text,
  caption      text,
  tags         text[]        NOT NULL DEFAULT '{}',
  sort_order   integer       NOT NULL DEFAULT 0,
  uploaded_by  uuid          NOT NULL REFERENCES profiles(id),
  created_at   timestamptz   NOT NULL DEFAULT now(),
  updated_at   timestamptz   NOT NULL DEFAULT now(),
  deleted_at   timestamptz
);

CREATE INDEX idx_media_context     ON media_files(context) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_bucket      ON media_files(bucket)  WHERE deleted_at IS NULL;
CREATE INDEX idx_media_uploaded_by ON media_files(uploaded_by);
CREATE INDEX idx_media_tags        ON media_files USING GIN(tags);

CREATE TRIGGER media_files_updated_at
  BEFORE UPDATE ON media_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Future tables (stubs) ─────────────────────────────────

CREATE TABLE students (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  uuid        REFERENCES applications(id),
  profile_id      uuid        REFERENCES profiles(id),
  student_number  text        UNIQUE,
  class_id        uuid,
  enrollment_date date,
  is_active       boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE staff_members (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      uuid        UNIQUE NOT NULL REFERENCES profiles(id),
  employee_number text        UNIQUE,
  department      text,
  position        text,
  hire_date       date,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE classes (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  level         text        NOT NULL,
  academic_year text        NOT NULL,
  teacher_id    uuid        REFERENCES staff_members(id),
  capacity      integer,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id         uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid           NOT NULL REFERENCES students(id),
  amount     numeric(12, 2) NOT NULL,
  currency   text           NOT NULL DEFAULT 'UGX',
  purpose    text,
  term       text,
  status     text           NOT NULL DEFAULT 'pending',
  paid_at    timestamptz,
  created_at timestamptz    NOT NULL DEFAULT now()
);
