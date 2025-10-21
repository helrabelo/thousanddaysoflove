// @ts-nocheck: Legacy framer-motion + CMS types pending refactor
'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface TimelinePhase {
  key: 'now' | 'wedding' | 'after';
  emoji: string;
  title: string;
  dateRange: string;
  items: string[];
  tip: string;
}

interface JourneyTimelineProps {
  currentPhase?: 'now' | 'wedding' | 'after';
}

const TIMELINE_PHASES: TimelinePhase[] = [
  {
    key: 'now',
    emoji: '🎯',
    title: 'AGORA até 19 de Novembro',
    dateRange: 'Preparação para o grande dia',
    items: [
      'Confirme sua presença',
      'Escolha um presente',
      'Envie fotos de preparação',
      'Deixe mensagens antecipadas',
    ],
    tip: 'Complete seu checklist antes do casamento!',
  },
  {
    key: 'wedding',
    emoji: '🎉',
    title: 'DIA 20 DE NOVEMBRO',
    dateRange: 'Dia do Casamento',
    items: [
      'Acompanhe o feed ao vivo',
      'Veja fotos em tempo real',
      'Poste momentos da cerimônia',
      'Interaja com outros convidados',
    ],
    tip: 'Deixe seu celular carregado! 📱',
  },
  {
    key: 'after',
    emoji: '🌟',
    title: 'DEPOIS de 20 de Novembro',
    dateRange: 'Memórias da celebração',
    items: [
      'Envie fotos da celebração',
      'Compartilhe memórias',
      'Navegue pela galeria completa',
      'Reviva os melhores momentos',
    ],
    tip: 'O site continua ativo como arquivo de memórias!',
  },
];

function TimelinePhaseCard({
  phase,
  isCurrentPhase,
  isExpanded,
  onToggle,
  isMobile,
}: {
  phase: TimelinePhase;
  isCurrentPhase: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  isMobile: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`
        rounded-lg border-2 transition-colors
        ${
          isCurrentPhase
            ? 'border-decorative bg-gradient-to-br from-accent to-white'
            : 'border-accent bg-white'
        }
        ${isMobile ? 'mb-4' : ''}
      `}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Phase Header (clickable on mobile) */}
      <button
        onClick={isMobile ? onToggle : undefined}
        className={`
          w-full px-6 py-4 text-left flex items-center justify-between
          ${isMobile ? 'cursor-pointer hover:bg-accent/50' : 'cursor-default'}
          transition-colors rounded-t-lg
        `}
        aria-expanded={isMobile ? isExpanded : undefined}
        aria-controls={isMobile ? `phase-${phase.key}` : undefined}
        disabled={!isMobile}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={phase.title}>
            {phase.emoji}
          </span>
          <div>
            <h3 className="font-playfair text-lg md:text-xl font-bold text-primary-text">
              {phase.title}
            </h3>
            <p className="font-crimson text-sm text-secondary-text italic">
              {phase.dateRange}
            </p>
          </div>
        </div>

        {isMobile && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-decorative" />
          </motion.div>
        )}
      </button>

      {/* Phase Content */}
      <AnimatePresence initial={false}>
        {(!isMobile || isExpanded) && (
          <motion.div
            id={`phase-${phase.key}`}
            initial={
              shouldReduceMotion
                ? false
                : isMobile
                ? { height: 0, opacity: 0 }
                : false
            }
            animate={{ height: 'auto', opacity: 1 }}
            exit={
              shouldReduceMotion
                ? false
                : isMobile
                ? { height: 0, opacity: 0 }
                : false
            }
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              {/* Divider */}
              <div className="border-t-2 border-dotted border-decorative/30" />

              {/* Checklist Items */}
              <ul className="space-y-2">
                {phase.items.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3 font-crimson text-base text-secondary-text"
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, x: -10 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <span className="text-decorative font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Tip Card */}
              <motion.div
                className="bg-accent/50 rounded-md px-4 py-3 border border-decorative/20"
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <p className="font-crimson text-sm text-secondary-text italic flex items-start gap-2">
                  <span className="text-base">💡</span>
                  <span>{phase.tip}</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function JourneyTimeline({
  currentPhase = 'now',
}: JourneyTimelineProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
    new Set([currentPhase])
  );
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Check if mobile on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  });

  const togglePhase = (phaseKey: string) => {
    setExpandedPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phaseKey)) {
        newSet.delete(phaseKey);
      } else {
        newSet.add(phaseKey);
      }
      return newSet;
    });
  };

  return (
    <section
      className="w-full max-w-4xl mx-auto px-4 py-12"
      aria-labelledby="journey-timeline-title"
    >
      {/* Section Header */}
      <motion.div
        className="text-center mb-8"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          id="journey-timeline-title"
          className="font-playfair text-3xl md:text-4xl font-bold text-primary-text mb-2"
        >
          📅 Sua Jornada até o Dia 1000
        </h2>
        <p className="font-crimson text-base md:text-lg text-secondary-text italic">
          Saiba o que fazer em cada momento da celebração
        </p>
      </motion.div>

      {/* Timeline Phases */}
      <div className="space-y-0 md:space-y-4">
        {TIMELINE_PHASES.map((phase) => (
          <TimelinePhaseCard
            key={phase.key}
            phase={phase}
            isCurrentPhase={phase.key === currentPhase}
            isExpanded={expandedPhases.has(phase.key)}
            onToggle={() => togglePhase(phase.key)}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-8 text-center"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button
          className="
            inline-flex items-center gap-2 px-8 py-3
            bg-gradient-to-r from-decorative to-secondary-text
            text-white font-crimson text-lg font-semibold
            rounded-full shadow-lg
            hover:shadow-xl hover:scale-105
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-text focus:ring-offset-2
          "
          onClick={() => {
            // Scroll to progress tracker or RSVP section
            const progressSection = document.getElementById('guest-progress');
            if (progressSection) {
              progressSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <span>Preparado? Comece Agora!</span>
          <span className="text-xl">🚀</span>
        </button>
      </motion.div>
    </section>
  );
}
