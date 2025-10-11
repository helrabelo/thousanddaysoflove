-- Add enhanced RSVP fields to simple_guests table
-- These fields make the RSVP experience more personal and useful

ALTER TABLE public.simple_guests
  ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT,
  ADD COLUMN IF NOT EXISTS song_requests TEXT,
  ADD COLUMN IF NOT EXISTS special_message TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.simple_guests.dietary_restrictions IS 'Dietary restrictions or food allergies (vegetarian, vegan, gluten-free, etc.)';
COMMENT ON COLUMN public.simple_guests.song_requests IS 'Song requests for the wedding playlist';
COMMENT ON COLUMN public.simple_guests.special_message IS 'Special message or wishes for the couple';

-- Update the updated_at timestamp trigger
-- This ensures these fields trigger the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_simple_guests_updated_at ON public.simple_guests;

-- Create trigger for updated_at
CREATE TRIGGER update_simple_guests_updated_at
  BEFORE UPDATE ON public.simple_guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
