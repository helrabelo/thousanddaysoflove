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
-- Migration 019: Story Preview section admin management
-- Creates tables for StoryPreview section header and story moment cards

-- Table 1: Story Preview Settings (single row for header/photo)
CREATE TABLE IF NOT EXISTS public.story_preview_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Header Content
  section_title VARCHAR(100) DEFAULT 'Nossa História',
  section_description TEXT NOT NULL,

  -- Proposal Photo (left side)
  photo_url TEXT,
  photo_alt VARCHAR(200),
  photo_caption TEXT,

  -- CTA Button
  cta_text VARCHAR(100) DEFAULT 'Ver História Completa',
  cta_link VARCHAR(200) DEFAULT '/historia',

  is_published BOOLEAN DEFAULT true
);

-- Table 2: Story Cards (timeline moments on right side)
CREATE TABLE IF NOT EXISTS public.story_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Card Content
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,

  -- Optional day reference (not displayed, just for reference)
  day_number INTEGER,

  -- Display Settings
  display_order INTEGER NOT NULL,
  is_visible BOOLEAN DEFAULT true
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_story_cards_visible ON public.story_cards(is_visible);
CREATE INDEX IF NOT EXISTS idx_story_cards_order ON public.story_cards(display_order);

-- Insert default story preview settings
INSERT INTO public.story_preview_settings (
  section_title,
  section_description,
  photo_url,
  photo_alt,
  photo_caption,
  cta_text,
  cta_link,
  is_published
) VALUES (
  'Nossa História',
  'Caseiros e introvertidos de verdade. A gente é daqueles que realmente prefere ficar em casa. Unidos por boa comida (especialmente no Mangue Azul), vinhos que acompanham conversas longas, viagens quando dá, e 4 cachorros que fazem barulho demais mas a gente ama.',
  '/images/mock/proposal-photo.jpg',
  'Pedido de casamento em Icaraí',
  'Uma jornada de mil dias começa com um simples "oi"',
  'Ver História Completa',
  '/historia',
  true
);

-- Insert default story cards (3 moments)
INSERT INTO public.story_cards (
  title,
  description,
  day_number,
  display_order,
  is_visible
) VALUES
  (
    'Do Tinder ao WhatsApp',
    '6 de janeiro de 2023. Aquele primeiro "oi" meio sem graça no WhatsApp. A gente quase nem respondeu. Três anos depois, casamento. Vai entender.',
    1,
    1,
    true
  ),
  (
    'O Momento',
    'Hel ficou doente. Ylana apareceu com remédio e chá. "Na hora eu já sabia: ''é ela''". Simples assim.',
    NULL,
    2,
    true
  ),
  (
    'A Casa',
    'Esse apartamento? Hel passava de bicicleta aqui indo pra faculdade. Sonhava morar aqui um dia. Anos de trabalho. Literalmente anos. Agora é nosso. Casa própria. Família de 6. Primeira vez na vida que ele não quer chegar no próximo nível.',
    434,
    3,
    true
  );

-- Add RLS policies
ALTER TABLE public.story_preview_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_cards ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Anyone can read published story preview settings"
  ON public.story_preview_settings
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Anyone can read visible story cards"
  ON public.story_cards
  FOR SELECT
  USING (is_visible = true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can update story preview settings"
  ON public.story_preview_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage story cards"
  ON public.story_cards
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Comments for documentation
COMMENT ON TABLE public.story_preview_settings IS 'Single-row configuration for StoryPreview section header and photo';
COMMENT ON TABLE public.story_cards IS 'Timeline moment cards displayed in StoryPreview section';
COMMENT ON COLUMN public.story_cards.day_number IS 'Optional day reference (Day 1, Day 434, etc.) - not displayed on frontend';
COMMENT ON COLUMN public.story_cards.display_order IS 'Display order (1, 2, 3) for vertical timeline layout';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 019 complete: Story preview tables created';
    RAISE NOTICE '   - Created story_preview_settings table for header/photo';
    RAISE NOTICE '   - Created story_cards table for timeline moments';
    RAISE NOTICE '   - Inserted default content (3 story cards)';
    RAISE NOTICE '   - Added RLS policies for public read/authenticated manage';
END $$;
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
