-- Guest Authentication System Migration
-- Adds invitation codes and shared password authentication for guest access
-- Photos/videos will be stored in Sanity, references stored in Supabase

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. ADD INVITATION CODE TO SIMPLE_GUESTS
-- ============================================================================

-- Add invitation_code column to simple_guests table
ALTER TABLE public.simple_guests
ADD COLUMN IF NOT EXISTS invitation_code TEXT UNIQUE;

-- Add account_created column to track if guest created their account
ALTER TABLE public.simple_guests
ADD COLUMN IF NOT EXISTS account_created BOOLEAN DEFAULT false;

-- Add last_login to track guest activity
ALTER TABLE public.simple_guests
ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- Create index for invitation code lookups
CREATE INDEX IF NOT EXISTS idx_simple_guests_invitation_code
ON public.simple_guests(invitation_code);

-- Function to generate unique invitation codes
CREATE OR REPLACE FUNCTION generate_guest_invitation_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 6-character alphanumeric code (e.g., HY1000, AMOR25, etc.)
    code := upper(substring(md5(random()::text) from 1 for 6));

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.simple_guests WHERE invitation_code = code) INTO exists;

    -- If unique, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate invitation codes for existing guests
UPDATE public.simple_guests
SET invitation_code = generate_guest_invitation_code()
WHERE invitation_code IS NULL;

-- Make invitation_code NOT NULL after populating
ALTER TABLE public.simple_guests
ALTER COLUMN invitation_code SET NOT NULL;

COMMENT ON COLUMN public.simple_guests.invitation_code IS 'Unique invitation code for guest authentication (e.g., HY1000)';
COMMENT ON COLUMN public.simple_guests.account_created IS 'Whether guest has created their account using invitation code';
COMMENT ON COLUMN public.simple_guests.last_login IS 'Last time guest logged in to the platform';

-- ============================================================================
-- 2. WEDDING AUTH CONFIG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wedding_auth_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Shared Password (hashed)
  shared_password_hash TEXT NOT NULL,
  shared_password_enabled BOOLEAN DEFAULT true,

  -- Invitation Code Settings
  require_invitation_code BOOLEAN DEFAULT true,
  allow_password_only BOOLEAN DEFAULT false, -- Allow guests to use just password without invite code

  -- Session Settings
  session_duration_hours INTEGER DEFAULT 72, -- How long guest sessions last
  max_uploads_per_guest INTEGER DEFAULT 50,

  -- Feature Flags
  photo_upload_enabled BOOLEAN DEFAULT true,
  video_upload_enabled BOOLEAN DEFAULT true,
  message_board_enabled BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Only allow one config row (singleton pattern)
CREATE UNIQUE INDEX IF NOT EXISTS idx_wedding_auth_config_singleton
ON public.wedding_auth_config ((true));

-- Insert default config (password will be set by admin)
INSERT INTO public.wedding_auth_config (
  shared_password_hash,
  shared_password_enabled,
  require_invitation_code
) VALUES (
  extensions.crypt('1000dias', extensions.gen_salt('bf')), -- Default password: "1000dias" (change this!)
  true,
  true
) ON CONFLICT DO NOTHING;

