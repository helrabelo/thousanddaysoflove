'use client'

import { motion } from 'framer-motion'
import CountdownTimer from '@/components/ui/CountdownTimer'
import { Heart, Calendar, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { CONSTABLE_GALERIE } from '@/lib/utils/maps'

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-rose-300/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={
{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="block bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mil
            </span>
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Dias de Amor
            </span>
          </h1>
        </motion.div>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center gap-4 text-3xl md:text-5xl font-light text-gray-700">
            <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent font-medium">
              Hel
            </span>
            <Heart className="h-8 w-8 md:h-12 md:w-12 text-rose-500" fill="currentColor" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
              Ylana
            </span>
          </div>
        </motion.div>

        {/* Wedding Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-gray-600">
            <Calendar className="h-6 w-6" />
            <span>20 de Novembro de 2025</span>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Após 1.000 dias lindos juntos, estamos prontos para começar o para sempre.
            <br className="hidden md:block" />
            Junte-se a nós para celebrar nossa história de amor e o início do nosso novo capítulo.
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mb-12"
        >
          <CountdownTimer />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/rsvp"
            className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Confirmar Presença
          </Link>
          <Link
            href="/presentes"
            className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-gray-700 font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Ver Lista de Presentes
          </Link>
        </motion.div>

        {/* Wedding Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-12"
        >
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 text-sm">Horário</p>
                    <p className="text-gray-600 text-sm">10:30h</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 text-sm">Local</p>
                    <p className="text-gray-600 text-sm">{CONSTABLE_GALERIE.name}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-center text-xs text-gray-500">
                  Eng. Luciano Cavalcante, Fortaleza - CE
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
