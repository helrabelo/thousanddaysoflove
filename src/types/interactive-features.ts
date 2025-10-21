/**
 * TypeScript type definitions for interactive guest features
 * Generated from database schema
 */

// ============================================================================
// GUEST PHOTOS
// ============================================================================

export type UploadPhase = 'before' | 'during' | 'after';
export type ModerationStatus = 'pending' | 'approved' | 'rejected';
export type ImageMimeType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/heic';

export interface GuestPhoto {
  id: string;
  guest_id: string | null;
  guest_name: string;
  title: string | null;
  caption: string | null;
  upload_phase: UploadPhase;
  uploaded_at: string;
  storage_path: string;
  thumbnail_path: string | null;
  file_size_bytes: number;
  mime_type: ImageMimeType;
  width: number | null;
  height: number | null;
  moderation_status: ModerationStatus;
  moderated_at: string | null;
  moderated_by: string | null;
  rejection_reason: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_featured: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  timeline_event_id: string | null;
}

export interface GuestPhotoInsert {
  id?: string;
  guest_id?: string | null;
  guest_name: string;
  title?: string | null;
  caption?: string | null;
  upload_phase: UploadPhase;
  uploaded_at?: string;
  storage_path: string;
  thumbnail_path?: string | null;
  file_size_bytes: number;
  mime_type: ImageMimeType;
  width?: number | null;
  height?: number | null;
  moderation_status?: ModerationStatus;
  moderated_at?: string | null;
  moderated_by?: string | null;
  rejection_reason?: string | null;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  is_featured?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  timeline_event_id?: string | null;
}

export interface GuestPhotoUpdate {
  guest_id?: string | null;
  guest_name?: string;
  title?: string | null;
  caption?: string | null;
  upload_phase?: UploadPhase;
  uploaded_at?: string;
  storage_path?: string;
  thumbnail_path?: string | null;
  file_size_bytes?: number;
  mime_type?: ImageMimeType;
  width?: number | null;
  height?: number | null;
  moderation_status?: ModerationStatus;
  moderated_at?: string | null;
  moderated_by?: string | null;
  rejection_reason?: string | null;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  is_featured?: boolean;
  is_deleted?: boolean;
  updated_at?: string;
  timeline_event_id?: string | null;
}

// ============================================================================
// GUEST MESSAGES
// ============================================================================

export type MessageType = 'guestbook' | 'photo_comment' | 'well_wishes';

