'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Radio } from 'lucide-react'
import { LiveStats } from '@/components/live/LiveStats'
import { PinnedMomentsSection } from '@/components/live/PinnedMomentsSection'
import { LivePostStream } from '@/components/live/LivePostStream'
import { GuestsGrid } from '@/components/live/GuestsGrid'
import { LivePhotoGallery } from '@/components/live/LivePhotoGallery'

export function LiveFeedPage() {
  const [connectionStatus, setConnectionStatus] = useState<'live' | 'polling'>('live')

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-playfair font-bold">
                Celebração Ao Vivo
              </h1>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5
                }}
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
            </div>

            <p className="text-xl md:text-2xl font-crimson mb-6">
              Hel & Ylana - 1000 Dias de Amor
            </p>

            {/* Connection status indicator */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'live' ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
              </motion.div>
              <span className="text-sm font-medium">
                {connectionStatus === 'live' ? 'Ao Vivo' : 'Atualizando...'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Live statistics */}
        <LiveStats />

        {/* Pinned special moments */}
        <PinnedMomentsSection />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Live posts (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E6E3]">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <Radio className="w-6 h-6 text-red-500" />
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="absolute inset-0 bg-red-500 rounded-full blur-md"
                  />
                </div>
                <h2 className="text-2xl font-playfair font-bold text-[#2C2C2C]">
                  Feed de Mensagens
                </h2>
              </div>

              <LivePostStream />
            </div>
          </div>

          {/* Right column - Guests & Gallery (1/3 width on desktop) */}
          <div className="space-y-6">
            {/* Photo gallery */}
            <LivePhotoGallery />

            {/* Confirmed guests */}
            <GuestsGrid />
          </div>
        </div>

        {/* Bottom section - Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 text-center border-2 border-purple-200"
        >
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-playfair font-bold text-[#2C2C2C] mb-3">
            Compartilhe este Momento Conosco!
          </h3>
          <p className="text-[#4A4A4A] mb-6 max-w-2xl mx-auto">
            Envie suas mensagens, fotos e vídeos para celebrar este dia especial.
            Todas as contribuições aparecem aqui em tempo real!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/mensagens"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              Enviar Mensagem
            </a>
            <a
              href="/dia-1000/upload"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#2C2C2C] font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg border-2 border-purple-200"
            >
              Enviar Fotos
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
