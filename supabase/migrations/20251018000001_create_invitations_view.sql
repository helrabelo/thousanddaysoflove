-- Migration: Create invitations view over simple_guests
-- Description: Provides backwards compatibility without code changes
-- Date: 2025-10-18

-- Drop old invitations table (no data loss since it's empty)
DROP TABLE IF EXISTS invitations CASCADE;

-- Create view that maps simple_guests → invitations
CREATE OR REPLACE VIEW invitations AS
SELECT
  id,
  invitation_code AS code,
  name AS guest_name,
  email AS guest_email,
  phone AS guest_phone,
  relationship_type,
  plus_one_allowed,
  plus_one_name,
  custom_message,
  table_number,
  notes AS dietary_restrictions,  -- Map notes to dietary_restrictions
  opened_at,
  open_count,
  rsvp_completed,
  gift_selected,
  photos_uploaded,
  messages_posted,
  created_at,
  updated_at,
  created_by
FROM simple_guests;

-- Create INSTEAD OF triggers for INSERT/UPDATE/DELETE on view
CREATE OR REPLACE FUNCTION invitations_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO simple_guests (
    invitation_code, name, email, phone,
    relationship_type, plus_one_allowed, plus_one_name,
    custom_message, table_number, notes,
    created_by
  ) VALUES (
    NEW.code, NEW.guest_name, NEW.guest_email, NEW.guest_phone,
    NEW.relationship_type, NEW.plus_one_allowed, NEW.plus_one_name,
    NEW.custom_message, NEW.table_number, NEW.dietary_restrictions,
    NEW.created_by
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION invitations_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE simple_guests SET
    invitation_code = NEW.code,
    name = NEW.guest_name,
    email = NEW.guest_email,
    phone = NEW.guest_phone,
    relationship_type = NEW.relationship_type,
    plus_one_allowed = NEW.plus_one_allowed,
    plus_one_name = NEW.plus_one_name,
    custom_message = NEW.custom_message,
    table_number = NEW.table_number,
    notes = NEW.dietary_restrictions,
    opened_at = NEW.opened_at,
    open_count = NEW.open_count,
    rsvp_completed = NEW.rsvp_completed,
    gift_selected = NEW.gift_selected,
    photos_uploaded = NEW.photos_uploaded,
    messages_posted = NEW.messages_posted,
    updated_at = NOW()
  WHERE id = OLD.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION invitations_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM simple_guests WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS invitations_insert_trigger ON invitations;
CREATE TRIGGER invitations_insert_trigger
  INSTEAD OF INSERT ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION invitations_insert();

DROP TRIGGER IF EXISTS invitations_update_trigger ON invitations;
CREATE TRIGGER invitations_update_trigger
  INSTEAD OF UPDATE ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION invitations_update();

DROP TRIGGER IF EXISTS invitations_delete_trigger ON invitations;
CREATE TRIGGER invitations_delete_trigger
  INSTEAD OF DELETE ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION invitations_delete();

-- Grant permissions on view
GRANT SELECT, INSERT, UPDATE, DELETE ON invitations TO anon, authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Created invitations view over simple_guests';
  RAISE NOTICE '   - Code can continue using .from(''invitations'')';
  RAISE NOTICE '   - All operations proxy to simple_guests';
  RAISE NOTICE '   - ZERO code changes required!';
END $$;
