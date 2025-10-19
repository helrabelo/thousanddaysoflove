'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  Users,
  Heart,
  Camera,
  Music,
  Utensils,
  Sparkles,
  PartyPopper,
  Cake,
  LucideIcon,
} from 'lucide-react'
import { fetchTimelineEvents } from '@/lib/sanity/timeline'
import type { WeddingTimelineEvent } from '@/types/wedding'

interface TimelineEntry {
  id: string
  time: string
  title: string
  description: string
  icon: LucideIcon
  colorGradient: string
  durationLabel?: string
  location?: string
}

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Heart,
  Camera,
  Music,
  Utensils,
  Sparkles,
  PartyPopper,
  Cake,
  Clock,
}

export default function EventTimeline() {
  const [events, setEvents] = useState<WeddingTimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadEvents() {
      try {
        const data = await fetchTimelineEvents()
        if (!active) return
        setEvents(data)
      } catch (error) {
        console.error('[EventTimeline] Failed to fetch timeline events', error)
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadEvents()

    return () => {
      active = false
    }
  }, [])

  const timelineEntries = useMemo<TimelineEntry[]>(() => {
    return events.map((event) => {
      // Extract time directly from ISO string without timezone conversion
      // This ensures the time shows exactly as saved in Sanity, regardless of device timezone
      const startLabel = event.startTime
        ? event.startTime.substring(11, 16) // Extract HH:mm from "YYYY-MM-DDTHH:mm:ss"
        : ''
      const durationLabel = Number.isFinite(event.estimatedDuration) && event.estimatedDuration > 0
        ? `${event.estimatedDuration} min`
        : undefined

      const icon = ICON_MAP[event.icon] ?? Clock

      return {
        id: event._id,
        time: startLabel,
        title: event.title,
        description: event.description,
        icon,
        colorGradient: event.colorGradient || 'from-[#4A7C59] to-[#5A8C69]',
        durationLabel,
        location: event.location,
      }
    })
  }, [events])

  return (
    <div className="relative">
      {/* Timeline Line - Desktop */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E8E6E3] via-[#A8A8A8] to-[#E8E6E3]" />

      {/* Timeline Events */}
      <div className="space-y-12 md:space-y-16">
        {isLoading && (
          <div className="text-center text-[#A8A8A8] font-crimson italic">
            Carregando programação...
          </div>
        )}

        {!isLoading && timelineEntries.length === 0 && (
          <div className="text-center text-[#A8A8A8] font-crimson italic">
            A programação ainda não foi publicada.
          </div>
        )}

        {timelineEntries.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 ${
                isEven ? '' : 'md:flex-row-reverse'
              }`}
            >
              {/* Left Side - Even items */}
              {isEven && (
                <>
                  {/* Desktop: Event Card on Left */}
                  <div className="hidden md:block">
                    <EventCard event={event} align="right" />
                  </div>

                  {/* Center: Time Badge */}
                  <div className="hidden md:flex items-center justify-center">
                    <TimeBadge time={event.time} duration={event.durationLabel} />
                  </div>

                  {/* Mobile: Full Width */}
                  <div className="md:hidden">
                    <div className="flex items-center gap-4 mb-4">
                      <TimeBadge time={event.time} duration={event.durationLabel} />
                    </div>
                    <EventCard event={event} align="left" />
                  </div>
                </>
              )}

              {/* Right Side - Odd items */}
              {!isEven && (
                <>
                  {/* Desktop: Time Badge on Left */}
                  <div className="hidden md:flex items-center justify-center">
                    <TimeBadge time={event.time} duration={event.durationLabel} />
                  </div>

                  {/* Desktop: Event Card on Right */}
                  <div className="hidden md:block">
                    <EventCard event={event} align="left" />
                  </div>

                  {/* Mobile: Full Width */}
                  <div className="md:hidden">
                    <div className="flex items-center gap-4 mb-4">
                      <TimeBadge time={event.time} duration={event.durationLabel} />
                    </div>
                    <EventCard event={event} align="left" />
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TimeBadge({ time, duration }: { time: string; duration?: string }) {
  return (
    <div className="relative z-10">
      <div className="bg-white border-4 border-[#E8E6E3] rounded-full p-4 shadow-lg">
        <div className="text-center">
          <div className="font-playfair text-2xl font-bold text-[#2C2C2C]">
            {time}
          </div>
          {duration && (
            <div className="font-crimson text-xs text-[#A8A8A8] mt-1">
              {duration}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({
  event,
  align,
}: {
  event: TimelineEntry;
  align: 'left' | 'right';
}) {
  const IconComponent = event.icon;

  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg border border-[#E8E6E3] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        align === 'right' ? 'md:text-right' : ''
      }`}
    >
      {/* Icon */}
      <div
        className={`inline-flex w-14 h-14 rounded-full bg-gradient-to-br ${event.colorGradient} items-center justify-center mb-4`}
      >
        <IconComponent className="w-7 h-7 text-white" />
      </div>

      {/* Title */}
      <h3 className="font-playfair text-2xl text-[#2C2C2C] mb-2">
        {event.title}
      </h3>

      {/* Description */}
      <p className="font-crimson text-base text-[#4A4A4A] leading-relaxed">
        {event.description}
      </p>
      {event.location && (
        <p className="font-crimson text-sm text-[#8C8577] mt-3">
          📍 {event.location}
        </p>
      )}
    </div>
  );
}
