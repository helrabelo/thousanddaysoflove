-- Migration: Add invitation_code to simple_guests
-- Description: Add invitation code field for guest tracking
-- Date: 2025-10-14

-- Add invitation_code column to simple_guests
ALTER TABLE public.simple_guests
ADD COLUMN IF NOT EXISTS invitation_code TEXT;

-- Create index for invitation_code lookups
CREATE INDEX IF NOT EXISTS idx_simple_guests_invitation_code
ON public.simple_guests(invitation_code);

-- Add comment
COMMENT ON COLUMN public.simple_guests.invitation_code IS 'Unique invitation code for guest tracking (e.g., HY123456)';
