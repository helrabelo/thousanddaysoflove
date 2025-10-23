/**
 * Payment Configuration
 *
 * Centralized configuration for payment-related settings.
 * Can be controlled via environment variables for different environments.
 */

/**
 * Default minimum payment amount in BRL (R$50)
 * This is used if NEXT_PUBLIC_MIN_PAYMENT_AMOUNT is not set
 */
const DEFAULT_MIN_PAYMENT = 50

/**
 * Minimum payment amount in BRL
 *
 * - Production: 50 (R$50.00 minimum) - DEFAULT
 * - Testing: 1 (R$1.00 minimum for testing payments)
 *
 * Configure via NEXT_PUBLIC_MIN_PAYMENT_AMOUNT environment variable
 * If not set or invalid, defaults to 50 for safety
 */
export const MIN_PAYMENT_AMOUNT = (() => {
  const envValue = process.env.NEXT_PUBLIC_MIN_PAYMENT_AMOUNT

  // If not set, use default
  if (!envValue) {
    return DEFAULT_MIN_PAYMENT
  }

  // Parse and validate
  const parsed = parseInt(envValue, 10)

  // If invalid (NaN) or negative, use default
  if (isNaN(parsed) || parsed < 1) {
    console.warn(`Invalid NEXT_PUBLIC_MIN_PAYMENT_AMOUNT: "${envValue}". Using default: ${DEFAULT_MIN_PAYMENT}`)
    return DEFAULT_MIN_PAYMENT
  }

  return parsed
})()

/**
 * Default suggested contribution amounts
 * These are shown as quick-select buttons in the payment modal
 */
export const DEFAULT_SUGGESTED_AMOUNTS = [100, 250, 500, 1000]

/**
 * Payment method options available
 */
export const PAYMENT_METHODS = {
  PIX: 'pix',
  CREDIT_CARD: 'credit_card',
} as const

/**
 * Format a currency amount in Brazilian Real
 */
export function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

/**
 * Get minimum payment message for UI
 */
export function getMinPaymentMessage(): string {
  return `Mínimo R$ ${MIN_PAYMENT_AMOUNT}`
}

/**
 * Validate if an amount meets the minimum requirement
 */
export function isValidPaymentAmount(amount: number): boolean {
  return amount >= MIN_PAYMENT_AMOUNT
}
