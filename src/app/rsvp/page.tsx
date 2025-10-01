'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Check, X, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Navigation from '@/components/ui/Navigation'

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
      alert('RSVP confirmado!')
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
    </div>
  )
}
