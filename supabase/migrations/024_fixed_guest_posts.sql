-- SIMPLIFIED Migration: Guest Posts System
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/sql/new
-- This version removes guest_sessions references

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
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  rsvp_completed BOOLEAN DEFAULT false,
  gift_selected BOOLEAN DEFAULT false,
  photos_uploaded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_invitations_code ON invitations(code);
CREATE INDEX IF NOT EXISTS idx_invitations_guest_name ON invitations(guest_name);

-- =====================================================
-- 2. GUEST POSTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS guest_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_session_id UUID,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('text', 'image', 'video', 'mixed')),
  media_urls TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderation_reason TEXT,
  moderated_at TIMESTAMPTZ,
  moderated_by TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_posts_status ON guest_posts(status);
CREATE INDEX IF NOT EXISTS idx_guest_posts_created_at ON guest_posts(created_at DESC);

-- =====================================================
-- 3. POST REACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE,
  guest_session_id UUID,
  guest_name TEXT,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'clap', 'laugh', 'celebrate', 'love')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, guest_session_id)
);

CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);

-- =====================================================
-- 4. POST COMMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  guest_session_id UUID,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at ASC);

-- =====================================================
-- 5. PINNED POSTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS pinned_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE UNIQUE,
  pinned_by TEXT NOT NULL,
  pinned_at TIMESTAMPTZ DEFAULT NOW(),
  display_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_pinned_posts_display_order ON pinned_posts(display_order);

-- =====================================================
-- 6. TRIGGERS
-- =====================================================

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

-- Update likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE guest_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guest_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_likes_count_on_reaction ON post_reactions;
CREATE TRIGGER update_likes_count_on_reaction
  AFTER INSERT OR DELETE ON post_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

-- Update comments count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE guest_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guest_posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
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
-- 7. ROW LEVEL SECURITY
-- =====================================================

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

-- Create policies
CREATE POLICY "Anyone can read invitations by code"
  ON invitations FOR SELECT USING (true);

CREATE POLICY "Service role can manage invitations"
  ON invitations FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can view approved posts"
  ON guest_posts FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Guests can create posts"
  ON guest_posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage all posts"
  ON guest_posts FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can view reactions"
  ON post_reactions FOR SELECT USING (true);

CREATE POLICY "Guests can manage their own reactions"
  ON post_reactions FOR ALL USING (true);

CREATE POLICY "Anyone can view comments on approved posts"
  ON post_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM guest_posts
      WHERE id = post_comments.post_id AND status = 'approved'
    )
  );

CREATE POLICY "Guests can create comments"
  ON post_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can manage all comments"
  ON post_comments FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can view pinned posts"
  ON pinned_posts FOR SELECT USING (true);

CREATE POLICY "Service role can manage pinned posts"
  ON pinned_posts FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- 8. SAMPLE DATA
-- =====================================================

INSERT INTO invitations (code, guest_name, guest_email, relationship_type, plus_one_allowed, custom_message)
VALUES
  ('FAMILY001', 'João Silva', 'joao@example.com', 'family', true, 'Estamos ansiosos para compartilhar este momento especial com você e sua família!'),
  ('FRIEND002', 'Maria Santos', 'maria@example.com', 'friend', true, 'Sua amizade significa muito para nós. Não perca!'),
  ('FRIEND003', 'Pedro Costa', 'pedro@example.com', 'friend', false, 'Será uma honra ter você conosco neste dia tão especial!'),
  ('WORK004', 'Ana Oliveira', 'ana@example.com', 'colleague', false, 'Obrigado por fazer parte da nossa jornada profissional e pessoal!')
ON CONFLICT (code) DO NOTHING;
