-- Migration: migrate existing photo/post reactions and comments into unified media tables

BEGIN;

-- =====================================================
-- Reactions migration
-- =====================================================

WITH ranked_photo_reactions AS (
  SELECT
    pr.*,
    ROW_NUMBER() OVER (
      PARTITION BY pr.photo_id, COALESCE(pr.guest_session_id::text, lower(pr.guest_name))
      ORDER BY pr.created_at DESC
    ) AS rn
  FROM public.photo_reactions pr
)
INSERT INTO public.media_reactions (
  media_type,
  media_id,
  reaction_type,
  guest_session_id,
  guest_name,
  created_at
)
SELECT
  'guest_photo',
  r.photo_id::text,
  r.reaction_type,
  r.guest_session_id,
  r.guest_name,
  r.created_at
FROM ranked_photo_reactions r
WHERE r.rn = 1
ON CONFLICT DO NOTHING;

WITH ranked_post_reactions AS (
  SELECT
    pr.*,
    ROW_NUMBER() OVER (
      PARTITION BY pr.post_id, COALESCE(pr.guest_session_id::text, lower(pr.guest_name))
      ORDER BY pr.created_at DESC
    ) AS rn
  FROM public.post_reactions pr
)
INSERT INTO public.media_reactions (
  media_type,
  media_id,
  reaction_type,
  guest_session_id,
  guest_name,
  created_at
)
SELECT
  'guest_post',
  r.post_id::text,
  r.reaction_type,
  r.guest_session_id,
  r.guest_name,
  r.created_at
FROM ranked_post_reactions r
WHERE r.rn = 1
ON CONFLICT DO NOTHING;

-- =====================================================
-- Comments migration (preserve original ids for threading)
-- =====================================================

INSERT INTO public.media_comments (
  id,
  media_type,
  media_id,
  comment_text,
  guest_session_id,
  guest_name,
  parent_id,
  created_at
)
SELECT
  pc.id,
  'guest_photo',
  pc.photo_id::text,
  pc.content,
  pc.guest_session_id,
  pc.guest_name,
  pc.parent_comment_id,
  pc.created_at
FROM public.photo_comments pc
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_comments (
  id,
  media_type,
  media_id,
  comment_text,
  guest_session_id,
  guest_name,
  parent_id,
  created_at
)
SELECT
  pc.id,
  'guest_post',
  pc.post_id::text,
  pc.content,
  pc.guest_session_id,
  pc.guest_name,
  pc.parent_comment_id,
  pc.created_at
FROM public.post_comments pc
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Recalculate counts to ensure accuracy
-- =====================================================

UPDATE public.guest_photos gp
SET reactions_count = (
  SELECT COUNT(*)
  FROM public.media_reactions mr
  WHERE mr.media_type = 'guest_photo'
    AND mr.media_id = gp.id::text
),
comment_count = (
  SELECT COUNT(*)
  FROM public.media_comments mc
  WHERE mc.media_type = 'guest_photo'
    AND mc.media_id = gp.id::text
);

UPDATE public.guest_posts gp
SET likes_count = (
  SELECT COUNT(*)
  FROM public.media_reactions mr
  WHERE mr.media_type = 'guest_post'
    AND mr.media_id = gp.id::text
),
comments_count = (
  SELECT COUNT(*)
  FROM public.media_comments mc
  WHERE mc.media_type = 'guest_post'
    AND mc.media_id = gp.id::text
);

COMMIT;
