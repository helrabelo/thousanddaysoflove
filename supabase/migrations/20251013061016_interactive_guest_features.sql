-- Interactive Guest Features Migration
-- Photo uploads, messaging/guest book, real-time updates, content moderation
-- For Thousand Days of Love wedding website

-- ============================================================================
-- 1. GUEST PHOTOS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.guest_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Guest Association
  guest_id UUID REFERENCES public.simple_guests(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,

  -- Photo Metadata
  title TEXT,
  caption TEXT CHECK (char_length(caption) <= 500),
  upload_phase TEXT NOT NULL CHECK (upload_phase IN ('before', 'during', 'after')),
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Storage Information
  storage_path TEXT NOT NULL UNIQUE,
  thumbnail_path TEXT,
  file_size_bytes INTEGER NOT NULL,
  mime_type TEXT NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp', 'image/heic')),
  width INTEGER,
  height INTEGER,

  -- Moderation
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  moderated_at TIMESTAMPTZ,
  moderated_by TEXT,
  rejection_reason TEXT,

  -- Engagement Metrics
  view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
  like_count INTEGER DEFAULT 0 CHECK (like_count >= 0),
  comment_count INTEGER DEFAULT 0 CHECK (comment_count >= 0),

  -- Flags
  is_featured BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- Comments
COMMENT ON TABLE public.guest_photos IS 'Guest-uploaded photos with moderation and engagement metrics';
COMMENT ON COLUMN public.guest_photos.upload_phase IS 'When photo was taken: before/during/after wedding';
COMMENT ON COLUMN public.guest_photos.moderation_status IS 'Content moderation status';

-- ============================================================================
-- 2. GUEST MESSAGES TABLE (Guest Book + Comments)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.guest_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Guest Association
  guest_id UUID REFERENCES public.simple_guests(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,

  -- Message Content
  message TEXT NOT NULL CHECK (char_length(message) >= 1 AND char_length(message) <= 1000),
  message_type TEXT DEFAULT 'guestbook' CHECK (message_type IN ('guestbook', 'photo_comment', 'well_wishes')),

  -- Parent for threading (optional)
  parent_message_id UUID REFERENCES public.guest_messages(id) ON DELETE CASCADE,

  -- Associated Photo (if comment)
  photo_id UUID REFERENCES public.guest_photos(id) ON DELETE CASCADE,

  -- Moderation
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  moderated_at TIMESTAMPTZ,
  moderated_by TEXT,
  rejection_reason TEXT,

  -- Engagement
  like_count INTEGER DEFAULT 0 CHECK (like_count >= 0),

  -- Flags
  is_pinned BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes


-- Comments
COMMENT ON TABLE public.guest_messages IS 'Guest book messages and photo comments with moderation';
COMMENT ON COLUMN public.guest_messages.message_type IS 'Type of message: guestbook entry, photo comment, or well wishes';

-- ============================================================================
-- 3. PHOTO LIKES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.photo_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Associations
  photo_id UUID NOT NULL REFERENCES public.guest_photos(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.simple_guests(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- Comments
COMMENT ON TABLE public.photo_likes IS 'Track which guests liked which photos';

-- ============================================================================
-- 4. MESSAGE LIKES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.message_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Associations
  message_id UUID NOT NULL REFERENCES public.guest_messages(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.simple_guests(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);



-- Comments
COMMENT ON TABLE public.message_likes IS 'Track which guests liked which messages';

-- ============================================================================
-- 5. ACTIVITY FEED TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Activity Details
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'photo_uploaded', 'message_posted', 'photo_liked',
    'message_liked', 'photo_commented', 'guest_rsvp'
  )),

  -- Actor
  guest_id UUID REFERENCES public.simple_guests(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,

  -- Target (polymorphic)
  target_type TEXT CHECK (target_type IN ('photo', 'message', 'rsvp')),
  target_id UUID,

  -- Activity Data (JSONB for flexibility)
  metadata JSONB DEFAULT '{}',

  -- Visibility
  is_public BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes

-- Comments
COMMENT ON TABLE public.activity_feed IS 'Real-time activity feed for wedding day live updates';
COMMENT ON COLUMN public.activity_feed.metadata IS 'JSONB data with activity-specific information';

-- ============================================================================
-- 6. MODERATION QUEUE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content Reference (polymorphic)
  content_type TEXT NOT NULL CHECK (content_type IN ('photo', 'message')),
  content_id UUID NOT NULL,

  -- Moderation Details
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'completed')),
  priority INTEGER DEFAULT 0,

  -- Auto-moderation flags
  spam_score DECIMAL(3,2) CHECK (spam_score >= 0 AND spam_score <= 1),
  inappropriate_score DECIMAL(3,2) CHECK (inappropriate_score >= 0 AND inappropriate_score <= 1),
  flagged_reasons TEXT[],

  -- Manual Review
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- Comments
COMMENT ON TABLE public.moderation_queue IS 'Content moderation queue with auto-flagging and manual review';
COMMENT ON COLUMN public.moderation_queue.priority IS 'Higher priority items reviewed first';

-- ============================================================================
-- 7. UPLOAD SESSIONS TABLE (Rate Limiting & Auth)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.upload_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Guest Association
  guest_id UUID NOT NULL REFERENCES public.simple_guests(id) ON DELETE CASCADE,

  -- Session Details
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,

  -- Rate Limiting
  uploads_count INTEGER DEFAULT 0 CHECK (uploads_count >= 0),
  uploads_size_bytes BIGINT DEFAULT 0 CHECK (uploads_size_bytes >= 0),

  -- Session Metadata
  user_agent TEXT,
  ip_address INET,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_upload_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_upload_sessions_guest_id ON public.upload_sessions(guest_id);
CREATE INDEX idx_upload_sessions_token ON public.upload_sessions(session_token);
CREATE INDEX idx_upload_sessions_expires_at ON public.upload_sessions(expires_at);

-- Comments
COMMENT ON TABLE public.upload_sessions IS 'Guest upload sessions for authentication and rate limiting';

-- ============================================================================
-- 8. TRIGGERS FOR AUTOMATIC COUNT UPDATES
-- ============================================================================

-- Update photo like_count when likes are added/removed
CREATE OR REPLACE FUNCTION update_photo_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.guest_photos
    SET like_count = like_count + 1
    WHERE id = NEW.photo_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.guest_photos
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = OLD.photo_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- Update photo comment_count when comments are added/removed
CREATE OR REPLACE FUNCTION update_photo_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.photo_id IS NOT NULL THEN
    UPDATE public.guest_photos
    SET comment_count = comment_count + 1
    WHERE id = NEW.photo_id;
  ELSIF TG_OP = 'DELETE' AND OLD.photo_id IS NOT NULL THEN
    UPDATE public.guest_photos
    SET comment_count = GREATEST(comment_count - 1, 0)
    WHERE id = OLD.photo_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- Update message like_count when likes are added/removed
CREATE OR REPLACE FUNCTION update_message_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.guest_messages
    SET like_count = like_count + 1
    WHERE id = NEW.message_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.guest_messages
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = OLD.message_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.guest_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_sessions ENABLE ROW LEVEL SECURITY;

-- guest_photos policies

CREATE POLICY "Anyone can insert photos"
  ON public.guest_photos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update photos"
  ON public.guest_photos FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete their own photos"
  ON public.guest_photos FOR DELETE
  USING (true);

-- upload_sessions policies
CREATE POLICY "Anyone can create sessions"
  ON public.upload_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view sessions"
  ON public.upload_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update sessions"
  ON public.upload_sessions FOR UPDATE
  USING (true);

-- ============================================================================
-- 10. MATERIALIZED VIEW FOR GALLERY STATISTICS
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS public.gallery_stats AS
SELECT
  upload_phase,
  COUNT(*) as photo_count,
  SUM(like_count) as total_likes,
  SUM(comment_count) as total_comments,
  AVG(like_count)::DECIMAL(10,2) as avg_likes_per_photo,
  MAX(uploaded_at) as last_upload
FROM public.guest_photos
WHERE moderation_status = 'approved' AND is_deleted = false
GROUP BY upload_phase;


-- Function to refresh stats
CREATE OR REPLACE FUNCTION refresh_gallery_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.gallery_stats;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON MATERIALIZED VIEW public.gallery_stats IS 'Aggregated gallery statistics refreshed periodically';

-- ============================================================================
-- 11. ENABLE REALTIME FOR RELEVANT TABLES
-- ============================================================================

-- Enable realtime replication
