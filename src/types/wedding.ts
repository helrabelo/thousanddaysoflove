export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  attending: boolean | null;
  dietary_restrictions?: string;
  plus_one?: boolean;
  plus_one_name?: string;
  invitation_code: string;
  rsvp_date?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;

  // Enhanced RSVP System Fields
  family_group_id?: string;
  invited_by?: string;
  invitation_sent_date?: string;
  invitation_opened_date?: string;
  rsvp_reminder_count: number;
  communication_preferences: CommunicationPreferences;
  guest_type: 'individual' | 'family_head' | 'family_member';
  qr_code_url?: string;
  last_email_sent_date?: string;
  email_delivery_status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  registry_url?: string;
  quantity_desired: number;
  quantity_purchased: number;
  is_available: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  gift_id: string;
  guest_id?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'pix' | 'credit_card' | 'bank_transfer';
  mercado_pago_payment_id?: string;
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface WeddingConfig {
  wedding_date: string;
  rsvp_deadline: string;
  venue_name: string;
  venue_address: string;
  ceremony_time: string;
  reception_time: string;
  dress_code?: string;
  max_guests: number;
}

// Enhanced RSVP System Types
export interface CommunicationPreferences {
  email_notifications: boolean;
  whatsapp_notifications: boolean;
  sms_notifications: boolean;
  language: 'pt-BR' | 'en';
  preferred_time: 'morning' | 'afternoon' | 'evening';
}

export interface FamilyGroup {
  id: string;
  family_name: string;
  family_head_guest_id?: string;
  invitation_code: string;
  max_family_size: number;
  created_at: string;
  updated_at: string;
}

export interface InvitationCode {
  id: string;
  code: string;
  code_type: 'individual' | 'family' | 'plus_one';
  guest_id?: string;
  family_group_id?: string;
  is_used: boolean;
  usage_count: number;
  max_usage: number;
  generated_date: string;
  expiry_date?: string;
  qr_code_data?: string;
  qr_code_image_url?: string;
  created_at: string;
}

export interface EmailLog {
  id: string;
  guest_id: string;
  email_type: 'invitation' | 'reminder' | 'confirmation' | 'thank_you';
  subject: string;
  template_name?: string;
  sent_date: string;
  delivery_status: 'sent' | 'delivered' | 'bounced' | 'failed' | 'opened' | 'clicked';
  sendgrid_message_id?: string;
  error_message?: string;
  opened_date?: string;
  clicked_date?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface RsvpAnalytics {
  id: string;
  guest_id?: string;
  event_type: 'invitation_sent' | 'invitation_opened' | 'form_started' | 'form_completed' | 'reminder_sent';
  event_data: Record<string, any>;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  session_id?: string;
  created_at: string;
}

export interface GuestRsvpStats {
  total_guests: number;
  confirmed_guests: number;
  declined_guests: number;
  pending_guests: number;
  total_with_plus_ones: number;
  confirmation_rate: number;
  family_groups_count: number;
  individual_guests_count: number;
  invitations_sent: number;
  invitations_opened: number;
  reminder_emails_sent: number;
}

// Brazilian Wedding Specific Types
export interface BrazilianWeddingGuest extends Guest {
  cpf?: string; // Brazilian CPF for formal tracking
  whatsapp_number?: string; // WhatsApp for Brazilian communication
  address?: BrazilianAddress;
  relationship_to_couple: 'family' | 'friend' | 'work' | 'school' | 'other';
}

export interface BrazilianAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string; // Brazilian postal code
}

// Email Template Types for Brazilian Wedding
export interface EmailTemplate {
  id: string;
  name: string;
  subject_pt: string;
  subject_en?: string;
  content_pt: string;
  content_en?: string;
  template_type: 'invitation' | 'reminder' | 'confirmation' | 'thank_you';
  variables: string[]; // Available template variables
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// WhatsApp Integration Types
export interface WhatsAppMessage {
  id: string;
  guest_id: string;
  phone_number: string;
  message_type: 'invitation' | 'reminder' | 'confirmation';
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  whatsapp_message_id?: string;
  sent_date?: string;
  delivered_date?: string;
  read_date?: string;
  error_message?: string;
  created_at: string;
}

// Gallery System Types for Wedding Photos/Videos
export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail_url?: string;
  media_type: 'photo' | 'video';
  file_size?: number;
  width?: number;
  height?: number;
  aspect_ratio: number;
  category: MediaCategory;
  tags: string[];
  date_taken?: string;
  location?: string;
  is_featured: boolean;
  is_public: boolean;
  upload_date: string;
  uploaded_by?: string;
  metadata?: MediaMetadata;
  created_at: string;
  updated_at: string;
}

export type MediaCategory =
  | 'engagement'
  | 'travel'
  | 'dates'
  | 'family'
  | 'friends'
  | 'special_moments'
  | 'proposal'
  | 'wedding_prep'
  | 'behind_scenes'
  | 'professional';

export interface MediaMetadata {
  camera_make?: string;
  camera_model?: string;
  lens?: string;
  iso?: number;
  aperture?: string;
  shutter_speed?: string;
  focal_length?: string;
  photographer?: string;
  editing_software?: string;
  color_profile?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  media_type: 'photo' | 'video';
  media_url: string;
  thumbnail_url?: string;
  location?: string;
  milestone_type: 'first_date' | 'anniversary' | 'travel' | 'engagement' | 'special' | 'family' | 'achievement';
  is_major_milestone: boolean;
  order_index: number;
  created_at: string;
}

export interface GalleryStats {
  total_photos: number;
  total_videos: number;
  total_size_mb: number;
  categories_breakdown: Record<MediaCategory, number>;
  featured_count: number;
  latest_upload_date?: string;
  most_popular_category: MediaCategory;
  timeline_events_count: number;
}

export interface GalleryFilter {
  categories: MediaCategory[];
  media_types: ('photo' | 'video')[];
  date_range?: {
    start: string;
    end: string;
  };
  tags: string[];
  is_featured?: boolean;
  search_query?: string;
  sort_by: 'date_taken' | 'upload_date' | 'title' | 'category';
  sort_order: 'asc' | 'desc';
}

export interface GallerySection {
  id: string;
  name: string;
  description: string;
  media_items: MediaItem[];
  section_type: 'hero_video' | 'masonry' | 'timeline' | 'featured' | 'category_showcase';
  background_type: 'solid' | 'gradient' | 'photo' | 'video';
  background_url?: string;
  layout_config: {
    columns?: number;
    aspect_ratio?: string;
    spacing?: 'tight' | 'normal' | 'loose';
    overlay_opacity?: number;
  };
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface MediaUpload {
  id: string;
  file: File;
  preview_url: string;
  upload_progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  category: MediaCategory;
  title: string;
  description?: string;
  tags: string[];
  date_taken?: string;
  location?: string;
  is_featured: boolean;
  error_message?: string;
}

export interface LightboxState {
  isOpen: boolean;
  currentIndex: number;
  items: MediaItem[];
  autoPlay: boolean;
  showControls: boolean;
  showThumbnails: boolean;
}

export interface SocialShare {
  platform: 'whatsapp' | 'instagram' | 'facebook' | 'twitter' | 'telegram';
  media_item_id: string;
  share_url: string;
  share_count?: number;
  last_shared?: string;
}