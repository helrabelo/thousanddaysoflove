import { createClient } from '@/lib/supabase/client'
import { Guest } from '@/types/wedding'
import { generateInvitationCode } from '@/lib/utils/wedding'

export class GuestService {
  static async findByEmail(email: string): Promise<Guest | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !data) return null
    return data
  }

  static async findByInvitationCode(code: string): Promise<Guest | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('invitation_code', code.toUpperCase())
      .single()

    if (error || !data) return null
    return data
  }

  static async createGuest(guestData: Omit<Guest, 'id' | 'created_at' | 'updated_at' | 'invitation_code'>): Promise<Guest | null> {
    const supabase = createClient()

    const newGuest = {
      ...guestData,
      email: guestData.email.toLowerCase(),
      invitation_code: generateInvitationCode(),
      rsvp_date: guestData.attending !== null ? new Date().toISOString() : null
    }

    const { data, error } = await supabase
      .from('guests')
      .insert(newGuest)
      .select()
      .single()

    if (error || !data) return null
    return data
  }

  static async updateGuest(id: string, updates: Partial<Guest>): Promise<Guest | null> {
    const supabase = createClient()

    const updateData = {
      ...updates,
      email: updates.email?.toLowerCase(),
      updated_at: new Date().toISOString(),
      rsvp_date: updates.attending !== null && !updates.rsvp_date
        ? new Date().toISOString()
        : updates.rsvp_date
    }

    const { data, error } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) return null
    return data
  }

  static async submitRsvp(guestData: {
    name: string
    email: string
    phone?: string
    attending: boolean
    plusOne?: boolean
    plusOneName?: string
    dietaryRestrictions?: string
    specialRequests?: string
    invitationCode?: string
  }): Promise<{ success: boolean; guest?: Guest; error?: string }> {
    try {
      // Check if guest already exists
      let existingGuest = null

      if (guestData.invitationCode) {
        existingGuest = await this.findByInvitationCode(guestData.invitationCode)
      } else {
        existingGuest = await this.findByEmail(guestData.email)
      }

      const guestPayload = {
        name: guestData.name,
        email: guestData.email,
        phone: guestData.phone || null,
        attending: guestData.attending,
        plus_one: guestData.plusOne || false,
        plus_one_name: guestData.plusOneName || null,
        dietary_restrictions: guestData.dietaryRestrictions || null,
        special_requests: guestData.specialRequests || null
      }

      if (existingGuest) {
        // Update existing guest
        const updatedGuest = await this.updateGuest(existingGuest.id, guestPayload)
        if (!updatedGuest) {
          return { success: false, error: 'Erro ao atualizar RSVP' }
        }
        return { success: true, guest: updatedGuest }
      } else {
        // Create new guest
        const newGuest = await this.createGuest(guestPayload)
        if (!newGuest) {
          return { success: false, error: 'Erro ao criar RSVP' }
        }
        return { success: true, guest: newGuest }
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // Admin functions (server-side only)
  static async getAllGuests(): Promise<Guest[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) return []
    return data
  }

  static async getGuestStats() {
    const supabase = createClient()

    const { data: guests, error } = await supabase
      .from('guests')
      .select('attending, plus_one')

    if (error || !guests) {
      return {
        total: 0,
        attending: 0,
        notAttending: 0,
        pending: 0,
        totalWithPlusOnes: 0
      }
    }

    const stats = guests.reduce((acc, guest) => {
      acc.total++

      if (guest.attending === true) {
        acc.attending++
        acc.totalWithPlusOnes += guest.plus_one ? 2 : 1
      } else if (guest.attending === false) {
        acc.notAttending++
      } else {
        acc.pending++
      }

      return acc
    }, {
      total: 0,
      attending: 0,
      notAttending: 0,
      pending: 0,
      totalWithPlusOnes: 0
    })

    return stats
  }

  static async deleteGuest(id: string): Promise<boolean> {
    const supabase = createClient()

    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id)

    return !error
  }
}