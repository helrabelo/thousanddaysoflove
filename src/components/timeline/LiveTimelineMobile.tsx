'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import useTimelineState from '@/hooks/useTimelineState'
import TimelineProgressHeader from '@/components/timeline/TimelineProgressHeader'
import TimelineBadge from '@/components/timeline/TimelineBadge'
import EventPhotoGallery from '@/components/timeline/EventPhotoGallery'
import PhotoUploadButton from '@/components/timeline/PhotoUploadButton'
import type { TimelineEventState } from '@/types/wedding'

export function LiveTimelineMobile() {
  const { data, isLoading, error, refresh } = useTimelineState()

  const grouped = useMemo(() => {
    if (!data) {
      return { past: [], present: null, future: [] as TimelineEventState[] }
    }

    const past = data.events.filter((event) => event.status === 'completed')
    const present = data.currentEvent ?? null
    const future = data.events.filter((event) => event.status === 'upcoming')

    return { past, present, future }
  }, [data])

  return (
    <div className="min-h-screen bg-[#0F0D0C] text-white pb-24">
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0F0D0C] to-transparent px-5 pt-8 pb-6">
        <TimelineProgressHeader data={data} />
      </div>

      <main className="px-5">
        {isLoading && (
          <p className="text-white/60">Carregando timeline...</p>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-50">
            {error}
            <button className="mt-3 block text-sm underline" onClick={() => refresh()}>
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && grouped.past.length === 0 && grouped.present === null && grouped.future.length === 0 && (
          <p className="text-white/60">Nenhum evento por aqui ainda.</p>
        )}

        {grouped.past.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.4em] text-white/30">Ja rolou</h2>
            {grouped.past.map((event) => (
              <MobileEventCard
                key={event.event._id}
                state={event}
                onUpload={event.event.allowPhotoUploads
                  ? () =>
                      window.dispatchEvent(
                        new CustomEvent('open-media-upload', {
                          detail: {
                            timelineEventId: event.event._id,
                            timelineEventTitle: event.event.title,
                          },
                        })
                      )
                  : undefined}
              />
            ))}
          </section>
        )}

        {grouped.present && (
          <section className="mt-10">
            <h2 className="text-xs uppercase tracking-[0.4em] text-[#F6D28B]">Agora</h2>
            <MobileEventCard
              state={grouped.present}
              highlight
              onUpload={grouped.present.event.allowPhotoUploads
                ? () =>
                    window.dispatchEvent(
                      new CustomEvent('open-media-upload', {
                        detail: {
                          timelineEventId: grouped.present?.event._id,
                          timelineEventTitle: grouped.present?.event.title,
                        },
                      })
                    )
                : undefined}
            />
          </section>
        )}

        {grouped.future.length > 0 && (
          <section className="mt-10 space-y-4">
            <h2 className="text-xs uppercase tracking-[0.4em] text-white/30">Em breve</h2>
            {grouped.future.map((event) => (
              <MobileEventCard
                key={event.event._id}
                state={event}
                onUpload={event.event.allowPhotoUploads
                  ? () =>
                      window.dispatchEvent(
                        new CustomEvent('open-media-upload', {
                          detail: {
                            timelineEventId: event.event._id,
                            timelineEventTitle: event.event.title,
                          },
                        })
                      )
                  : undefined}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

interface MobileEventCardProps {
  state: TimelineEventState
  highlight?: boolean
  onUpload?: () => void
}

function MobileEventCard({ state, highlight = false, onUpload }: MobileEventCardProps) {
  const { event } = state

  return (
    <motion.article
      layout
      className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
    >
      <div className="flex items-center justify-between">
        <TimelineBadge state={state} size="sm" />
        <span className="text-xs uppercase tracking-[0.3em] text-white/50">
          {new Date(event.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          {event.endTime
            ? ` - ${new Date(event.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
            : ''}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-playfair font-semibold">{event.title}</h3>
      <p className="mt-2 text-sm text-white/70">{event.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/50">
        {event.location && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
            📍 {event.location}
          </span>
        )}
        {event.allowPhotoUploads && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
            📸 Fotos liberadas
          </span>
        )}
        {event.isHighlight && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
            ✨ Destaque
          </span>
        )}
      </div>

      {state.guestPhotos.length > 0 && (
        <div className="mt-4">
          <EventPhotoGallery variant="mobile" photos={state.guestPhotos} />
        </div>
      )}

      {event.allowPhotoUploads && onUpload && (
        <div className="mt-4">
          <PhotoUploadButton onClick={onUpload} />
        </div>
      )}

      {highlight && state.progressPercentage != null && (
        <div className="mt-4">
          <div className="h-2 rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[#F6D28B]"
              initial={{ width: 0 }}
              animate={{ width: `${state.progressPercentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/50">
            {Math.round(state.progressPercentage)}% concluido
          </p>
        </div>
      )}
    </motion.article>
  )
}

export default LiveTimelineMobile
