'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Check, X, Users, Heart, Gift, MapPin, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Navigation from '@/components/ui/Navigation'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import type { Database } from '@/types/supabase'
import ElegantInvitation from '@/components/sections/ElegantInvitation'
import HYBadge from '@/components/ui/HYBadge'

interface Guest {
  id: string
  name: string
  phone: string | null
  email: string | null
  attending: boolean | null
  confirmed_by: string | null
  dietary_restrictions: string | null
  song_requests: string | null
  special_message: string | null
}

type SimpleGuestRow = Database['public']['Tables']['simple_guests']['Row']

// Loading Spinner Component
const LoadingSpinner = () => (
  <motion.div
    className="inline-flex items-center gap-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
    <span>Confirmando...</span>
  </motion.div>
)

// Celebration Confetti Function
const celebrateRSVP = (attending: boolean) => {
  if (!attending) return // No confetti for "no" responses

  // Elegant sparkle burst - sophisticated aesthetic
  const duration = 2000
  const animationEnd = Date.now() + duration
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    colors: ['#ffffff', '#F8F6F3', '#E8E6E3', '#D4AF37'], // White + cream + gold
    disableForReducedMotion: true
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    confetti({
      ...defaults,
      particleCount,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
      scalar: 0.8
    })
  }, 250)
}

// Wedding Countdown Helper
const getWeddingCountdown = () => {
  const weddingDate = new Date('2025-11-20T10:30:00-03:00') // Fortaleza timezone
  const today = new Date()
  const daysUntil = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Handle day-of wedding
  if (daysUntil === 0) {
    return {
      days: 'HOJE',
      message: 'O grande dia chegou!',
      emoji: '💒'
    }
  }

  // Handle post-wedding
  if (daysUntil < 0) {
    return {
      days: '—',
      message: 'O casamento já aconteceu, mas você ainda está em nossos corações!',
      emoji: '💕'
    }
  }

  // Special messages for different timeframes
  if (daysUntil > 100) {
    return {
      days: daysUntil,
      message: 'Mal podemos esperar!',
      emoji: '✨'
    }
  } else if (daysUntil > 30) {
    return {
      days: daysUntil,
      message: 'A contagem regressiva começou!',
      emoji: '🎊'
    }
  } else if (daysUntil > 7) {
    return {
      days: daysUntil,
      message: 'Quase lá!',
      emoji: '🎉'
    }
  } else {
    return {
      days: daysUntil,
      message: 'Nos vemos em breve!',
      emoji: '💕'
    }
  }
}

