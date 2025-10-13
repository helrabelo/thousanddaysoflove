-- Add helper function to create guest with auto-generated invitation code
-- This fixes the issue where shared password authentication fails when creating new guests

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

COMMENT ON FUNCTION create_guest_with_invitation IS 'Create a new guest with auto-generated invitation code (used by shared password auth)';
