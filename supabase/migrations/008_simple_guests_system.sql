-- Simple Guests Table
-- Just the basics: name, attendance, who they're bringing

CREATE TABLE IF NOT EXISTS public.simple_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  attending BOOLEAN DEFAULT NULL, -- NULL = not responded, true = yes, false = no
  plus_ones INTEGER DEFAULT 0, -- how many extra people they're bringing
  notes TEXT, -- dietary restrictions, etc
  confirmed_at TIMESTAMPTZ,
  confirmed_by TEXT, -- 'self' or 'admin' or name of person who confirmed for them
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simple index for searching by name
CREATE INDEX idx_simple_guests_name ON public.simple_guests USING gin(to_tsvector('portuguese', name));

-- RLS Policies - Keep it simple
ALTER TABLE public.simple_guests ENABLE ROW LEVEL SECURITY;

-- Anyone can read (for RSVP search)
CREATE POLICY "Anyone can search guests" ON public.simple_guests
  FOR SELECT
  USING (true);

-- Anyone can update their own RSVP or confirm for others
CREATE POLICY "Anyone can RSVP" ON public.simple_guests
  FOR UPDATE
  USING (true);

-- Admin can do everything (we'll check admin in the app layer)
CREATE POLICY "Anyone can insert guests" ON public.simple_guests
  FOR INSERT
  WITH CHECK (true);