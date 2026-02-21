-- Add separate hero image keys for desktop and mobile variants.
-- The old hero_image_url key (from 007) is kept for backward compatibility
-- and used as a fallback if the variant-specific keys are empty.

INSERT INTO site_settings (key, value)
VALUES
  ('hero_image_url_desktop', ''),
  ('hero_image_url_mobile',  '')
ON CONFLICT (key) DO NOTHING;
