-- Migration 020: Homepage features section admin management
-- Creates tables for QuickPreview section header and feature cards

-- Table 1: Homepage Section Settings (single row for header)
CREATE TABLE IF NOT EXISTS public.homepage_section_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Section Header
  section_title VARCHAR(100) DEFAULT 'Tudo Que Você Precisa',
  section_description TEXT NOT NULL,

  -- Wedding Highlights Card Settings
  highlights_title VARCHAR(200) DEFAULT 'Reserve a Data: 20 de Novembro de 2025',
  show_highlights BOOLEAN DEFAULT true,

  is_published BOOLEAN DEFAULT true
);

-- Table 2: Homepage Features (4 navigation cards)
CREATE TABLE IF NOT EXISTS public.homepage_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Feature Content
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(50) NOT NULL, -- 'Users', 'Gift', 'Calendar', 'MapPin', etc.

  -- Navigation
  link_url VARCHAR(200) NOT NULL,
  link_text VARCHAR(100), -- Optional custom link text

  -- Display Settings
  display_order INTEGER NOT NULL,
  is_visible BOOLEAN DEFAULT true
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_homepage_features_visible ON public.homepage_features(is_visible);
CREATE INDEX IF NOT EXISTS idx_homepage_features_order ON public.homepage_features(display_order);

-- Insert default homepage section settings
INSERT INTO public.homepage_section_settings (
  section_title,
  section_description,
  highlights_title,
  show_highlights,
  is_published
) VALUES (
  'Tudo Que Você Precisa',
  'Da confirmação à lista de presentes, facilitamos para você fazer parte da nossa celebração.',
  'Reserve a Data: 20 de Novembro de 2025',
  true,
  true
);

-- Insert default homepage features (4 cards)
INSERT INTO public.homepage_features (
  title,
  description,
  icon_name,
  link_url,
  link_text,
  display_order,
  is_visible
) VALUES
  (
    'Confirmação',
    'Junte-se a nós para celebrar nosso dia especial',
    'Users',
    '/rsvp',
    'Confirmar Presença',
    1,
    true
  ),
  (
    'Lista de Presentes',
    'Nos ajude a começar nosso novo capítulo juntos',
    'Gift',
    '/presentes',
    'Saiba Mais',
    2,
    true
  ),
  (
    'Cronograma',
    'Datas importantes e eventos',
    'Calendar',
    '#timeline',
    'Saiba Mais',
    3,
    true
  ),
  (
    'Local',
    'Casa HY - Fortaleza, CE',
    'MapPin',
    '/local',
    'Ver Localização',
    4,
    true
  );

-- Add RLS policies
ALTER TABLE public.homepage_section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_features ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Anyone can read published homepage section settings"
  ON public.homepage_section_settings
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Anyone can read visible homepage features"
  ON public.homepage_features
  FOR SELECT
  USING (is_visible = true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can update homepage section settings"
  ON public.homepage_section_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage homepage features"
  ON public.homepage_features
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Comments for documentation
COMMENT ON TABLE public.homepage_section_settings IS 'Single-row configuration for QuickPreview section header';
COMMENT ON TABLE public.homepage_features IS 'Navigation feature cards displayed in QuickPreview section';
COMMENT ON COLUMN public.homepage_features.icon_name IS 'Lucide icon name (Users, Gift, Calendar, MapPin, Heart, etc.)';
COMMENT ON COLUMN public.homepage_features.link_text IS 'Optional custom link text (defaults to "Saiba Mais")';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 020 complete: Homepage features tables created';
    RAISE NOTICE '   - Created homepage_section_settings table for header';
    RAISE NOTICE '   - Created homepage_features table for 4 navigation cards';
    RAISE NOTICE '   - Inserted default content (Confirmação, Presentes, Cronograma, Local)';
    RAISE NOTICE '   - Added RLS policies for public read/authenticated manage';
END $$;
