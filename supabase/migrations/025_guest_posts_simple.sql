-- Migration: Guest Posts and Social Features
-- Description: Add guest_posts, reactions, and comments tables
-- Date: 2025-10-13

-- =====================================================
-- 1. GUEST POSTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS guest_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('text', 'image', 'video', 'mixed')),
  media_urls TEXT[], -- Array of storage URLs

  -- Moderation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderation_reason TEXT,
  moderated_at TIMESTAMPTZ,
  moderated_by TEXT,

  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_content CHECK (length(content) > 0 AND length(content) <= 5000),
  CONSTRAINT valid_media CHECK (media_urls IS NULL OR array_length(media_urls, 1) <= 10)
);

-- Indexes for guest_posts
CREATE INDEX idx_guest_posts_status ON guest_posts(status);
CREATE INDEX idx_guest_posts_created_at ON guest_posts(created_at DESC);
CREATE INDEX idx_guest_posts_post_type ON guest_posts(post_type);

-- =====================================================
-- 2. POST REACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE,
  guest_name TEXT,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'clap', 'laugh', 'celebrate', 'love')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for post_reactions
CREATE INDEX idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX idx_post_reactions_reaction_type ON post_reactions(reaction_type);

-- =====================================================
-- 3. POST COMMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_comment_content CHECK (length(content) > 0 AND length(content) <= 1000)
);

-- Indexes for post_comments
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_post_comments_parent_id ON post_comments(parent_comment_id);
CREATE INDEX idx_post_comments_created_at ON post_comments(created_at ASC);

-- =====================================================
-- 4. PINNED POSTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS pinned_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE UNIQUE,
  pinned_by TEXT NOT NULL,
  pinned_at TIMESTAMPTZ DEFAULT NOW(),
  display_order INTEGER DEFAULT 0
);

-- Index for pinned_posts
CREATE INDEX idx_pinned_posts_display_order ON pinned_posts(display_order);

-- =====================================================
-- 5. TRIGGERS
-- =====================================================

CREATE TRIGGER update_guest_posts_updated_at
  BEFORE UPDATE ON guest_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at
  BEFORE UPDATE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update likes_count when reactions change
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE guest_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guest_posts
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_likes_count_on_reaction
  AFTER INSERT OR DELETE ON post_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

-- Update comments_count when comments change
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE guest_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guest_posts
    SET comments_count = GREATEST(comments_count - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comments_count_on_comment
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_count();

-- =====================================================
-- 6. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE guest_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pinned_posts ENABLE ROW LEVEL SECURITY;

-- Guest posts policies
CREATE POLICY "Anyone can view approved posts"
  ON guest_posts FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can create posts"
  ON guest_posts FOR INSERT
  WITH CHECK (true);

-- Post reactions policies
CREATE POLICY "Anyone can view reactions"
  ON post_reactions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add reactions"
  ON post_reactions FOR INSERT
  WITH CHECK (true);

-- Post comments policies
CREATE POLICY "Anyone can view comments on approved posts"
  ON post_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM guest_posts
      WHERE id = post_comments.post_id
      AND status = 'approved'
    )
  );

CREATE POLICY "Anyone can create comments"
  ON post_comments FOR INSERT
  WITH CHECK (true);

-- Pinned posts policies
CREATE POLICY "Anyone can view pinned posts"
  ON pinned_posts FOR SELECT
  USING (true);

COMMENT ON TABLE guest_posts IS 'Social feed posts from wedding guests with moderation';
COMMENT ON TABLE post_reactions IS 'Likes and reactions on guest posts';
COMMENT ON TABLE post_comments IS 'Comments and replies on guest posts';
COMMENT ON TABLE pinned_posts IS 'Admin-pinned special moments on wedding day feed';
