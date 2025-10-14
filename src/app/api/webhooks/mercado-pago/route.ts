// @ts-nocheck: Mercado Pago webhook still relies on loosely typed payment payloads
import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payments'
import { EmailService } from '@/lib/services/email'
import crypto from 'crypto'

// Verify Mercado Pago webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(body)
    const expectedSignature = hmac.digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-signature') || ''
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET

    // Verify webhook signature if secret is configured
    if (webhookSecret) {
      if (!verifyWebhookSignature(body, signature, webhookSecret)) {
        console.error('Invalid webhook signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    // Parse webhook data
    let webhookData
    try {
      webhookData = JSON.parse(body)
    } catch (error) {
      console.error('Invalid JSON in webhook body:', error)
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Webhook data:', JSON.stringify(webhookData, null, 2))
    }

    // Process the webhook notification
    const result = await PaymentService.processWebhookNotification(webhookData)

    // If payment was completed, send notification email
    if (webhookData.type === 'payment' && webhookData.data?.id) {
      try {
        const paymentStatus = await PaymentService.checkPaymentStatus(webhookData.data.id)

        if (paymentStatus.status === 'approved' && paymentStatus.external_reference) {
          const payment = await PaymentService.getPaymentById(paymentStatus.external_reference)

          if (payment) {
            // Send payment confirmation email
            await EmailService.sendPaymentConfirmation({
              paymentId: payment.id,
              giftName: payment.gifts?.name || 'Presente',
              amount: payment.amount,
              buyerName: paymentStatus.payer?.first_name || 'Convidado',
              buyerEmail: paymentStatus.payer?.email || 'convidado@casamento.com'
            })
          }
        }
      } catch (emailError) {
        console.error('Error sending payment confirmation email:', emailError)
        // Don't fail the webhook for email errors
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error processing Mercado Pago webhook:', error)

    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Handle GET requests for webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const challenge = searchParams.get('challenge')

  if (challenge) {
    // Mercado Pago webhook verification
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  }

  return NextResponse.json({
    message: 'Mercado Pago webhook endpoint',
    timestamp: new Date().toISOString(),
    status: 'active'
  })
}
