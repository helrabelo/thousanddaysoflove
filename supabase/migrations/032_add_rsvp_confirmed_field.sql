-- Migration: Add rsvp_confirmed field to invitations table
-- Description: Track whether guest confirmed attendance (yes) or declined (no)
-- Date: 2025-10-15

-- Add rsvp_confirmed field to distinguish between yes/no responses
-- NULL = no response yet
-- TRUE = confirmed attending
-- FALSE = declined (not attending)
ALTER TABLE invitations
ADD COLUMN IF NOT EXISTS rsvp_confirmed BOOLEAN DEFAULT NULL;

-- Update existing records where rsvp_completed is true to assume confirmed (yes)
-- This ensures backwards compatibility with existing data
UPDATE invitations
SET rsvp_confirmed = true
WHERE rsvp_completed = true AND rsvp_confirmed IS NULL;

-- Add index for faster querying
CREATE INDEX IF NOT EXISTS idx_invitations_rsvp_confirmed
ON invitations(rsvp_confirmed);

COMMENT ON COLUMN invitations.rsvp_confirmed IS 'Whether guest confirmed attendance: NULL = no response, TRUE = attending, FALSE = not attending';
