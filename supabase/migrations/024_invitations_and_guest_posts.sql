-- Migration: Guest Experience Enhancement - Phase 1
-- Description: Add invitations, guest posts, reactions, and comments tables
-- Date: 2025-10-13

-- =====================================================
-- 1. INVITATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  relationship_type TEXT CHECK (relationship_type IN ('family', 'friend', 'colleague', 'other')),
  plus_one_allowed BOOLEAN DEFAULT false,
  plus_one_name TEXT,
  custom_message TEXT,
  table_number INTEGER,
  dietary_restrictions TEXT,

  -- Tracking
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  rsvp_completed BOOLEAN DEFAULT false,
  gift_selected BOOLEAN DEFAULT false,
  photos_uploaded BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT,

  -- Constraints
  CONSTRAINT valid_code CHECK (length(code) >= 6),
  CONSTRAINT valid_email CHECK (guest_email IS NULL OR guest_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for invitations
CREATE INDEX idx_invitations_code ON invitations(code);
CREATE INDEX idx_invitations_guest_name ON invitations(guest_name);
CREATE INDEX idx_invitations_relationship_type ON invitations(relationship_type);
CREATE INDEX idx_invitations_created_at ON invitations(created_at DESC);

-- =====================================================
-- 2. GUEST POSTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS guest_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_session_id UUID REFERENCES guest_sessions(id) ON DELETE SET NULL,
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
CREATE INDEX idx_guest_posts_guest_session ON guest_posts(guest_session_id);
CREATE INDEX idx_guest_posts_post_type ON guest_posts(post_type);

-- =====================================================
-- 3. POST REACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE,
  guest_session_id UUID REFERENCES guest_sessions(id) ON DELETE SET NULL,
  guest_name TEXT,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'clap', 'laugh', 'celebrate', 'love')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- One reaction per guest per post
  UNIQUE(post_id, guest_session_id)
);

-- Indexes for post_reactions
CREATE INDEX idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX idx_post_reactions_guest_session ON post_reactions(guest_session_id);
CREATE INDEX idx_post_reactions_reaction_type ON post_reactions(reaction_type);

-- =====================================================
-- 4. POST COMMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  guest_session_id UUID REFERENCES guest_sessions(id) ON DELETE SET NULL,
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
-- 5. PINNED POSTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS pinned_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE UNIQUE,
  pinned_by TEXT NOT NULL,
  pinned_at TIMESTAMPTZ DEFAULT NOW(),
  display_order INTEGER DEFAULT 0

  -- Note: Only approved posts should be pinned (enforced in application code)
);

-- Index for pinned_posts
CREATE INDEX idx_pinned_posts_display_order ON pinned_posts(display_order);

-- =====================================================
-- 6. TRIGGERS AND FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_invitations_updated_at ON invitations;
CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_guest_posts_updated_at ON guest_posts;
CREATE TRIGGER update_guest_posts_updated_at
  BEFORE UPDATE ON guest_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_post_comments_updated_at ON post_comments;
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

DROP TRIGGER IF EXISTS update_likes_count_on_reaction ON post_reactions;
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

DROP TRIGGER IF EXISTS update_comments_count_on_comment ON post_comments;
CREATE TRIGGER update_comments_count_on_comment
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_count();

-- =====================================================
-- 7. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pinned_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read invitations by code" ON invitations;
DROP POLICY IF EXISTS "Service role can manage invitations" ON invitations;
DROP POLICY IF EXISTS "Anyone can view approved posts" ON guest_posts;
DROP POLICY IF EXISTS "Guests can create posts" ON guest_posts;
DROP POLICY IF EXISTS "Service role can manage all posts" ON guest_posts;
DROP POLICY IF EXISTS "Anyone can view reactions" ON post_reactions;
DROP POLICY IF EXISTS "Guests can manage their own reactions" ON post_reactions;
DROP POLICY IF EXISTS "Anyone can view comments on approved posts" ON post_comments;
DROP POLICY IF EXISTS "Guests can create comments" ON post_comments;
DROP POLICY IF EXISTS "Service role can manage all comments" ON post_comments;
DROP POLICY IF EXISTS "Anyone can view pinned posts" ON pinned_posts;
DROP POLICY IF EXISTS "Service role can manage pinned posts" ON pinned_posts;

-- Invitations policies
CREATE POLICY "Anyone can read invitations by code"
  ON invitations FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage invitations"
  ON invitations FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- Guest posts policies
CREATE POLICY "Anyone can view approved posts"
  ON guest_posts FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Guests can create posts"
  ON guest_posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage all posts"
  ON guest_posts FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- Post reactions policies
CREATE POLICY "Anyone can view reactions"
  ON post_reactions FOR SELECT
  USING (true);

CREATE POLICY "Guests can manage their own reactions"
  ON post_reactions FOR ALL
  USING (true)
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

CREATE POLICY "Guests can create comments"
  ON post_comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage all comments"
  ON post_comments FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- Pinned posts policies
CREATE POLICY "Anyone can view pinned posts"
  ON pinned_posts FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage pinned posts"
  ON pinned_posts FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- =====================================================
-- 8. SAMPLE DATA (for testing)
-- =====================================================

-- Insert sample invitations
INSERT INTO invitations (code, guest_name, guest_email, relationship_type, plus_one_allowed, custom_message) VALUES
  ('FAMILY001', 'João Silva', 'joao@example.com', 'family', true, 'Estamos ansiosos para compartilhar este momento especial com você e sua família!'),
  ('FRIEND002', 'Maria Santos', 'maria@example.com', 'friend', true, 'Sua amizade significa muito para nós. Não perca!'),
  ('FRIEND003', 'Pedro Costa', 'pedro@example.com', 'friend', false, 'Será uma honra ter você conosco neste dia tão especial!'),
  ('WORK004', 'Ana Oliveira', 'ana@example.com', 'colleague', false, 'Obrigado por fazer parte da nossa jornada profissional e pessoal!')
ON CONFLICT (code) DO NOTHING;

COMMENT ON TABLE invitations IS 'Personalized wedding invitations with unique codes for guest tracking';
COMMENT ON TABLE guest_posts IS 'Social feed posts from wedding guests with moderation';
COMMENT ON TABLE post_reactions IS 'Likes and reactions on guest posts';
COMMENT ON TABLE post_comments IS 'Comments and replies on guest posts';
COMMENT ON TABLE pinned_posts IS 'Admin-pinned special moments on wedding day feed';
