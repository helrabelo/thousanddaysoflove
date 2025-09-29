import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payments'
import { GiftService } from '@/lib/services/gifts'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { giftId, amount, payerEmail, buyerName, message } = body

    // Validate required fields
    if (!giftId || !amount) {
      return NextResponse.json(
        { error: 'Gift ID and amount are required' },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Get gift information
    const gift = await GiftService.getGiftById(giftId)
    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      )
    }

    // Validate amount doesn't exceed gift price
    if (amount > gift.price) {
      return NextResponse.json(
        { error: 'Amount cannot exceed gift price' },
        { status: 400 }
      )
    }

    // Create PIX payment
    const paymentResult = await PaymentService.createPixPayment({
      giftId,
      amount,
      payerEmail: payerEmail || 'convidado@casamento.com',
      buyerName: buyerName || 'Convidado',
      message,
      giftName: gift.name
    })

    // Generate QR code if we have PIX code
    let qrCodeImage = null
    if (paymentResult.pixCode) {
      try {
        qrCodeImage = await PaymentService.generatePixQRCode(paymentResult.pixCode)
      } catch (error) {
        console.error('Failed to generate QR code:', error)
        // Continue without QR code image
      }
    }

    // Return payment data
    return NextResponse.json({
      success: true,
      payment: paymentResult.payment,
      mercadoPago: {
        paymentId: paymentResult.mercadoPagoResult.id,
        status: paymentResult.mercadoPagoResult.status,
        pixCode: paymentResult.pixCode,
        qrCodeBase64: paymentResult.qrCodeBase64,
        qrCodeImage
      },
      gift: {
        id: gift.id,
        name: gift.name,
        price: gift.price
      }
    })

  } catch (error) {
    console.error('Error creating PIX payment:', error)

    // Return user-friendly error message
    const errorMessage = error instanceof Error
      ? error.message
      : 'Erro interno do servidor'

    return NextResponse.json(
      {
        error: 'Falha ao criar pagamento PIX',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}