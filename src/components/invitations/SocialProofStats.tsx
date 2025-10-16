'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

interface CelebrationStats {
  confirmed_guests: number;
  selected_gifts: number;
  uploaded_photos: number;
  posted_messages: number;
}

interface ActivityItem {
  id: string;
  type: 'rsvp' | 'gift' | 'photo' | 'message';
  guest_name: string; // First name only for privacy
  description: string;
  created_at: Date;
}

interface SocialProofStatsProps {
  stats: CelebrationStats;
  recentActivity: ActivityItem[];
}

const STAT_CONFIG = [
  {
    key: 'confirmed_guests' as keyof CelebrationStats,
    emoji: '👥',
    label: 'Convidados\nConfirmados',
    ariaLabel: 'Convidados confirmados',
  },
  {
    key: 'selected_gifts' as keyof CelebrationStats,
    emoji: '🎁',
    label: 'Presentes\nEscolhidos',
    ariaLabel: 'Presentes escolhidos',
  },
  {
    key: 'uploaded_photos' as keyof CelebrationStats,
    emoji: '📸',
    label: 'Fotos\nCompartilhadas',
    ariaLabel: 'Fotos compartilhadas',
  },
  {
    key: 'posted_messages' as keyof CelebrationStats,
    emoji: '💬',
    label: 'Mensagens\nEnviadas',
    ariaLabel: 'Mensagens enviadas',
  },
];

const ACTIVITY_ICONS: Record<ActivityItem['type'], string> = {
  rsvp: '✅',
  gift: '🎁',
  photo: '📸',
  message: '💬',
};

function CountUpNumber({
  value,
  duration = 1000,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    // Skip animation if reduced motion is preferred
    if (shouldReduceMotion) {
      setCount(value);
      return;
    }

    const startTime = Date.now();
    const endTime = startTime + duration;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) ** 2; // Ease out quadratic
      setCount(Math.floor(easeOutQuad * value));

      if (now < endTime) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animate();
  }, [isInView, value, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
    </span>
  );
}

function StatCard({
  emoji,
  value,
  label,
  ariaLabel,
  index,
}: {
  emoji: string;
  value: number;
  label: string;
  ariaLabel: string;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="
        bg-white rounded-lg shadow-md p-6
        flex flex-col items-center justify-center
        text-center
        hover:shadow-lg transition-shadow duration-200
      "
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      role="article"
      aria-label={ariaLabel}
    >
      <span className="text-5xl mb-3" role="img" aria-label={ariaLabel}>
        {emoji}
      </span>
      <div
        className="font-playfair text-4xl md:text-5xl font-bold text-primary-text mb-2"
        aria-live="polite"
      >
        <CountUpNumber value={value} />
      </div>
      <p className="font-crimson text-sm md:text-base text-secondary-text whitespace-pre-line">
        {label}
      </p>
    </motion.div>
  );
}

function ActivityFeedItem({
  activity,
  index,
}: {
  activity: ActivityItem;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  // Safely handle date formatting
  let timeAgo = 'há pouco tempo';
  try {
    const date = new Date(activity.created_at);
    if (!isNaN(date.getTime())) {
      timeAgo = formatDistanceToNow(date, {
        addSuffix: true,
        locale: ptBR,
      });
    }
  } catch (error) {
    console.warn('Invalid date for activity:', activity.id, error);
  }

  return (
    <motion.div
      className="
        bg-white rounded-md p-4 shadow-sm
        flex items-start gap-3
        hover:shadow-md transition-shadow duration-200
      "
      initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
        {ACTIVITY_ICONS[activity.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-crimson text-base text-secondary-text">
          <span className="font-semibold text-primary-text">
            {activity.guest_name}
          </span>{' '}
          {activity.description}
        </p>
        <p className="font-crimson text-sm text-decorative mt-1">{timeAgo}</p>
      </div>
    </motion.div>
  );
}

export default function SocialProofStats({
  stats,
  recentActivity,
}: SocialProofStatsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="w-full max-w-6xl mx-auto px-4 py-12"
      aria-labelledby="social-proof-title"
    >
      {/* Section Header */}
      <motion.div
        className="text-center mb-8"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          id="social-proof-title"
          className="font-playfair text-3xl md:text-4xl font-bold text-primary-text mb-2"
        >
          🎊 A Celebração Já Começou!
        </h2>
        <p className="font-crimson text-base md:text-lg text-secondary-text italic">
          Junte-se aos outros convidados na preparação
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        role="list"
      >
        {STAT_CONFIG.map((config, index) => (
          <StatCard
            key={config.key}
            emoji={config.emoji}
            value={stats[config.key]}
            label={config.label}
            ariaLabel={config.ariaLabel}
            index={index}
          />
        ))}
      </div>

      {/* Divider */}
      <motion.div
        className="border-t-2 border-dotted border-decorative/30 mb-8"
        initial={shouldReduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      />

      {/* Recent Activity Feed */}
      <div>
        <motion.h3
          className="font-playfair text-2xl font-bold text-primary-text mb-6 flex items-center gap-2"
          initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <span className="text-2xl" role="img" aria-label="Últimas atividades">
            🌟
          </span>
          <span>Últimas Atividades</span>
        </motion.h3>

        {recentActivity.length > 0 ? (
          <div className="space-y-3 mb-6" role="list" aria-label="Atividades recentes">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <ActivityFeedItem
                key={activity.id}
                activity={activity}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="bg-accent/50 rounded-lg p-8 text-center"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <p className="font-crimson text-lg text-secondary-text italic">
              🎉 Seja o primeiro a participar!
            </p>
            <p className="font-crimson text-base text-decorative mt-2">
              Suas ações aparecerão aqui para inspirar outros convidados
            </p>
          </motion.div>
        )}

        {/* View All Link */}
        {recentActivity.length > 5 && (
          <motion.div
            className="text-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <Link
              href="/mensagens"
              className="
                inline-flex items-center gap-2
                font-crimson text-base text-secondary-text
                hover:text-primary-text transition-colors
                underline underline-offset-2
                focus:outline-none focus:ring-2 focus:ring-primary-text focus:ring-offset-2 rounded
              "
            >
              <span>Ver Todas Atividades</span>
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
