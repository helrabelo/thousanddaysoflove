-- Migration: Add Photo Reactions and Comments System
-- Description: Create photo_reactions and photo_comments tables similar to guest posts system
-- Date: 2025-10-19

-- =====================================================
-- 1. PHOTO REACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.photo_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES public.guest_photos(id) ON DELETE CASCADE,
  guest_session_id UUID REFERENCES public.guest_sessions(id) ON DELETE SET NULL,
  guest_name TEXT,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'clap', 'laugh', 'celebrate', 'love')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- One reaction per guest per photo
  UNIQUE(photo_id, guest_session_id)
);

-- Indexes for photo_reactions
CREATE INDEX idx_photo_reactions_photo_id ON public.photo_reactions(photo_id);
CREATE INDEX idx_photo_reactions_guest_session ON public.photo_reactions(guest_session_id);
CREATE INDEX idx_photo_reactions_reaction_type ON public.photo_reactions(reaction_type);

COMMENT ON TABLE public.photo_reactions IS 'Likes and reactions on guest photos (heart, clap, laugh, celebrate, love)';

-- =====================================================
-- 2. PHOTO COMMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.photo_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES public.guest_photos(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.photo_comments(id) ON DELETE CASCADE,
  guest_session_id UUID REFERENCES public.guest_sessions(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_comment_content CHECK (length(content) > 0 AND length(content) <= 1000)
);

-- Indexes for photo_comments
CREATE INDEX idx_photo_comments_photo_id ON public.photo_comments(photo_id);
CREATE INDEX idx_photo_comments_parent_id ON public.photo_comments(parent_comment_id);
CREATE INDEX idx_photo_comments_created_at ON public.photo_comments(created_at ASC);

COMMENT ON TABLE public.photo_comments IS 'Comments and replies on guest photos with threading support';

-- =====================================================
-- 3. ADD REACTIONS_COUNT TO GUEST_PHOTOS
-- =====================================================

-- Add reactions_count column (separate from like_count for backwards compatibility)
ALTER TABLE public.guest_photos
ADD COLUMN IF NOT EXISTS reactions_count INTEGER DEFAULT 0;

COMMENT ON COLUMN public.guest_photos.reactions_count IS 'Total count of all reactions (heart, clap, laugh, celebrate, love)';

-- =====================================================
-- 4. TRIGGERS FOR AUTOMATIC COUNT UPDATES
-- =====================================================

-- Update reactions_count when reactions change
CREATE OR REPLACE FUNCTION update_photo_reactions_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.guest_photos
    SET reactions_count = reactions_count + 1
    WHERE id = NEW.photo_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.guest_photos
    SET reactions_count = GREATEST(reactions_count - 1, 0)
    WHERE id = OLD.photo_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reactions_count_on_reaction ON public.photo_reactions;
CREATE TRIGGER update_reactions_count_on_reaction
  AFTER INSERT OR DELETE ON public.photo_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_photo_reactions_count();

-- Update comment_count when photo comments change (using new table)
CREATE OR REPLACE FUNCTION update_photo_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.guest_photos
    SET comment_count = comment_count + 1
    WHERE id = NEW.photo_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.guest_photos
    SET comment_count = GREATEST(comment_count - 1, 0)
    WHERE id = OLD.photo_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_comments_count_on_photo_comment ON public.photo_comments;
CREATE TRIGGER update_comments_count_on_photo_comment
  AFTER INSERT OR DELETE ON public.photo_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_photo_comments_count();

-- Update updated_at timestamp for photo comments
DROP TRIGGER IF EXISTS update_photo_comments_updated_at ON public.photo_comments;
CREATE TRIGGER update_photo_comments_updated_at
  BEFORE UPDATE ON public.photo_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.photo_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view reactions on approved photos" ON public.photo_reactions;
DROP POLICY IF EXISTS "Guests can manage their own reactions" ON public.photo_reactions;
DROP POLICY IF EXISTS "Anyone can view comments on approved photos" ON public.photo_comments;
DROP POLICY IF EXISTS "Guests can create comments" ON public.photo_comments;
DROP POLICY IF EXISTS "Service role can manage all photo comments" ON public.photo_comments;

-- Photo reactions policies
CREATE POLICY "Anyone can view reactions on approved photos"
  ON public.photo_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.guest_photos
      WHERE id = photo_reactions.photo_id
      AND moderation_status = 'approved'
    )
  );

CREATE POLICY "Guests can manage their own reactions"
  ON public.photo_reactions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Photo comments policies
CREATE POLICY "Anyone can view comments on approved photos"
  ON public.photo_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.guest_photos
      WHERE id = photo_comments.photo_id
      AND moderation_status = 'approved'
    )
  );

CREATE POLICY "Guests can create comments"
  ON public.photo_comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage all photo comments"
  ON public.photo_comments FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- =====================================================
-- 6. MIGRATE EXISTING DATA (if any)
-- =====================================================

-- Migrate photo_likes to photo_reactions (as 'heart' type)
INSERT INTO public.photo_reactions (photo_id, guest_session_id, guest_name, reaction_type, created_at)
SELECT
  pl.photo_id,
  NULL as guest_session_id, -- old system didn't track sessions
  pl.guest_name,
  'heart' as reaction_type,
  pl.created_at
FROM public.photo_likes pl
ON CONFLICT (photo_id, guest_session_id) DO NOTHING;

-- Update reactions_count based on migrated data
UPDATE public.guest_photos gp
SET reactions_count = (
  SELECT COUNT(*)
  FROM public.photo_reactions pr
  WHERE pr.photo_id = gp.id
)
WHERE reactions_count = 0;
