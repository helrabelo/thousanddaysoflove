-- Migration: Add rsvp_confirmed field to simple_guests table
-- Description: Track whether guest confirmed attendance (yes) or declined (no)
-- Note: invitations is a VIEW over simple_guests, so we add to the underlying table
-- Date: 2025-10-15

-- Add rsvp_confirmed field to simple_guests (underlying table for invitations view)
-- NULL = no response yet
-- TRUE = confirmed attending
-- FALSE = declined (not attending)
ALTER TABLE simple_guests
ADD COLUMN IF NOT EXISTS rsvp_confirmed BOOLEAN DEFAULT NULL;

-- Update existing records where rsvp_completed is true to assume confirmed (yes)
-- This ensures backwards compatibility with existing data
UPDATE simple_guests
SET rsvp_confirmed = true
WHERE rsvp_completed = true AND rsvp_confirmed IS NULL;

-- Add index for faster querying
CREATE INDEX IF NOT EXISTS idx_simple_guests_rsvp_confirmed
ON simple_guests(rsvp_confirmed);

COMMENT ON COLUMN simple_guests.rsvp_confirmed IS 'Whether guest confirmed attendance: NULL = no response, TRUE = attending, FALSE = not attending';
