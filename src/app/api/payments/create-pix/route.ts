import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payments'
import { GiftService } from '@/lib/services/gifts'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/payments/create-pix
 *
 * Creates a PIX payment for a wedding gift
 *
 * SECURITY: Database operations use admin client (service role)
 * This is safe because this API route is server-side only.
 * The service layer only handles Mercado Pago API calls (external API).
 */
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

    // Create admin client for database operations (SECURE: server-side only)
    const adminClient = createAdminClient()

    // Step 1: Create payment record in database
    console.log('🎯 [1/4] Creating payment record in database...')
    const { data: payment, error: createError } = await adminClient
      .from('payments')
      .insert({
        sanity_gift_id: sanityGiftId,
        guest_id: null,
        amount,
        status: 'pending',
        payment_method: 'pix',
        message: message || null
      })
      .select()
      .single()

    if (createError || !payment) {
      console.error('❌ [1/4] Failed to create payment record:', createError)
      throw new Error(`Database error: ${createError?.message || 'Unknown error'}`)
    }

    console.log('✅ [1/4] Payment record created:', {
      internalId: payment.id,
      amount: payment.amount,
      status: payment.status
    })

    // Step 2: Call Mercado Pago API (service layer handles this)
    console.log('🎯 [2/4] Calling Mercado Pago API...')
    const mercadoPagoResult = await PaymentService.processMercadoPagoPayment({
      paymentId: payment.id,
      amount,
      paymentMethod: 'pix',
      payerEmail: payerEmail || 'convidado@casamento.com',
      description: `Casamento Hel & Ylana`,
      giftName: gift.title,
      buyerName: buyerName || 'Convidado'
    })

    console.log('✅ [2/4] Mercado Pago response received:', {
      mercadoPagoId: mercadoPagoResult.id,
      mercadoPagoIdType: typeof mercadoPagoResult.id,
      status: mercadoPagoResult.status,
      statusDetail: mercadoPagoResult.status_detail,
      hasQrCode: !!mercadoPagoResult.point_of_interaction?.transaction_data?.qr_code
    })

    // Step 3: Update payment with Mercado Pago ID
    console.log('🎯 [3/4] Updating payment with Mercado Pago ID...')
    const mercadoPagoIdString = String(mercadoPagoResult.id)

    const { data: updatedPayment, error: updateError } = await adminClient
      .from('payments')
      .update({
        mercado_pago_payment_id: mercadoPagoIdString,
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ [3/4] Failed to update payment with Mercado Pago ID:', updateError)
      console.error('Update error details:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint
      })
      // Don't throw - payment was created, just log the error
    }

    console.log('✅ [3/4] Payment updated with Mercado Pago ID:', {
      internalId: updatedPayment?.id,
      mercadoPagoIdSaved: updatedPayment?.mercado_pago_payment_id,
      idMatches: updatedPayment?.mercado_pago_payment_id === mercadoPagoIdString,
      updateSuccessful: !updateError
    })

    if (!updatedPayment?.mercado_pago_payment_id) {
      console.error('⚠️ WARNING: Mercado Pago ID was NOT saved to database!')
    }

    console.log('✅ [4/4] Payment creation complete')

    // Generate QR code
    const pixCode = mercadoPagoResult.point_of_interaction?.transaction_data?.qr_code
    let qrCodeImage = null
    if (pixCode) {
      try {
        qrCodeImage = await PaymentService.generatePixQRCode(pixCode)
      } catch (error) {
        console.error('Failed to generate QR code:', error)
      }
    }

    // Return payment data
    return NextResponse.json({
      success: true,
      payment: updatedPayment || payment, // Use updated payment if available
      mercadoPago: {
        paymentId: mercadoPagoResult.id,
        status: mercadoPagoResult.status,
        pixCode,
        qrCodeBase64: mercadoPagoResult.point_of_interaction?.transaction_data?.qr_code_base64,
        qrCodeImage
      },
      gift: {
        id: gift._id,
        name: gift.title,
        price: gift.fullPrice,
        remainingAmount,
        totalContributed: contributions.totalContributed
      }
    })

  } catch (error) {
    console.error('❌ Error creating PIX payment:', error)

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
