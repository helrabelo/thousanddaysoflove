-- Mil Dias de Amor - Gallery System
-- Migration 005: Media gallery tables with Supabase Storage integration

-- Create media_items table for photos and videos
CREATE TABLE public.media_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    storage_path TEXT NOT NULL, -- Path in Supabase Storage bucket
    url TEXT NOT NULL, -- Public URL from Supabase Storage
    thumbnail_url TEXT, -- Thumbnail URL (auto-generated)
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video')),
    file_size BIGINT, -- File size in bytes
    aspect_ratio DECIMAL(5,3), -- Width/height ratio
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'engagement', 'travel', 'dates', 'family', 'friends',
        'special_moments', 'proposal', 'wedding_prep', 'behind_scenes', 'professional'
    )),
    tags TEXT[], -- Array of tags
    date_taken DATE,
    location VARCHAR(255),
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    upload_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create timeline_events table for story milestones
CREATE TABLE public.timeline_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video')),
    media_url TEXT NOT NULL, -- URL to media file
    thumbnail_url TEXT,
    location VARCHAR(255),
    milestone_type VARCHAR(50) NOT NULL CHECK (milestone_type IN (
        'first_date', 'anniversary', 'travel', 'proposal', 'family', 'engagement', 'other'
    )),
    is_major_milestone BOOLEAN DEFAULT false,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_media_items_category ON public.media_items(category);
CREATE INDEX idx_media_items_media_type ON public.media_items(media_type);
CREATE INDEX idx_media_items_is_featured ON public.media_items(is_featured);
CREATE INDEX idx_media_items_is_public ON public.media_items(is_public);
CREATE INDEX idx_media_items_date_taken ON public.media_items(date_taken);
CREATE INDEX idx_media_items_upload_date ON public.media_items(upload_date);
CREATE INDEX idx_media_items_tags ON public.media_items USING GIN (tags);

CREATE INDEX idx_timeline_events_date ON public.timeline_events(date);
CREATE INDEX idx_timeline_events_milestone_type ON public.timeline_events(milestone_type);
CREATE INDEX idx_timeline_events_is_major_milestone ON public.timeline_events(is_major_milestone);
CREATE INDEX idx_timeline_events_order_index ON public.timeline_events(order_index);

-- Add updated_at triggers
CREATE TRIGGER update_media_items_updated_at BEFORE UPDATE ON public.media_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add constraints
ALTER TABLE public.media_items ADD CONSTRAINT check_positive_file_size
    CHECK (file_size IS NULL OR file_size > 0);

ALTER TABLE public.media_items ADD CONSTRAINT check_positive_aspect_ratio
    CHECK (aspect_ratio IS NULL OR aspect_ratio > 0);

-- Ensure order_index is unique for timeline events
CREATE UNIQUE INDEX idx_timeline_events_unique_order ON public.timeline_events(order_index);

-- Comments for documentation
COMMENT ON TABLE public.media_items IS 'Fotos e vídeos da galeria do casamento armazenados no Supabase Storage';
COMMENT ON TABLE public.timeline_events IS 'Eventos da linha do tempo da história de amor do casal';

COMMENT ON COLUMN public.media_items.storage_path IS 'Caminho do arquivo no bucket do Supabase Storage';
COMMENT ON COLUMN public.media_items.url IS 'URL pública do arquivo no Supabase Storage';
COMMENT ON COLUMN public.media_items.file_size IS 'Tamanho do arquivo em bytes';
COMMENT ON COLUMN public.media_items.tags IS 'Array de tags para busca e organização';
COMMENT ON COLUMN public.timeline_events.order_index IS 'Índice de ordenação na linha do tempo';

-- Create storage bucket for wedding media (will be created via Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('wedding-media', 'wedding-media', true);

-- Create storage policies (will be created via Supabase dashboard)
-- These policies will allow:
-- 1. Public read access to all files
-- 2. Authenticated users can upload files
-- 3. Only authenticated users can delete files