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
  created_at: string;
  updated_at: string;
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