export interface GuestMessage {
  id: string;
  guest_id: string | null;
  guest_name: string;
  message: string;
  message_type: MessageType;
  parent_message_id: string | null;
  photo_id: string | null;
  moderation_status: ModerationStatus;
  moderated_at: string | null;
  moderated_by: string | null;
  rejection_reason: string | null;
  like_count: number;
  is_pinned: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface GuestMessageInsert {
  id?: string;
  guest_id?: string | null;
  guest_name: string;
  message: string;
  message_type?: MessageType;
  parent_message_id?: string | null;
  photo_id?: string | null;
  moderation_status?: ModerationStatus;
  moderated_at?: string | null;
  moderated_by?: string | null;
  rejection_reason?: string | null;
  like_count?: number;
  is_pinned?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GuestMessageUpdate {
  guest_id?: string | null;
  guest_name?: string;
  message?: string;
  message_type?: MessageType;
  parent_message_id?: string | null;
  photo_id?: string | null;
  moderation_status?: ModerationStatus;
  moderated_at?: string | null;
  moderated_by?: string | null;
  rejection_reason?: string | null;
  like_count?: number;
  is_pinned?: boolean;
  is_deleted?: boolean;
  updated_at?: string;
}

// ============================================================================
// LIKES
// ============================================================================

export interface PhotoLike {
  id: string;
  photo_id: string;
  guest_id: string | null;
  guest_name: string;
  created_at: string;
}

export interface PhotoLikeInsert {
  id?: string;
  photo_id: string;
  guest_id?: string | null;
  guest_name: string;
  created_at?: string;
}

export interface MessageLike {
  id: string;
  message_id: string;
  guest_id: string | null;
  guest_name: string;
  created_at: string;
}

export interface MessageLikeInsert {
  id?: string;
  message_id: string;
  guest_id?: string | null;
  guest_name: string;
  created_at?: string;
}

// ============================================================================
// ACTIVITY FEED
// ============================================================================

export type ActivityType =
  | 'photo_uploaded'
  | 'message_posted'
  | 'photo_liked'
  | 'message_liked'
  | 'photo_commented'
  | 'guest_rsvp';

export type TargetType = 'photo' | 'message' | 'rsvp';

export interface ActivityFeed {
  id: string;
  activity_type: ActivityType;
  guest_id: string | null;
  guest_name: string;
  target_type: TargetType | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  is_public: boolean;
  created_at: string;
}

export interface ActivityFeedInsert {
  id?: string;
  activity_type: ActivityType;
  guest_id?: string | null;
  guest_name: string;
  target_type?: TargetType | null;
  target_id?: string | null;
  metadata?: Record<string, unknown>;
  is_public?: boolean;
  created_at?: string;
}

// ============================================================================
// MODERATION QUEUE
// ============================================================================

export type ContentType = 'photo' | 'message';
export type QueueStatus = 'pending' | 'in_review' | 'completed';

export interface ModerationQueue {
  id: string;
  content_type: ContentType;
  content_id: string;
  status: QueueStatus;
  priority: number;
  spam_score: number | null;
  inappropriate_score: number | null;
  flagged_reasons: string[] | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModerationQueueInsert {
  id?: string;
  content_type: ContentType;
  content_id: string;
  status?: QueueStatus;
  priority?: number;
  spam_score?: number | null;
  inappropriate_score?: number | null;
  flagged_reasons?: string[] | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ModerationQueueUpdate {
  content_type?: ContentType;
  content_id?: string;
  status?: QueueStatus;
  priority?: number;
  spam_score?: number | null;
  inappropriate_score?: number | null;
  flagged_reasons?: string[] | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_notes?: string | null;
  updated_at?: string;
}

// ============================================================================
// UPLOAD SESSIONS
// ============================================================================

export interface UploadSession {
  id: string;
  guest_id: string;
  session_token: string;
  expires_at: string;
  uploads_count: number;
  uploads_size_bytes: number;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  last_upload_at: string | null;
}

export interface UploadSessionInsert {
  id?: string;
  guest_id: string;
  session_token: string;
  expires_at: string;
  uploads_count?: number;
  uploads_size_bytes?: number;
  user_agent?: string | null;
  ip_address?: string | null;
  created_at?: string;
  last_upload_at?: string | null;
}

export interface UploadSessionUpdate {
  guest_id?: string;
  session_token?: string;
  expires_at?: string;
  uploads_count?: number;
  uploads_size_bytes?: number;
  user_agent?: string | null;
  ip_address?: string | null;
  last_upload_at?: string | null;
}

// ============================================================================
// GALLERY STATS (Materialized View)
// ============================================================================

export interface GalleryStats {
  upload_phase: UploadPhase;
  photo_count: number;
  total_likes: number;
  total_comments: number;
  avg_likes_per_photo: number;
  last_upload: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

export interface PhotoUploadResponse {
  id: string;
  storage_path: string;
  thumbnail_path: string | null;
  upload_phase: UploadPhase;
  moderation_status: ModerationStatus;
  uploaded_at: string;
}

export interface LikeResponse {
  liked: boolean;
  like_count: number;
}

// ============================================================================
// GUEST SESSION
// ============================================================================

export interface GuestSession {
  guest_id: string;
  guest_name: string;
  session_token: string;
  expires_at: string;
}

// ============================================================================
// PHOTO WITH DETAILS (Joined data)
// ============================================================================

export interface PhotoWithDetails extends GuestPhoto {
  comments?: GuestMessage[];
  likes?: PhotoLike[];
  has_liked?: boolean; // For current user
}

// ============================================================================
// EXTENDED DATABASE TYPE
// ============================================================================

export interface InteractiveFeaturesTables {
  guest_photos: {
    Row: GuestPhoto;
    Insert: GuestPhotoInsert;
    Update: GuestPhotoUpdate;
  };
  guest_messages: {
    Row: GuestMessage;
    Insert: GuestMessageInsert;
    Update: GuestMessageUpdate;
  };
  photo_likes: {
    Row: PhotoLike;
    Insert: PhotoLikeInsert;
    Update: Partial<PhotoLike>;
  };
  message_likes: {
    Row: MessageLike;
    Insert: MessageLikeInsert;
    Update: Partial<MessageLike>;
  };
  activity_feed: {
    Row: ActivityFeed;
    Insert: ActivityFeedInsert;
    Update: Partial<ActivityFeed>;
  };
  moderation_queue: {
    Row: ModerationQueue;
    Insert: ModerationQueueInsert;
    Update: ModerationQueueUpdate;
  };
  upload_sessions: {
    Row: UploadSession;
    Insert: UploadSessionInsert;
    Update: UploadSessionUpdate;
  };
}
