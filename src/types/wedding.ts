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