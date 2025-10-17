-- Migration: Enhance simple_guests with invitations features
-- Description: Add missing columns from invitations table to simple_guests
-- This allows us to drop the invitations table and use simple_guests for everything
-- Date: 2025-10-18

-- Add missing columns from invitations table
ALTER TABLE public.simple_guests
  -- Relationship & categorization
  ADD COLUMN IF NOT EXISTS relationship_type TEXT CHECK (relationship_type IN ('family', 'friend', 'colleague', 'other')),

  -- Plus one details (plus_ones INTEGER already exists)
  ADD COLUMN IF NOT EXISTS plus_one_allowed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS plus_one_name TEXT,

  -- Event details
  ADD COLUMN IF NOT EXISTS custom_message TEXT,
  ADD COLUMN IF NOT EXISTS table_number INTEGER,

  -- Tracking (invitation_code already exists from migration 20251014000000)
  ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS open_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rsvp_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS gift_selected BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS photos_uploaded BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS messages_posted BOOLEAN DEFAULT false,

  -- Account status
  ADD COLUMN IF NOT EXISTS account_created BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by TEXT; -- 'admin' or 'self' or admin name

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_simple_guests_relationship_type ON public.simple_guests(relationship_type);
CREATE INDEX IF NOT EXISTS idx_simple_guests_attending ON public.simple_guests(attending);
CREATE INDEX IF NOT EXISTS idx_simple_guests_last_login ON public.simple_guests(last_login DESC);

-- Add email constraint
ALTER TABLE public.simple_guests
  DROP CONSTRAINT IF EXISTS simple_guests_email_check,
  ADD CONSTRAINT simple_guests_email_check
    CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add invitation code uniqueness constraint (if not already exists)
ALTER TABLE public.simple_guests
  DROP CONSTRAINT IF EXISTS simple_guests_invitation_code_unique;

ALTER TABLE public.simple_guests
  ADD CONSTRAINT simple_guests_invitation_code_unique UNIQUE (invitation_code);

-- Update function to handle new columns
CREATE OR REPLACE FUNCTION update_simple_guests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_simple_guests_updated_at ON public.simple_guests;
CREATE TRIGGER update_simple_guests_updated_at
  BEFORE UPDATE ON public.simple_guests
  FOR EACH ROW
  EXECUTE FUNCTION update_simple_guests_updated_at();

-- Update create_guest_session function to handle last_login
-- (This fixes the issue mentioned in migration 031)
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

  -- Update guest last_login (now that column exists!)
  UPDATE public.simple_guests
  SET last_login = NOW()
  WHERE id = p_guest_id;

  RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Add comment
COMMENT ON TABLE public.simple_guests IS 'Unified guest table for invitations, RSVPs, and authentication';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Enhanced simple_guests table with invitation features';
  RAISE NOTICE '   - Added relationship_type, plus_one details';
  RAISE NOTICE '   - Added tracking columns (opened_at, progress flags)';
  RAISE NOTICE '   - Added account_created, last_login';
  RAISE NOTICE '   - Added indexes and constraints';
  RAISE NOTICE '   - Ready to drop invitations table!';
END $$;
