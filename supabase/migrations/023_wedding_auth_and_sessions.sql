-- Migration 023: Wedding Auth Config and Guest Sessions
-- Creates authentication infrastructure for guest access
-- Note: invitation_code added to simple_guests in migration 20251014000000
-- Note: guest_photos table created in migration 20251013061016

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. WEDDING AUTH CONFIG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wedding_auth_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Shared Password (hashed)
  shared_password_hash TEXT NOT NULL,
  shared_password_enabled BOOLEAN DEFAULT true,

  -- Invitation Code Settings
  require_invitation_code BOOLEAN DEFAULT true,
  allow_password_only BOOLEAN DEFAULT false,

  -- Session Settings
  session_duration_hours INTEGER DEFAULT 72,
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

-- Insert default config
INSERT INTO public.wedding_auth_config (
  shared_password_hash,
  shared_password_enabled,
  require_invitation_code
) VALUES (
  crypt('1000dias', gen_salt('bf')),
  true,
  true
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. AUTH FUNCTIONS
-- ============================================================================

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

  RETURN stored_hash = crypt(input_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update shared password
CREATE OR REPLACE FUNCTION update_shared_password(new_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.wedding_auth_config
  SET
    shared_password_hash = crypt(new_password, gen_salt('bf')),
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

  -- Session Token
  session_token TEXT NOT NULL UNIQUE,

  -- Authentication Method
  auth_method TEXT NOT NULL CHECK (auth_method IN ('invitation_code', 'shared_password', 'both')),

  -- Session Metadata
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,

  -- Device Info
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

-- ============================================================================
-- 4. SESSION MANAGEMENT FUNCTIONS
-- ============================================================================

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
-- 5. RLS POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.wedding_auth_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view auth config" ON public.wedding_auth_config;
DROP POLICY IF EXISTS "Only admins can update auth config" ON public.wedding_auth_config;
DROP POLICY IF EXISTS "Guests can view own sessions" ON public.guest_sessions;
DROP POLICY IF EXISTS "Anyone can create sessions" ON public.guest_sessions;
DROP POLICY IF EXISTS "Guests can update own sessions" ON public.guest_sessions;
DROP POLICY IF EXISTS "Guests can delete own sessions" ON public.guest_sessions;

-- Auth config: Anyone can read, only admins can modify
CREATE POLICY "Anyone can view auth config"
  ON public.wedding_auth_config FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update auth config"
  ON public.wedding_auth_config FOR UPDATE
  USING (false);

-- Guest sessions: Users can manage their own sessions
CREATE POLICY "Guests can view own sessions"
  ON public.guest_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create sessions"
  ON public.guest_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Guests can update own sessions"
  ON public.guest_sessions FOR UPDATE
  USING (true);

CREATE POLICY "Guests can delete own sessions"
  ON public.guest_sessions FOR DELETE
  USING (true);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 023 complete: Wedding Auth and Sessions';
  RAISE NOTICE '   - Created wedding_auth_config table';
  RAISE NOTICE '   - Created guest_sessions table';
  RAISE NOTICE '   - Added auth helper functions';
  RAISE NOTICE '   - Default shared password: 1000dias';
  RAISE NOTICE '';
  RAISE NOTICE 'Note: invitation_code added to simple_guests in migration 20251014000000';
  RAISE NOTICE 'Note: guest_photos table created in migration 20251013061016';
END $$;
