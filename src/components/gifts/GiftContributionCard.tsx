'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  FireIcon,
  HeartIcon,
  StarIcon,
  TrophyIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import {
  getGiftContributionMessage,
  getMessageStyling,
  getMilestoneProgress,
  type GiftMessage,
} from '@/lib/utils/giftMessages';

interface GiftContributionCardProps {
  giftId: string;
  giftTitle: string;
  giftCategory?: 'honeymoon' | 'home' | 'experience' | 'technology' | 'general';
  fullPrice: number;
  totalContributed: number;
  contributorCount: number;
  onContribute: () => void;
}

/**
 * Gift Contribution Card Component
 *
 * Visual presentation of the psychology-driven messaging system.
 *
 * Design Features:
 * - No scary percentages for low progress
 * - Emphasis on community/contributors count
 * - Milestone-based progress (not percentage)
 * - Emotional gradient backgrounds
 * - Icons that match the message emotion
 * - Smooth animations on state changes
 */
export default function GiftContributionCard({
  giftId,
  giftTitle,
  giftCategory = 'general',
  fullPrice,
  totalContributed,
  contributorCount,
  onContribute,
}: GiftContributionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get the appropriate message based on contribution state
  const message = getGiftContributionMessage({
    fullPrice,
    totalContributed,
    contributorCount,
    giftTitle,
    giftCategory,
  });

  // Get styling based on emotion
  const styling = getMessageStyling(message.emotion);

  // Get milestone progress (smart alternative to percentage)
  const milestone = getMilestoneProgress(totalContributed, fullPrice);

  // Icon mapping
  const IconComponent = {
    sparkle: SparklesIcon,
    fire: FireIcon,
    heart: HeartIcon,
    star: StarIcon,
    celebrate: TrophyIcon,
  }[message.visualHint];

  const isComplete = totalContributed >= fullPrice;
  const hasContributors = contributorCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-white shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styling.gradient} opacity-40`} />

      {/* Content */}
      <div className="relative p-6 sm:p-8">
        {/* Header with icon */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`text-2xl font-serif ${styling.textColor} mb-2`}>
              {giftTitle}
            </h3>
            <p className="text-sm text-gray-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
              }).format(fullPrice)}
            </p>
          </div>

          {/* Animated icon */}
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`rounded-full bg-white/80 p-3 shadow-md ${styling.accentColor}`}
          >
            <IconComponent className="h-6 w-6" />
          </motion.div>
        </div>

        {/* Message Section */}
        <div className="mb-6 space-y-3">
          <h4 className={`text-lg font-semibold ${styling.textColor}`}>
            {message.headline}
          </h4>
          <p className="text-sm leading-relaxed text-gray-700">
            {message.subtext}
          </p>
        </div>

        {/* Progress Section (only if there are contributors) */}
        {hasContributors && !isComplete && (
          <div className="mb-6 space-y-3">
            {/* Milestone label with icon */}
            <div className="flex items-center gap-2">
              <div className={`text-${milestone.color}-600`}>
                {milestone.icon === 'sparkle' && <SparklesIcon className="h-5 w-5" />}
                {milestone.icon === 'fire' && <FireIcon className="h-5 w-5" />}
                {milestone.icon === 'heart' && <HeartIcon className="h-5 w-5" />}
                {milestone.icon === 'star' && <StarIcon className="h-5 w-5" />}
                {milestone.icon === 'celebrate' && <TrophyIcon className="h-5 w-5" />}
              </div>
              <span className={`text-sm font-medium text-${milestone.color}-700`}>
                {milestone.label}
              </span>
              {milestone.showPercentage && (
                <span className="text-sm text-gray-500">
                  ({Math.round(milestone.percentage)}%)
                </span>
              )}
            </div>

            {/* Visual progress bar (milestone-based, not percentage) */}
            <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(milestone.percentage, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${styling.buttonStyle.replace('hover:', '')}`}
              />
              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'linear',
                }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </div>

            {/* Contributors count with avatars placeholder */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UsersIcon className="h-5 w-5" />
              <span>
                {contributorCount === 1
                  ? '1 pessoa contribuiu'
                  : `${contributorCount} pessoas contribuíram`}
              </span>
            </div>
          </div>
        )}

        {/* Completion celebration */}
        {isComplete && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 p-4"
          >
            <div className="flex items-center gap-3">
              <TrophyIcon className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-900">Presente Realizado!</p>
                <p className="text-sm text-emerald-700">
                  {contributorCount} {contributorCount === 1 ? 'pessoa fez' : 'pessoas fizeram'} este sonho acontecer
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContribute}
          className={`w-full rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition-all ${styling.buttonStyle}`}
          disabled={isComplete}
        >
          {message.callToAction}
        </motion.button>

        {/* Subtle encouragement for zero contributions */}
        {contributorCount === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-center text-xs text-gray-500"
          >
            Qualquer valor faz diferença e será muito apreciado
          </motion.p>
        )}

        {/* Social proof for partial contributions */}
        {contributorCount > 0 && !isComplete && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-center text-xs text-gray-500"
          >
            Junte-se a {contributorCount} {contributorCount === 1 ? 'pessoa que já ajudou' : 'pessoas que já ajudaram'}
          </motion.p>
        )}
      </div>

      {/* Decorative corner accent (only for non-complete gifts) */}
      {!isComplete && (
        <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${styling.gradient} opacity-20 blur-2xl`} />
      )}

      {/* Completion confetti effect */}
      {isComplete && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 1 }}
              animate={{
                y: 400,
                opacity: 0,
                x: Math.sin(i) * 100,
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className={`absolute left-1/2 h-2 w-2 rounded-full ${
                i % 3 === 0 ? 'bg-emerald-400' : i % 3 === 1 ? 'bg-green-400' : 'bg-teal-400'
              }`}
              style={{ marginLeft: `${(i - 4) * 10}px` }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

/**
 * USAGE EXAMPLE:
 *
 * <GiftContributionCard
 *   giftId="honeymoon-001"
 *   giftTitle="Lua de Mel"
 *   giftCategory="honeymoon"
 *   fullPrice={50000}
 *   totalContributed={8500}
 *   contributorCount={12}
 *   onContribute={() => router.push('/presentes/honeymoon-001/contribute')}
 * />
 */
