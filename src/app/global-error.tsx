'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error boundary caught:', error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 ">
          <div className="max-w-md w-full text-center">
            <h2
              className="mb-6 text-4xl font-serif"
              style={{
                color: '#2C2C2C',
                letterSpacing: '0.1em'
              }}
            >
              Ops! Algo deu errado
            </h2>
            <p
              className="mb-8 text-lg italic"
              style={{
                color: '#4A4A4A'
              }}
            >
              Pedimos desculpas pelo inconveniente. Tente novamente ou recarregue a página.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="px-8 py-4 rounded-full"
                style={{
                  background: '#2C2C2C',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  letterSpacing: '0.1em'
                }}
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-8 py-4 rounded-full"
                style={{
                  background: 'transparent',
                  color: '#2C2C2C',
                  border: '2px solid #2C2C2C',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  letterSpacing: '0.1em'
                }}
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
