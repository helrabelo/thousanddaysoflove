-- Migration: Add attending column to invitations view
-- Description: Expose the existing simple_guests.attending column through the view
-- Date: 2025-10-18

-- Drop and recreate the invitations view to include attending
DROP VIEW IF EXISTS invitations CASCADE;

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
  notes AS dietary_restrictions,
  opened_at,
  open_count,
  rsvp_completed,
  attending,  -- Expose the existing attending column
  gift_selected,
  photos_uploaded,
  messages_posted,
  created_at,
  updated_at,
  created_by
FROM simple_guests;

-- Recreate INSTEAD OF triggers (include attending in UPDATE)
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
    attending = NEW.attending,  -- Map view's attending to table's attending
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

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON invitations TO anon, authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Added attending column to invitations view';
  RAISE NOTICE '   - Maps to existing simple_guests.attending column';
  RAISE NOTICE '   - Updated triggers to handle attending updates';
END $$;
