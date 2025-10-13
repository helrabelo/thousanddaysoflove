'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import type { GuestProgress } from '@/types/wedding';

interface ProgressTrackerProps {
  progress: GuestProgress;
}

export default function ProgressTracker({ progress }: ProgressTrackerProps) {
  const { completion_percentage, completed_count, total_count } = progress;

  // Get motivational message based on progress
  const getMessage = () => {
    if (completion_percentage === 100) return '🎉 Tudo pronto para o grande dia!';
    if (completion_percentage >= 75) return 'Incrível! Falta só um detalhe';
    if (completion_percentage >= 50) return 'Quase lá! Só faltam alguns passos';
    if (completion_percentage >= 25) return 'Ótimo progresso! Continue assim';
    return 'Vamos começar! Complete seu RSVP';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
      {/* Circular Progress */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative inline-block mb-4"
      >
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="#E8E6E3"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle with gradient */}
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 352' }}
            animate={{
              strokeDasharray: `${(completion_percentage / 100) * 352} 352`,
            }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Percentage text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-4xl font-playfair font-bold text-[#2C2C2C]">
              {completion_percentage}%
            </p>
            <p className="text-xs text-[#4A4A4A]">
              {completed_count}/{total_count}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Motivational message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="font-crimson text-base text-[#4A4A4A] italic"
      >
        {getMessage()}
      </motion.p>

      {/* Progress items */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-6 space-y-2"
      >
        <ProgressItem
          label="RSVP Confirmado"
          completed={progress.rsvp_completed}
          delay={1.0}
        />
        <ProgressItem
          label="Presente Selecionado"
          completed={progress.gift_selected}
          delay={1.1}
        />
        <ProgressItem
          label="Fotos Enviadas"
          completed={progress.photos_uploaded}
          delay={1.2}
        />
        <ProgressItem
          label="Mensagem Compartilhada"
          completed={progress.messages_sent}
          delay={1.3}
        />
      </motion.div>
    </div>
  );
}

interface ProgressItemProps {
  label: string;
  completed: boolean;
  delay: number;
}

function ProgressItem({ label, completed, delay }: ProgressItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-2"
    >
      {completed ? (
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
      ) : (
        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
      )}
      <span
        className={`text-sm font-crimson ${
          completed
            ? 'text-[#2C2C2C] line-through'
            : 'text-[#4A4A4A]'
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}
