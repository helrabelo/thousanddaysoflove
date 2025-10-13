'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle, Heart } from 'lucide-react';
import { loginWithInvitationCode } from '@/lib/supabase/invitations';

/**
 * Guest Login Page
 *
 * Simple form to authenticate guests with their invitation code
 * Creates persistent session in localStorage
 */
export default function GuestLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for error in URL params
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'invalid_code') {
      setError('Código inválido. Verifique seu convite e tente novamente.');
    } else if (errorParam === 'login_failed') {
      setError('Erro ao fazer login. Tente novamente.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Trim and uppercase the code
      const cleanCode = code.trim().toUpperCase();

      if (!cleanCode) {
        setError('Por favor, insira seu código de convite');
        setIsLoading(false);
        return;
      }

      // Attempt login
      const invitation = await loginWithInvitationCode(cleanCode);

      if (!invitation) {
        setError(
          'Código inválido. Verifique seu convite e tente novamente.'
        );
        setIsLoading(false);
        return;
      }

      // Success! Redirect to dashboard
      router.push('/meu-convite');
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro ao fazer login. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-4"
          >
            <Heart className="w-8 h-8 text-pink-600" />
          </motion.div>

          <h1 className="font-playfair text-4xl md:text-5xl text-[#2C2C2C] mb-2">
            Meu Convite
          </h1>
          <p className="font-crimson text-lg text-[#4A4A4A] italic">
            Acesse seu dashboard personalizado
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Input */}
            <div>
              <label
                htmlFor="code"
                className="block font-crimson text-sm font-medium text-[#2C2C2C] mb-2"
              >
                Código do Convite
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: FAMILY001"
                className="w-full px-4 py-3 border-2 border-[#E8E6E3] rounded-lg font-mono text-lg uppercase tracking-wider
                         focus:border-pink-300 focus:ring-4 focus:ring-pink-100 outline-none transition-all
                         placeholder:normal-case placeholder:tracking-normal"
                disabled={isLoading}
                autoFocus
              />
              <p className="mt-2 text-xs text-[#4A4A4A] font-crimson">
                Digite o código que está em seu convite físico ou digital
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-crimson">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-crimson text-lg py-3 px-6 rounded-lg
                       hover:from-pink-600 hover:to-purple-600 transform hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Acessar Dashboard
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-[#E8E6E3]">
            <p className="text-sm text-[#4A4A4A] font-crimson text-center">
              Não tem um código?{' '}
              <a
                href="mailto:contato@thousanddaysof.love"
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Entre em contato
              </a>
            </p>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-[#4A4A4A] font-crimson">
            Seu código é único e permite acesso a:
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-[#4A4A4A]">
            <span className="bg-white px-3 py-1.5 rounded-full shadow-sm">
              ✓ RSVP
            </span>
            <span className="bg-white px-3 py-1.5 rounded-full shadow-sm">
              🎁 Presentes
            </span>
            <span className="bg-white px-3 py-1.5 rounded-full shadow-sm">
              📸 Fotos
            </span>
            <span className="bg-white px-3 py-1.5 rounded-full shadow-sm">
              💌 Mensagens
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
