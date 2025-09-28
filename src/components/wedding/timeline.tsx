"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart, Calendar, MapPin, Camera, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate } from "@/lib/utils"

export interface TimelineEvent {
  id: string
  title: string
  description: string
  date: Date
  location?: string
  imageUrl?: string
  type: "meeting" | "first-date" | "relationship" | "milestone" | "engagement" | "wedding"
  isSpecial?: boolean
}

export interface TimelineProps {
  events: TimelineEvent[]
  variant?: "default" | "compact" | "detailed"
  showImages?: boolean
  className?: string
}

const eventIcons = {
  meeting: Heart,
  "first-date": Star,
  relationship: Heart,
  milestone: Calendar,
  engagement: Heart,
  wedding: Heart
}

const eventColors = {
  meeting: "romantic",
  "first-date": "gold",
  relationship: "default",
  milestone: "confirmed",
  engagement: "romantic",
  wedding: "gold"
} as const

const eventLabels = {
  meeting: "Primeiro Encontro",
  "first-date": "Primeiro Encontro",
  relationship: "Relacionamento",
  milestone: "Marco Importante",
  engagement: "Noivado",
  wedding: "Casamento"
}

const Timeline: React.FC<TimelineProps> = ({
  events,
  variant = "default",
  showImages = true,
  className
}) => {
  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [events])

  if (variant === "compact") {
    return (
      <div className={cn("space-y-4", className)}>
        {sortedEvents.map((event, index) => {
          const Icon = eventIcons[event.type]

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="flex-shrink-0">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  event.isSpecial
                    ? "bg-gradient-to-br from-gold-400 to-gold-600"
                    : "bg-gradient-to-br from-blush-400 to-blush-600"
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <Card variant="elegant" className="flex-1">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-burgundy-800 font-heading">
                        {event.title}
                      </h3>
                      <p className="text-sm text-sage-600 font-body mt-1">
                        {event.description}
                      </p>
                      {event.location && (
                        <div className="flex items-center space-x-1 mt-2 text-xs text-sage-500">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={eventColors[event.type]} size="sm">
                        {eventLabels[event.type]}
                      </Badge>
                      <p className="text-xs text-sage-500 mt-1">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blush-300 via-blush-400 to-blush-300" />

      <div className="space-y-8">
        {sortedEvents.map((event, index) => {
          const Icon = eventIcons[event.type]
          const isEven = index % 2 === 0

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={cn(
                "relative flex items-center",
                variant === "detailed" ? "min-h-32" : "min-h-24"
              )}
            >
              {/* Timeline Node */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={cn(
                  "relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg",
                  event.isSpecial
                    ? "bg-gradient-to-br from-gold-400 to-gold-600 ring-4 ring-gold-200"
                    : "bg-gradient-to-br from-blush-400 to-blush-600 ring-4 ring-blush-200"
                )}
              >
                <Icon className="h-6 w-6 text-white" />
              </motion.div>

              {/* Content */}
              <div className={cn(
                "ml-8 flex-1",
                variant === "detailed" && "max-w-2xl"
              )}>
                <Card
                  variant={event.isSpecial ? "floating" : "romantic"}
                  className={cn(
                    "relative",
                    event.isSpecial && "ring-2 ring-gold-300"
                  )}
                >
                  {/* Date Badge */}
                  <div className="absolute -top-3 -right-3">
                    <Badge variant={eventColors[event.type]}>
                      {formatDate(event.date)}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className={cn(
                      "space-y-4",
                      showImages && event.imageUrl && variant === "detailed" && "grid grid-cols-1 md:grid-cols-3 gap-6 space-y-0"
                    )}>
                      <div className={cn(
                        showImages && event.imageUrl && variant === "detailed" ? "md:col-span-2" : ""
                      )}>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant={eventColors[event.type]} size="sm">
                            {eventLabels[event.type]}
                          </Badge>
                          {event.isSpecial && (
                            <Badge variant="gold" size="sm">
                              ⭐ Especial
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-xl font-heading font-semibold text-burgundy-800 mb-2">
                          {event.title}
                        </h3>

                        <p className="text-sage-700 font-body leading-relaxed">
                          {event.description}
                        </p>

                        {event.location && (
                          <div className="flex items-center space-x-2 mt-3 text-sage-600">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm font-body">{event.location}</span>
                          </div>
                        )}
                      </div>

                      {showImages && event.imageUrl && variant === "detailed" && (
                        <div className="relative overflow-hidden rounded-xl">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <div className="absolute bottom-2 right-2">
                            <Camera className="h-4 w-4 text-white/80" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {/* Special decoration for important events */}
                  {event.isSpecial && (
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="absolute -top-2 -left-2 text-2xl"
                    >
                      ✨
                    </motion.div>
                  )}
                </Card>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* End decoration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: sortedEvents.length * 0.2 + 0.5 }}
        className="relative flex justify-center mt-8"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-gold-200">
          <Heart className="h-8 w-8 text-white animate-heartbeat" />
        </div>
      </motion.div>
    </div>
  )
}

Timeline.displayName = "Timeline"

export { Timeline }