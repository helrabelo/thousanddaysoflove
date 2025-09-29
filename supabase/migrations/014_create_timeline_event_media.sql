-- Create Timeline Event Media Table for Multiple Media Support
-- Allows multiple photos/videos per timeline event while maintaining backward compatibility

-- Create the timeline_event_media table
CREATE TABLE IF NOT EXISTS public.timeline_event_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.timeline_events(id) ON DELETE CASCADE,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_timeline_event_media_event_id ON public.timeline_event_media(event_id);
CREATE INDEX IF NOT EXISTS idx_timeline_event_media_display_order ON public.timeline_event_media(event_id, display_order);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_timeline_event_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER timeline_event_media_updated_at
  BEFORE UPDATE ON public.timeline_event_media
  FOR EACH ROW
  EXECUTE FUNCTION update_timeline_event_media_updated_at();

-- RLS Policies (same as timeline_events - public read, admin write)
ALTER TABLE public.timeline_event_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view timeline event media"
  ON public.timeline_event_media FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert timeline event media"
  ON public.timeline_event_media FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can update timeline event media"
  ON public.timeline_event_media FOR UPDATE
  USING (true);

CREATE POLICY "Admin can delete timeline event media"
  ON public.timeline_event_media FOR DELETE
  USING (true);

-- Add comment
COMMENT ON TABLE public.timeline_event_media IS 'Stores multiple photos/videos for each timeline event';