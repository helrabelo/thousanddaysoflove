-- Fix create_guest_session function to remove last_login reference
-- The last_login column doesn't exist in production simple_guests table

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

  -- Note: Removed last_login update as column doesn't exist in production schema

  RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
