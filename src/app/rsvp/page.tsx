'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, CheckCircle, Calendar, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { RsvpForm } from '@/components/forms/RsvpForm'
import { Button } from '@/components/ui/button'
import { Guest } from '@/types/wedding'

export default function RsvpPage() {
  const [currentView, setCurrentView] = useState<'lookup' | 'form' | 'success'>('lookup')
  const [lookupCode, setLookupCode] = useState('')
  const [lookupError, setLookupError] = useState('')
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [foundGuest, setFoundGuest] = useState<Guest | null>(null)
  const [submittedGuest, setSubmittedGuest] = useState<Guest | null>(null)

  const handleLookup = async () => {
    if (!lookupCode.trim()) {
      setLookupError('Por favor, digite seu código de convite')
      return
    }

    setIsLookingUp(true)
    setLookupError('')

    try {
      // Import GuestService dynamically to avoid SSR issues
      const { GuestService } = await import('@/lib/services/guests')
      const guest = await GuestService.findByInvitationCode(lookupCode)

      if (guest) {
        setFoundGuest(guest)
        setCurrentView('form')
      } else {
        setLookupError('Código de convite não encontrado. Você pode prosseguir sem código.')
      }
    } catch (error) {
      console.error('Error looking up guest:', error)
      setLookupError('Erro ao buscar convite. Tente novamente.')
    } finally {
      setIsLookingUp(false)
    }
  }

  const handleProceedWithoutCode = () => {
    setFoundGuest(null)
    setCurrentView('form')
  }

  const handleRsvpSuccess = (guest: Guest) => {
    setSubmittedGuest(guest)
    setCurrentView('success')
  }

  const handleRsvpError = (error: string) => {
    console.error('RSVP Error:', error)
    // Error handling is done within the form
  }

  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blush-500" fill="currentColor" />
              <span className="font-bold text-xl bg-gradient-to-r from-blush-600 to-burgundy-600 bg-clip-text text-transparent">
                H & Y
              </span>
            </Link>
            <Link href="/" className="text-burgundy-700 hover:text-blush-600 transition-colors duration-300 font-medium">
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blush-400 to-blush-600 rounded-full mb-6"
            >
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-playfair font-bold text-burgundy-800 mb-4"
            >
              RSVP
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-burgundy-600 mb-8"
            >
              Confirme sua presença em nosso dia especial
            </motion.p>

            {/* Wedding Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 max-w-2xl mx-auto mb-12"
            >
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Calendar className="w-8 h-8 text-blush-500 mb-2" />
                  <h3 className="font-semibold text-burgundy-800">Data</h3>
                  <p className="text-burgundy-600">20 de Novembro de 2025</p>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="w-8 h-8 text-blush-500 mb-2" />
                  <h3 className="font-semibold text-burgundy-800">Horário</h3>
                  <p className="text-burgundy-600">16:00h</p>
                </div>
                <div className="flex flex-col items-center">
                  <MapPin className="w-8 h-8 text-blush-500 mb-2" />
                  <h3 className="font-semibold text-burgundy-800">Local</h3>
                  <p className="text-burgundy-600">Em breve</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Invitation Code Lookup */}
              {currentView === 'lookup' && (
                <motion.div
                  key="lookup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass rounded-2xl p-8"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-playfair font-bold text-burgundy-800 mb-4">
                      Tem um código de convite? ✨
                    </h2>
                    <p className="text-burgundy-600">
                      Digite seu código para uma experiência personalizada, ou prossiga sem código.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                      <label htmlFor="invitation-code" className="block text-sm font-medium text-burgundy-700 mb-2">
                        Código do convite
                      </label>
                      <input
                        id="invitation-code"
                        type="text"
                        value={lookupCode}
                        onChange={(e) => {
                          setLookupCode(e.target.value.toUpperCase())
                          setLookupError('')
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                        placeholder="Ex: ABC12345"
                        className="w-full px-4 py-3 border rounded-xl transition-all duration-200 bg-white/50 backdrop-blur-sm border-blush-200 focus:border-blush-400 focus:ring-2 focus:ring-blush-400/20 placeholder:text-gray-400 text-center font-mono uppercase"
                        maxLength={8}
                      />
                      {lookupError && (
                        <p className="mt-2 text-sm text-red-600 flex items-center justify-center">
                          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {lookupError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleLookup}
                        variant="romantic"
                        size="lg"
                        className="w-full"
                        isLoading={isLookingUp}
                        disabled={isLookingUp}
                      >
                        {isLookingUp ? 'Verificando...' : 'Buscar convite'}
                      </Button>

                      <Button
                        onClick={handleProceedWithoutCode}
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        Prosseguir sem código
                      </Button>
                    </div>

                    <p className="text-sm text-center text-gray-500">
                      O código está no seu convite físico ou digital
                    </p>
                  </div>
                </motion.div>
              )}

              {/* RSVP Form */}
              {currentView === 'form' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass rounded-2xl p-8"
                >
                  {foundGuest && (
                    <div className="mb-8 p-4 bg-sage-50 border border-sage-200 rounded-xl">
                      <div className="flex items-center text-sage-700">
                        <CheckCircle className="w-5 h-5 mr-2 text-sage-600" />
                        <span className="font-medium">Convite encontrado para {foundGuest.name}!</span>
                      </div>
                    </div>
                  )}

                  <RsvpForm
                    initialGuest={foundGuest || undefined}
                    onSuccess={handleRsvpSuccess}
                    onError={handleRsvpError}
                  />

                  <div className="mt-8 pt-6 border-t border-blush-200">
                    <Button
                      onClick={() => setCurrentView('lookup')}
                      variant="ghost"
                      className="mx-auto"
                    >
                      ← Voltar para busca de convite
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Success State */}
              {currentView === 'success' && submittedGuest && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-sage-400 to-sage-600 rounded-full mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>

                    <h2 className="text-3xl font-playfair font-bold text-burgundy-800 mb-4">
                      {submittedGuest.attending ? '🎉 RSVP Confirmado!' : '💙 Obrigado pela resposta'}
                    </h2>

                    {submittedGuest.attending ? (
                      <div className="space-y-4 text-burgundy-600">
                        <p className="text-lg">
                          <strong>{submittedGuest.name}</strong>, não vemos a hora de celebrar com você!
                        </p>
                        {submittedGuest.plus_one && (
                          <p>
                            E também estamos ansiosos para conhecer <strong>{submittedGuest.plus_one_name}</strong>!
                          </p>
                        )}
                        <div className="bg-blush-50 border border-blush-200 rounded-xl p-6 my-6">
                          <h3 className="font-semibold text-burgundy-800 mb-3">Próximos passos:</h3>
                          <ul className="text-left space-y-2 text-sm">
                            <li>• Você receberá um e-mail de confirmação em breve</li>
                            <li>• Fique atento para mais detalhes sobre o local</li>
                            <li>• Explore nossa lista de presentes se desejar</li>
                            <li>• Qualquer dúvida, entre em contato conosco</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-burgundy-600">
                        <p className="text-lg">
                          Entendemos, <strong>{submittedGuest.name}</strong>. Obrigado por nos informar.
                        </p>
                        <p>
                          Mesmo não podendo estar presente, você estará em nossos corações! ❤️
                        </p>
                        {submittedGuest.special_requests && (
                          <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 my-6">
                            <p className="text-sm italic">&ldquo;{submittedGuest.special_requests}&rdquo;</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <Button
                        onClick={() => window.location.href = '/'}
                        variant="romantic"
                        size="lg"
                        className="flex-1"
                      >
                        Voltar ao início
                      </Button>
                      {submittedGuest.attending && (
                        <Button
                          onClick={() => window.location.href = '/registry'}
                          variant="outline"
                          size="lg"
                          className="flex-1"
                        >
                          Ver lista de presentes
                        </Button>
                      )}
                    </div>

                    {/* Change RSVP Option */}
                    <div className="mt-8 pt-6 border-t border-blush-200">
                      <Button
                        onClick={() => {
                          setCurrentView('form')
                          setFoundGuest(submittedGuest)
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        Precisa alterar sua resposta?
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16 text-burgundy-600"
          >
            <p className="text-sm">
              Feito com ❤️ para celebrar nossos mil dias de amor
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
