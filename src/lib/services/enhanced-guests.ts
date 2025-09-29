// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Enhanced Guest Service for World-Class Brazilian Wedding RSVP System
 *
 * Features:
 * 🎫 Unique invitation code system with QR codes
 * 👥 Family group management
 * 📧 Email automation and tracking
 * 📱 WhatsApp integration for Brazilian guests
 * 📊 Analytics and engagement tracking
 * 🔔 Automated reminder sequences
 */

import { createClient } from '@/lib/supabase/client'
import {
  Guest,
  FamilyGroup,
  InvitationCode,
  EmailLog,
  RsvpAnalytics,
  GuestRsvpStats,
  CommunicationPreferences,
  WhatsAppMessage
} from '@/types/wedding'
import {
  generateInvitationCode,
  generateFamilyInvitationCode,
  generateBulkInvitationCodes,
  validateBrazilianPhone,
  validateEmail,
  formatWhatsAppNumber,
  generateQRCodeData,
  generateWhatsAppShareURL,
  formatBrazilianDate,
  getBrazilianWeddingGreeting
} from '@/lib/utils/wedding'

type SupabaseClient = ReturnType<typeof createClient>

export class EnhancedGuestService {

  // ====================
  // CORE GUEST OPERATIONS
  // ====================

  /**
   * Find guest by email with enhanced tracking
   */
  static async findByEmail(email: string): Promise<Guest | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('guests')
      .select(`
        *,
        family_groups(*)
      `)
      .eq('email', email.toLowerCase())
      .single()

    if (error || !data) return null

    // Track guest lookup for analytics
    await this.trackEvent(data.id, 'guest_lookup', {
      lookup_method: 'email',
      found: true
    })

