'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Check, X, Users, Heart, Gift, MapPin, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Navigation from '@/components/ui/Navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface Guest {
  id: string
  name: string
  phone: string | null
  email: string | null
  attending: boolean | null
  plus_ones: number
  confirmed_by: string | null
}

export default function SimpleRSVP() {
  const [searchTerm, setSearchTerm] = useState('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [confirmedGuest, setConfirmedGuest] = useState<{ name: string; attending: boolean } | null>(null)

  const searchGuests = async () => {
    if (!searchTerm.trim()) return

    setSearching(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('simple_guests')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name')

      if (error) throw error
      setGuests(data || [])
    } catch (error) {
      console.error('Error searching:', error)
      alert('Erro ao buscar convidados')
    } finally {
      setSearching(false)
    }
  }

  const confirmRSVP = async (guestId: string, guestName: string, attending: boolean, plusOnes: number) => {
    // Confirmation dialog
    const message = attending
      ? `Confirmar presença de ${guestName}?`
      : `Confirmar que ${guestName} não poderá comparecer?`

    if (!window.confirm(message)) return

    setSaving(guestId)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('simple_guests')
        .update({
          attending,
          plus_ones: plusOnes,
          confirmed_at: new Date().toISOString(),
          confirmed_by: 'self' // or pass the name of who's confirming
        })
        .eq('id', guestId)

      if (error) throw error

      // Refresh the list
      await searchGuests()

      // Show success modal with guidance
      setConfirmedGuest({ name: guestName, attending })
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error saving RSVP:', error)
      alert('Erro ao salvar RSVP')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />
      <div className="py-16 px-4 pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-4" style={{ color: 'var(--decorative)' }}>
              <span className="flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-crimson)', fontSize: '1rem' }}>
                ← Voltar
              </span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', letterSpacing: '0.1em' }}>
              Confirme sua Presença
            </h1>
            <p className="text-lg" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
              Digite seu nome para encontrar seu convite
            </p>
          </div>

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
                          Confirmado! {guest.plus_ones > 0 && `+ ${guest.plus_ones} acompanhante(s)`}
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
                              onClick={() => confirmRSVP(guest.id, guest.name, true, 0)}
                              disabled={saving === guest.id}
                              variant="wedding"
                              className="flex items-center gap-2 min-h-[48px] flex-1 sm:flex-initial"
                            >
                              <Check className="w-4 h-4" />
                              Sim, vou!
                            </Button>
                            <Button
                              onClick={() => confirmRSVP(guest.id, guest.name, false, 0)}
                              disabled={saving === guest.id}
                              variant="wedding-outline"
                              className="flex items-center gap-2 min-h-[48px] flex-1 sm:flex-initial"
                            >
                              <X className="w-4 h-4" />
                              Não posso
                            </Button>
                          </div>

                          {/* Plus ones */}
                          <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <label className="text-sm" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)' }}>
                                <Users className="w-4 h-4 inline mr-1" />
                                Quantos acompanhantes?
                              </label>
                              <select
                                className="px-3 py-2 border rounded-lg text-sm min-h-[48px] w-full sm:w-auto"
                                style={{
                                  borderColor: 'var(--border-subtle)',
                                  background: 'var(--background)',
                                  color: 'var(--primary-text)',
                                  fontFamily: 'var(--font-crimson)',
                                  fontSize: '16px'
                                }}
                                onChange={(e) => {
                                  const plusOnes = parseInt(e.target.value)
                                  confirmRSVP(guest.id, guest.name, true, plusOnes)
                                }}
                                defaultValue={guest.plus_ones || 0}
                                disabled={saving === guest.id}
                              >
                                {[0, 1, 2, 3, 4].map((n) => (
                                  <option key={n} value={n}>{n}</option>
                                ))}
                              </select>
                            </div>
                            <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                              * Só adicione acompanhantes que NÃO estão na nossa lista
                            </p>
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
        </div>
      </div>

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
                            20 de Novembro de 2025, 10h30 • Casa HY, Fortaleza
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
