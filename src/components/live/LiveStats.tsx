// @ts-nocheck: Pending animation + icon typing cleanup
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { ComponentType } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MessageSquare, Camera, Users, Heart, TrendingUp } from 'lucide-react'
import { getLiveCelebrationStats, getRecentActivity } from '@/lib/supabase/live'
import type { LiveCelebrationStats, ActivityItem } from '@/lib/supabase/live'
import { Card } from '@/components/ui/card'
import { isMilestone } from '@/lib/utils/animations'
import { HeartParticles } from '@/components/ui/Confetti'

interface LiveStatsProps {
  compact?: boolean
}

export function LiveStats({
  compact = false
}: LiveStatsProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<LiveCelebrationStats>({
    total_posts_today: 0,
    photos_uploaded_today: 0,
    guests_checked_in: 0,
    total_reactions: 0,
    comments_today: 0
  })
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [celebrateHearts, setCelebrateHearts] = useState(false)
  const [previousReactions, setPreviousReactions] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  const checkAuthentication = useCallback(async () => {
    try {
      // Note: guest_session_token is an httpOnly cookie that can only be read server-side
      const response = await fetch('/api/auth/verify')
      const data = await response.json()

      if (response.ok && data.success && data.session?.guest) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('[LiveStats] Error checking authentication:', error)
      setIsAuthenticated(false)
    }
  }, [])

  const loadStats = useCallback(async () => {
    const [statsData, activitiesData] = await Promise.all([
      getLiveCelebrationStats(),
      getRecentActivity(10)
    ])
    setStats(statsData)
    setActivities(activitiesData)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadStats()
    checkAuthentication()

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [checkAuthentication, loadStats])

  // Check for reactions milestone
  useEffect(() => {
    if (stats.total_reactions > previousReactions && previousReactions > 0) {
      const milestone = isMilestone(stats.total_reactions)
      if (milestone.milestone) {
        setCelebrateHearts(true)
        setTimeout(() => setCelebrateHearts(false), 3000)
      }
    }
    setPreviousReactions(stats.total_reactions)
  }, [previousReactions, stats.total_reactions])

  interface StatConfig {
    icon: ComponentType<{ className?: string }>
    label: string
    value: number
    color: string
    bgColor: string
    iconColor: string
    emoji: string
  }

  const statCards: StatConfig[] = [
    {
      icon: MessageSquare,
      label: 'Mensagens Hoje',
      value: stats.total_posts_today,
      color: 'from-[#2C2C2C] to-[#4A4A4A]',
      bgColor: 'from-[#F8F6F3] to-white',
      iconColor: 'text-[#2C2C2C]',
      emoji: '💬'
    },
    {
      icon: Camera,
      label: 'Fotos Enviadas',
      value: stats.photos_uploaded_today,
      color: 'from-[#4A4A4A] to-[#2C2C2C]',
      bgColor: 'from-[#E8E6E3] to-white',
      iconColor: 'text-[#4A4A4A]',
      emoji: '📸'
    },
    {
      icon: Users,
      label: 'Convidados',
      value: stats.guests_checked_in,
      color: 'from-[#A8A8A8] to-[#4A4A4A]',
      bgColor: 'from-white to-[#F8F6F3]',
      iconColor: 'text-[#A8A8A8]',
      emoji: '👥'
    },
    {
      icon: Heart,
      label: 'Reações',
      value: stats.total_reactions,
      color: 'from-[#2C2C2C] to-[#A8A8A8]',
      bgColor: 'from-white to-[#E8E6E3]',
      iconColor: 'text-[#2C2C2C]',
      emoji: '❤️'
    }
  ]

  if (isLoading) {
    return (
      <div className={compact ? "space-y-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"}>
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={compact ? "h-12 bg-gray-100 rounded-lg" : "h-32 bg-gray-100 rounded-xl"}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    )
  }

  const handleOpenMessageComposer = () => {
    window.dispatchEvent(new CustomEvent('open-message-composer'))
  }

  const handleOpenMediaUpload = () => {
    window.dispatchEvent(new CustomEvent('open-media-upload'))
  }

  // Compact sidebar version
  if (compact) {
    return (
      <div className="space-y-3">
        {/* Action Buttons for Authenticated Guests */}
        {isAuthenticated && (
          <div className="space-y-2 pb-3 border-b border-[#E8E6E3]">
            <motion.button
              onClick={handleOpenMessageComposer}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#2C2C2C] to-[#4A4A4A] text-white rounded-lg hover:from-[#1A1A1A] hover:to-[#2C2C2C] transition-all shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-crimson font-medium">Enviar Mensagem</span>
            </motion.button>

            <motion.button
              onClick={handleOpenMediaUpload}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#2C2C2C] rounded-lg border-2 border-[#E8E6E3] hover:border-[#2C2C2C] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Camera className="w-4 h-4" />
              <span className="font-crimson font-medium">Enviar Fotos</span>
            </motion.button>
          </div>
        )}

        {statCards.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between p-3 bg-[#F8F6F3] rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">{stat.emoji}</span>
              <span className="text-sm text-[#4A4A4A] font-crimson">{stat.label}</span>
            </div>
            <span className="text-xl font-playfair font-bold text-[#2C2C2C]">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Heart celebration for reactions milestone */}
      <HeartParticles trigger={celebrateHearts} count={15} />

      {/* Stats Cards with delightful animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <StatCard
            key={stat.label}
            stat={stat}
            index={index}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>

      {/* Recent Activity Feed */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <motion.div
            animate={shouldReduceMotion ? {} : {
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <TrendingUp className="w-5 h-5 text-[#2C2C2C]" />
          </motion.div>
          <h3 className="text-lg font-semibold text-[#2C2C2C] font-playfair">Atividade Recente</h3>
        </div>

        {activities.length === 0 ? (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.p
              className="text-[#4A4A4A] font-crimson italic mb-3"
              animate={shouldReduceMotion ? {} : {
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              Nenhuma atividade ainda. A celebração está apenas começando!
            </motion.p>
            <motion.div
              className="text-4xl"
              animate={shouldReduceMotion ? {} : {
                rotate: [0, -10, 10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              🎉
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

// Stat Card Component with delightful micro-interactions
interface StatCardProps {
  stat: StatConfig
  index: number
  shouldReduceMotion?: boolean
}

function StatCard({ stat, index, shouldReduceMotion }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showIncrement, setShowIncrement] = useState(false)
  const previousValueRef = useRef(stat.value)

  useEffect(() => {
    if (stat.value > previousValueRef.current) {
      setShowIncrement(true)
      const timer = setTimeout(() => setShowIncrement(false), 2000)
      previousValueRef.current = stat.value
      return () => clearTimeout(timer)
    }
    if (stat.value !== previousValueRef.current) {
      previousValueRef.current = stat.value
    }
    return undefined
  }, [stat.value])

  const Icon = stat.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <Card className={`p-6 bg-gradient-to-br ${stat.bgColor} border-2 border-transparent hover:border-[#E8E6E3] transition-all duration-300 relative overflow-hidden`}>
          {/* Shimmer effect on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                background: 'linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.3) 50%, transparent 60%)',
                backgroundSize: '200% 200%',
                pointerEvents: 'none'
              }}
            />
          )}

          <div className="flex items-center justify-between relative">
            <div>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon className={`w-8 h-8 ${stat.iconColor} mb-3`} />
              </motion.div>

              {/* Value with increment animation */}
              <div className="relative">
                <motion.div
                  key={stat.value}
                  initial={shouldReduceMotion ? {} : { scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-3xl font-bold text-[#2C2C2C] mb-1 font-playfair"
                >
                  {stat.value}
                </motion.div>

                {/* Increment indicator */}
                {showIncrement && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 0], y: -30, scale: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute -top-8 left-0 text-green-500 font-bold text-sm"
                  >
                    +{stat.value - previousValue}
                  </motion.div>
                )}
              </div>

              <p className="text-sm text-[#4A4A4A] font-crimson">{stat.label}</p>
            </div>

            {/* Animated emoji background */}
            <motion.div
              className="text-6xl opacity-10"
              animate={shouldReduceMotion ? {} : (isHovered ? {
                rotate: [0, -10, 10, 0],
                scale: [1, 1.2, 1]
              } : {})}
              transition={{
                duration: 0.6
              }}
            >
              {stat.emoji}
            </motion.div>
          </div>

          {/* Milestone indicator */}
          {isMilestone(stat.value).milestone && (
            <motion.div
              className="absolute top-2 right-2"
              initial={{ scale: 0, rotate: 0 }}
              animate={shouldReduceMotion ? { scale: 1, rotate: 0 } : {
                scale: [0, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 0.6,
                delay: 0.3
              }}
            >
              <span className="text-xl">🎉</span>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}

// Activity Item Component
interface ActivityItemProps {
  activity: ActivityItem
  index: number
  shouldReduceMotion?: boolean
}

function ActivityItem({ activity, index, shouldReduceMotion }: ActivityItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getActivityIcon = () => {
    switch (activity.type) {
      case 'post':
        return <MessageSquare className="w-4 h-4 text-[#2C2C2C]" />
      case 'photo':
        return <Camera className="w-4 h-4 text-[#4A4A4A]" />
      case 'reaction':
        return <Heart className="w-4 h-4 text-[#A8A8A8]" />
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-[#2C2C2C]" />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8F6F3] transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={shouldReduceMotion ? {} : { x: 4 }}
    >
      {/* Activity avatar with bounce */}
      <motion.div
        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2C2C2C] to-[#4A4A4A] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
        whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {activity.guest_name.charAt(0).toUpperCase()}
      </motion.div>

      {/* Activity text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#2C2C2C] font-crimson">
          <span className="font-semibold font-playfair">{activity.guest_name}</span>{' '}
          <span className="text-[#4A4A4A]">{activity.description}</span>
        </p>
        <p className="text-xs text-[#4A4A4A]">
          {formatTime(new Date(activity.created_at))}
        </p>
      </div>

      {/* Activity type badge with pulse */}
      <motion.div
        className="flex-shrink-0"
        animate={shouldReduceMotion ? {} : (isHovered ? {
          scale: [1, 1.2, 1]
        } : {})}
        transition={{
          duration: 0.3
        }}
      >
        {getActivityIcon()}
      </motion.div>
    </motion.div>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'agora mesmo'
  if (diffMins === 1) return '1 minuto atrás'
  if (diffMins < 60) return `${diffMins} minutos atrás`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours === 1) return '1 hora atrás'
  if (diffHours < 24) return `${diffHours} horas atrás`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return '1 dia atrás'
  return `${diffDays} dias atrás`
}
