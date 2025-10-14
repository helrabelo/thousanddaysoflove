-- Migration 017: Add fields for full-bleed timeline design
-- Adds day_number, content_align, phase, and video_url for cinematic timeline

-- Add day_number column (Day 1, Day 8, Day 434, etc.)
ALTER TABLE public.timeline_events
ADD COLUMN IF NOT EXISTS day_number INTEGER;

-- Add content_align for alternating layout ('left' or 'right')
ALTER TABLE public.timeline_events
ADD COLUMN IF NOT EXISTS content_align VARCHAR(10) DEFAULT 'left' CHECK (content_align IN ('left', 'right'));

-- Add phase for grouping timeline moments
ALTER TABLE public.timeline_events
ADD COLUMN IF NOT EXISTS phase VARCHAR(50);

-- Add video_url for video background support
ALTER TABLE public.timeline_events
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add imageAlt for accessibility
ALTER TABLE public.timeline_events
ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- Create index on day_number for sorting
CREATE INDEX IF NOT EXISTS idx_timeline_day_number ON public.timeline_events(day_number);

-- Create index on phase for filtering
CREATE INDEX IF NOT EXISTS idx_timeline_phase ON public.timeline_events(phase);

-- COMMENTED OUT: timeline_events will be dropped (moved to Sanity CMS)
-- Insert/Update the 8 key timeline moments for full-bleed design
-- PHASE 1: Os Primeiros Dias (Day 1-100)
/*
INSERT INTO public.timeline_events (
  day_number, date, title, description, image_url, image_alt, content_align, phase, milestone_type, display_order, is_visible
) VALUES
  (
    1,
    '2023-01-06',
    'Primeiro ''Oi''',
    '6 de janeiro de 2023. Aquele primeiro ''oi'' meio sem graça no WhatsApp. A gente quase nem respondeu. Três anos depois, casamento. Vai entender.',
    '/images/mock/timeline-day1.jpg',
    'Primeiro encontro',
    'left',
    'primeiros_dias',
    'first_meet',
    1,
    true
  ),
  (
    8,
    '2023-01-13',
    'Primeiro Encontro',
    'Casa Fontana. Aquele jantar que podia ter dado muito errado mas deu muito certo. Conversamos por horas. No final, nenhum dos dois queria ir embora.',
    '/images/mock/timeline-day8.jpg',
    'Primeiro jantar juntos',
    'right',
    'primeiros_dias',
    'first_meet',
    2,
    true
  ),
  -- PHASE 2: Construindo Juntos (Day 100-500)
  (
    200,
    '2023-07-25',
    'Linda Chega',
    'A primeira filha. Linda. Nome certeiro. Matriarca autista que manda em todo mundo até hoje. Mudou tudo. De repente a gente era uma família.',
    '/images/mock/timeline-day200.jpg',
    'Linda, nossa primeira cachorra',
    'left',
    'construindo_juntos',
    'pet',
    3,
    true
  ),
  (
    434,
    '2024-03-14',
    'Casa Própria',
    'Esse apartamento? Hel passava de bicicleta aqui indo pra faculdade. Sonhava morar aqui um dia. Anos de trabalho. Literalmente anos. Agora é nosso. Casa própria. Família de 6. Primeira vez na vida que ele não quer chegar no próximo nível.',
    '/images/mock/timeline-day434.jpg',
    'Nosso apartamento',
    'right',
    'construindo_juntos',
    'home',
    4,
    true
  ),
  -- PHASE 3: Nossa Família (Day 500-900)
  (
    600,
    '2024-08-22',
    'Cacao Se Junta à Família',
    'Ylana viu, Ylana quis, Ylana trouxe. Cacao chegou e virou o companheiro oficial. Menos autista que a Linda, mais carinhoso, e completa a vibe da casa.',
    '/images/mock/timeline-day600.jpg',
    'Cacao',
    'left',
    'nossa_familia',
    'pet',
    5,
    true
  ),
  (
    700,
    '2024-11-10',
    'Olivia & Oliver Nascem',
    'Linda teve filhotes. Olivia, a doce. Oliver, o energético. A gente ia dar os filhotes. Óbvio que não deu certo. Ficamos com os dois. Família de 6 completa.',
    '/images/mock/timeline-day700.jpg',
    'Olivia e Oliver',
    'right',
    'nossa_familia',
    'pet',
    6,
    true
  ),
  -- PHASE 4: Caminhando Pro Altar (Day 900-1000)
  (
    900,
    '2025-09-09',
    'O Pedido em Icaraí',
    'Praia de Icaraí. Hel estava nervoso. Ylana desconfiada. Ele ajoelhou. Ela disse sim. 900 dias juntos. Mais 1000 pela frente.',
    '/images/mock/timeline-day900.jpg',
    'Pedido de casamento',
    'left',
    'caminhando_altar',
    'proposal',
    7,
    true
  ),
  (
    1000,
    '2025-11-20',
    'Mil Dias de Amor',
    'E aqui estamos. 1000 dias depois daquele primeiro ''oi'' sem graça. Casa própria. 4 cachorros. E a gente casando. Porque às vezes o clichê é bom demais.',
    '/images/mock/timeline-day1000.jpg',
    'Nosso casamento',
    'right',
    'caminhando_altar',
    'anniversary',
    8,
    true
  )
ON CONFLICT (id) DO NOTHING;
*/

-- Comments for documentation
COMMENT ON COLUMN public.timeline_events.day_number IS 'Day count in relationship (Day 1, Day 8, Day 434, etc.)';
COMMENT ON COLUMN public.timeline_events.content_align IS 'Content position for full-bleed design: left or right';
COMMENT ON COLUMN public.timeline_events.phase IS 'Timeline phase: primeiros_dias, construindo_juntos, nossa_familia, caminhando_altar';
COMMENT ON COLUMN public.timeline_events.video_url IS 'Optional video URL for background instead of image';
COMMENT ON COLUMN public.timeline_events.image_alt IS 'Alt text for image accessibility';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 017 complete: Full-bleed timeline fields added';
    RAISE NOTICE '   - Added day_number, content_align, phase, video_url, image_alt columns';
    RAISE NOTICE '   - ⏭️  Skipped INSERT (timeline_events will be dropped - moved to Sanity)';
    RAISE NOTICE '   - Created indexes for day_number and phase';
END $$;
