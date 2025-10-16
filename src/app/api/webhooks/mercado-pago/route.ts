// @ts-nocheck: Mercado Pago webhook still relies on loosely typed payment payloads
import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payments'
import { EmailService } from '@/lib/services/email'
import crypto from 'crypto'

const SIGNATURE_HASH_KEYS = ['sha256', 'hash', 'v1', 'v2']

function parseSignatureHeader(header: string) {
  return header
    .split(/[;,]/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, segment) => {
      const [key, ...valueParts] = segment.split('=')
      const value = valueParts.join('=').trim()
      if (key && value) {
        acc[key.trim()] = value
      }
      return acc
    }, {})
}

// Verify Mercado Pago webhook signature
function verifyWebhookSignature(params: {
  body: string
  signatureHeader: string
  secret: string
  requestUrl: string
}): boolean {
  try {
    const parsed = parseSignatureHeader(params.signatureHeader)
    const id = parsed.id
    const ts = parsed.ts
    const hashKey = SIGNATURE_HASH_KEYS.find((key) => parsed[key])
    const providedHash = hashKey ? parsed[hashKey] : null

    if (!id || !ts || !providedHash) {
      console.error('Webhook signature header missing required fields:', parsed)
      return false
    }

    const url = new URL(params.requestUrl)
    const normalizedUrl = `${url.origin}${url.pathname}`

    const payloadCandidates = [
      `${id}${ts}${normalizedUrl}`,
      `${id}${ts}${normalizedUrl}${params.body}`,
      params.body
    ]

    const providedBuffer = Buffer.from(providedHash.toLowerCase(), 'hex')

    for (const payload of payloadCandidates) {
      const computed = crypto
        .createHmac('sha256', params.secret)
        .update(payload)
        .digest('hex')

      const computedBuffer = Buffer.from(computed, 'hex')

      if (
        providedBuffer.length === computedBuffer.length &&
        crypto.timingSafeEqual(providedBuffer, computedBuffer)
      ) {
        return true
      }
    }

    console.error('Webhook signature mismatch for payload candidates', {
      parsed,
      normalizedUrl
    })
    return false
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
    if (webhookSecret && signature) {
      const signatureValid = verifyWebhookSignature({
        body,
        signatureHeader: signature,
        secret: webhookSecret,
        requestUrl: req.url
      })

      if (!signatureValid) {
        console.error('Invalid webhook signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    } else if (webhookSecret && !signature) {
      console.error('Webhook secret configured, but no x-signature header present')
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 401 }
      )
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
          const payment = await PaymentService.getPaymentById(paymentStatus.external_reference, {
            useAdmin: true
          })

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
