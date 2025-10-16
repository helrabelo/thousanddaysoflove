import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payments'
import { GiftService } from '@/lib/services/gifts'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sanityGiftId, amount, payerEmail, buyerName, message } = body

    // Validate required fields
    if (!sanityGiftId || !amount) {
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

    // Validate minimum amount (R$50 as per requirements)
    // if (amount < 50) {
    //   return NextResponse.json(
    //     { error: 'Valor mínimo de contribuição é R$ 50,00' },
    //     { status: 400 }
    //   )
    // }

    // Get gift information from Sanity CMS
    const gift = await GiftService.getGiftFromSanity(sanityGiftId)
    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      )
    }

    // Check if gift is active
    if (!gift.isActive) {
      return NextResponse.json(
        { error: 'Este presente não está mais disponível' },
        { status: 400 }
      )
    }

    // Get current contribution progress from Supabase
    const contributions = await GiftService.getGiftContributions(sanityGiftId)
    const remainingAmount = gift.fullPrice - contributions.totalContributed

    // Validate amount doesn't exceed remaining gift value
    // (Allow over-contributions as per requirements: "who would refuse more money?")
    // But still show warning if significantly over
    if (amount > remainingAmount * 1.5) {
      return NextResponse.json(
        {
          error: 'Valor muito acima do necessário',
          details: `Faltam apenas R$ ${remainingAmount.toFixed(2)} para este presente. Você pode escolher um valor menor ou contribuir para outro presente.`,
          remainingAmount
        },
        { status: 400 }
      )
    }

    // Create PIX payment
    const paymentResult = await PaymentService.createPixPayment({
      sanityGiftId, // Now using Sanity reference
      amount,
      payerEmail: payerEmail || 'convidado@casamento.com',
      buyerName: buyerName || 'Convidado',
      message,
      giftName: gift.title // Changed from gift.name to gift.title (Sanity schema)
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
        id: gift._id, // Sanity _id
        name: gift.title, // Sanity title
        price: gift.fullPrice, // Sanity fullPrice
        remainingAmount, // Show how much is still needed
        totalContributed: contributions.totalContributed // Show current progress
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
