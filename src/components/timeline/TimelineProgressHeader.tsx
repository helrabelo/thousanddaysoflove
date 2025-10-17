'use client'

import { motion } from 'framer-motion'
import type { LiveTimelineData } from '@/types/wedding'

interface TimelineProgressHeaderProps {
  data: LiveTimelineData | null
}

export function TimelineProgressHeader({ data }: TimelineProgressHeaderProps) {
  const progress = data?.overallProgress ?? 0

  return (
    <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm uppercase tracking-[0.25em] text-white/60">Voce esta aqui</h2>
          <p className="mt-2 text-2xl font-playfair font-semibold">
            {data?.currentEvent?.event.title ?? 'Aquecendo os motores'}
          </p>
          <p className="text-sm text-white/60 mt-1">
            {data?.currentEvent
              ? 'Acompanhe em tempo real o que ta rolando agora'
              : 'Timeline entra em cena assim que o primeiro evento comecar'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm uppercase tracking-[0.25em] text-white/60">Progresso</span>
          <p className="mt-1 text-4xl font-playfair font-semibold">{Math.round(progress)}%</p>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default TimelineProgressHeader
