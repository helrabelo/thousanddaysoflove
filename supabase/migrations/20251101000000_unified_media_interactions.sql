-- Migration: Create unified media reactions and comments tables
-- Purpose: Consolidate photo and post interactions into polymorphic media tables

BEGIN;

-- =====================================================
-- Helper enums and checks
-- =====================================================

CREATE TABLE IF NOT EXISTS public.media_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type TEXT NOT NULL CHECK (media_type IN ('guest_photo', 'sanity_image', 'guest_post')),
  media_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'clap', 'laugh', 'celebrate', 'love')),
  guest_session_id UUID,
  guest_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT media_reactions_guest_identity_check
    CHECK (guest_session_id IS NOT NULL OR guest_name IS NOT NULL)
);

-- Unique identity constraints (session preferred, fallback to guest name)
CREATE UNIQUE INDEX IF NOT EXISTS media_reactions_unique_session
  ON public.media_reactions (media_type, media_id, guest_session_id)
  WHERE guest_session_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS media_reactions_unique_guest
  ON public.media_reactions (media_type, media_id, lower(guest_name))
  WHERE guest_session_id IS NULL AND guest_name IS NOT NULL;

-- Lookup indexes
CREATE INDEX IF NOT EXISTS idx_media_reactions_lookup
  ON public.media_reactions (media_type, media_id);

CREATE INDEX IF NOT EXISTS idx_media_reactions_created_at
  ON public.media_reactions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_media_reactions_guest_session
  ON public.media_reactions (guest_session_id)
  WHERE guest_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_media_reactions_guest_name
  ON public.media_reactions (guest_name)
  WHERE guest_session_id IS NULL AND guest_name IS NOT NULL;

-- =====================================================
-- Media comments
-- =====================================================

CREATE TABLE IF NOT EXISTS public.media_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type TEXT NOT NULL CHECK (media_type IN ('guest_photo', 'sanity_image', 'guest_post')),
  media_id TEXT NOT NULL,
  comment_text TEXT NOT NULL CHECK (char_length(comment_text) > 0 AND char_length(comment_text) <= 1000),
  guest_session_id UUID,
  guest_name TEXT,
  parent_id UUID REFERENCES public.media_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT media_comments_guest_identity_check
    CHECK (guest_session_id IS NOT NULL OR guest_name IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_media_comments_lookup
  ON public.media_comments (media_type, media_id, created_at);

CREATE INDEX IF NOT EXISTS idx_media_comments_parent
  ON public.media_comments (parent_id);

CREATE INDEX IF NOT EXISTS idx_media_comments_guest_session
  ON public.media_comments (guest_session_id)
  WHERE guest_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_media_comments_guest_name
  ON public.media_comments (guest_name)
  WHERE guest_session_id IS NULL AND guest_name IS NOT NULL;

-- =====================================================
-- Counting triggers
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_media_reaction_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  target_type TEXT;
  target_media_id TEXT;
  target_uuid UUID;
  delta INTEGER := 0;
BEGIN
  IF TG_OP = 'INSERT' THEN
    target_type := NEW.media_type;
    target_media_id := NEW.media_id;
    delta := 1;
  ELSIF TG_OP = 'DELETE' THEN
    target_type := OLD.media_type;
    target_media_id := OLD.media_id;
    delta := -1;
  ELSE
    RETURN NULL;
  END IF;

  IF target_type IN ('guest_photo', 'guest_post') THEN
    BEGIN
      target_uuid := target_media_id::uuid;
    EXCEPTION
      WHEN others THEN
        RETURN NULL;
    END;

    IF target_type = 'guest_photo' THEN
      UPDATE public.guest_photos
      SET reactions_count = GREATEST(COALESCE(reactions_count, 0) + delta, 0)
      WHERE id = target_uuid;
    ELSIF target_type = 'guest_post' THEN
      UPDATE public.guest_posts
      SET likes_count = GREATEST(COALESCE(likes_count, 0) + delta, 0)
      WHERE id = target_uuid;
    END IF;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_media_reactions_counts_trigger ON public.media_reactions;
CREATE TRIGGER update_media_reactions_counts_trigger
  AFTER INSERT OR DELETE ON public.media_reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_media_reaction_counts();

CREATE OR REPLACE FUNCTION public.update_media_comment_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  target_type TEXT;
  target_media_id TEXT;
  target_uuid UUID;
  delta INTEGER := 0;
BEGIN
  IF TG_OP = 'INSERT' THEN
    target_type := NEW.media_type;
    target_media_id := NEW.media_id;
    delta := 1;
  ELSIF TG_OP = 'DELETE' THEN
    target_type := OLD.media_type;
    target_media_id := OLD.media_id;
    delta := -1;
  ELSE
    RETURN NULL;
  END IF;

  IF target_type IN ('guest_photo', 'guest_post') THEN
    BEGIN
      target_uuid := target_media_id::uuid;
    EXCEPTION
      WHEN others THEN
        RETURN NULL;
    END;

    IF target_type = 'guest_photo' THEN
      UPDATE public.guest_photos
      SET comment_count = GREATEST(COALESCE(comment_count, 0) + delta, 0)
      WHERE id = target_uuid;
    ELSIF target_type = 'guest_post' THEN
      UPDATE public.guest_posts
      SET comments_count = GREATEST(COALESCE(comments_count, 0) + delta, 0)
      WHERE id = target_uuid;
    END IF;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_media_comments_counts_trigger ON public.media_comments;
CREATE TRIGGER update_media_comments_counts_trigger
  AFTER INSERT OR DELETE ON public.media_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_media_comment_counts();

-- =====================================================
-- Row level security
-- =====================================================

ALTER TABLE public.media_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view media reactions" ON public.media_reactions;
CREATE POLICY "Public can view media reactions"
  ON public.media_reactions FOR SELECT
  USING (
    CASE media_type
      WHEN 'guest_photo' THEN EXISTS (
        SELECT 1 FROM public.guest_photos gp
        WHERE gp.id::text = media_reactions.media_id
          AND gp.moderation_status = 'approved'
      )
      WHEN 'guest_post' THEN EXISTS (
        SELECT 1 FROM public.guest_posts gp
        WHERE gp.id::text = media_reactions.media_id
          AND gp.status = 'approved'
      )
      ELSE TRUE
    END
  );

DROP POLICY IF EXISTS "Guests can write media reactions" ON public.media_reactions;
CREATE POLICY "Guests can write media reactions"
  ON public.media_reactions FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public can view media comments" ON public.media_comments;
CREATE POLICY "Public can view media comments"
  ON public.media_comments FOR SELECT
  USING (
    CASE media_type
      WHEN 'guest_photo' THEN EXISTS (
        SELECT 1 FROM public.guest_photos gp
        WHERE gp.id::text = media_comments.media_id
          AND gp.moderation_status = 'approved'
      )
      WHEN 'guest_post' THEN EXISTS (
        SELECT 1 FROM public.guest_posts gp
        WHERE gp.id::text = media_comments.media_id
          AND gp.status = 'approved'
      )
      ELSE TRUE
    END
  );

DROP POLICY IF EXISTS "Guests can create media comments" ON public.media_comments;
CREATE POLICY "Guests can create media comments"
  ON public.media_comments FOR INSERT
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role manages media comments" ON public.media_comments;
CREATE POLICY "Service role manages media comments"
  ON public.media_comments FOR ALL
  USING (current_setting('role', TRUE) = 'service_role')
  WITH CHECK (current_setting('role', TRUE) = 'service_role');

COMMIT;
