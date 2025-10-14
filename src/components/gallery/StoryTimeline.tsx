'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Heart, Play } from 'lucide-react'
import { TimelineEvent } from '@/types/wedding'
import AutoCarousel from '@/components/ui/AutoCarousel'

interface StoryTimelineProps {
  events: TimelineEvent[]
  title?: string
  description?: string
}

export default function StoryTimeline({
  events,
  title = "Nossa História de Amor",
  description = "Uma jornada de mil dias que se tornará para sempre"
}: StoryTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getMilestoneIcon = (type: TimelineEvent['milestone_type']) => {
    const icons = {
      first_date: '💕',
      anniversary: '💖',
      travel: '✈️',
      engagement: '💍',
      special: '⭐',
      family: '👨‍👩‍👧‍👦',
      achievement: '🏆'
    }
    return icons[type] || '💝'
  }

  const getMilestoneColor = (type: TimelineEvent['milestone_type']) => {
    // Using monochromatic wedding invitation palette
    return 'var(--decorative)' // All milestones use same elegant silver-gray
  }

  return (
    <section className="py-20" >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', letterSpacing: '0.15em' }}>
            {title}
          </h2>
          <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--decorative)' }} />
          <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
            {description}
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full rounded-full shadow-lg" style={{ background: 'var(--decorative)' }} />

          {/* Timeline Events */}
          <div className="space-y-16">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className={`flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                } relative`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredEvent(event.id)}
                onHoverEnd={() => setHoveredEvent(null)}
              >
                {/* Content Card */}
                <div className="w-5/12">
                  <motion.div
                    className={`rounded-xl p-8 cursor-pointer transition-all duration-300 ${
                      hoveredEvent === event.id ? 'scale-105' : ''
                    }`}
                    style={{
                      background: 'var(--white-soft)',
                      boxShadow: hoveredEvent === event.id ? '0 12px 40px var(--shadow-medium)' : '0 6px 25px var(--shadow-subtle)',
                      border: '1px solid var(--border-subtle)'
                    }}
                    onClick={() => setSelectedEvent(event)}
                    whileHover={{ y: -5 }}
                  >
                    {/* Date */}
                    <div className="flex items-center mb-4">
                      <Calendar className="w-5 h-5 mr-2" style={{ color: 'var(--decorative)' }} />
                      <span className="font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--decorative)', letterSpacing: '0.05em' }}>
                        {formatDate(event.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 leading-tight" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic', fontSize: '1.125rem' }}>
                      {event.description}
                    </p>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center mb-4" style={{ color: 'var(--decorative)' }}>
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-crimson)' }}>{event.location}</span>
                      </div>
                    )}

                    {/* Milestone Badge */}
                    {event.is_major_milestone && (
                      <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'var(--accent)', color: 'var(--primary-text)', fontFamily: 'var(--font-crimson)' }}>
                        <Heart className="w-4 h-4 mr-2" style={{ color: 'var(--decorative)' }} />
                        Marco Importante
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Central Icon */}
                <div className="w-2/12 flex justify-center relative z-10">
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 relative overflow-hidden"
                    style={{
                      background: getMilestoneColor(event.milestone_type),
                      borderColor: 'var(--white-soft)'
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-2xl z-10 relative">
                      {getMilestoneIcon(event.milestone_type)}
                    </span>

                    {/* Pulse Effect for Major Milestones */}
                    {event.is_major_milestone && (
                      <motion.div
                        className="absolute inset-0 bg-white/30 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Media Content */}
                <div className="w-5/12">
                  <motion.div
                    className="relative overflow-hidden rounded-xl group cursor-pointer"
                    style={{ boxShadow: '0 8px 30px var(--shadow-subtle)' }}
                    onClick={() => setSelectedEvent(event)}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    {event.media && event.media.length > 0 ? (
                      // Multiple media - use AutoCarousel
                      <AutoCarousel
                        media={event.media.map(m => ({
                          media_type: m.media_type === 'photo' ? 'image' : 'video',
                          media_url: m.media_url,
                          caption: m.caption
                        }))}
                        interval={5000}
                        autoPlay={true}
                        showControls={true}
                        className="h-80"
                      />
                    ) : event.media_type === 'photo' ? (
                      // Single photo - backward compatibility
                      <img
                        src={event.media_url}
                        alt={event.title}
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      // Single video - backward compatibility
                      <div className="relative">
                        <img
                          src={event.thumbnail_url || event.media_url}
                          alt={event.title}
                          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-rose-600 ml-1" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay - only show if not using carousel */}
                    {(!event.media || event.media.length === 0) && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(44, 44, 44, 0.6), transparent)' }} />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: 'var(--decorative)',
                opacity: '0.05'
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 30 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              ♥
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
                  {selectedEvent.title}
                </h3>
                <p className="text-xl" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--decorative)', letterSpacing: '0.05em' }}>
                  {formatDate(selectedEvent.date)}
                </p>
              </div>

              {selectedEvent.media && selectedEvent.media.length > 0 ? (
                // Multiple media - use AutoCarousel
                <div className="mb-6">
                  <AutoCarousel
                    media={selectedEvent.media.map(m => ({
                      media_type: m.media_type === 'photo' ? 'image' : 'video',
                      media_url: m.media_url,
                      caption: m.caption
                    }))}
                    interval={5000}
                    autoPlay={false}
                    showControls={true}
                    className="h-96"
                  />
                </div>
              ) : selectedEvent.media_type === 'photo' ? (
                // Single photo - backward compatibility
                <img
                  src={selectedEvent.media_url}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                  style={{ border: '1px solid var(--border-subtle)' }}
                />
              ) : (
                // Single video - backward compatibility
                <video
                  src={selectedEvent.media_url}
                  controls
                  className="w-full h-64 object-cover rounded-xl mb-6"
                  style={{ border: '1px solid var(--border-subtle)' }}
                />
              )}

              <p className="leading-relaxed mb-6" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic', fontSize: '1.125rem' }}>
                {selectedEvent.description}
              </p>

              {selectedEvent.location && (
                <div className="flex items-center justify-center mb-6" style={{ color: 'var(--decorative)' }}>
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="font-medium" style={{ fontFamily: 'var(--font-crimson)' }}>{selectedEvent.location}</span>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                  style={{ background: 'var(--decorative)', color: 'var(--white-soft)', fontFamily: 'var(--font-playfair)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-text)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--decorative)' }}
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