export default function SimpleRSVP() {
  const [searchTerm, setSearchTerm] = useState('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [confirmedGuest, setConfirmedGuest] = useState<{ name: string; attending: boolean } | null>(null)

  // Enhanced RSVP fields
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null)
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [songRequests, setSongRequests] = useState('')
  const [specialMessage, setSpecialMessage] = useState('')
  const [showEnhancedForm, setShowEnhancedForm] = useState(false)

  const searchGuests = useCallback(async () => {
    if (!searchTerm.trim()) {
      setGuests([])
      return
    }

    setSearching(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('simple_guests')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name')

      if (error) throw error
      const sanitizedGuests: Guest[] = (data ?? []).map((guest: SimpleGuestRow) => ({
        id: guest.id,
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
        attending: guest.attending,
        confirmed_by: guest.confirmed_by,
        dietary_restrictions: guest.dietary_restrictions,
        song_requests: guest.song_requests,
        special_message: guest.special_message
      }))
      setGuests(sanitizedGuests)
    } catch (error) {
      console.error('Error searching:', error)
      alert('Erro ao buscar convidados')
    } finally {
      setSearching(false)
    }
  }, [searchTerm])

  // Real-time search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchGuests()
    }, 300) // Wait 300ms after user stops typing

    return () => clearTimeout(debounceTimer)
  }, [searchGuests])

  const openEnhancedForm = (guestId: string, guest: Guest) => {
    setSelectedGuestId(guestId)
    setDietaryRestrictions(guest.dietary_restrictions || '')
    setSongRequests(guest.song_requests || '')
    setSpecialMessage(guest.special_message || '')
    setShowEnhancedForm(true)
  }

  const confirmRSVP = async (guestId: string, guestName: string, attending: boolean) => {
    setSaving(guestId)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('simple_guests')
        .update({
          attending,
          dietary_restrictions: dietaryRestrictions || null,
          song_requests: songRequests || null,
          special_message: specialMessage || null,
          confirmed_at: new Date().toISOString(),
          confirmed_by: 'self'
        })
        .eq('id', guestId)

      if (error) throw error

      // Refresh the list
      await searchGuests()

      // Close enhanced form
      setShowEnhancedForm(false)

      // 🎉 Trigger celebration BEFORE modal
      celebrateRSVP(attending)

      // Small delay for confetti to start before modal appears
      setTimeout(() => {
        setConfirmedGuest({ name: guestName, attending })
        setShowSuccessModal(true)
      }, 300)
    } catch (error) {
      console.error('Error saving RSVP:', error)
      alert('Erro ao salvar RSVP')
    } finally {
      setSaving(null)
    }
  }

  const quickConfirm = async (guestId: string, guestName: string, attending: boolean) => {
    // For quick "No" responses, skip the enhanced form
    if (!attending) {
      await confirmRSVP(guestId, guestName, false)
      return
    }

    // For "Yes", find the guest and open enhanced form
    const guest = guests.find(g => g.id === guestId)
    if (guest) {
      openEnhancedForm(guestId, guest)
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />
      <div className="py-16 px-4 pt-12 md:pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header with HY Logo */}
          <HYBadge />



          {/* Story Moment Section - NEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >

            {/* Story text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h1
                className="text-5xl md:text-7xl font-bold mb-8"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                  letterSpacing: '0.15em',
                  lineHeight: '1.1'
                }}
              >
                Bem vindo ao nosso casamento! 🎉
              </h1>
              <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--decorative)' }} />

              <p
                className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-2"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic',
                }}
              >
                Preparamos uma experiência digital super especial para nosso casório! Nossos convidados poderão mandar mensagens, postar fotos, vídeos, <br />&gt;&gt;&gt;&gt; COMPRAR PRESENTES &lt;&lt;&lt;&lt; e claro, confirmar presença. Tudo isso para deixar nossa celebração ainda mais inesquecível.
              </p>

              <p
                className="text-sm mb-8"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--decorative)',
                  letterSpacing: '0.1em'
                }}
              >
                20 DE NOVEMBRO DE 2025 • CASA HY, FORTALEZA
              </p>

              <p className="text-lg mb-4" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                Comece digitando seu nome para encontrar o seu convite
              </p>
            </motion.div>
          </motion.div>

          {/* Search */}
          <Card className="glass p-6 mb-8" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Digite seu nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchGuests()}
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 min-h-[48px]"
                style={{
                  borderColor: 'var(--border-subtle)',
                  background: 'var(--background)',
                  color: 'var(--primary-text)',
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '16px'
                }}
              />
              <Button
                onClick={searchGuests}
                disabled={searching}
                className="px-6 min-h-[48px]"
                variant="wedding"
              >
                {searching ? 'Buscando...' : <><Search className="w-5 h-5 mr-2" /> Buscar</>}
              </Button>
            </div>
          </Card>

          {/* Results */}
          {guests.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
                Convidados Encontrados ({guests.length})
              </h2>
              {guests.map((guest) => (
                <Card key={guest.id} className="glass p-6" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-start justify-between flex-col md:flex-row gap-4">
                    <div className="flex-1 w-full">
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
                        {guest.name}
                      </h3>
                      {guest.attending === null ? (
                        <p className="mb-4" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)' }}>
                          Aguardando confirmação
                        </p>
                      ) : guest.attending ? (
                        <p className="mb-4 flex items-center gap-2" style={{ color: '#22c55e', fontFamily: 'var(--font-crimson)' }}>
                          <Check className="w-5 h-5" />
                          Confirmado!
                        </p>
                      ) : (
                        <p className="mb-4 flex items-center gap-2" style={{ color: '#ef4444', fontFamily: 'var(--font-crimson)' }}>
                          <X className="w-5 h-5" />
                          Não pode comparecer
                        </p>
                      )}

                      {/* RSVP Buttons */}
                      {(guest.attending === null || guest.confirmed_by === 'self') && (
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={() => quickConfirm(guest.id, guest.name, true)}
                              disabled={saving === guest.id}
                              variant="wedding"
                              className="flex items-center gap-2 min-h-[48px] flex-1 sm:flex-initial relative overflow-hidden group"
                            >
                              {/* Animated background on hover */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              />

                              {/* Button content */}
                              <span className="relative z-10 flex items-center gap-2">
                                <motion.div
                                  whileHover={{ scale: 1.2, rotate: 10 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Check className="w-4 h-4" />
                                </motion.div>
                                Sim, vou!
                              </span>
                            </Button>
                            <Button
                              onClick={() => quickConfirm(guest.id, guest.name, false)}
                              disabled={saving === guest.id}
                              variant="wedding-outline"
                              className="flex items-center gap-2 min-h-[48px] flex-1 sm:flex-initial relative overflow-hidden group"
                            >
                              {/* Subtle hover state */}
                              <motion.div
                                className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                              />

                              <span className="relative z-10 flex items-center gap-2">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X className="w-4 h-4" />
                                </motion.div>
                                Não posso
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}

                      {guest.confirmed_by === 'admin' && (
                        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                          Confirmado pela organização
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {guests.length === 0 && searchTerm && !searching && (
            <Card className="glass p-8 text-center" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)' }}>
              <p className="text-lg mb-2" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)' }}>
                Nenhum convidado encontrado com "{searchTerm}"
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                Tente buscar por outro nome ou entre em contato conosco
              </p>
            </Card>
          )}

          {/* Featured wedding invitation */}
            <ElegantInvitation variant='compact' />
        </div>
      </div>

      {/* Enhanced RSVP Form Modal */}
      <AnimatePresence>
        {showEnhancedForm && selectedGuestId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowEnhancedForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-8"
              style={{ background: 'var(--background)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className="text-3xl font-bold mb-2 text-center"
                style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}
              >
                Confirme sua Presença
              </h2>
              <p
                className="text-center mb-8"
                style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}
              >
                Queremos deixar tudo perfeito para você!
              </p>

              <div className="space-y-6">
                {/* Dietary Restrictions */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ fontFamily: 'var(--font-crimson)', color: 'var(--primary-text)' }}
                  >
                    🍽️ Restrições Alimentares
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border rounded-lg resize-none"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--background)',
                      color: 'var(--primary-text)',
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '16px',
                      minHeight: '80px'
                    }}
                    placeholder="Vegetariano, vegano, alergias, etc..."
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    maxLength={500}
                  />
                </div>

                {/* Song Requests */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ fontFamily: 'var(--font-crimson)', color: 'var(--primary-text)' }}
                  >
                    🎵 Sugestões de Músicas
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border rounded-lg resize-none"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--background)',
                      color: 'var(--primary-text)',
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '16px',
                      minHeight: '80px'
                    }}
                    placeholder="Músicas que você gostaria de ouvir na festa..."
                    value={songRequests}
                    onChange={(e) => setSongRequests(e.target.value)}
                    maxLength={500}
                  />
                </div>

                {/* Special Message */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ fontFamily: 'var(--font-crimson)', color: 'var(--primary-text)' }}
                  >
                    💌 Mensagem para os Noivos
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border rounded-lg resize-none"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--background)',
                      color: 'var(--primary-text)',
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '16px',
                      minHeight: '100px'
                    }}
                    placeholder="Deixe uma mensagem carinhosa para Hel & Ylana..."
                    value={specialMessage}
                    onChange={(e) => setSpecialMessage(e.target.value)}
                    maxLength={1000}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  onClick={() => setShowEnhancedForm(false)}
                  variant="wedding-outline"
                  className="flex-1 min-h-[48px]"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    const guest = guests.find(g => g.id === selectedGuestId)
                    if (guest) {
                      confirmRSVP(selectedGuestId, guest.name, true)
                    }
                  }}
                  variant="wedding"
                  className="flex-1 min-h-[48px]"
                  disabled={saving === selectedGuestId}
                >
                  {saving === selectedGuestId ? <LoadingSpinner /> : 'Confirmar Presença'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post-RSVP Success Modal with Guidance */}
      <AnimatePresence>
        {showSuccessModal && confirmedGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-8"
              style={{ background: 'var(--background)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {confirmedGuest.attending ? (
                // Success - Attending
                <>
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                      style={{ background: '#22c55e' }}
                    >
                      <Heart className="w-10 h-10 text-white" fill="white" />
                    </motion.div>

                    <h2
                      className="text-3xl md:text-4xl mb-4"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        color: 'var(--primary-text)',
                        fontWeight: '600'
                      }}
                    >
                      Confirmado! ✨
                    </h2>

                    <p
                      className="text-lg mb-2"
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        color: 'var(--secondary-text)',
                        fontStyle: 'italic'
                      }}
                    >
                      {confirmedGuest.name}, mal podemos esperar para celebrar com você!
                    </p>

                    <p
                      className="text-sm"
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      Seu RSVP foi confirmado com sucesso. Veja o que vem a seguir:
                    </p>
                  </div>

                  {/* Countdown Card - NEW */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
                    className="mb-8"
                  >
                    <Card
                      className="text-center p-8"
                      style={{
                        background: 'linear-gradient(135deg, #FFF5F7 0%, #F0F9FF 50%, #FFF9E6 100%)',
                        border: '2px solid var(--border-subtle)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                      }}
                    >
                      {(() => {
                        const countdown = getWeddingCountdown()
                        return (
                          <>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                              style={{
                                fontFamily: 'var(--font-playfair)',
                                fontSize: 'clamp(3rem, 8vw, 4.5rem)',
                                fontWeight: '600',
                                color: 'var(--primary-text)',
                                lineHeight: '1',
                                marginBottom: '0.5rem'
                              }}
                            >
                              {countdown.days}
                            </motion.div>

                            <p
                              style={{
                                fontFamily: 'var(--font-crimson)',
                                fontSize: '1.25rem',
                                color: 'var(--secondary-text)',
                                marginBottom: '0.75rem'
                              }}
                            >
                              dias até o grande dia
                            </p>

                            <p
                              style={{
                                fontFamily: 'var(--font-crimson)',
                                fontSize: '1rem',
                                color: 'var(--decorative)',
                                fontStyle: 'italic'
                              }}
                            >
                              {countdown.emoji} {countdown.message}
                            </p>

                            {/* Date reminder */}
                            <div
                              className="mt-4 pt-4"
                              style={{
                                borderTop: '1px solid var(--border-subtle)'
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: 'var(--font-playfair)',
                                  fontSize: '1.125rem',
                                  color: 'var(--primary-text)',
                                  letterSpacing: '0.05em'
                                }}
                              >
                                20 DE NOVEMBRO • 10:30
                              </p>
                              <p
                                className="text-sm mt-1"
                                style={{
                                  fontFamily: 'var(--font-crimson)',
                                  color: 'var(--secondary-text)',
                                  fontStyle: 'italic'
                                }}
                              >
                                Casa HY, Fortaleza
                              </p>
                            </div>
                          </>
                        )
                      })()}
                    </Card>
                  </motion.div>

                  {/* Next Steps Cards */}
                  <div className="space-y-4 mb-8">
                    <Card className="p-6" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)' }}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Calendar className="w-6 h-6" style={{ color: 'var(--decorative)' }} />
                        </div>
                        <div className="flex-1">
                          <h3
                            className="font-semibold mb-2"
                            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}
                          >
                            1. Marque seu calendário
                          </h3>
                          <p
                            className="text-sm mb-2"
                            style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)' }}
                          >
                            20 de Novembro de 2025, 11h15 • Casa HY, Fortaleza
                          </p>
                          <p
                            className="text-xs"
                            style={{ fontFamily: 'var(--font-crimson)', color: 'var(--text-muted)', fontStyle: 'italic' }}
                          >
                            Exatos 1000 dias após aquele primeiro "oi" no WhatsApp
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)' }}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <MapPin className="w-6 h-6" style={{ color: 'var(--decorative)' }} />
                        </div>
                        <div className="flex-1">
                          <h3
                            className="font-semibold mb-2"
                            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}
                          >
                            2. Veja os detalhes do evento
                          </h3>
                          <p
                            className="text-sm mb-3"
                            style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)' }}
                          >
                            Horários, traje, estacionamento, hotéis próximos e mais
                          </p>
                          <Link href="/detalhes">
                            <Button
                              variant="wedding-outline"
                              size="sm"
                              className="text-sm"
                            >
                              Ver Detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)' }}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Gift className="w-6 h-6" style={{ color: 'var(--decorative)' }} />
                        </div>
                        <div className="flex-1">
                          <h3
                            className="font-semibold mb-2"
                            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}
                          >
                            3. Ajude a construir nosso lar
                          </h3>
                          <p
                            className="text-sm mb-3"
                            style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)' }}
                          >
                            Nossa lista de presentes está pronta! Sua presença já é o maior presente, mas se quiser contribuir...
                          </p>
                          <Link href="/presentes">
                            <Button
                              variant="wedding-outline"
                              size="sm"
                              className="text-sm"
                            >
                              Ver Lista de Presentes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)' }}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Heart className="w-6 h-6" style={{ color: 'var(--decorative)' }} />
                        </div>
                        <div className="flex-1">
                          <h3
                            className="font-semibold mb-2"
                            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}
                          >
                            4. Conheça nossa história
                          </h3>
                          <p
                            className="text-sm mb-3"
                            style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)' }}
                          >
                            Do primeiro "oi" no WhatsApp até os 1000 dias que nos trouxeram até aqui
                          </p>
                          <Link href="/historia">
                            <Button
                              variant="wedding-outline"
                              size="sm"
                              className="text-sm"
                            >
                              Nossa História
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* WhatsApp Share */}
                  <Card className="p-6 text-center mb-8" style={{ background: 'linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)', border: '1px solid var(--border-subtle)' }}>
                    <h3
                      className="font-semibold mb-2"
                      style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}
                    >
                      📱 Compartilhe com seus amigos!
                    </h3>
                    <p
                      className="text-sm mb-4"
                      style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)' }}
                    >
                      Convide outras pessoas especiais para celebrar conosco
                    </p>
                    <Button
                      onClick={() => {
                        const message = encodeURIComponent(
                          `🎉 Confirme sua presença no casamento de Hel & Ylana!\n\n` +
                          `📅 20 de Novembro de 2025, às 11h15\n` +
                          `📍 Casa HY, Fortaleza\n\n` +
                          `Confirme pelo site: ${window.location.origin}/rsvp\n\n` +
                          `Mil dias de amor viram para sempre! 💕`
                        )
                        window.open(`https://wa.me/?text=${message}`, '_blank')
                      }}
                      variant="wedding-outline"
                      size="sm"
                      className="bg-green-50 hover:bg-green-100"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Compartilhar via WhatsApp
                    </Button>
                  </Card>

                  <div className="text-center">
                    <Button
                      onClick={() => setShowSuccessModal(false)}
                      variant="wedding"
                      size="lg"
                    >
                      Perfeito, entendi!
                    </Button>
                  </div>
                </>
              ) : (
                // Success - Not Attending
                <>
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                      style={{ background: 'var(--decorative)' }}
                    >
                      <Heart className="w-10 h-10 text-white" />
                    </motion.div>

                    <h2
                      className="text-3xl md:text-4xl mb-4"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        color: 'var(--primary-text)',
                        fontWeight: '600'
                      }}
                    >
                      Entendemos 💕
                    </h2>

                    <p
                      className="text-lg mb-2"
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        color: 'var(--secondary-text)',
                        fontStyle: 'italic'
                      }}
                    >
                      {confirmedGuest.name}, sentiremos muito sua falta!
                    </p>

                    <p
                      className="text-sm mb-8"
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      Mas nosso amor nos conecta mesmo à distância. Você ainda pode:
                    </p>

                    <div className="space-y-4 mb-8">
                      <Card className="p-6 text-left" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)' }}>
                        <h3
                          className="font-semibold mb-2"
                          style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}
                        >
                          Acompanhe nossa história
                        </h3>
                        <p
                          className="text-sm mb-3"
                          style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)' }}
                        >
                          Veja como chegamos até aqui - 1000 dias de amor
                        </p>
                        <Link href="/historia">
                          <Button variant="wedding-outline" size="sm">
                            Ver Nossa História
                          </Button>
                        </Link>
                      </Card>

                      <Card className="p-6 text-left" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)' }}>
                        <h3
                          className="font-semibold mb-2"
                          style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}
                        >
                          Envie um presente
                        </h3>
                        <p
                          className="text-sm mb-3"
                          style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)' }}
                        >
                          Mesmo de longe, você pode nos ajudar a construir nosso lar
                        </p>
                        <Link href="/presentes">
                          <Button variant="wedding-outline" size="sm">
                            Ver Lista de Presentes
                          </Button>
                        </Link>
                      </Card>
                    </div>

                    <Button
                      onClick={() => setShowSuccessModal(false)}
                      variant="wedding"
                      size="lg"
                    >
                      Fechar
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
