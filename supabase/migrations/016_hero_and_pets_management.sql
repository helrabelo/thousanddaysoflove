-- Migration 016: Hero Images and Pet Portraits Management
-- Adds tables for managing hero images and pet portraits through admin interface

-- ========================================
-- SITE SETTINGS TABLE (Hero Images + Global Settings)
-- ========================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'text' CHECK (setting_type IN ('text', 'url', 'number', 'boolean', 'json')),
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert hero image settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description) VALUES
    ('hero_poster_url', '/images/hero-poster.jpg', 'url', 'Hero video poster image (1920x1080)'),
    ('hero_couple_url', '/images/hero-couple.jpg', 'url', 'Hero fallback image for reduced motion (1920x1080)')
ON CONFLICT (setting_key) DO NOTHING;

-- Create index
CREATE INDEX idx_site_settings_key ON public.site_settings(setting_key);

-- Add updated_at trigger
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE public.site_settings IS 'Configurações globais do site incluindo URLs de imagens hero';
COMMENT ON COLUMN public.site_settings.setting_key IS 'Chave única da configuração (ex: hero_poster_url)';

-- ========================================
-- PETS TABLE (Pet Portraits)
-- ========================================
CREATE TABLE IF NOT EXISTS public.pets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100),
    species VARCHAR(50) NOT NULL CHECK (species IN ('dog', 'cat', 'other')),
    breed VARCHAR(100),
    description TEXT,
    personality VARCHAR(255),
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    date_joined DATE, -- When they joined the family
    is_visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert the 4 pets (Linda, Cacao, Olivia, Oliver)
INSERT INTO public.pets (name, species, breed, description, personality, image_url, thumbnail_url, display_order, date_joined) VALUES
    ('Linda', 'cat', 'Vira-lata', 'A matriarca autista da família', 'Matriarca Autista 👑', '/images/pets/linda.jpg', '/images/pets/linda-thumb.jpg', 1, '2023-01-01'),
    ('Cacao', 'cat', 'Vira-lata', 'O companheiro carinhoso', 'Companheiro 🍫', '/images/pets/cacao.jpg', '/images/pets/cacao-thumb.jpg', 2, '2023-06-01'),
    ('Olivia', 'cat', 'Vira-lata', 'A filhote doce e carinhosa', 'Filhote Doce 🌸', '/images/pets/olivia.jpg', '/images/pets/olivia-thumb.jpg', 3, '2024-01-15'),
    ('Oliver', 'cat', 'Vira-lata', 'O filhote energético e brincalhão', 'Filhote Energético ⚡', '/images/pets/oliver.jpg', '/images/pets/oliver-thumb.jpg', 4, '2024-01-15')
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX idx_pets_display_order ON public.pets(display_order);
CREATE INDEX idx_pets_is_visible ON public.pets(is_visible);
CREATE INDEX idx_pets_species ON public.pets(species);

-- Add updated_at trigger
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON public.pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE public.pets IS 'Pets da família que aparecem no site';
COMMENT ON COLUMN public.pets.date_joined IS 'Data em que o pet se juntou à família';
COMMENT ON COLUMN public.pets.personality IS 'Descrição curta da personalidade (ex: Matriarca Autista 👑)';

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Site Settings Policies
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated can modify site settings" ON public.site_settings;

CREATE POLICY "Anyone can read site settings" ON public.site_settings
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated can modify site settings" ON public.site_settings
    FOR ALL
    USING (true);

-- Pets Policies
DROP POLICY IF EXISTS "Anyone can read visible pets" ON public.pets;
DROP POLICY IF EXISTS "Authenticated can modify pets" ON public.pets;

CREATE POLICY "Anyone can read visible pets" ON public.pets
    FOR SELECT
    USING (is_visible = true);

CREATE POLICY "Authenticated can modify pets" ON public.pets
    FOR ALL
    USING (true);

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 016 complete: Hero images and pets tables created';
END $$;