    return data
  }

  /**
   * Find guest by invitation code with family support
   */
  static async findByInvitationCode(code: string): Promise<Guest | null> {
    const supabase = createClient()

    // First check individual guest invitation codes
    let { data, error } = await supabase
      .from('guests')
      .select(`
        *,
        family_groups(*)
      `)
      .eq('invitation_code', code.toUpperCase())
      .single()

    // If not found, check family group invitation codes
    if (error || !data) {
      const { data: familyData, error: familyError } = await supabase
        .from('family_groups')
        .select(`
          *,
          guests(*)
        `)
        .eq('invitation_code', code.toUpperCase())
        .single()

      if (!familyError && familyData && familyData.guests.length > 0) {
        // Return the family head or first family member
        data = familyData.guests.find((g: any) => g.guest_type === 'family_head') || familyData.guests[0]
      }
    }

    if (!data) return null

    // Track invitation code usage
    await this.trackEvent(data.id, 'invitation_code_lookup', {
      code: code.toUpperCase(),
      found: true
    })

    return data
  }

  /**
   * Create guest with enhanced features
   */
  static async createGuest(guestData: Omit<Guest, 'id' | 'created_at' | 'updated_at'>): Promise<Guest | null> {
    const supabase = createClient()

    // Default values for enhanced fields
    const defaultCommunicationPreferences: CommunicationPreferences = {
      email_notifications: true,
      whatsapp_notifications: true,
      sms_notifications: false,
      language: 'pt-BR',
      preferred_time: 'afternoon'
    }

    const newGuest = {
      ...guestData,
      email: guestData.email.toLowerCase(),
      invitation_code: guestData.invitation_code || generateInvitationCode(),
      rsvp_date: guestData.attending !== null ? new Date().toISOString() : null,
      rsvp_reminder_count: 0,
      communication_preferences: defaultCommunicationPreferences,
      guest_type: guestData.guest_type || 'individual',
      email_delivery_status: 'pending'
    }

    const { data, error } = await supabase
      .from('guests')
      .insert(newGuest as any)
      .select()
      .single()

    if (error || !data) {
      console.error('Error creating guest:', error)
      return null
    }

    // Track guest creation
    await this.trackEvent(data.id, 'guest_created', {
      guest_type: data.guest_type,
      has_family_group: !!data.family_group_id
    })

    return data
  }

  /**
   * Enhanced RSVP submission with analytics
   */
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
    sessionId?: string
    userAgent?: string
    ipAddress?: string
  }): Promise<{ success: boolean; guest?: Guest; error?: string }> {
    try {
      // Validate inputs
      if (!validateEmail(guestData.email)) {
        return { success: false, error: 'Email inválido' }
      }

      if (guestData.phone && !validateBrazilianPhone(guestData.phone)) {
        return { success: false, error: 'Número de telefone brasileiro inválido' }
      }

      // Check if guest exists
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

      let finalGuest: Guest | null = null

      if (existingGuest) {
        // Update existing guest
        finalGuest = await this.updateGuest(existingGuest.id, guestPayload)
        if (!finalGuest) {
          return { success: false, error: 'Erro ao atualizar RSVP' }
        }

        // Track RSVP update
        await this.trackEvent(finalGuest.id, 'rsvp_updated', {
          attending: guestData.attending,
          plus_one: guestData.plusOne,
          session_id: guestData.sessionId,
          user_agent: guestData.userAgent,
          ip_address: guestData.ipAddress
        })
      } else {
        // Create new guest
        finalGuest = await this.createGuest({
          ...guestPayload,
          invitation_code: guestData.invitationCode || generateInvitationCode(),
          guest_type: 'individual',
          rsvp_reminder_count: 0,
          communication_preferences: {
            email_notifications: true,
            whatsapp_notifications: true,
            sms_notifications: false,
            language: 'pt-BR',
            preferred_time: 'afternoon'
          },
          email_delivery_status: 'pending'
        } as any)

        if (!finalGuest) {
          return { success: false, error: 'Erro ao criar RSVP' }
        }

        // Track new RSVP
        await this.trackEvent(finalGuest.id, 'rsvp_completed', {
          attending: guestData.attending,
          plus_one: guestData.plusOne,
          session_id: guestData.sessionId,
          user_agent: guestData.userAgent,
          ip_address: guestData.ipAddress
        })
      }

      // Send confirmation email
      if (finalGuest && guestData.attending) {
        await this.sendConfirmationEmail(finalGuest)
      }

      return { success: true, guest: finalGuest }

    } catch (error) {
      console.error('Error submitting RSVP:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // ====================
  // FAMILY GROUP MANAGEMENT
  // ====================

  /**
   * Create family group with invitation code
   */
  static async createFamilyGroup(
    familyName: string,
    maxFamilySize: number = 4
  ): Promise<FamilyGroup | null> {
    const supabase = createClient()

    const newFamilyGroup = {
      family_name: familyName,
      invitation_code: generateFamilyInvitationCode(familyName),
      max_family_size: maxFamilySize
    }

    const { data, error } = await supabase
      .from('family_groups')
      .insert(newFamilyGroup)
      .select()
      .single()

    if (error || !data) {
      console.error('Error creating family group:', error)
      return null
    }

    return data
  }

  /**
   * Add guest to family group
   */
  static async addGuestToFamily(guestId: string, familyGroupId: string): Promise<boolean> {
    const supabase = createClient()

    const { error } = await supabase
      .from('guests')
      .update({
        family_group_id: familyGroupId,
        guest_type: 'family_member',
        updated_at: new Date().toISOString()
      })
      .eq('id', guestId)

    return !error
  }

  /**
   * Get family group with all members
   */
  static async getFamilyGroup(familyGroupId: string): Promise<FamilyGroup & { guests: Guest[] } | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('family_groups')
      .select(`
        *,
        guests(*)
      `)
      .eq('id', familyGroupId)
      .single()

    if (error || !data) return null
    return data
  }

  // ====================
  // INVITATION CODE SYSTEM
  // ====================

  /**
   * Generate bulk invitation codes for admin
   */
  static async generateBulkCodes(count: number, codeType: 'individual' | 'family' = 'individual'): Promise<InvitationCode[]> {
    const supabase = createClient()
    const codes = generateBulkInvitationCodes(count)

    const invitationCodes = codes.map(code => ({
      code,
      code_type: codeType,
      is_used: false,
      usage_count: 0,
      max_usage: 1,
      qr_code_data: generateQRCodeData(code),
      generated_date: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('invitation_codes')
      .insert(invitationCodes)
      .select()

    if (error) {
      console.error('Error generating bulk codes:', error)
      return []
    }

    return data || []
  }

  /**
   * Generate QR code for invitation
   */
  static async generateInvitationQRCode(invitationCode: string): Promise<string | null> {
    try {
      // This would integrate with a QR code generation service
      // For now, return the URL that would contain the QR code
      const qrCodeData = generateQRCodeData(invitationCode)

      // TODO: Integrate with actual QR code generation service (qrcode library)
      const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}`

      return qrCodeImageUrl
    } catch (error) {
      console.error('Error generating QR code:', error)
      return null
    }
  }

  // ====================
  // EMAIL AUTOMATION
  // ====================

  /**
   * Send RSVP confirmation email
   */
  static async sendConfirmationEmail(guest: Guest): Promise<boolean> {
    try {
      // This would integrate with SendGrid service
      const emailData = {
        to: guest.email,
        subject: 'Confirmação de RSVP - Casamento Hel & Ylana 💕',
        templateName: 'rsvp_confirmation',
        templateData: {
          guestName: guest.name,
          attending: guest.attending,
          plusOne: guest.plus_one,
          plusOneName: guest.plus_one_name,
          weddingDate: '20 de Novembro de 2025',
          invitationCode: guest.invitation_code
        }
      }

      // Log email attempt
      await this.logEmail(guest.id, 'confirmation', emailData.subject, 'rsvp_confirmation')

      // TODO: Integrate with actual SendGrid service
      console.log('Would send confirmation email to:', guest.email)

      return true
    } catch (error) {
      console.error('Error sending confirmation email:', error)
      return false
    }
  }

  /**
   * Send RSVP reminder email
   */
  static async sendReminderEmail(guest: Guest): Promise<boolean> {
    try {
      const timeOfDay = new Date().getHours() < 12 ? 'morning' :
                       new Date().getHours() < 18 ? 'afternoon' : 'evening'

      const greeting = getBrazilianWeddingGreeting(timeOfDay)

      const emailData = {
        to: guest.email,
        subject: 'Lembrete: Confirme sua presença no nosso casamento 💕',
        templateName: 'rsvp_reminder',
        templateData: {
          greeting,
          guestName: guest.name,
          reminderCount: guest.rsvp_reminder_count + 1,
          weddingDate: '20 de Novembro de 2025',
          invitationCode: guest.invitation_code,
          rsvpUrl: `https://thousandaysof.love/rsvp?code=${guest.invitation_code}`
        }
      }

      // Update reminder count
      await this.updateGuest(guest.id, {
        rsvp_reminder_count: guest.rsvp_reminder_count + 1,
        last_email_sent_date: new Date().toISOString()
      })

      // Log email attempt
      await this.logEmail(guest.id, 'reminder', emailData.subject, 'rsvp_reminder')

      // Track reminder sent
      await this.trackEvent(guest.id, 'reminder_sent', {
        reminder_count: guest.rsvp_reminder_count + 1
      })

      // TODO: Integrate with actual SendGrid service
      console.log('Would send reminder email to:', guest.email)

      return true
    } catch (error) {
      console.error('Error sending reminder email:', error)
      return false
    }
  }

  /**
   * Send bulk reminder emails to pending guests
   */
  static async sendBulkReminders(): Promise<{ sent: number; failed: number }> {
    const pendingGuests = await this.getGuestsNeedingReminders()
    let sent = 0
    let failed = 0

    for (const guest of pendingGuests) {
      const success = await this.sendReminderEmail(guest)
      if (success) {
        sent++
      } else {
        failed++
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return { sent, failed }
  }

  // ====================
  // WHATSAPP INTEGRATION
  // ====================

  /**
   * Generate WhatsApp invitation share URL
   */
  static generateWhatsAppInvitation(guest: Guest): string {
    return generateWhatsAppShareURL(guest.invitation_code, guest.name)
  }

  /**
   * Send WhatsApp reminder (placeholder for integration)
   */
  static async sendWhatsAppReminder(guest: Guest): Promise<boolean> {
    try {
      if (!guest.phone) return false

      const whatsappNumber = formatWhatsAppNumber(guest.phone)
      const message = `🎉 Lembrete: Casamento Hel & Ylana\n\n` +
                     `Olá ${guest.name}! Ainda estamos aguardando sua confirmação de presença.\n\n` +
                     `📅 Data: 20 de Novembro de 2025\n` +
                     `⏰ Horário: 16:00h\n\n` +
                     `Confirme em: https://thousandaysof.love/rsvp?code=${guest.invitation_code}\n\n` +
                     `Código: ${guest.invitation_code}`

      // TODO: Integrate with WhatsApp Business API
      console.log('Would send WhatsApp to:', whatsappNumber, message)

      // Track WhatsApp reminder
      await this.trackEvent(guest.id, 'whatsapp_reminder_sent', {
        phone_number: whatsappNumber
      })

      return true
    } catch (error) {
      console.error('Error sending WhatsApp reminder:', error)
      return false
    }
  }

  // ====================
  // ANALYTICS & TRACKING
  // ====================

  /**
   * Track RSVP analytics event
   */
  static async trackEvent(
    guestId: string | null,
    eventType: string,
    eventData: Record<string, any> = {},
    userAgent?: string,
    ipAddress?: string,
    referrer?: string,
    sessionId?: string
  ): Promise<void> {
    try {
      const supabase = createClient()

      await supabase
        .from('rsvp_analytics')
        .insert({
          guest_id: guestId,
          event_type: eventType,
          event_data: eventData,
          user_agent: userAgent,
          ip_address: ipAddress,
          referrer: referrer,
          session_id: sessionId
        })
    } catch (error) {
      console.error('Error tracking event:', error)
    }
  }

  /**
   * Get comprehensive RSVP statistics
   */
  static async getRsvpStatistics(): Promise<GuestRsvpStats> {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .rpc('get_guest_rsvp_stats')

      if (error || !data || data.length === 0) {
        return {
          total_guests: 0,
          confirmed_guests: 0,
          declined_guests: 0,
          pending_guests: 0,
          total_with_plus_ones: 0,
          confirmation_rate: 0,
          family_groups_count: 0,
          individual_guests_count: 0,
          invitations_sent: 0,
          invitations_opened: 0,
          reminder_emails_sent: 0
        }
      }

      return data[0]
    } catch (error) {
      console.error('Error getting RSVP statistics:', error)
      return {
        total_guests: 0,
        confirmed_guests: 0,
        declined_guests: 0,
        pending_guests: 0,
        total_with_plus_ones: 0,
        confirmation_rate: 0,
        family_groups_count: 0,
        individual_guests_count: 0,
        invitations_sent: 0,
        invitations_opened: 0,
        reminder_emails_sent: 0
      }
    }
  }

  /**
   * Get guest engagement analytics
   */
  static async getGuestEngagementAnalytics(days: number = 30): Promise<any> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('rsvp_analytics')
      .select('*')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })

    if (error || !data) return []

    // Process analytics data
    const eventCounts = data.reduce((acc: any, event: any) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1
      return acc
    }, {})

    return {
      totalEvents: data.length,
      eventCounts,
      dailyActivity: this.groupEventsByDay(data),
      topEvents: Object.entries(eventCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
    }
  }

  // ====================
  // ADMIN FUNCTIONS
  // ====================

  /**
   * Get all guests with enhanced data
   */
  static async getAllGuests(): Promise<Guest[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('guests')
      .select(`
        *,
        family_groups(*),
        email_logs(count)
      `)
      .order('created_at', { ascending: false })

    if (error || !data) return []
    return data
  }

  /**
   * Update guest with enhanced tracking
   */
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
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) return null

    // Track guest update
    await this.trackEvent(id, 'guest_updated', {
      updated_fields: Object.keys(updates)
    })

    return data
  }

  /**
   * Get guests needing RSVP reminders
   */
  static async getGuestsNeedingReminders(): Promise<Guest[]> {
    const supabase = createClient()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 7) // 1 week since last reminder

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .is('attending', null)
      .is('rsvp_date', null)
      .lt('rsvp_reminder_count', 3) // Max 3 reminders
      .or(`last_email_sent_date.is.null,last_email_sent_date.lt.${cutoffDate.toISOString()}`)

    if (error || !data) return []
    return data
  }

  /**
   * Export enhanced guest data as CSV
   */
  static async exportGuestsCSV(): Promise<string> {
    const guests = await this.getAllGuests()

    const headers = [
      'Nome',
      'Email',
      'Telefone',
      'Confirmação',
      'Acompanhante',
      'Nome do Acompanhante',
      'Restrições Alimentares',
      'Pedidos Especiais',
      'Código do Convite',
      'Data do RSVP',
      'Tipo de Convidado',
      'Grupo Familiar',
      'Lembretes Enviados',
      'Status de Email',
      'Data de Criação'
    ]

    const rows = guests.map((guest: any) => [
      guest.name,
      guest.email,
      guest.phone || '',
      guest.attending === true ? 'Confirmado' : guest.attending === false ? 'Não Confirmado' : 'Pendente',
      guest.plus_one ? 'Sim' : 'Não',
      guest.plus_one_name || '',
      guest.dietary_restrictions || '',
      guest.special_requests || '',
      guest.invitation_code,
      guest.rsvp_date ? formatBrazilianDate(guest.rsvp_date) : '',
      guest.guest_type || 'individual',
      guest.family_groups?.family_name || '',
      guest.rsvp_reminder_count || 0,
      guest.email_delivery_status || 'pending',
      formatBrazilianDate(guest.created_at)
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    return csvContent
  }

  // ====================
  // UTILITY FUNCTIONS
  // ====================

  /**
   * Log email activity
   */
  private static async logEmail(
    guestId: string,
    emailType: 'invitation' | 'reminder' | 'confirmation' | 'thank_you',
    subject: string,
    templateName?: string
  ): Promise<void> {
    try {
      const supabase = createClient()

      await supabase
        .from('email_logs')
        .insert({
          guest_id: guestId,
          email_type: emailType,
          subject: subject,
          template_name: templateName,
          delivery_status: 'sent'
        })
    } catch (error) {
      console.error('Error logging email:', error)
    }
  }

  /**
   * Group analytics events by day
   */
  private static groupEventsByDay(events: any[]): Record<string, number> {
    return events.reduce((acc: any, event: any) => {
      const day = event.created_at.split('T')[0]
      acc[day] = (acc[day] || 0) + 1
      return acc
    }, {})
  }

  /**
   * Real-time subscriptions for admin dashboard
   */
  static subscribeToGuestChanges(callback: (payload: any) => void) {
    const supabase = createClient()

    return supabase
      .channel('enhanced_guests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'guests',
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rsvp_analytics',
        },
        callback
      )
      .subscribe()
  }
}

export default EnhancedGuestService
