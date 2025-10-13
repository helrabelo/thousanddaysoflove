'use client'

/**
 * Guest Login Page
 * Allows guests to authenticate with invitation code or shared password
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setGuestSessionCookie } from '@/lib/auth/guestAuth'

type AuthMethod = 'invitation_code' | 'shared_password'

export default function GuestLoginPage() {
  const router = useRouter()
  const [authMethod, setAuthMethod] = useState<AuthMethod>('invitation_code')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [invitationCode, setInvitationCode] = useState('')
  const [password, setPassword] = useState('')
  const [guestName, setGuestName] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authMethod,
          invitationCode: authMethod === 'invitation_code' ? invitationCode : undefined,
          password: authMethod === 'shared_password' ? password : undefined,
          guestName: authMethod === 'shared_password' && guestName ? guestName : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login')
        return
      }

      // Store session token in cookie (client-side)
      if (data.session?.session_token) {
        setGuestSessionCookie(data.session.session_token)
      }

      // Redirect to upload page
      router.push('/dia-1000/upload')
    } catch (err) {
      console.error('Login error:', err)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl md:text-5xl text-[#2C2C2C] mb-4">
            Mil Dias de Amor
          </h1>
          <p className="font-crimson text-lg text-[#4A4A4A]">
            Compartilhe suas fotos e vídeos do nosso casamento
          </p>
        </div>

        {/* Auth Method Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setAuthMethod('invitation_code')}
              className={`flex-1 py-3 px-4 rounded-lg font-crimson text-sm transition-all ${
                authMethod === 'invitation_code'
                  ? 'bg-[#2C2C2C] text-white'
                  : 'bg-[#E8E6E3] text-[#4A4A4A] hover:bg-[#A8A8A8]/20'
              }`}
            >
              Código de Convite
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('shared_password')}
              className={`flex-1 py-3 px-4 rounded-lg font-crimson text-sm transition-all ${
                authMethod === 'shared_password'
                  ? 'bg-[#2C2C2C] text-white'
                  : 'bg-[#E8E6E3] text-[#4A4A4A] hover:bg-[#A8A8A8]/20'
              }`}
            >
              Senha Compartilhada
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {authMethod === 'invitation_code' && (
              <div>
                <label
                  htmlFor="invitation-code"
                  className="block font-crimson text-sm text-[#4A4A4A] mb-2"
                >
                  Código de Convite
                </label>
                <input
                  id="invitation-code"
                  type="text"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                  placeholder="Ex: HY1000"
                  required
                  className="w-full px-4 py-3 border border-[#E8E6E3] rounded-lg font-crimson text-[#2C2C2C] placeholder:text-[#A8A8A8] focus:outline-none focus:border-[#2C2C2C] transition-colors"
                  maxLength={10}
                />
                <p className="mt-2 font-crimson text-xs text-[#A8A8A8]">
                  Seu código de convite foi enviado no convite de casamento
                </p>
              </div>
            )}

            {authMethod === 'shared_password' && (
              <>
                <div>
                  <label
                    htmlFor="guest-name"
                    className="block font-crimson text-sm text-[#4A4A4A] mb-2"
                  >
                    Seu Nome (opcional)
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ex: Maria Silva"
                    className="w-full px-4 py-3 border border-[#E8E6E3] rounded-lg font-crimson text-[#2C2C2C] placeholder:text-[#A8A8A8] focus:outline-none focus:border-[#2C2C2C] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block font-crimson text-sm text-[#4A4A4A] mb-2"
                  >
                    Senha Compartilhada
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha"
                    required
                    className="w-full px-4 py-3 border border-[#E8E6E3] rounded-lg font-crimson text-[#2C2C2C] placeholder:text-[#A8A8A8] focus:outline-none focus:border-[#2C2C2C] transition-colors"
                  />
                  <p className="mt-2 font-crimson text-xs text-[#A8A8A8]">
                    A senha foi compartilhada com todos os convidados
                  </p>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-crimson text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-[#2C2C2C] text-white font-crimson rounded-lg hover:bg-[#4A4A4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="font-crimson text-sm text-[#A8A8A8]">
            Problemas para entrar?{' '}
            <a
              href="mailto:contato@thousanddaysof.love"
              className="text-[#2C2C2C] hover:underline"
            >
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
