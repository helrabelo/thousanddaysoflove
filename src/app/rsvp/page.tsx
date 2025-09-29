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
    <div className="rsvp-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{
        background: 'rgba(254, 254, 254, 0.25)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8" style={{ color: 'var(--decorative)' }} fill="currentColor" />
              <span className="font-bold text-xl" style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
                letterSpacing: '0.1em'
              }}>
                H & Y
              </span>
            </Link>
            <Link href="/" className="font-medium transition-colors duration-300" style={{
              color: 'var(--secondary-text)',
              fontFamily: 'var(--font-crimson)',
              fontSize: '0.9rem'
            }} onMouseEnter={(e) => e.target.style.color = 'var(--decorative)'}
               onMouseLeave={(e) => e.target.style.color = 'var(--secondary-text)'}>
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
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{
                background: 'var(--decorative)',
                boxShadow: '0 4px 6px -1px var(--shadow-subtle)'
              }}
            >
              <Heart className="w-8 h-8" style={{ color: 'var(--white-soft)' }} fill="currentColor" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
                letterSpacing: '0.1em'
              }}
            >
              Confirme sua presença nos nossos 1000 dias
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8"
              style={{
                fontFamily: 'var(--font-crimson)',
                color: 'var(--secondary-text)',
                fontStyle: 'italic'
              }}
            >
              De mil dias de amor para toda a eternidade
            </motion.p>

            {/* Wedding Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-6 max-w-2xl mx-auto mb-12"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 6px -1px var(--shadow-subtle), 0 2px 4px -1px var(--shadow-medium)'
              }}
            >
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Calendar className="w-8 h-8 mb-2" style={{ color: 'var(--decorative)' }} />
                  <h3 className="font-semibold mb-2" style={{
                    fontFamily: 'var(--font-playfair)',
                    color: 'var(--primary-text)',
                    fontSize: '1.1rem',
                    letterSpacing: '0.05em'
                  }}>Data</h3>
                  <p style={{
                    fontFamily: 'var(--font-crimson)',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic'
                  }}>20 de Novembro de 2025</p>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="w-8 h-8 mb-2" style={{ color: 'var(--decorative)' }} />
                  <h3 className="font-semibold mb-2" style={{
                    fontFamily: 'var(--font-playfair)',
                    color: 'var(--primary-text)',
                    fontSize: '1.1rem',
                    letterSpacing: '0.05em'
                  }}>Horário</h3>
                  <p style={{
                    fontFamily: 'var(--font-crimson)',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic'
                  }}>10:30h</p>
                </div>
                <div className="flex flex-col items-center">
                  <MapPin className="w-8 h-8 mb-2" style={{ color: 'var(--decorative)' }} />
                  <h3 className="font-semibold mb-2" style={{
                    fontFamily: 'var(--font-playfair)',
                    color: 'var(--primary-text)',
                    fontSize: '1.1rem',
                    letterSpacing: '0.05em'
                  }}>Local</h3>
                  <p style={{
                    fontFamily: 'var(--font-crimson)',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic'
                  }}>Luciano Cavalcante</p>
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
                  className="rounded-2xl p-8"
                  style={{
                    background: 'var(--white-soft)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 4px 6px -1px var(--shadow-subtle), 0 2px 4px -1px var(--shadow-medium)'
                  }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-4" style={{
                      fontFamily: 'var(--font-playfair)',
                      color: 'var(--primary-text)',
                      letterSpacing: '0.05em'
                    }}>
                      Tem um código de convite? ✨
                    </h2>
                    <p style={{
                      fontFamily: 'var(--font-crimson)',
                      color: 'var(--secondary-text)',
                      fontStyle: 'italic',
                      fontSize: '1.1rem'
                    }}>
                      Digite seu código para uma experiência personalizada, ou prossiga sem código.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                      <label htmlFor="invitation-code" className="block text-sm font-medium mb-2" style={{
                        fontFamily: 'var(--font-playfair)',
                        color: 'var(--primary-text)',
                        letterSpacing: '0.05em'
                      }}>
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
                        className="w-full px-4 py-3 border rounded-xl transition-all duration-200 text-center font-mono uppercase"
                        style={{
                          background: 'rgba(254, 254, 254, 0.8)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--primary-text)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--decorative)'
                          e.target.style.boxShadow = '0 0 0 2px rgba(168, 168, 168, 0.2)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-subtle)'
                          e.target.style.boxShadow = 'none'
                        }}
                        maxLength={8}
                      />
                      {lookupError && (
                        <p className="mt-2 text-sm flex items-center justify-center" style={{
                          color: 'var(--secondary-text)',
                          fontFamily: 'var(--font-crimson)',
                          fontStyle: 'italic'
                        }}>
                          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{
                            color: 'var(--decorative)'
                          }}>
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

                    <p className="text-sm text-center" style={{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-crimson)',
                      fontStyle: 'italic'
                    }}>
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
                  className="rounded-2xl p-8"
                  style={{
                    background: 'var(--white-soft)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 4px 6px -1px var(--shadow-subtle), 0 2px 4px -1px var(--shadow-medium)'
                  }}
                >
                  {foundGuest && (
                    <div className="mb-8 p-4 rounded-xl" style={{
                      background: 'var(--accent)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div className="flex items-center" style={{ color: 'var(--primary-text)' }}>
                        <CheckCircle className="w-5 h-5 mr-2" style={{ color: 'var(--decorative)' }} />
                        <span className="font-medium" style={{
                          fontFamily: 'var(--font-playfair)',
                          letterSpacing: '0.05em'
                        }}>Convite encontrado para {foundGuest.name}!</span>
                      </div>
                    </div>
                  )}

                  <RsvpForm
                    initialGuest={foundGuest || undefined}
                    onSuccess={handleRsvpSuccess}
                    onError={handleRsvpError}
                  />

                  <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
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
                  <div className="rounded-2xl p-8 max-w-2xl mx-auto" style={{
                    background: 'var(--white-soft)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 4px 6px -1px var(--shadow-subtle), 0 2px 4px -1px var(--shadow-medium)'
                  }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                      style={{
                        background: 'var(--decorative)',
                        boxShadow: '0 4px 6px -1px var(--shadow-subtle)'
                      }}
                    >
                      <CheckCircle className="w-10 h-10" style={{ color: 'var(--white-soft)' }} />
                    </motion.div>

                    <h2 className="text-3xl font-bold mb-4" style={{
                      fontFamily: 'var(--font-playfair)',
                      color: 'var(--primary-text)',
                      letterSpacing: '0.05em'
                    }}>
                      {submittedGuest.attending ? '🎉 RSVP Confirmado!' : '💙 Obrigado pela resposta'}
                    </h2>

                    {submittedGuest.attending ? (
                      <div className="space-y-4" style={{
                        color: 'var(--secondary-text)',
                        fontFamily: 'var(--font-crimson)',
                        fontStyle: 'italic'
                      }}>
                        <p className="text-lg">
                          <strong>{submittedGuest.name}</strong>, mal podemos esperar para celebrar com você no Constable Galerie!
                        </p>
                        {submittedGuest.plus_one && (
                          <p>
                            E também estamos ansiosos para conhecer <strong>{submittedGuest.plus_one_name}</strong>!
                          </p>
                        )}
                        <div className="rounded-xl p-6 my-6" style={{
                          background: 'var(--accent)',
                          border: '1px solid var(--border-subtle)'
                        }}>
                          <h3 className="font-semibold mb-3" style={{
                            fontFamily: 'var(--font-playfair)',
                            color: 'var(--primary-text)',
                            letterSpacing: '0.05em'
                          }}>Próximos passos:</h3>
                          <ul className="text-left space-y-2 text-sm">
                            <li>• Você receberá um e-mail de confirmação em breve</li>
                            <li>• Constable Galerie te espera com toda arte e amor</li>
                            <li>• Ajude a construir nosso lar visitando nossa lista de presentes</li>
                            <li>• Linda, Cacao, Olivia e Oliver também agradecem sua presença! 🐾</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4" style={{
                        color: 'var(--secondary-text)',
                        fontFamily: 'var(--font-crimson)',
                        fontStyle: 'italic'
                      }}>
                        <p className="text-lg">
                          Entendemos, <strong>{submittedGuest.name}</strong>. Obrigado por nos informar com carinho.
                        </p>
                        <p>
                          Mesmo não podendo estar presente, você fará parte dos nossos mil dias para sempre! ❤️
                        </p>
                        {submittedGuest.special_requests && (
                          <div className="rounded-xl p-4 my-6" style={{
                            background: 'var(--accent)',
                            border: '1px solid var(--border-subtle)'
                          }}>
                            <p className="text-sm italic" style={{
                              fontFamily: 'var(--font-crimson)',
                              color: 'var(--secondary-text)'
                            }}>&ldquo;{submittedGuest.special_requests}&rdquo;</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <Button
                        onClick={() => window.location.href = '/'}
                        variant="wedding"
                        size="lg"
                        className="flex-1"
                      >
                        Voltar ao início
                      </Button>
                      {submittedGuest.attending && (
                        <Button
                          onClick={() => window.location.href = '/presentes'}
                          variant="wedding-outline"
                          size="lg"
                          className="flex-1"
                        >
                          Ver lista de presentes
                        </Button>
                      )}
                    </div>

                    {/* Change RSVP Option */}
                    <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
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
            className="text-center mt-16"
            style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}
          >
            <p className="text-sm">
              Feito com ❤️ por Hel & Ylana - De um simples "oi" no WhatsApp até o altar do Constable Galerie
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
