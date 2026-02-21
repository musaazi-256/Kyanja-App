-- Lightweight key-value store for site-wide configuration.
-- Currently used for: hero_image_url
-- Extend by inserting new rows — no schema changes needed.

CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT        PRIMARY KEY,
  value      TEXT        NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed known keys so reads never return null.
INSERT INTO site_settings (key, value)
VALUES ('hero_image_url', '')
ON CONFLICT (key) DO NOTHING;

-- Row-level security: public read (needed by the anonymous home page),
-- writes are done exclusively via the service-role admin client in Server Actions.
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_public_read"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);
