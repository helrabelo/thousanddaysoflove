'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  CheckCircle2,
  Gift,
  Camera,
  MessageSquare,
  UserCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import type { GuestProgress } from '@/types/wedding';

interface GuestProgressTrackerProps {
  progress: GuestProgress;
  guestName: string;
}

interface ContextualMessage {
  title: string;
  emoji: string;
  message: string;
  nextAction?: {
    label: string;
    href: string;
    description: string;
  };
}

function getContextualMessage(
  percentage: number,
  progress: GuestProgress,
  guestName: string
): ContextualMessage {
  // 0% Complete (Nothing Done)
  if (percentage === 0) {
    return {
      title: `Seu Progresso: ${percentage}%`,
      emoji: '🎯',
      message: 'Primeira Ação Sugerida:',
      nextAction: {
        label: 'Confirmar Presença',
        href: '/rsvp',
        description: 'Confirme sua presença e ganhe 25% de progresso!',
      },
    };
  }

  // 25% Complete (RSVP Done)
  if (percentage === 25 || (progress.rsvp_completed && percentage < 50)) {
    return {
      title: `Seu Progresso: ${percentage}%`,
      emoji: '🎊',
      message: 'Ótimo começo!',
      nextAction: {
        label: 'Ver Presentes',
        href: '/presentes',
        description: 'Próximo passo: Escolha um presente da nossa lista',
      },
    };
  }

  // 50% Complete (RSVP + Gift)
  if (percentage === 50 || (progress.rsvp_completed && progress.gift_selected && percentage < 75)) {
    return {
      title: `Seu Progresso: ${percentage}%`,
      emoji: '🌟',
      message: 'Você está na metade!',
      nextAction: {
        label: 'Upload de Fotos',
        href: '/dia-1000/upload',
        description: 'Próximo passo: Compartilhe fotos ou vídeos',
      },
    };
  }

  // 75% Complete (RSVP + Gift + Photos)
  if (percentage === 75 || (progress.rsvp_completed && progress.gift_selected && progress.photos_uploaded && percentage < 100)) {
    return {
      title: `Seu Progresso: ${percentage}%`,
      emoji: '💕',
      message: 'Quase lá!',
      nextAction: {
        label: 'Escrever Mensagem',
        href: '/mensagens',
        description: 'Última ação: Deixe uma mensagem especial',
      },
    };
  }

  // 100% Complete (All Done)
  return {
    title: `Parabéns, ${guestName}!`,
    emoji: '🎉',
    message: 'Você completou tudo!',
  };
}

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
    color: 'from-gray-500 to-gray-500',
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
    color: 'from-gray-500 to-indigo-500',
    comingSoon: true,
  },
];

export default function GuestProgressTracker({
  progress,
  guestName,
}: GuestProgressTrackerProps) {
  const { completion_percentage, completed_count, total_count } = progress;
  const shouldReduceMotion = useReducedMotion();

  // Get contextual message based on completion
  const contextualMsg = getContextualMessage(
    completion_percentage,
    progress,
    guestName
  );

  return (
    <div className="space-y-8">
      {/* Header with circular progress and contextual messaging */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Circular Progress */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative"
        >
          {/* Confetti animation at 100% */}
          {completion_percentage === 100 && !shouldReduceMotion && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 0.6, times: [0, 0.6, 1] }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Sparkles
                className="w-40 h-40 text-yellow-400 animate-pulse"
                style={{ filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))' }}
              />
            </motion.div>
          )}

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
              stroke={
                completion_percentage === 100
                  ? 'var(--success)'
                  : 'var(--decorative)'
              }
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

        {/* Contextual Messaging */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center lg:text-left"
        >
          <h3
            className="text-xl font-semibold mb-2"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: 'var(--primary-text)',
            }}
          >
            {contextualMsg.title}
          </h3>
          <p
            className="text-lg mb-1"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontStyle: 'italic',
              color: 'var(--secondary-text)',
            }}
          >
            {contextualMsg.message} {contextualMsg.emoji}
          </p>

          {/* Next Action (if not 100%) */}
          {contextualMsg.nextAction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.2 }}
              className="mt-4"
            >
              <p
                className="text-sm font-medium mb-2"
                style={{
                  color: 'var(--decorative)',
                  fontFamily: 'var(--font-crimson)',
                }}
              >
                🎯 Próximo Passo:
              </p>
              <p
                className="text-sm mb-3"
                style={{ color: 'var(--secondary-text)' }}
              >
                {contextualMsg.nextAction.description}
              </p>
              <Link
                href={contextualMsg.nextAction.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 hover:shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, var(--decorative), var(--secondary-text))',
                  color: 'var(--white-soft)',
                }}
              >
                {contextualMsg.nextAction.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          {/* 100% Completion Message */}
          {completion_percentage === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.2 }}
              className="mt-4 p-4 rounded-xl"
              style={{
                background: 'var(--accent)',
                border: '1px solid var(--decorative)',
              }}
            >
              <p
                className="text-sm font-bold mb-2"
                style={{ color: 'var(--success)' }}
              >
                ✅ Você é um convidado 5 estrelas!
              </p>
              <p
                className="text-sm mb-2"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontStyle: 'italic',
                  color: 'var(--secondary-text)',
                }}
              >
                No dia 20 de novembro, volte para acompanhar a celebração ao
                vivo e ver suas fotos na galeria!
              </p>
              <Link
                href="/convite"
                className="inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: 'var(--decorative)' }}
              >
                Compartilhar Convite
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          )}
        </motion.div>
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
                      <Icon
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

    </div>
  );
}
