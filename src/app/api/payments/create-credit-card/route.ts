import { NextRequest, NextResponse } from 'next/server'
import { GiftService } from '@/lib/services/gifts'
import { PaymentService } from '@/lib/services/payments'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      sanityGiftId,
      amount,
      payerEmail,
      buyerName,
      message,
      installments,
      cardToken,
      paymentMethodId,
      issuerId,
      identificationType,
      identificationNumber,
      cardholderName
    } = body

    if (!sanityGiftId || !amount || !cardToken || !paymentMethodId || !payerEmail || !buyerName) {
      return NextResponse.json(
        { error: 'Informações obrigatórias ausentes para processar o pagamento com cartão.' },
        { status: 400 }
      )
    }

    if (!identificationNumber) {
      return NextResponse.json(
        { error: 'CPF do titular é obrigatório para pagamento com cartão.' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'O valor do pagamento deve ser maior que zero.' },
        { status: 400 }
      )
    }

    const gift = await GiftService.getGiftFromSanity(sanityGiftId)
    if (!gift) {
      return NextResponse.json(
        { error: 'Presente não encontrado.' },
        { status: 404 }
      )
    }

    if (!gift.isActive) {
      return NextResponse.json(
        { error: 'Este presente não está mais disponível.' },
        { status: 400 }
      )
    }

    const contributions = await GiftService.getGiftContributionsAdmin(sanityGiftId)
    const remainingAmount = gift.fullPrice - contributions.totalContributed

    if (amount > remainingAmount * 1.5) {
      return NextResponse.json(
        {
          error: 'Valor muito acima do necessário para este presente.',
          details: `Faltam R$ ${remainingAmount.toFixed(2)} para concluir este presente.`,
          remainingAmount
        },
        { status: 400 }
      )
    }

    const paymentResult = await PaymentService.createCreditCardPayment({
      sanityGiftId,
      amount,
      message,
      payerEmail,
      buyerName,
      giftName: gift.title,
      cardToken,
      paymentMethodId,
      installments: installments || 1,
      issuerId,
      identificationType: identificationType || 'CPF',
      identificationNumber,
      cardholderName: cardholderName || buyerName
    })

    const mercadoPago = paymentResult.mercadoPago

    return NextResponse.json({
      success: true,
      payment: paymentResult.payment,
      status: paymentResult.status,
      mercadoPago: {
        paymentId: mercadoPago.id,
        status: mercadoPago.status,
        statusDetail: mercadoPago.status_detail,
        installments: mercadoPago.installments,
        paymentMethodId: mercadoPago.payment_method_id,
        issuerId: mercadoPago.issuer_id
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
    console.error('❌ Error creating credit card payment:', error)

    const errorMessage = error instanceof Error ? error.message : 'Erro interno ao processar o pagamento.'

    return NextResponse.json(
      {
        error: 'Falha ao processar pagamento com cartão.',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
