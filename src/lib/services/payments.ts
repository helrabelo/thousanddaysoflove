// @ts-nocheck: payments dashboard relies on Supabase RPC payloads not yet modelled in TypeScript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/server'
import { Payment } from '@/types/wedding'
import QRCode from 'qrcode'

export class PaymentService {
  // Create a new payment intent
  // Updated to use sanityGiftId from Sanity CMS instead of Supabase gift_id
  static async createPayment(paymentData: {
    sanityGiftId: string // Sanity CMS gift _id
    guestId?: string
    amount: number
    paymentMethod: 'pix' | 'credit_card' | 'bank_transfer'
    message?: string
  }): Promise<Payment | null> {
    const supabase = createClient()

    const newPayment = {
      sanity_gift_id: paymentData.sanityGiftId, // Now using Sanity reference
      guest_id: paymentData.guestId || null,
      amount: paymentData.amount,
      status: 'pending' as const,
      payment_method: paymentData.paymentMethod,
      message: paymentData.message || null
    }

    const { data, error } = await supabase
      .from('payments')
      .insert(newPayment)
      .select()
      .single()

    if (error || !data) {
      console.error('Error creating payment:', error)
      return null
    }

    return data
  }

  // Update payment status (usually called by webhooks)
  static async updatePaymentStatus(
    paymentId: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded',
    mercadoPagoPaymentId?: string
  ): Promise<Payment | null> {
    try {
      const adminClient = createAdminClient()

      const updateData: Partial<Payment> = {
        status,
        updated_at: new Date().toISOString()
      }

      if (mercadoPagoPaymentId) {
        updateData.mercado_pago_payment_id = mercadoPagoPaymentId
      }

      const { data, error } = await adminClient
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single()

      if (error) {
        console.error('Error updating payment status:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error)
      return null
    }
  }

  // Get payment by ID
  static async getPaymentById(id: string): Promise<Payment | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        gifts (
          id,
          name,
          price,
          category
        ),
        guests (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error || !data) return null
    return data
  }

  // Get payments by gift ID
  static async getPaymentsByGift(giftId: string): Promise<Payment[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        guests (
          id,
          name,
          email
        )
      `)
      .eq('gift_id', giftId)
      .order('created_at', { ascending: false })

    if (error || !data) return []
    return data
  }

  // Get payments by guest ID
  static async getPaymentsByGuest(guestId: string): Promise<Payment[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        gifts (
          id,
          name,
          price,
          category
        )
      `)
      .eq('guest_id', guestId)
      .order('created_at', { ascending: false })

    if (error || !data) return []
    return data
  }

