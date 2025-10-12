-- Migration 021: Video hero section text overlay admin management
-- Creates table for VideoHeroSection text content (names, tagline, CTAs)

-- Create hero_text table (single row configuration)
CREATE TABLE IF NOT EXISTS public.hero_text (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Monogram (e.g., "H ♥ Y")
  monogram VARCHAR(20) DEFAULT 'H ♥ Y',

  -- Names
  bride_name VARCHAR(50) NOT NULL,
  groom_name VARCHAR(50) NOT NULL,
  names_separator VARCHAR(10) DEFAULT '&', -- " & ", " e ", etc.

  -- Tagline/Subtitle
  tagline TEXT NOT NULL,

  -- Date Badge
  date_badge VARCHAR(50) NOT NULL, -- "20.11.2025"

  -- CTA Buttons
  primary_cta_text VARCHAR(100) DEFAULT 'Confirmar Presença',
  primary_cta_link VARCHAR(200) DEFAULT '/rsvp',
  secondary_cta_text VARCHAR(100) DEFAULT 'Nossa História',
  secondary_cta_link VARCHAR(200) DEFAULT '/historia',

  -- Scroll Indicator
  scroll_text VARCHAR(50) DEFAULT 'Explorar',

  is_published BOOLEAN DEFAULT true
);

-- Create index for quick lookup
CREATE INDEX IF NOT EXISTS idx_hero_text_published ON public.hero_text(is_published);

-- Insert default hero text (Hel & Ylana's wedding)
INSERT INTO public.hero_text (
  monogram,
  bride_name,
  groom_name,
  names_separator,
  tagline,
  date_badge,
  primary_cta_text,
  primary_cta_link,
  secondary_cta_text,
  secondary_cta_link,
  scroll_text,
  is_published
) VALUES (
  'H ♥ Y',
  'Ylana',
  'Hel',
  '&',
  '1000 dias. Sim, a gente fez a conta.',
  '20.11.2025',
  'Confirmar Presença',
  '/rsvp',
  'Nossa História',
  '/historia',
  'Explorar',
  true
);

-- Add RLS policies
ALTER TABLE public.hero_text ENABLE ROW LEVEL SECURITY;

-- Public can read published hero text
CREATE POLICY "Anyone can read published hero text"
  ON public.hero_text
  FOR SELECT
  USING (is_published = true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update hero text"
  ON public.hero_text
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Comments for documentation
COMMENT ON TABLE public.hero_text IS 'Single-row configuration for VideoHeroSection text overlay content';
COMMENT ON COLUMN public.hero_text.monogram IS 'Couple monogram displayed above names (e.g., "H ♥ Y")';
COMMENT ON COLUMN public.hero_text.names_separator IS 'Character between names (& or e)';
COMMENT ON COLUMN public.hero_text.tagline IS 'Subtitle/tagline displayed below names';
COMMENT ON COLUMN public.hero_text.date_badge IS 'Wedding date displayed in badge format (20.11.2025)';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 021 complete: Hero text table created';
    RAISE NOTICE '   - Created hero_text table for VideoHero overlay content';
    RAISE NOTICE '   - Inserted default text (Hel & Ylana, 1000 dias tagline)';
    RAISE NOTICE '   - Added RLS policies for public read/authenticated update';
    RAISE NOTICE '   - Note: Hero images (poster, couple) managed via site_settings';
END $$;
