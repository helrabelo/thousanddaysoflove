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
  dietary_restrictions: string | null
  song_requests: string | null
  special_message: string | null
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

  const openEnhancedForm = (guestId: string, guest: Guest) => {
    setSelectedGuestId(guestId)
    setDietaryRestrictions(guest.dietary_restrictions || '')
    setSongRequests(guest.song_requests || '')
    setSpecialMessage(guest.special_message || '')
    setShowEnhancedForm(true)
  }

  const confirmRSVP = async (guestId: string, guestName: string, attending: boolean, plusOnes: number) => {
    setSaving(guestId)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('simple_guests')
        .update({
          attending,
          plus_ones: plusOnes,
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

  const quickConfirm = async (guestId: string, guestName: string, attending: boolean) => {
    // For quick "No" responses, skip the enhanced form
    if (!attending) {
      await confirmRSVP(guestId, guestName, false, 0)
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
                              onClick={() => quickConfirm(guest.id, guest.name, true)}
                              disabled={saving === guest.id}
                              variant="wedding"
                              className="flex items-center gap-2 min-h-[48px] flex-1 sm:flex-initial"
                            >
                              <Check className="w-4 h-4" />
                              Sim, vou!
                            </Button>
                            <Button
                              onClick={() => quickConfirm(guest.id, guest.name, false)}
                              disabled={saving === guest.id}
                              variant="wedding-outline"
                              className="flex items-center gap-2 min-h-[48px] flex-1 sm:flex-initial"
                            >
                              <X className="w-4 h-4" />
                              Não posso
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
                {/* Plus Ones */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ fontFamily: 'var(--font-crimson)', color: 'var(--primary-text)' }}
                  >
                    <Users className="w-4 h-4 inline mr-2" />
                    Quantos acompanhantes?
                  </label>
                  <select
                    className="w-full px-4 py-3 border rounded-lg min-h-[48px]"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--background)',
                      color: 'var(--primary-text)',
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '16px'
                    }}
                    value={guests.find(g => g.id === selectedGuestId)?.plus_ones || 0}
                    onChange={(e) => {
                      const updatedGuests = guests.map(g =>
                        g.id === selectedGuestId ? { ...g, plus_ones: parseInt(e.target.value) } : g
                      )
                      setGuests(updatedGuests)
                    }}
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                    * Só adicione acompanhantes que NÃO estão na nossa lista
                  </p>
                </div>

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
                      confirmRSVP(selectedGuestId, guest.name, true, guest.plus_ones || 0)
                    }
                  }}
                  variant="wedding"
                  className="flex-1 min-h-[48px]"
                  disabled={saving === selectedGuestId}
                >
                  {saving === selectedGuestId ? 'Confirmando...' : 'Confirmar Presença'}
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
                          `📅 20 de Novembro de 2025, às 10h30\n` +
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
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
