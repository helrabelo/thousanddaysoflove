'use client'

import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { RefreshCw, Clock, Camera } from 'lucide-react'
import TimelineBadge from '@/components/timeline/TimelineBadge'
import type { LiveTimelineData, TimelineEventState } from '@/types/wedding'

interface LiveTimelineSidebarProps {
  data: LiveTimelineData | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  lastUpdatedAt: Date | null
  variant?: 'default' | 'tv'
}

export function LiveTimelineSidebar({
  data,
  isLoading,
  error,
  refresh,
  lastUpdatedAt,
  variant = 'default',
}: LiveTimelineSidebarProps) {
  const current = data?.currentEvent ?? null
  const upcoming = data?.events.filter((event) => event.status === 'upcoming').slice(0, 4) ?? []
  const celebrated = data?.events.filter((event) => event.status === 'completed').slice(-3).reverse() ?? []
  const progress = data?.overallProgress ?? 0
  const isTV = variant === 'tv'

  const containerClass = isTV
    ? 'bg-white/95 rounded-3xl border border-white/40 shadow-xl p-6 xl:p-7 space-y-6 backdrop-blur'
    : 'bg-white rounded-2xl border border-[#E8E6E3] shadow-sm p-4 lg:p-5 space-y-5'

  const titleClass = isTV
    ? 'text-[0.75rem] uppercase tracking-[0.55em] text-[#8C8577]'
    : 'text-xs uppercase tracking-[0.4em] text-[#A8A8A8]'

  const headingClass = isTV
    ? 'text-3xl font-playfair font-semibold text-[#1F1B16]'
    : 'text-2xl font-playfair font-semibold text-[#2C2C2C]'

  const progressLabelClass = isTV
    ? 'text-[0.8rem] uppercase tracking-[0.35em] text-[#8C8577] mb-3'
    : 'text-xs uppercase tracking-[0.3em] text-[#A8A8A8] mb-2'

  const progressCopyClass = isTV
    ? 'mt-3 text-sm text-[#2C2C2C] font-crimson'
    : 'mt-2 text-xs text-[#4A4A4A] font-crimson'

  return (
    <section className={containerClass}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className={titleClass}>Timeline do Dia</p>
          <h3 className={headingClass}>1000 Dias de Amor</h3>
          {lastUpdatedAt && (
            <p className={`mt-1 ${isTV ? 'text-sm text-[#6E665B]' : 'text-xs text-[#A8A8A8]'}`}>
              Atualizado {formatDistanceToNow(lastUpdatedAt, { addSuffix: true, locale: ptBR })}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => refresh()}
          className={`inline-flex items-center gap-2 rounded-full border ${
            isTV ? 'border-[#D8D3CC] px-4 py-2 text-sm' : 'border-[#E8E6E3] px-3 py-1.5 text-xs'
          } font-semibold uppercase tracking-[0.3em] text-[#4A4A4A] hover:bg-[#F8F6F3] transition`}
          disabled={isLoading}
        >
          <RefreshCw className={isTV ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
          Atualizar
        </button>
      </header>

      {isLoading && (
        <p className="text-sm text-[#A8A8A8]">Carregando timeline...</p>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && data && (
        <div className="space-y-5">
          <div>
            <p className={progressLabelClass}>Progresso do Dia</p>
            <div className={`rounded-full overflow-hidden ${isTV ? 'h-2.5 bg-[#E4DED6]' : 'h-2 bg-[#F0EEEB]'}`}>
              <div
                className={`h-full rounded-full ${isTV ? 'bg-[#1C1A17]' : 'bg-[#2C2C2C]'} transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <p className={progressCopyClass}>
              {Math.round(progress)}% do cronograma celebrado
            </p>
          </div>

          {current ? (
            <CurrentEventCard state={current} variant={variant} />
          ) : (
            <div
              className={`rounded-xl border border-dashed ${
                isTV ? 'border-[#DAD3C7] bg-[#FBF8F3] p-5 text-base text-[#3A332C]' : 'border-[#E8E6E3] bg-[#F8F6F3] p-4 text-sm text-[#4A4A4A]'
              }`}
            >
              Aguardando o primeiro momento do dia.
            </div>
          )}

          {upcoming.length > 0 && (
            <section>
              <h4 className="text-xs uppercase tracking-[0.35em] text-[#A8A8A8] mb-3">A seguir</h4>
              <div className="space-y-3">
                {upcoming.map((event) => (
                  <CompactEventRow key={event.event._id} state={event} variant="upcoming" viewVariant={variant} />
                ))}
              </div>
            </section>
          )}

          {celebrated.length > 0 && (
            <section>
              <h4 className="text-xs uppercase tracking-[0.35em] text-[#A8A8A8] mb-3">Celebrados</h4>
              <div className="space-y-3">
                {celebrated.map((event) => (
                  <CompactEventRow key={event.event._id} state={event} variant="completed" viewVariant={variant} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  )
}

interface CurrentEventCardProps {
  state: TimelineEventState
  variant?: 'default' | 'tv'
}

function CurrentEventCard({ state, variant = 'default' }: CurrentEventCardProps) {
  const { event, timeRemaining, progressPercentage } = state
  const start = format(new Date(event.startTime), 'HH:mm', { locale: ptBR })
  const end = event.endTime ? format(new Date(event.endTime), 'HH:mm', { locale: ptBR }) : null
  const isTV = variant === 'tv'

  return (
    <article
      className={`${
        isTV
          ? 'rounded-2xl border border-[#1C1A17]/20 bg-[#1C1A17] text-white p-5 space-y-4 shadow-[0_25px_60px_rgba(12,10,8,0.45)]'
          : 'rounded-xl border border-[#2C2C2C]/10 bg-[#1C1A17] text-white p-4 space-y-3 shadow-[0_20px_40px_rgba(0,0,0,0.25)]'
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className={`${isTV ? 'text-sm tracking-[0.4em]' : 'text-xs tracking-[0.35em]'} uppercase text-white/60`}>Agora</p>
          <h4 className={`font-playfair ${isTV ? 'text-3xl leading-tight' : 'text-2xl'} font-semibold`}>{event.title}</h4>
        </div>
        <TimelineBadge state={state} size={isTV ? 'md' : 'sm'} />
      </header>
      <p className={`${isTV ? 'text-base' : 'text-sm'} text-white/75 font-crimson leading-relaxed`}>
        {event.description}
      </p>
      <div className={`flex flex-wrap items-center gap-2 text-white/70 ${isTV ? 'text-sm' : 'text-xs'}`}>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5">
          <Clock className={isTV ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
          {start}
          {end ? ` - ${end}` : ''}
        </span>
        {typeof timeRemaining === 'number' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5">
            ⏱ {Math.max(timeRemaining, 0)} min restantes
          </span>
        )}
        {event.guestPhotosCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5">
            <Camera className={isTV ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
            {event.guestPhotosCount} fotos
          </span>
        )}
      </div>
      {progressPercentage != null && (
        <div>
          <div className={`${isTV ? 'h-2 rounded-full' : 'h-1.5 rounded-full'} bg-white/10 overflow-hidden`}>
            <div
              className="h-full rounded-full bg-white/90 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            />
          </div>
          <p className={`mt-2 uppercase text-white/60 ${isTV ? 'text-xs tracking-[0.35em]' : 'text-[11px] tracking-[0.3em]'}`}>
            {Math.round(progressPercentage)}% concluído
          </p>
        </div>
      )}
    </article>
  )
}

interface CompactEventRowProps {
  state: TimelineEventState
  variant: 'upcoming' | 'completed'
  viewVariant?: 'default' | 'tv'
}

function CompactEventRow({ state, variant, viewVariant = 'default' }: CompactEventRowProps) {
  const { event } = state
  const start = format(new Date(event.startTime), 'HH:mm', { locale: ptBR })
  const end = event.endTime ? format(new Date(event.endTime), 'HH:mm', { locale: ptBR }) : null
  const isTV = viewVariant === 'tv'

  return (
    <div className={`rounded-lg border bg-[#FDFBF8] ${isTV ? 'border-[#E1DACE] px-4 py-3' : 'border-[#E8E6E3] px-3 py-2'}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className={`${isTV ? 'text-[0.75rem] tracking-[0.4em] text-[#8C8577]' : 'text-xs tracking-[0.35em] text-[#A8A8A8]' } uppercase`}>
            {variant === 'upcoming' ? 'Em breve' : 'Celebrado'}
          </p>
          <p className={`${isTV ? 'text-lg' : 'text-sm'} font-playfair font-semibold text-[#2C2C2C] truncate`}>
            {event.title}
          </p>
        </div>
        <div className={`${isTV ? 'text-sm' : 'text-xs'} text-[#4A4A4A] font-crimson`}>
          {start}
          {end ? ` - ${end}` : ''}
        </div>
      </div>
      {event.guestPhotosCount > 0 && (
        <p className={`mt-1 uppercase text-[#4A4A4A] ${isTV ? 'text-xs tracking-[0.3em]' : 'text-[11px] tracking-[0.25em]'}`}>
          {event.guestPhotosCount} fotos compartilhadas
        </p>
      )}
    </div>
  )
}

export default LiveTimelineSidebar
