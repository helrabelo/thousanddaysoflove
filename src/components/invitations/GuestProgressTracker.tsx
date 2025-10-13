'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Gift,
  Camera,
  MessageSquare,
  UserCheck,
} from 'lucide-react';
import type { GuestProgress } from '@/types/wedding';

interface GuestProgressTrackerProps {
  progress: GuestProgress;
  guestName: string;
}

const PROGRESS_ITEMS = [
  {
    key: 'rsvp_completed' as keyof GuestProgress,
    icon: UserCheck,
    title: 'Confirmou Presença',
    description: 'Complete seu RSVP',
    color: 'from-green-500 to-emerald-500',
  },
  {
    key: 'gift_selected' as keyof GuestProgress,
    icon: Gift,
    title: 'Escolheu Presente',
    description: 'Selecione um presente',
    color: 'from-rose-500 to-pink-500',
  },
  {
    key: 'photos_uploaded' as keyof GuestProgress,
    icon: Camera,
    title: 'Enviou Fotos',
    description: 'Compartilhe suas fotos',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    key: 'messages_sent' as keyof GuestProgress,
    icon: MessageSquare,
    title: 'Enviou Mensagem',
    description: 'Deixe uma mensagem (em breve)',
    color: 'from-purple-500 to-indigo-500',
    comingSoon: true,
  },
];

export default function GuestProgressTracker({
  progress,
  guestName,
}: GuestProgressTrackerProps) {
  const { completion_percentage, completed_count, total_count } = progress;

  return (
    <div className="space-y-6">
      {/* Header with circular progress */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative inline-block"
        >
          {/* Circular progress background */}
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="var(--accent)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="var(--decorative)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 352' }}
              animate={{
                strokeDasharray: `${(completion_percentage / 100) * 352} 352`,
              }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>

          {/* Percentage text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center"
            >
              <p
                className="text-3xl font-bold"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                }}
              >
                {completion_percentage}%
              </p>
              <p
                className="text-xs opacity-70"
                style={{ color: 'var(--secondary-text)' }}
              >
                {completed_count}/{total_count}
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-4 text-lg"
          style={{
            fontFamily: 'var(--font-crimson)',
            fontStyle: 'italic',
            color: 'var(--secondary-text)',
          }}
        >
          {completion_percentage === 100
            ? `Parabéns, ${guestName}! Você completou tudo! 🎉`
            : `Continue explorando, ${guestName}!`}
        </motion.p>
      </div>

      {/* Progress items grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {PROGRESS_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isCompleted = progress[item.key] as boolean;

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="relative"
            >
              <div
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-white/90 backdrop-blur-sm border-green-200 shadow-lg'
                    : 'bg-white/50 backdrop-blur-sm border-gray-200'
                } ${item.comingSoon ? 'opacity-60' : ''}`}
              >
                {/* Coming soon badge */}
                {item.comingSoon && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Em breve
                  </div>
                )}

                <div className="flex items-start gap-3">
                  {/* Icon with gradient background */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? `bg-gradient-to-br ${item.color}`
                        : 'bg-gray-100'
                    }`}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          delay: 0.5 + index * 0.1,
                        }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </motion.div>
                    ) : (
                      <Circle
                        className="w-6 h-6"
                        style={{ color: 'var(--decorative)' }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-semibold mb-1 ${
                        isCompleted ? 'line-through' : ''
                      }`}
                      style={{
                        color: isCompleted
                          ? 'var(--secondary-text)'
                          : 'var(--primary-text)',
                        fontFamily: 'var(--font-playfair)',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--secondary-text)' }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Completion checkmark animation */}
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      delay: 0.6 + index * 0.1,
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Motivational message */}
      {completion_percentage < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-center p-4 rounded-xl"
          style={{
            background: 'var(--accent)',
            border: '1px solid var(--decorative)',
          }}
        >
          <p
            className="text-sm"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontStyle: 'italic',
              color: 'var(--secondary-text)',
            }}
          >
            {completion_percentage === 0 &&
              'Comece confirmando sua presença! ✨'}
            {completion_percentage > 0 &&
              completion_percentage < 50 &&
              'Você está progredindo! Continue assim! 🎊'}
            {completion_percentage >= 50 &&
              completion_percentage < 100 &&
              'Quase lá! Falta pouco para completar tudo! 🌟'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
