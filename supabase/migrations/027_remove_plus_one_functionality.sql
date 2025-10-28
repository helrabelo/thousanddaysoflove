-- Migration 027: Remove Plus One Functionality
-- Date: 2025-10-28
-- Description: Remove all plus_one related fields from database tables
--              All guests will now be managed individually

BEGIN;

-- ============================================================================
-- STEP 1: Drop plus_one columns from simple_guests table (main guest table)
-- ============================================================================
ALTER TABLE IF EXISTS simple_guests
  DROP COLUMN IF EXISTS plus_ones CASCADE,
  DROP COLUMN IF EXISTS plus_one_allowed CASCADE,
  DROP COLUMN IF EXISTS plus_one_name CASCADE;

-- ============================================================================
-- STEP 2: Drop plus_one columns from invitations table
-- ============================================================================
ALTER TABLE IF EXISTS invitations
  DROP COLUMN IF EXISTS plus_one_allowed CASCADE,
  DROP COLUMN IF EXISTS plus_one_name CASCADE;

-- ============================================================================
-- STEP 3: Update get_table_guests() function to remove plus_one fields
-- ============================================================================
DROP FUNCTION IF EXISTS get_table_guests(UUID);

CREATE OR REPLACE FUNCTION get_table_guests(table_id_param UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  relationship TEXT,
  table_id UUID,
  table_number INTEGER,
  table_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sg.id,
    sg.name,
    sg.relationship,
    sg.table_id,
    t.table_number,
    t.table_name
  FROM simple_guests sg
  LEFT JOIN tables t ON sg.table_id = t.id
  WHERE sg.table_id = table_id_param
  ORDER BY sg.name;
END;
$$ LANGUAGE plpgsql STABLE;

COMMIT;
