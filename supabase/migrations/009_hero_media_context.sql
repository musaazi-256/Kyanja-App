-- Add 'hero' to media_context enum so hero images uploaded via the
-- Media Library are tracked in media_files with a distinct context.
ALTER TYPE media_context ADD VALUE IF NOT EXISTS 'hero';
