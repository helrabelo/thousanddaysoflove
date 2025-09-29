'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Heart, Play } from 'lucide-react'
import { TimelineEvent } from '@/types/wedding'

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
    const colors = {
      first_date: 'from-rose-500 to-pink-600',
      anniversary: 'from-purple-500 to-pink-500',
      travel: 'from-blue-500 to-cyan-500',
      engagement: 'from-yellow-400 to-orange-500',
      special: 'from-indigo-500 to-purple-600',
      family: 'from-green-500 to-emerald-600',
      achievement: 'from-amber-500 to-yellow-600'
    }
    return colors[type] || 'from-rose-500 to-pink-600'
  }

  return (
    <section className="py-20 bg-gradient-to-br from-cream via-rose-50 to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-header text-deep-romantic mb-6">
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="story-text text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-rose-300 via-pink-400 to-purple-400 rounded-full shadow-lg" />

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
                    className={`bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 cursor-pointer transition-all duration-300 ${
                      hoveredEvent === event.id ? 'shadow-2xl scale-105' : ''
                    }`}
                    onClick={() => setSelectedEvent(event)}
                    whileHover={{ y: -5 }}
                  >
                    {/* Date */}
                    <div className="flex items-center mb-4">
                      <Calendar className="w-5 h-5 text-rose-500 mr-2" />
                      <span className="romantic-script text-rose-600 font-semibold">
                        {formatDate(event.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-deep-romantic mb-3 leading-tight">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="story-text text-gray-700 mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center text-rose-600 mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{event.location}</span>
                      </div>
                    )}

                    {/* Milestone Badge */}
                    {event.is_major_milestone && (
                      <div className="inline-flex items-center bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold">
                        <Heart className="w-4 h-4 mr-2" />
                        Marco Importante
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Central Icon */}
                <div className="w-2/12 flex justify-center relative z-10">
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${getMilestoneColor(event.milestone_type)} rounded-full flex items-center justify-center shadow-lg border-4 border-white relative overflow-hidden`}
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
                    className="relative overflow-hidden rounded-3xl shadow-xl group cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    {event.media_type === 'photo' ? (
                      <img
                        src={event.media_url}
                        alt={event.title}
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
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

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-200/10 text-6xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              🌸
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
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-deep-romantic mb-2">
                  {selectedEvent.title}
                </h3>
                <p className="romantic-script text-rose-600 text-xl">
                  {formatDate(selectedEvent.date)}
                </p>
              </div>

              {selectedEvent.media_type === 'photo' ? (
                <img
                  src={selectedEvent.media_url}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
              ) : (
                <video
                  src={selectedEvent.media_url}
                  controls
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
              )}

              <p className="story-text text-gray-700 leading-relaxed mb-6">
                {selectedEvent.description}
              </p>

              {selectedEvent.location && (
                <div className="flex items-center justify-center text-rose-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="font-medium">{selectedEvent.location}</span>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300"
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