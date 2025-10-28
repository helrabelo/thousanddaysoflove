export interface Database {
  public: {
    Tables: {
      guests: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          attending: boolean | null
          dietary_restrictions: string | null
          invitation_code: string
          rsvp_date: string | null
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          attending?: boolean | null
          dietary_restrictions?: string | null
          invitation_code: string
          rsvp_date?: string | null
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          attending?: boolean | null
          dietary_restrictions?: string | null
          invitation_code?: string
          rsvp_date?: string | null
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gifts: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image_url: string | null
          registry_url: string | null
          quantity_desired: number
          quantity_purchased: number
          is_available: boolean
          category: string
          priority: 'low' | 'medium' | 'high'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image_url?: string | null
          registry_url?: string | null
          quantity_desired?: number
          quantity_purchased?: number
          is_available?: boolean
          category: string
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image_url?: string | null
          registry_url?: string | null
          quantity_desired?: number
          quantity_purchased?: number
          is_available?: boolean
          category?: string
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          gift_id: string
          guest_id: string | null
          amount: number
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: 'pix' | 'credit_card' | 'bank_transfer'
          mercado_pago_payment_id: string | null
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gift_id: string
          guest_id?: string | null
          amount: number
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: 'pix' | 'credit_card' | 'bank_transfer'
          mercado_pago_payment_id?: string | null
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gift_id?: string
          guest_id?: string | null
          amount?: number
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: 'pix' | 'credit_card' | 'bank_transfer'
          mercado_pago_payment_id?: string | null
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      wedding_config: {
        Row: {
          id: string
          wedding_date: string
          rsvp_deadline: string
          venue_name: string
          venue_address: string
          ceremony_time: string
          reception_time: string
          dress_code: string | null
          max_guests: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wedding_date: string
          rsvp_deadline: string
          venue_name: string
          venue_address: string
          ceremony_time: string
          reception_time: string
          dress_code?: string | null
          max_guests: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wedding_date?: string
          rsvp_deadline?: string
          venue_name?: string
          venue_address?: string
          ceremony_time?: string
          reception_time?: string
          dress_code?: string | null
          max_guests?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}