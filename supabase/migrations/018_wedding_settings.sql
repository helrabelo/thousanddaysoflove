-- Migration 018: Wedding Settings table for admin-managed wedding details
-- Stores wedding date, time, venue, dress code, and all event configuration

-- Create wedding_settings table (single row configuration)
CREATE TABLE IF NOT EXISTS public.wedding_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Wedding Date & Time
  wedding_date DATE NOT NULL,
  wedding_time TIME NOT NULL,
  wedding_timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',

  -- Bride & Groom Names
  bride_name VARCHAR(100) NOT NULL,
  groom_name VARCHAR(100) NOT NULL,

  -- Venue Information
  venue_name VARCHAR(200) NOT NULL,
  venue_address VARCHAR(300) NOT NULL,
  venue_city VARCHAR(100) NOT NULL,
  venue_state VARCHAR(50) NOT NULL,
  venue_zip VARCHAR(20),
  venue_country VARCHAR(100) DEFAULT 'Brasil',

  -- Google Maps Integration
  venue_lat DECIMAL(10, 8),
  venue_lng DECIMAL(11, 8),
  google_maps_place_id VARCHAR(200),

  -- Event Details
  reception_time TIME,
  dress_code VARCHAR(100),
  dress_code_description TEXT,

  -- Additional Settings
  rsvp_deadline DATE,
  guest_limit INTEGER,
  is_published BOOLEAN DEFAULT false
);

-- Create index for quick lookup
CREATE INDEX IF NOT EXISTS idx_wedding_settings_published ON public.wedding_settings(is_published);

-- Insert default wedding settings (Hel & Ylana's wedding)
INSERT INTO public.wedding_settings (
  wedding_date,
  wedding_time,
  wedding_timezone,
  bride_name,
  groom_name,
  venue_name,
  venue_address,
  venue_city,
  venue_state,
  venue_zip,
  venue_lat,
  venue_lng,
  reception_time,
  dress_code,
  dress_code_description,
  rsvp_deadline,
  is_published
) VALUES (
  '2025-11-20',
  '10:30:00',
  'America/Sao_Paulo',
  'Ylana',
  'Hel',
  'Constable Galerie',
  'Rua Lopes Quintas, 356',
  'Rio de Janeiro',
  'RJ',
  '22460-010',
  -22.959722,
  -43.212778,
  '12:00:00',
  'Traje Esporte Fino',
  'Homens: terno ou blazer. Mulheres: vestido de festa.',
  '2025-11-10',
  true
);

-- Add RLS policies
ALTER TABLE public.wedding_settings ENABLE ROW LEVEL SECURITY;

-- Public can read published settings
CREATE POLICY "Anyone can read published wedding settings"
  ON public.wedding_settings
  FOR SELECT
  USING (is_published = true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update wedding settings"
  ON public.wedding_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Comments for documentation
COMMENT ON TABLE public.wedding_settings IS 'Single-row configuration table for wedding event details managed via /admin/wedding-settings';
COMMENT ON COLUMN public.wedding_settings.wedding_date IS 'Wedding ceremony date';
COMMENT ON COLUMN public.wedding_settings.wedding_time IS 'Wedding ceremony start time';
COMMENT ON COLUMN public.wedding_settings.venue_lat IS 'Latitude for Google Maps integration';
COMMENT ON COLUMN public.wedding_settings.venue_lng IS 'Longitude for Google Maps integration';
COMMENT ON COLUMN public.wedding_settings.dress_code IS 'Dress code title (e.g., "Traje Esporte Fino")';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 018 complete: Wedding settings table created';
    RAISE NOTICE '   - Created wedding_settings table with venue and event details';
    RAISE NOTICE '   - Inserted default Hel & Ylana wedding configuration';
    RAISE NOTICE '   - Added RLS policies for public read/authenticated update';
END $$;
