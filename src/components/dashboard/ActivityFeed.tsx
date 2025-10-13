'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { ActivityItem } from '@/lib/supabase/dashboard';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="font-playfair text-2xl text-[#2C2C2C] mb-6">
          Atividades Recentes
        </h2>

        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-[#F8F6F3] rounded-full mb-4"
          >
            <Clock className="w-8 h-8 text-[#A8A8A8]" />
          </motion.div>
          <p className="font-crimson text-base text-[#4A4A4A] italic">
            Nenhuma atividade ainda. Comece explorando!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="font-playfair text-2xl text-[#2C2C2C] mb-6">
        Atividades Recentes
      </h2>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F8F6F3] transition-colors"
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
              <span className="text-lg">{activity.icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-crimson text-sm text-[#2C2C2C]">
                {activity.description}
              </p>
              <p className="font-crimson text-xs text-[#4A4A4A] mt-1">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>

            {/* Activity type badge */}
            <div className="flex-shrink-0">
              <span className="inline-block px-2 py-1 rounded-full bg-[#E8E6E3] text-[#4A4A4A] text-xs font-medium">
                {getActivityTypeLabel(activity.type)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Agora mesmo';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'} atrás`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'} atrás`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'} atrás`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'} atrás`;
}

function getActivityTypeLabel(
  type: ActivityItem['type']
): string {
  const labels: Record<ActivityItem['type'], string> = {
    post_created: 'Post',
    comment_made: 'Comentário',
    reaction_given: 'Reação',
    photo_uploaded: 'Foto',
    gift_selected: 'Presente',
    rsvp_completed: 'RSVP',
  };

  return labels[type] || type;
}
