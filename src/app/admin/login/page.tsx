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
    <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-[#2C2C2C] mb-2">
              Admin Login
            </h1>
            <p className="text-[#4A4A4A]">
              Acesso restrito à área de administração
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#2C2C2C] mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha de administrador"
                className="w-full px-4 py-3 border border-[#E8E6E3] rounded-md focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent"
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
              className="w-full px-4 py-3 bg-[#2C2C2C] text-white rounded-md hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors"
            >
              ← Voltar ao site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