  // Admin functions
  static async getAllPayments(): Promise<Payment[]> {
    try {
      const adminClient = createAdminClient()

      const { data, error } = await adminClient
        .from('payments')
        .select(`
          *,
          gifts (
            id,
            name,
            price,
            category
          ),
          guests (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching payments:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getAllPayments:', error)
      return []
    }
  }

  static async getPaymentStats() {
    try {
      const adminClient = createAdminClient()

      const { data: payments, error } = await adminClient
        .from('payments')
        .select('amount, status, payment_method, created_at')

      if (error || !payments) {
        console.error('Error fetching payment stats:', error)
        return {
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          totalAmount: 0,
          completedAmount: 0,
          pendingAmount: 0,
          byMethod: {
            pix: 0,
            credit_card: 0,
            bank_transfer: 0
          }
        }
      }

      const stats = payments.reduce((acc, payment) => {
        acc.total++
        acc.totalAmount += payment.amount

        // Count by status
        switch (payment.status) {
          case 'completed':
            acc.completed++
            acc.completedAmount += payment.amount
            break
          case 'pending':
            acc.pending++
            acc.pendingAmount += payment.amount
            break
          case 'failed':
          case 'refunded':
            acc.failed++
            break
        }

        // Count by payment method
        if (payment.status === 'completed') {
          acc.byMethod[payment.payment_method]++
        }

        return acc
      }, {
        total: 0,
        completed: 0,
        pending: 0,
        failed: 0,
        totalAmount: 0,
        completedAmount: 0,
        pendingAmount: 0,
        byMethod: {
          pix: 0,
          credit_card: 0,
          bank_transfer: 0
        }
      })

      return stats
    } catch (error) {
      console.error('Error in getPaymentStats:', error)
      return {
        total: 0,
        completed: 0,
        pending: 0,
        failed: 0,
        totalAmount: 0,
        completedAmount: 0,
        pendingAmount: 0,
        byMethod: {
          pix: 0,
          credit_card: 0,
          bank_transfer: 0
        }
      }
    }
  }

  // Get recent payments for admin dashboard
  static async getRecentPayments(limit: number = 10): Promise<Payment[]> {
    try {
      const adminClient = createAdminClient()

      const { data, error } = await adminClient
        .from('payments')
        .select(`
          *,
          gifts (
            id,
            name,
            price,
            category
          ),
          guests (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching recent payments:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getRecentPayments:', error)
      return []
    }
  }

  // Process payment with Mercado Pago
  static async processMercadoPagoPayment(paymentData: {
    paymentId: string
    amount: number
    paymentMethod: 'pix' | 'credit_card'
    payerEmail?: string
    description: string
    giftName?: string
    buyerName?: string
  }) {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

    if (!accessToken) {
      throw new Error('Mercado Pago access token not configured')
    }

    const requestBody = {
      transaction_amount: paymentData.amount,
      description: `${paymentData.description} - ${paymentData.giftName || 'Presente'}`,
      payment_method_id: paymentData.paymentMethod,
      payer: {
        email: paymentData.payerEmail || 'convidado@casamento.com',
        first_name: paymentData.buyerName?.split(' ')[0] || 'Convidado',
        last_name: paymentData.buyerName?.split(' ').slice(1).join(' ') || 'Casamento'
      },
      external_reference: paymentData.paymentId,
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercado-pago`,
      metadata: {
        payment_id: paymentData.paymentId,
        gift_name: paymentData.giftName,
        buyer_name: paymentData.buyerName,
        wedding_couple: 'Hel & Ylana',
        wedding_date: '2025-11-20'
      }
    }

    try {
      const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `wedding-${paymentData.paymentId}-${Date.now()}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Mercado Pago API error:', response.status, errorData)
        throw new Error(`Mercado Pago API error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const result = await response.json()
      console.log('Mercado Pago payment created:', result.id, result.status)
      return result
    } catch (error) {
      console.error('Error processing Mercado Pago payment:', error)
      throw error
    }
  }

  // Create PIX payment with QR code
  // Updated to use sanityGiftId from Sanity CMS
  static async createPixPayment(paymentData: {
    sanityGiftId: string // Sanity CMS gift _id
    guestId?: string
    amount: number
    message?: string
    payerEmail?: string
    giftName?: string
    buyerName?: string
  }) {
    try {
      // Create payment record
      const payment = await this.createPayment({
        sanityGiftId: paymentData.sanityGiftId, // Now using Sanity reference
        guestId: paymentData.guestId,
        amount: paymentData.amount,
        paymentMethod: 'pix',
        message: paymentData.message
      })

      if (!payment) {
        throw new Error('Failed to create payment record')
      }

      // Process with Mercado Pago (no changes - this is external API)
      const mercadoPagoResult = await this.processMercadoPagoPayment({
        paymentId: payment.id,
        amount: paymentData.amount,
        paymentMethod: 'pix',
        payerEmail: paymentData.payerEmail,
        description: `Casamento Hel & Ylana`,
        giftName: paymentData.giftName,
        buyerName: paymentData.buyerName
      })

      // Update payment with Mercado Pago ID
      if (mercadoPagoResult.id) {
        await this.updatePaymentStatus(payment.id, 'pending', mercadoPagoResult.id.toString())
      }

      return {
        payment,
        mercadoPagoResult,
        qrCode: mercadoPagoResult.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: mercadoPagoResult.point_of_interaction?.transaction_data?.qr_code_base64,
        pixCode: mercadoPagoResult.point_of_interaction?.transaction_data?.qr_code
      }
    } catch (error) {
      console.error('Error creating PIX payment:', error)
      throw error
    }
  }

  // Generate QR Code for PIX payment
  static async generatePixQRCode(pixCode: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(pixCode, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#2D1B69',  // Wedding purple
          light: '#FFFFFF'
        },
        width: 256
      })
      return qrCodeDataURL
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  // Check payment status with Mercado Pago
  static async checkPaymentStatus(mercadoPagoPaymentId: string) {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

    if (!accessToken) {
      throw new Error('Mercado Pago access token not configured')
    }

    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${mercadoPagoPaymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Mercado Pago API error: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error checking payment status:', error)
      throw error
    }
  }

  // Process webhook notification
  static async processWebhookNotification(webhookData: any) {
    try {
      const { data, type } = webhookData

      if (type === 'payment' && data?.id) {
        const paymentStatus = await this.checkPaymentStatus(data.id)

        // Find our payment record by external_reference
        const paymentId = paymentStatus.external_reference

        if (paymentId) {
          let status: 'pending' | 'completed' | 'failed' | 'refunded' = 'pending'

          switch (paymentStatus.status) {
            case 'approved':
              status = 'completed'
              break
            case 'rejected':
            case 'cancelled':
              status = 'failed'
              break
            case 'refunded':
              status = 'refunded'
              break
            default:
              status = 'pending'
          }

          // Update payment status
          await this.updatePaymentStatus(paymentId, status, data.id.toString())

          // Send email notification if payment is completed
          if (status === 'completed') {
            // TODO: Trigger email notification
            console.log(`Payment completed for payment ID: ${paymentId}`)
          }
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error processing webhook:', error)
      throw error
    }
  }

  // Brazilian currency formatting
  static formatBrazilianPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Real-time subscriptions for payment changes
  static subscribeToPaymentChanges(callback: (payload: { new: Payment; old: Payment; eventType: string }) => void) {
    const supabase = createClient()

    return supabase
      .channel('payments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
        },
        callback
      )
      .subscribe()
  }

  // Validate payment amount
  static validatePaymentAmount(amount: number, giftPrice: number): boolean {
    return amount > 0 && amount <= giftPrice
  }

  // Get payment method display name in Portuguese
  static getPaymentMethodName(method: string): string {
    const methods: Record<string, string> = {
      'pix': 'PIX',
      'credit_card': 'Cartão de Crédito',
      'bank_transfer': 'Transferência Bancária'
    }

    return methods[method] || method
  }

  // Get payment status display name in Portuguese
  static getPaymentStatusName(status: string): string {
    const statuses: Record<string, string> = {
      'pending': 'Pendente',
      'completed': 'Concluído',
      'failed': 'Falhou',
      'refunded': 'Reembolsado'
    }

    return statuses[status] || status
  }
}
