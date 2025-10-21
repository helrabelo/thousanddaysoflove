'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GuestProgress } from '@/types/wedding';
import { ALL_FEATURES } from './featureContent';
import FeatureCard from './FeatureCard';

interface FeatureDiscoveryHubProps {
  progress: GuestProgress;
  invitationCode: string;
}

/**
 * FeatureDiscoveryHub - Main container for 5 expandable feature cards
 *
 * Behavior:
 * - All cards collapsed by default
 * - Only one card expanded at a time (auto-collapse others)
 * - Responsive grid layout
 *
 * Layout:
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 3 columns
 */
export default function FeatureDiscoveryHub({
  progress,
}: FeatureDiscoveryHubProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleToggle = (key: string) => {
    setExpandedCard((current) => (current === key ? null : key));
  };

  return (
    <section className="w-full">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2
          className="text-3xl sm:text-4xl font-light mb-4"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: 'var(--primary-text)',
          }}
        >
          Descubra Tudo Que Você Pode Fazer
        </h2>
        <p
          className="text-lg max-w-2xl mx-auto"
          style={{
            fontFamily: 'var(--font-crimson)',
            fontStyle: 'italic',
            color: 'var(--secondary-text)',
          }}
        >
          Explore as funcionalidades interativas do nosso casamento
        </p>
      </motion.div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_FEATURES.map((feature) => {
          // Determine if feature is completed based on progress
          // Progress values can be boolean or number (count)
          const progressValue = progress[feature.progressKey];
          const isCompleted = typeof progressValue === 'boolean'
            ? progressValue
            : typeof progressValue === 'number' && progressValue > 0;

          return (
            <div
              key={feature.key}
              className={expandedCard === feature.key ? 'md:col-span-2 lg:col-span-3' : ''}
            >
              <FeatureCard
                feature={feature}
                isCompleted={isCompleted}
                isExpanded={expandedCard === feature.key}
                onToggle={() => handleToggle(feature.key)}
              />
            </div>
          );
        })}
      </div>

      {/* Helpful Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-8 text-center"
      >
        <p
          className="text-sm italic"
          style={{
            fontFamily: 'var(--font-crimson)',
            color: 'var(--decorative)',
          }}
        >
          Clique em "Saiba Mais" para ver detalhes completos de cada funcionalidade
        </p>
      </motion.div>
    </section>
  );
}
