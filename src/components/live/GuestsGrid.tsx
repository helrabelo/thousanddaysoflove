'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { getConfirmedGuests } from '@/lib/supabase/live'
import type { ConfirmedGuest } from '@/lib/supabase/live'
import { Card } from '@/components/ui/card'

const RELATIONSHIP_COLORS = {
  family: 'from-gray-400 to-gray-500',
  friend: 'from-blue-400 to-blue-500',
  colleague: 'from-green-400 to-green-500',
  other: 'from-gray-400 to-gray-500'
}

export function GuestsGrid() {
  const [guests, setGuests] = useState<ConfirmedGuest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'family' | 'friend' | 'colleague' | 'other'>('all')

  useEffect(() => {
    loadGuests()
  }, [])

  const loadGuests = async () => {
    const data = await getConfirmedGuests()
    setGuests(data)
    setIsLoading(false)
  }

  const filteredGuests = filter === 'all'
    ? guests
    : guests.filter(g => g.relationship_type === filter)

  // Count total attendees
  const totalAttendees = guests.length

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-6 gap-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-full" />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-[#2C2C2C]" />
            <h3 className="text-lg font-semibold text-[#2C2C2C]">Convidados Confirmados</h3>
          </div>
          <p className="text-sm text-[#4A4A4A]">
            {totalAttendees} {totalAttendees === 1 ? 'pessoa' : 'pessoas'} confirmadas
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-[#2C2C2C] text-white'
              : ' text-[#4A4A4A] hover:bg-[#E8E6E3]'
          }`}
        >
          Todos ({guests.length})
        </button>
        <button
          onClick={() => setFilter('family')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'family'
              ? 'bg-gray-500 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Família ({guests.filter(g => g.relationship_type === 'family').length})
        </button>
        <button
          onClick={() => setFilter('friend')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'friend'
              ? 'bg-blue-500 text-white'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          Amigos ({guests.filter(g => g.relationship_type === 'friend').length})
        </button>
        <button
          onClick={() => setFilter('colleague')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'colleague'
              ? 'bg-green-500 text-white'
              : 'bg-green-50 text-green-700 hover:bg-green-100'
          }`}
        >
          Colegas ({guests.filter(g => g.relationship_type === 'colleague').length})
        </button>
      </div>

      {/* Guests grid */}
      {filteredGuests.length === 0 ? (
        <p className="text-center text-[#4A4A4A] py-8">
          Nenhum convidado nesta categoria
        </p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {filteredGuests.map((guest, index) => (
            <div key={guest.id}>
              {/* Main guest */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className="group relative"
              >
                <div
                  className={`w-full aspect-square rounded-full bg-gradient-to-br ${
                    RELATIONSHIP_COLORS[guest.relationship_type as keyof typeof RELATIONSHIP_COLORS]
                  } flex items-center justify-center text-white font-bold text-lg shadow-md hover:scale-110 transition-transform cursor-pointer`}
                  title={guest.guest_name}
                >
                  {guest.guest_name.charAt(0).toUpperCase()}
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#2C2C2C] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <div className="font-semibold">{guest.guest_name}</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2C2C2C]" />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
