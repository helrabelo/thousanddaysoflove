'use client'

import { useMemo } from 'react'
import useTimelineState from '@/hooks/useTimelineState'
import EventCard from '@/components/timeline/EventCard'
import EventPhotoGallery from '@/components/timeline/EventPhotoGallery'
import TimelineBadge from '@/components/timeline/TimelineBadge'

export function LiveTimelineTV() {
  const { data, events, isLoading, error, refresh } = useTimelineState({ updateIntervalMs: 20_000 })

  const { currentEvent, nextEvents, completedEvents } = useMemo(() => {
    if (!data) {
      return {
        currentEvent: null,
        nextEvents: [],
        completedEvents: [],
      }
    }

    const current = data.currentEvent ?? null
    const upcoming = data.events.filter((event) => event.status === 'upcoming').slice(0, 2)
    const completed = data.events
      .filter((event) => event.status === 'completed')
      .slice(-3)
      .reverse()

    return {
      currentEvent: current,
      nextEvents: upcoming,
      completedEvents: completed,
    }
  }, [data])

  return (
    <div className="min-h-screen bg-[#0E0D0B] text-white px-10 py-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">Ao Vivo • Timeline do Casamento</p>
          <h1 className="mt-2 text-5xl font-playfair font-semibold">1000 Dias de Amor</h1>
          <p className="text-lg text-white/70 max-w-xl">
            A timeline que nao deixa ninguem perder o momento certo – atualizada em tempo real direto de Sanity e Supabase.
          </p>
        </div>
        <div className="text-right">
          <p className="uppercase text-xs tracking-[0.4em] text-white/40">Atualiza automatico</p>
          <button
            onClick={() => refresh()}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
          >
            Recarregar agora
          </button>
        </div>
      </header>

      {isLoading && (
        <p className="mt-10 text-white/60 text-xl">Carregando timeline...</p>
      )}

      {error && (
        <div className="mt-10 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-50">
          {error}
        </div>
      )}

      {!isLoading && !error && events.length === 0 && (
        <div className="mt-16 text-center text-white/60 text-xl">
          Nenhum evento cadastrado por enquanto – abre o Sanity e cria a timeline. ;)
        </div>
      )}

      {currentEvent && (
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-playfair font-semibold uppercase tracking-[0.4em] text-white/50">
              Acontecendo Agora
            </h2>
            <TimelineBadge state={currentEvent} />
          </div>
          <div className="mt-6">
            <EventCard state={currentEvent} variant="tv-primary" />
          </div>
          {currentEvent.guestPhotos.length > 0 && (
            <div className="mt-6">
              <EventPhotoGallery variant="tv" photos={currentEvent.guestPhotos} />
            </div>
          )}
        </section>
      )}

      {nextEvents.length > 0 && (
        <section className="mt-12">
          <h3 className="text-2xl font-playfair uppercase tracking-[0.4em] text-white/40">
            A Seguir
          </h3>
          <div className="mt-6 grid grid-cols-2 gap-6">
            {nextEvents.map((event) => (
              <EventCard key={event.event._id} state={event} variant="tv-secondary" />
            ))}
          </div>
        </section>
      )}

      {completedEvents.length > 0 && (
        <section className="mt-12">
          <h3 className="text-2xl font-playfair uppercase tracking-[0.4em] text-white/40">
            Momentos Celebrados
          </h3>
          <div className="mt-6 grid grid-cols-3 gap-6">
            {completedEvents.map((event) => (
              <div key={event.event._id} className="space-y-4">
                <EventCard state={event} variant="tv-secondary" />
                {event.guestPhotos.length > 0 && (
                  <EventPhotoGallery variant="tv" photos={event.guestPhotos} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default LiveTimelineTV
