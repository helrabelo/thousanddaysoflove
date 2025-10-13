-- Missing Functions for Cloud Supabase
-- Copy and paste this entire file into Supabase SQL Editor
-- https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/editor/sql

-- 1. Function to verify shared password
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

-- 2. Function to create guest with auto-generated invitation code
CREATE OR REPLACE FUNCTION create_guest_with_invitation(p_name TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  invitation_code TEXT,
  attending BOOLEAN,
  account_created BOOLEAN
) AS $$
DECLARE
  new_guest_id UUID;
  new_invitation_code TEXT;
BEGIN
  -- Generate unique invitation code
  new_invitation_code := generate_guest_invitation_code();

  -- Insert new guest
  INSERT INTO public.simple_guests (name, invitation_code, attending, account_created)
  VALUES (p_name, new_invitation_code, true, true)
  RETURNING simple_guests.id INTO new_guest_id;

  -- Return guest details
  RETURN QUERY
  SELECT
    g.id,
    g.name,
    g.invitation_code,
    g.attending,
    g.account_created
  FROM public.simple_guests g
  WHERE g.id = new_guest_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Function to create guest session
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

-- Comments
COMMENT ON FUNCTION verify_shared_password IS 'Verify guest-provided password against shared password';
COMMENT ON FUNCTION create_guest_with_invitation IS 'Create a new guest with auto-generated invitation code (used by shared password auth)';
COMMENT ON FUNCTION create_guest_session IS 'Create new authenticated guest session';
