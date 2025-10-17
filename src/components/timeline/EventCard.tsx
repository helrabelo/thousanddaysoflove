'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { clsx } from 'clsx'
import { LucideIcon, Users, Heart, Camera, Utensils, Music, Cake, Flower, PartyPopper, Clock, Sparkles } from 'lucide-react'
import type { TimelineEventState } from '@/types/wedding'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Heart,
  Camera,
  Utensils,
  Music,
  Cake,
  Flower,
  PartyPopper,
  Clock,
  Sparkles,
}

interface EventCardProps {
  state: TimelineEventState
  variant?: 'tv-primary' | 'tv-secondary' | 'mobile'
  onClick?: () => void
  onUploadClick?: () => void
}

export function EventCard({ state, variant = 'mobile', onClick, onUploadClick }: EventCardProps) {
  const { event, status, timeRemaining, timeUntilStart, progressPercentage } = state
  const Icon = ICON_MAP[event.icon] || Clock
  const gradient = event.colorGradient
  const gradientStyle = useMemo(() => {
    const fromMatch = gradient.match(/from-\[#([^\]]+)\]/)
    const toMatch = gradient.match(/to-\[#([^\]]+)\]/)
    const fromColor = fromMatch ? `#${fromMatch[1]}` : '#4A7C59'
    const toColor = toMatch ? `#${toMatch[1]}` : '#5A8C69'
    return { background: `linear-gradient(135deg, ${fromColor}, ${toColor})` }
  }, [gradient])

  const formattedTimeRange = [event.startTime, event.endTime]
    .filter(Boolean)
    .map((value) => format(new Date(value ?? event.startTime), 'HH:mm', { locale: ptBR }))
    .join(' - ')

  return (
    <motion.article
      layout
      onClick={onClick}
      className={clsx(
        'rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform',
        {
          'p-8': variant === 'tv-primary',
          'p-6': variant === 'tv-secondary',
          'p-4 md:p-5': variant === 'mobile',
          'ring-2 ring-[#D4A574] ring-offset-2 ring-offset-[#101010]': status === 'happening_now',
        }
      )}
      whileHover={{ translateY: variant === 'mobile' ? -4 : -8 }}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/60">
            <StatusBadge state={state} />
            <span>{formattedTimeRange}</span>
          </span>
          <h3 className={clsx('font-playfair font-semibold mt-2', {
            'text-4xl md:text-5xl leading-tight': variant === 'tv-primary',
            'text-3xl': variant === 'tv-secondary',
            'text-2xl md:text-3xl': variant === 'mobile',
          })}>
            {event.title}
          </h3>
        </div>
        <div
          className="relative rounded-2xl p-4 text-white drop-shadow-lg"
          style={gradientStyle}
        >
          <Icon className={clsx({
            'w-16 h-16': variant === 'tv-primary',
            'w-12 h-12': variant !== 'tv-primary',
          })} />
        </div>
      </header>

      <p className={clsx('font-crimson text-base md:text-lg mt-6 text-white/80', {
        'text-lg md:text-xl leading-relaxed': variant === 'tv-primary',
      })}>
        {event.description}
      </p>

      <footer className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
        <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
          <Clock className="w-4 h-4" />
          {timeRemaining != null && status === 'happening_now'
            ? `${timeRemaining} min restantes`
            : timeUntilStart != null
            ? `em ${timeUntilStart} min`
            : event.estimatedDuration
            ? `${event.estimatedDuration} min`
            : 'tempo livre'}
        </span>
        {event.location && (
          <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4" />
            {event.location}
          </span>
        )}
        {event.guestPhotosCount != null && event.guestPhotosCount > 0 && (
          <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <Camera className="w-4 h-4" />
            {event.guestPhotosCount} fotos
          </span>
        )}
        {event.allowPhotoUploads && onUploadClick && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUploadClick()
            }}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-white text-[#1A1A1A] font-semibold px-4 py-2 hover:bg-[#F8F6F3] transition-colors"
          >
            <Camera className="w-4 h-4" />
            Enviar foto
          </button>
        )}
      </footer>

      {progressPercentage != null && (
        <div className="mt-6">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
            {Math.round(progressPercentage)}% concluido
          </p>
        </div>
      )}
    </motion.article>
  )
}

interface StatusBadgeProps {
  state: TimelineEventState
}

function StatusBadge({ state }: StatusBadgeProps) {
  const { status, isNext } = state

  if (status === 'happening_now') {
    return (
      <motion.span
        className="inline-flex items-center gap-2 text-[#F6D28B]"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="inline-flex h-2 w-2 rounded-full bg-[#F6D28B] shadow-[0_0_15px_rgba(246,210,139,0.8)]" />
        agora
      </motion.span>
    )
  }

  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-2 text-white/50">
        <span className="inline-flex h-2 w-2 rounded-full bg-white/40" />
        celebrado
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 text-white/60">
      <span className="inline-flex h-2 w-2 rounded-full bg-white/40" />
      {isNext ? 'a seguir' : 'em breve'}
    </span>
  )
}

export default EventCard
