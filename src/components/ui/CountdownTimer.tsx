'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCountdown } from '@/lib/utils/wedding'

interface CountdownTimerProps {
  className?: string
}

export default function CountdownTimer({ className = '' }: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(getCountdown())

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (countdown.hasWeddingPassed) {
    return (
      <motion.div 
        className={`text-center ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Recém Casados! 💕
        </div>
        <p className="text-xl md:text-2xl text-gray-600 mt-4">Nossos mil dias de amor levaram a este momento</p>
      </motion.div>
    )
  }

  if (countdown.isWeddingDay) {
    return (
      <motion.div 
        className={`text-center ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Hoje é o Dia! 🎉
        </div>
        <p className="text-xl md:text-2xl text-gray-600 mt-4">Nossos mil dias de amor culminam hoje</p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={`text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
        {/* Days */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl">
            <div className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-rose-400 to-pink-600 bg-clip-text text-transparent">
              {countdown.days}
            </div>
            <div className="text-sm md:text-lg font-medium text-gray-700 mt-2">
              {countdown.days === 1 ? 'Dia' : 'Dias'}
            </div>
          </div>
        </motion.div>

        {/* Hours */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl">
            <div className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-purple-400 to-indigo-600 bg-clip-text text-transparent">
              {countdown.hours}
            </div>
            <div className="text-sm md:text-lg font-medium text-gray-700 mt-2">
              {countdown.hours === 1 ? 'Hora' : 'Horas'}
            </div>
          </div>
        </motion.div>

        {/* Minutes */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl">
            <div className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-emerald-400 to-teal-600 bg-clip-text text-transparent">
              {countdown.minutes}
            </div>
            <div className="text-sm md:text-lg font-medium text-gray-700 mt-2">
              {countdown.minutes === 1 ? 'Minuto' : 'Minutos'}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.p 
        className="text-lg md:text-xl text-gray-600 mt-8 font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Até que nossos mil dias de amor se tornem para sempre
      </motion.p>
    </motion.div>
  )
}