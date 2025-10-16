import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payments'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('paymentId')
    const mercadoPagoId = searchParams.get('mercadoPagoId')

    console.log('🔍 Status check requested:', { paymentId, mercadoPagoId })

    if (!paymentId && !mercadoPagoId) {
      return NextResponse.json(
        { error: 'Payment ID or Mercado Pago ID is required' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()
    let payment = null

    // Get payment by our internal ID
    if (paymentId) {
      const { data, error } = await adminClient
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single()

      if (!error && data) {
        payment = data
      }
      console.log('📋 Payment found by internal ID:', {
        id: payment?.id,
        status: payment?.status,
        mercadoPagoId: payment?.mercado_pago_payment_id,
        hasMercadoPagoId: !!payment?.mercado_pago_payment_id
      })
    }

    // Get payment by Mercado Pago ID if not found yet
    if (!payment && mercadoPagoId) {
      const { data, error } = await adminClient
        .from('payments')
        .select('*')
        .eq('mercado_pago_payment_id', mercadoPagoId)
        .single()

      if (!error && data) {
        payment = data
      }
      console.log('📋 Payment found by Mercado Pago ID:', {
        id: payment?.id,
        status: payment?.status,
        mercadoPagoId: payment?.mercado_pago_payment_id
      })
    }

    // Check status with Mercado Pago if we have the MP ID
    let mercadoPagoStatus = null
    if (mercadoPagoId || payment?.mercado_pago_payment_id) {
      try {
        const mpId = mercadoPagoId || payment?.mercado_pago_payment_id
        if (!mpId) throw new Error('No Mercado Pago ID available')
        console.log('🎯 Checking Mercado Pago status for ID:', mpId)
        mercadoPagoStatus = await PaymentService.checkPaymentStatus(mpId)
        console.log('✅ Mercado Pago status received:', {
          id: mercadoPagoStatus.id,
          status: mercadoPagoStatus.status,
          statusDetail: mercadoPagoStatus.status_detail
        })

        // Update our payment status if different
        if (payment && mercadoPagoStatus.status) {
          let newStatus: 'pending' | 'completed' | 'failed' | 'refunded' = 'pending'

          switch (mercadoPagoStatus.status) {
            case 'approved':
              newStatus = 'completed'
              break
            case 'rejected':
            case 'cancelled':
              newStatus = 'failed'
              break
            case 'refunded':
              newStatus = 'refunded'
              break
            default:
              newStatus = 'pending'
          }

          // Update if status changed
          if (payment.status !== newStatus) {
            payment = await PaymentService.updatePaymentStatus(
              payment.id,
              newStatus,
              mpId
            )
          }
        }
      } catch (error) {
        console.error('Error checking Mercado Pago status:', error)
        // Continue with our local payment status
      }
    }

    if (!payment) {
      console.error('❌ Payment not found in database:', { paymentId, mercadoPagoId })
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    console.log('✅ Status check complete. Returning payment data.')

    return NextResponse.json({
      success: true,
      payment,
      mercadoPagoStatus: mercadoPagoStatus ? {
        id: mercadoPagoStatus.id,
        status: mercadoPagoStatus.status,
        status_detail: mercadoPagoStatus.status_detail,
        date_created: mercadoPagoStatus.date_created,
        date_approved: mercadoPagoStatus.date_approved,
        transaction_amount: mercadoPagoStatus.transaction_amount
      } : null
    })

  } catch (error) {
    console.error('Error checking payment status:', error)

    return NextResponse.json(
      {
        error: 'Erro ao verificar status do pagamento',
        details: error instanceof Error ? error.message : 'Erro interno',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}