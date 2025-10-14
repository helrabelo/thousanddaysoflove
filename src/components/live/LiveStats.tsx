'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Camera, Users, Heart, TrendingUp } from 'lucide-react'
import { getLiveCelebrationStats, getRecentActivity } from '@/lib/supabase/live'
import type { LiveCelebrationStats, ActivityItem } from '@/lib/supabase/live'
import { Card } from '@/components/ui/card'

export function LiveStats() {
  const [stats, setStats] = useState<LiveCelebrationStats>({
    total_posts_today: 0,
    photos_uploaded_today: 0,
    guests_checked_in: 0,
    total_reactions: 0,
    comments_today: 0
  })
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    const [statsData, activitiesData] = await Promise.all([
      getLiveCelebrationStats(),
      getRecentActivity(10)
    ])
    setStats(statsData)
    setActivities(activitiesData)
    setIsLoading(false)
  }

  const statCards = [
    {
      icon: MessageSquare,
      label: 'Mensagens Hoje',
      value: stats.total_posts_today,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-white',
      iconColor: 'text-purple-500'
    },
    {
      icon: Camera,
      label: 'Fotos Enviadas',
      value: stats.photos_uploaded_today,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-white',
      iconColor: 'text-pink-500'
    },
    {
      icon: Users,
      label: 'Convidados',
      value: stats.guests_checked_in,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-white',
      iconColor: 'text-blue-500'
    },
    {
      icon: Heart,
      label: 'Reações',
      value: stats.total_reactions,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-white',
      iconColor: 'text-red-500'
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-6 bg-gradient-to-br ${stat.bgColor} border-${stat.color.split('-')[1]}-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <stat.icon className={`w-8 h-8 ${stat.iconColor} mb-3`} />
                  <motion.div
                    key={stat.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-3xl font-bold text-[#2C2C2C] mb-1"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-sm text-[#4A4A4A]">{stat.label}</p>
                </div>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} opacity-10`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[#2C2C2C]" />
          <h3 className="text-lg font-semibold text-[#2C2C2C]">Atividade Recente</h3>
        </div>

        {activities.length === 0 ? (
          <p className="text-center text-[#4A4A4A] py-8">
            Nenhuma atividade ainda. A celebração está apenas começando!
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover: transition-colors"
              >
                {/* Activity icon */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {activity.guest_name.charAt(0).toUpperCase()}
                </div>

                {/* Activity text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#2C2C2C]">
                    <span className="font-semibold">{activity.guest_name}</span>{' '}
                    <span className="text-[#4A4A4A]">{activity.description}</span>
                  </p>
                  <p className="text-xs text-[#4A4A4A]">
                    {formatTime(new Date(activity.created_at))}
                  </p>
                </div>

                {/* Activity type badge */}
                <div className="flex-shrink-0">
                  {activity.type === 'post' && <MessageSquare className="w-4 h-4 text-purple-500" />}
                  {activity.type === 'photo' && <Camera className="w-4 h-4 text-pink-500" />}
                  {activity.type === 'reaction' && <Heart className="w-4 h-4 text-red-500" />}
                  {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-blue-500" />}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'agora'
  if (diffMins === 1) return '1 minuto atrás'
  if (diffMins < 60) return `${diffMins} minutos atrás`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours === 1) return '1 hora atrás'
  if (diffHours < 24) return `${diffHours} horas atrás`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return '1 dia atrás'
  return `${diffDays} dias atrás`
}
