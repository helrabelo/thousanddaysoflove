-- Timeline Management - Add missing columns if they don't exist

-- Add display_order if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='timeline_events' AND column_name='display_order') THEN
    ALTER TABLE public.timeline_events ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- Add image_url if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='timeline_events' AND column_name='image_url') THEN
    ALTER TABLE public.timeline_events ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- Add is_visible if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='timeline_events' AND column_name='is_visible') THEN
    ALTER TABLE public.timeline_events ADD COLUMN is_visible BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Create index if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_timeline_date') THEN
    CREATE INDEX idx_timeline_date ON public.timeline_events(date DESC, display_order);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read timeline" ON public.timeline_events;
DROP POLICY IF EXISTS "Authenticated can modify timeline" ON public.timeline_events;

-- Create policies
CREATE POLICY "Anyone can read timeline" ON public.timeline_events
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated can modify timeline" ON public.timeline_events
  FOR ALL
  USING (true);