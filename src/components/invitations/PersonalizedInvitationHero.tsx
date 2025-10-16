'use client';

import { motion } from 'framer-motion';
import { Invitation } from '@/types/wedding';
import {
  getDaysUntilWedding,
  getFormattedWeddingDate,
  isWeddingDay,
  hasWeddingPassed,
} from '@/lib/utils/invitation-helpers';

interface PersonalizedInvitationHeroProps {
  invitation: Invitation;
}

export default function PersonalizedInvitationHero({
  invitation,
}: PersonalizedInvitationHeroProps) {
  const daysUntil = getDaysUntilWedding();
  const weddingDate = getFormattedWeddingDate();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#F8F6F3] via-[#F8F6F3] to-[#E8E6E3]/30 px-4 py-20">
      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Couple's Monogram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1
            className="font-cormorant text-8xl md:text-9xl text-[#2C2C2C] tracking-wider"
            style={{ fontFamily: 'Cormorant, serif' }}
          >
            H <span className="text-[#A8A8A8]">&</span> Y
          </h1>
        </motion.div>

        {/* Guest Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="font-playfair text-3xl md:text-4xl text-[#2C2C2C]">
            {invitation.guest_name}
          </h2>
        </motion.div>

        {/* Standard Invitation Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-10"
        >
          <p className="font-crimson text-xl md:text-2xl text-[#4A4A4A] italic max-w-2xl mx-auto leading-relaxed">
            Celebrando 1000 dias de amor
          </p>
        </motion.div>

        {/* Decorative Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#A8A8A8]" />
          <div className="w-2 h-2 rounded-full bg-[#A8A8A8]" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#A8A8A8]" />
        </motion.div>

        {/* Wedding Date & Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-4"
        >
          {/* Wedding Date */}
          <div>
            <p className="font-crimson text-lg text-[#4A4A4A] mb-2">
              Celebre conosco em
            </p>
            <h3 className="font-playfair text-3xl md:text-4xl text-[#2C2C2C]">
              {weddingDate}
            </h3>
          </div>

          {/* Countdown */}
          {!hasWeddingPassed() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="inline-block"
            >
              {isWeddingDay() ? (
                <div className="px-8 py-4 bg-white rounded-2xl shadow-lg border-2 border-[#4A7C59]">
                  <p className="font-playfair text-2xl md:text-3xl text-[#4A7C59] font-bold">
                    🎉 Hoje é o grande dia! 🎉
                  </p>
                </div>
              ) : (
                <div className="px-8 py-4 bg-white rounded-2xl shadow-lg">
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="font-playfair text-5xl md:text-6xl text-[#2C2C2C] font-bold">
                      {daysUntil}
                    </span>
                    <span className="font-crimson text-xl text-[#4A4A4A]">
                      {daysUntil === 1 ? 'dia' : 'dias'}
                    </span>
                  </div>
                  <p className="font-crimson text-sm text-[#4A4A4A] mt-2 italic">
                    para o nosso casamento
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {hasWeddingPassed() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="inline-block px-8 py-4 bg-white rounded-2xl shadow-lg"
            >
              <p className="font-playfair text-2xl md:text-3xl text-[#2C2C2C]">
                ✨ Obrigado por celebrar conosco! ✨
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1,
          repeat: Infinity,
          repeatType: 'reverse',
          repeatDelay: 0.5,
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-[#A8A8A8]">
          <p className="font-crimson text-sm">Role para confirmar sua presença</p>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
