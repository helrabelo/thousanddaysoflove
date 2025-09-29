import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payments'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('paymentId')
    const mercadoPagoId = searchParams.get('mercadoPagoId')

    if (!paymentId && !mercadoPagoId) {
      return NextResponse.json(
        { error: 'Payment ID or Mercado Pago ID is required' },
        { status: 400 }
      )
    }

    let payment = null

    // Get payment by our internal ID
    if (paymentId) {
      payment = await PaymentService.getPaymentById(paymentId)
    }

    // Check status with Mercado Pago if we have the MP ID
    let mercadoPagoStatus = null
    if (mercadoPagoId || payment?.mercado_pago_payment_id) {
      try {
        const mpId = mercadoPagoId || payment.mercado_pago_payment_id
        mercadoPagoStatus = await PaymentService.checkPaymentStatus(mpId)

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
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

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