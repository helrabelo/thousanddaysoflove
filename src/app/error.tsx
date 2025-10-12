'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h2
          className="mb-6"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '2.5rem',
            fontWeight: '400',
            color: 'var(--primary-text)',
            letterSpacing: '0.1em'
          }}
        >
          Ops! Algo deu errado
        </h2>
        <p
          className="mb-8"
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: '1.125rem',
            lineHeight: '1.8',
            color: 'var(--secondary-text)',
            fontStyle: 'italic'
          }}
        >
          Pedimos desculpas pelo inconveniente. Tente novamente ou volte para a página inicial.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="wedding"
            size="lg"
            onClick={reset}
          >
            Tentar Novamente
          </Button>
          <Button
            variant="wedding-outline"
            size="lg"
            onClick={() => window.location.href = '/'}
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  )
}
