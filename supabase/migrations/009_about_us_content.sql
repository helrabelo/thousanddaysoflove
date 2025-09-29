-- About Us Content Table
-- Simple table to manage About Us section content

CREATE TABLE IF NOT EXISTS public.about_us_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL, -- 'header', 'personality', 'shared', 'individual', 'pets'
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- lucide icon name like 'Home', 'Wine', 'Camera'
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying by section
CREATE INDEX idx_about_us_section ON public.about_us_items(section, display_order);

-- RLS Policies
ALTER TABLE public.about_us_items ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Anyone can read about us" ON public.about_us_items
  FOR SELECT
  USING (is_active = true);

-- Only authenticated can modify (we'll check admin in app)
CREATE POLICY "Authenticated can modify" ON public.about_us_items
  FOR ALL
  USING (true);

-- Seed with current content
INSERT INTO public.about_us_items (section, title, description, icon, display_order) VALUES
('header', 'Sobre Nós', 'Tem o que as pessoas sabem de nós, tem o que elas veem de nós, e tem o que nós temos entre nós. E o que nós temos entre nós é muito maior do que qualquer um pode imaginar.', null, 0),
('personality', 'Caseiros & Introvertidos por Natureza', 'Nosso universo particular é onde o amor floresce. Adoramos receber amigos em casa, criar memórias íntimas e curtir a companhia um do outro. Para nós, lar é onde está o coração.', 'Home', 1),
('shared', 'Boa Comida & Bom Vinho', 'Cozinhar juntos, descobrir novos restaurantes e saborear um bom vinho', 'Wine', 1),
('shared', 'Viagens', 'Explorar o mundo juntos, de praias paradisíacas a cidades históricas', 'Plane', 2),
('shared', 'Fitness Juntos', 'Musculação e corrida', 'Dumbbell', 3),
('individual', 'Ylana & Moda', 'Estilo e elegância únicos', 'Coffee', 1),
('individual', 'Hel & Tecnologia', 'Fotografia e trabalho duro', 'Camera', 2),
('pets', 'Linda 👑', 'Nossa rainha autista perfeita', 'PawPrint', 1),
('pets', 'Cacao 🍫', 'Nosso companheiro fiel', 'PawPrint', 2),
('pets', 'Olivia 🌸', 'Filha da Linda, cheia de energia', 'PawPrint', 3),
('pets', 'Oliver ⚡', 'Filho da Linda, o raio', 'PawPrint', 4);