-- Function to verify shared password
CREATE OR REPLACE FUNCTION verify_shared_password(input_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  stored_hash TEXT;
  config_enabled BOOLEAN;
BEGIN
  SELECT shared_password_hash, shared_password_enabled
  INTO stored_hash, config_enabled
  FROM public.wedding_auth_config
  LIMIT 1;

  IF NOT config_enabled THEN
    RETURN false;
  END IF;

  RETURN stored_hash = extensions.crypt(input_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update shared password
CREATE OR REPLACE FUNCTION update_shared_password(new_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.wedding_auth_config
  SET
    shared_password_hash = extensions.crypt(new_password, extensions.gen_salt('bf')),
    updated_at = NOW();

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.wedding_auth_config IS 'Authentication configuration for wedding guest access';
COMMENT ON FUNCTION verify_shared_password IS 'Verify guest-provided password against shared password';
COMMENT ON FUNCTION update_shared_password IS 'Update the shared password (admin only)';

-- ============================================================================
-- 3. GUEST SESSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.guest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Guest Reference
  guest_id UUID NOT NULL REFERENCES public.simple_guests(id) ON DELETE CASCADE,

  -- Session Token (JWT or random token)
  session_token TEXT NOT NULL UNIQUE,

  -- Authentication Method
  auth_method TEXT NOT NULL CHECK (auth_method IN ('invitation_code', 'shared_password', 'both')),

  -- Session Metadata
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,

  -- Device Info (optional)
  user_agent TEXT,
  ip_address INET,

  -- Activity Tracking
  uploads_count INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for session management
CREATE INDEX IF NOT EXISTS idx_guest_sessions_guest_id ON public.guest_sessions(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_sessions_token ON public.guest_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_guest_sessions_expires_at ON public.guest_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_guest_sessions_active ON public.guest_sessions(is_active, expires_at)
  WHERE is_active = true;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM public.guest_sessions
    WHERE expires_at < NOW()
    RETURNING id
  )
  SELECT count(*) INTO deleted_count FROM deleted;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to create guest session
CREATE OR REPLACE FUNCTION create_guest_session(
  p_guest_id UUID,
  p_session_token TEXT,
  p_auth_method TEXT,
  p_duration_hours INTEGER DEFAULT 72,
  p_user_agent TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO public.guest_sessions (
    guest_id,
    session_token,
    auth_method,
    expires_at,
    user_agent,
    ip_address
  ) VALUES (
    p_guest_id,
    p_session_token,
    p_auth_method,
    NOW() + (p_duration_hours || ' hours')::INTERVAL,
    p_user_agent,
    p_ip_address
  ) RETURNING id INTO session_id;

  -- Update guest last_login
  UPDATE public.simple_guests
  SET last_login = NOW()
  WHERE id = p_guest_id;

  RETURN session_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.guest_sessions IS 'Active guest sessions with authentication tracking';
COMMENT ON FUNCTION create_guest_session IS 'Create new authenticated guest session';
COMMENT ON FUNCTION cleanup_expired_sessions IS 'Remove expired sessions (run periodically)';

-- ============================================================================
-- 4. UPDATE GUEST_PHOTOS TO REFERENCE SANITY
-- ============================================================================

-- Drop old storage_path column (we're using Sanity now)
ALTER TABLE public.guest_photos
DROP COLUMN IF EXISTS storage_path,
DROP COLUMN IF EXISTS thumbnail_path,
DROP COLUMN IF EXISTS file_size_bytes,
DROP COLUMN IF EXISTS mime_type,
DROP COLUMN IF EXISTS width,
DROP COLUMN IF EXISTS height;

-- Add Sanity reference columns
ALTER TABLE public.guest_photos
ADD COLUMN IF NOT EXISTS sanity_asset_id TEXT UNIQUE, -- Sanity asset ID
ADD COLUMN IF NOT EXISTS sanity_document_id TEXT UNIQUE, -- Sanity document ID (_id)
ADD COLUMN IF NOT EXISTS sanity_image_url TEXT, -- CDN URL from Sanity
ADD COLUMN IF NOT EXISTS is_video BOOLEAN DEFAULT false; -- Track if it's a video

-- Add metadata that will sync from Sanity
ALTER TABLE public.guest_photos
ADD COLUMN IF NOT EXISTS original_filename TEXT,
ADD COLUMN IF NOT EXISTS file_size_bytes INTEGER,
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER; -- For videos

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_guest_photos_sanity_asset_id
ON public.guest_photos(sanity_asset_id);

CREATE INDEX IF NOT EXISTS idx_guest_photos_sanity_document_id
ON public.guest_photos(sanity_document_id);

CREATE INDEX IF NOT EXISTS idx_guest_photos_is_video
ON public.guest_photos(is_video);

COMMENT ON COLUMN public.guest_photos.sanity_asset_id IS 'Sanity CMS asset ID for the uploaded photo/video';
COMMENT ON COLUMN public.guest_photos.sanity_document_id IS 'Sanity CMS document ID for the guest media document';
COMMENT ON COLUMN public.guest_photos.sanity_image_url IS 'Sanity CDN URL for optimized image delivery';
COMMENT ON COLUMN public.guest_photos.is_video IS 'Whether this is a video (true) or photo (false)';

-- ============================================================================
-- 5. RLS POLICIES FOR AUTHENTICATION
-- ============================================================================

-- Note: upload_sessions table never existed, skipping cleanup

-- Enable RLS on new tables
ALTER TABLE public.wedding_auth_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;

-- Auth config: Only admins can modify, anyone can read settings
CREATE POLICY "Anyone can view auth config"
  ON public.wedding_auth_config FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update auth config"
  ON public.wedding_auth_config FOR UPDATE
  USING (false); -- Handled in app layer with admin check

-- Guest sessions: Users can only view their own sessions
CREATE POLICY "Guests can view own sessions"
  ON public.guest_sessions FOR SELECT
  USING (true); -- Will be filtered in app layer by session token

CREATE POLICY "Anyone can create sessions"
  ON public.guest_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Guests can update own sessions"
  ON public.guest_sessions FOR UPDATE
  USING (true); -- Will be filtered in app layer

CREATE POLICY "Guests can delete own sessions"
  ON public.guest_sessions FOR DELETE
  USING (true); -- Will be filtered in app layer

-- Update guest_photos policies to require authentication
DROP POLICY IF EXISTS "Anyone can insert photos" ON public.guest_photos;
DROP POLICY IF EXISTS "Anyone can update photos" ON public.guest_photos;
DROP POLICY IF EXISTS "Anyone can delete their own photos" ON public.guest_photos;

CREATE POLICY "Authenticated guests can upload photos"
  ON public.guest_photos FOR INSERT
  WITH CHECK (guest_id IN (
    SELECT guest_id FROM public.guest_sessions
    WHERE is_active = true AND expires_at > NOW()
  ));

CREATE POLICY "Guests can update own photos"
  ON public.guest_photos FOR UPDATE
  USING (guest_id IN (
    SELECT guest_id FROM public.guest_sessions
    WHERE is_active = true AND expires_at > NOW()
  ));

CREATE POLICY "Guests can delete own photos"
  ON public.guest_photos FOR DELETE
  USING (guest_id IN (
    SELECT guest_id FROM public.guest_sessions
    WHERE is_active = true AND expires_at > NOW()
  ));

-- ============================================================================
-- 6. ADMIN HELPER VIEWS
-- ============================================================================

-- View for guest authentication status
CREATE OR REPLACE VIEW public.guest_auth_status AS
SELECT
  g.id,
  g.name,
  g.invitation_code,
  g.account_created,
  g.last_login,
  g.attending,
  COUNT(DISTINCT s.id) as active_sessions_count,
  COUNT(DISTINCT p.id) as photos_uploaded,
  COUNT(DISTINCT m.id) as messages_posted
FROM public.simple_guests g
LEFT JOIN public.guest_sessions s ON g.id = s.guest_id AND s.is_active = true AND s.expires_at > NOW()
LEFT JOIN public.guest_photos p ON g.id = p.guest_id
LEFT JOIN public.guest_messages m ON g.id = m.guest_id
GROUP BY g.id, g.name, g.invitation_code, g.account_created, g.last_login, g.attending
ORDER BY g.last_login DESC NULLS LAST;

COMMENT ON VIEW public.guest_auth_status IS 'Overview of guest authentication and activity status';

-- ============================================================================
-- 7. MAINTENANCE TASKS
-- ============================================================================

-- Schedule cleanup of expired sessions (can be run via cron or manually)
COMMENT ON FUNCTION cleanup_expired_sessions IS
'Run this periodically (e.g., daily) to clean up expired sessions: SELECT cleanup_expired_sessions();';

-- ============================================================================
-- 8. SAMPLE DATA (For Testing)
-- ============================================================================

-- Generate invitation codes for any guests that don't have them
UPDATE public.simple_guests
SET invitation_code = generate_guest_invitation_code()
WHERE invitation_code IS NULL;

-- Show sample invitation codes for testing
DO $$
DECLARE
  guest_record RECORD;
BEGIN
  RAISE NOTICE '=== GUEST INVITATION CODES ===';
  RAISE NOTICE 'Sample guest invitation codes:';

  FOR guest_record IN (
    SELECT name, invitation_code
    FROM public.simple_guests
    LIMIT 5
  ) LOOP
    RAISE NOTICE 'Guest: % - Code: %', guest_record.name, guest_record.invitation_code;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '=== SHARED PASSWORD ===';
  RAISE NOTICE 'Default shared password: 1000dias';
  RAISE NOTICE 'Change it with: SELECT update_shared_password(''your-new-password'');';
END $$;
