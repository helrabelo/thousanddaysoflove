'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Lock } from 'lucide-react'

interface CreditCardFormProps {
  amount: number
  buyerName: string
  buyerEmail: string
  onSubmit: (data: {
    token: string
    paymentMethodId: string
    issuerId?: string
    installments: number
    identificationType: string
    identificationNumber: string
    cardholderName: string
  }) => Promise<void> | void
}

const installmentsOptions = Array.from({ length: 12 }, (_, index) => index + 1)

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

const formatExpiry = (value: string) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 4)
  if (cleaned.length < 3) return cleaned
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
}

const formatCPF = (value: string) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11)
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`
}

const cleanNumber = (value: string) => value.replace(/\D/g, '')

const getPaymentMethodFromBin = async (publicKey: string, bin: string) => {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payment_methods/search?public_key=${publicKey}&bin=${bin}`)
    if (!response.ok) return null
    const payload = await response.json()
    const result = payload.results?.[0]
    if (!result) return null
    return {
      paymentMethodId: result?.payment_method?.id as string | undefined,
      issuerId: result?.issuer?.id as string | undefined
    }
  } catch (error) {
    console.error('Failed to fetch payment method info:', error)
    return null
  }
}

export function CreditCardForm({ amount, buyerName, buyerEmail, onSubmit }: CreditCardFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState(buyerName)
  const [cpf, setCpf] = useState('')
  const [installments, setInstallments] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const publicKey = useMemo(() => process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY, [])

  const isFormValid = useMemo(() => {
    const cardDigits = cleanNumber(cardNumber)
    const cpfDigits = cleanNumber(cpf)
    const [expMonth, expYear] = expiry.split('/')

    return (
      cardDigits.length >= 13 &&
      expMonth?.length === 2 &&
      expYear?.length === 2 &&
      cleanNumber(cvv).length >= 3 &&
      cardholderName.trim().length > 4 &&
      buyerEmail.length > 3 &&
      cpfDigits.length === 11
    )
  }, [cardNumber, cvv, expiry, cardholderName, buyerEmail, cpf])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!publicKey) {
      setError('Configuração do Mercado Pago ausente. Verifique a variável NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY.')
      return
    }

    if (!isFormValid) {
      setError('Preencha todos os campos do cartão corretamente.')
      return
    }

    setIsSubmitting(true)

    try {
      const cardDigits = cleanNumber(cardNumber)
      const [expMonth, expYear] = expiry.split('/')
      const expirationYear = Number(expYear)
      const expirationMonth = Number(expMonth)
      const yearFull = expirationYear + (expirationYear >= 0 && expirationYear <= 50 ? 2000 : 1900)
      const securityCode = cleanNumber(cvv)
      const cpfDigits = cleanNumber(cpf)

      const tokenResponse = await fetch(`https://api.mercadopago.com/v1/card_tokens?public_key=${publicKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          card_number: cardDigits,
          expiration_month: expirationMonth,
          expiration_year: yearFull,
          security_code: securityCode,
          cardholder: {
            name: cardholderName,
            identification: {
              type: 'CPF',
              number: cpfDigits
            }
          }
        })
      })

      const tokenPayload = await tokenResponse.json()

      if (!tokenResponse.ok) {
        const message = tokenPayload?.message || tokenPayload?.error || 'Não foi possível tokenizar o cartão.'
        throw new Error(message)
      }

      const cardTokenId = tokenPayload.id as string | undefined
      const cardFirstSix = (tokenPayload.first_six_digits as string | undefined) || cardDigits.slice(0, 6)

      if (!cardTokenId) {
        throw new Error('Token de cartão inválido retornado pelo Mercado Pago.')
      }

      let paymentMethodId = 'credit_card'
      let issuerId: string | undefined

      if (cardFirstSix && cardFirstSix.length >= 6) {
        const methodInfo = await getPaymentMethodFromBin(publicKey, cardFirstSix)
        if (methodInfo?.paymentMethodId) {
          paymentMethodId = methodInfo.paymentMethodId
          issuerId = methodInfo.issuerId
        } else if (cardDigits.startsWith('4')) {
          paymentMethodId = 'visa'
        } else if (/^5[1-5]/.test(cardDigits)) {
          paymentMethodId = 'master'
        } else if (cardDigits.startsWith('3')) {
          paymentMethodId = 'amex'
        }
      }

      await onSubmit({
        token: cardTokenId,
        paymentMethodId,
        issuerId,
        installments,
        identificationType: 'CPF',
        identificationNumber: cpfDigits,
        cardholderName
      })
    } catch (submissionError) {
      console.error('Credit card submission failed:', submissionError)
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : 'Não foi possível processar seu cartão. Tente novamente ou use outro método.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-gray-700">
          <Lock className="w-4 h-4" />
          <p className="text-sm font-medium">Pagamento protegido pelo Mercado Pago</p>
        </div>
        <p className="text-xs text-gray-500">
          Usamos tokenização segura. Seus dados são enviados diretamente ao Mercado Pago e não ficam salvos aqui.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome impresso no cartão</label>
        <input
          type="text"
          value={cardholderName}
          onChange={(event) => setCardholderName(event.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          placeholder="Como aparece no cartão"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CPF do titular</label>
        <input
          type="text"
          value={cpf}
          onChange={(event) => setCpf(formatCPF(event.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          placeholder="000.000.000-00"
          required
        />
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número do cartão</label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={cardNumber}
            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            placeholder="0000 0000 0000 0000"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Validade (MM/AA)</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={expiry}
              onChange={(event) => setExpiry(formatExpiry(event.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="12/30"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={cvv}
              onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="123"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
        <select
          value={installments}
          onChange={(event) => setInstallments(Number(event.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          {installmentsOptions.map((option) => (
            <option key={option} value={option}>
              {option}x de {formatCurrency(amount / option)}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Sem juros — pagamos as taxas pelo carinho! 💛</p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white py-3 rounded-xl font-medium"
        isLoading={isSubmitting}
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? 'Processando pagamento...' : `Pagar ${formatCurrency(amount)} com cartão`}
      </Button>
    </form>
  )
}
