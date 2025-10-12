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
