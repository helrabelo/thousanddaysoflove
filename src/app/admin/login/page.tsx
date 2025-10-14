'use client'

/**
 * Admin Login Page
 * Simple password-based authentication for admin access
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to admin photos
      router.push('/admin/photos')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--background)' }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl mb-2"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
              }}
            >
              Admin Login
            </h1>
            <p style={{ color: 'var(--secondary-text)' }}>
              Acesso restrito à área de administração
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--primary-text)' }}
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha de administrador"
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:border-transparent"
                style={{
                  borderColor: 'var(--accent)',
                  outlineColor: 'var(--primary-text)',
                }}
                required
                autoFocus
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full px-4 py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              style={{
                background: 'var(--primary-text)',
                color: 'var(--white-soft)',
              }}
              onMouseEnter={(e) =>
                !isLoading &&
                password &&
                (e.currentTarget.style.background = 'var(--secondary-text)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'var(--primary-text)')
              }
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm transition-colors"
              style={{ color: 'var(--secondary-text)' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--primary-text)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--secondary-text)')
              }
            >
              ← Voltar ao site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
