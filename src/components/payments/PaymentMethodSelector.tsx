'use client'

import { CreditCard, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PaymentMethodOption = 'pix' | 'credit_card'

interface PaymentMethodSelectorProps {
  value: PaymentMethodOption
  onChange: (method: PaymentMethodOption) => void
}

const methodConfigs: Record<PaymentMethodOption, { label: string; description: string; icon: typeof QrCode }> = {
  pix: {
    label: 'PIX',
    description: 'Pagamento instantâneo via QR Code',
    icon: QrCode
  },
  credit_card: {
    label: 'Cartão de Crédito',
    description: 'Pague com Visa, Mastercard e mais',
    icon: CreditCard
  }
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-700">Escolha como deseja contribuir</p>
        <p className="text-xs text-gray-500">PIX é instantâneo e sem taxas; cartão de crédito permite parcelar.</p>
      </div>
      <div className="grid gap-3">
        {(Object.keys(methodConfigs) as PaymentMethodOption[]).map((method) => {
          const config = methodConfigs[method]
          const Icon = config.icon
          const isSelected = value === method

          return (
            <button
              key={method}
              type="button"
              onClick={() => onChange(method)}
              className={cn(
                'flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all',
                isSelected
                  ? 'border-gray-800 bg-gray-100 shadow-md'
                  : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border',
                  isSelected ? 'border-gray-800 bg-white' : 'border-gray-200 bg-white'
                )}>
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{config.label}</p>
                  <p className="text-xs text-gray-500">{config.description}</p>
                </div>
              </div>
              <span
                className={cn(
                  'inline-flex h-5 w-5 items-center justify-center rounded-full border-2',
                  isSelected ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                )}
              >
                {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
