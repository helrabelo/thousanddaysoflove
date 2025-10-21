'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import type { FeatureCardContent } from './featureContent';
import WorkflowDiagram from './WorkflowDiagram';

interface FeatureCardProps {
  feature: FeatureCardContent;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * FeatureCard - Individual expandable feature discovery card
 *
 * States:
 * - Collapsed: Shows icon, title, tagline, 3 bullets, expand button
 * - Expanded: Shows capabilities, workflow, steps, tip, CTAs
 *
 * Features:
 * - Smooth expand/collapse animations
 * - Completion badge
 * - Keyboard accessible
 * - Responsive design
 */
export default function FeatureCard({
  feature,
  isCompleted,
  isExpanded,
  onToggle,
}: FeatureCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = feature.icon;

  // Keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
    if (e.key === 'Escape' && isExpanded) {
      onToggle();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        relative rounded-2xl overflow-hidden
        transition-all duration-200
        ${isExpanded ? 'shadow-2xl' : 'shadow-xl hover:shadow-2xl'}
      `}
      style={{
        background: 'var(--white-soft)',
        border: isExpanded ? '2px solid var(--decorative)' : '1px solid var(--card-border)',
      }}
    >
      {/* Top gradient bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, var(--decorative), var(--accent))`,
        }}
      />

      {/* Completion Badge */}
      {isCompleted && feature.completionBadge && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium"
          style={{
            background: 'var(--success)',
            color: 'var(--white-soft)',
          }}
        >
          {feature.completionBadge}
        </motion.div>
      )}

      {/* Card Content */}
      <div className="p-6">
        {/* Header (Always Visible) */}
        <div className="flex items-start gap-4 mb-4">
          {/* Icon Circle */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, var(--accent), var(--decorative))`,
            }}
          >
            <Icon className="w-7 h-7" style={{ color: 'var(--primary-text)' }} />
          </div>

          {/* Title & Tagline */}
          <div className="flex-1">
            <h3
              className="text-xl font-semibold mb-1"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
              }}
            >
              {feature.title}
            </h3>
            <p
              className="text-sm italic"
              style={{
                fontFamily: 'var(--font-crimson)',
                color: 'var(--secondary-text)',
              }}
            >
              {feature.tagline}
            </p>
          </div>
        </div>

        {/* Collapsed Content (Always Visible) */}
        <div className="space-y-2 mb-4">
          {feature.collapsedBullets.map((bullet, index) => (
            <motion.div
              key={index}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex items-start gap-2"
            >
              <span
                className="flex-shrink-0 mt-1"
                style={{ color: 'var(--decorative)' }}
              >
                •
              </span>
              <p
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--secondary-text)',
                }}
              >
                {bullet}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all hover:shadow-md"
          style={{
            background: 'var(--accent)',
            color: 'var(--primary-text)',
          }}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Recolher' : 'Saiba Mais'}
        >
          <span style={{ fontFamily: 'var(--font-crimson)' }}>
            {isExpanded ? 'Recolher' : 'Saiba Mais'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                opacity: { delay: 0.1, duration: 0.2 },
                height: { duration: 0.3, ease: 'easeInOut' },
              }}
              className="overflow-hidden"
              role="region"
              aria-label={`Detalhes sobre ${feature.title}`}
            >
              <div className="pt-6 space-y-6">
                {/* Divider */}
                <div
                  className="border-t-2 border-dotted"
                  style={{ borderColor: 'var(--decorative)' }}
                />

                {/* Capabilities */}
                <div>
                  <h4
                    className="text-xs uppercase tracking-wider mb-3"
                    style={{
                      color: 'var(--decorative)',
                      fontFamily: 'var(--font-crimson)',
                    }}
                  >
                    O QUE VOCÊ PODE FAZER:
                  </h4>
                  <div className="space-y-2">
                    {feature.expandedContent.capabilities.map((capability, index) => (
                      <motion.div
                        key={index}
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                        className="flex items-start gap-2"
                      >
                        <span
                          className="flex-shrink-0"
                          style={{ color: 'var(--success)' }}
                        >
                          ✓
                        </span>
                        <p
                          className="text-sm"
                          style={{
                            fontFamily: 'var(--font-crimson)',
                            color: 'var(--secondary-text)',
                          }}
                        >
                          {capability}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Workflow Diagram (if present) */}
                {feature.expandedContent.workflow && (
                  <>
                    <div
                      className="border-t-2 border-dotted"
                      style={{ borderColor: 'var(--decorative)' }}
                    />
                    <WorkflowDiagram
                      steps={feature.expandedContent.workflow}
                      layout="auto"
                    />
                  </>
                )}

                {/* Divider */}
                <div
                  className="border-t-2 border-dotted"
                  style={{ borderColor: 'var(--decorative)' }}
                />

                {/* Steps */}
                <div>
                  <h4
                    className="text-xs uppercase tracking-wider mb-3"
                    style={{
                      color: 'var(--decorative)',
                      fontFamily: 'var(--font-crimson)',
                    }}
                  >
                    COMO FUNCIONA:
                  </h4>
                  <ol className="space-y-2">
                    {feature.expandedContent.steps.map((step, index) => (
                      <motion.li
                        key={index}
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                        className="flex items-start gap-3"
                      >
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: 'var(--accent)',
                            color: 'var(--primary-text)',
                          }}
                        >
                          {index + 1}
                        </span>
                        <p
                          className="text-sm pt-0.5"
                          style={{
                            fontFamily: 'var(--font-crimson)',
                            color: 'var(--secondary-text)',
                          }}
                        >
                          {step}
                        </p>
                      </motion.li>
                    ))}
                  </ol>
                </div>

                {/* Divider */}
                <div
                  className="border-t-2 border-dotted"
                  style={{ borderColor: 'var(--decorative)' }}
                />

                {/* Tip */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="p-4 rounded-lg"
                  style={{
                    background: 'var(--accent)',
                    border: '1px solid var(--decorative)',
                  }}
                >
                  <p
                    className="text-sm italic"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      color: 'var(--secondary-text)',
                    }}
                  >
                    💡 {feature.expandedContent.tip}
                  </p>
                </motion.div>

                {/* Divider */}
                <div
                  className="border-t-2 border-dotted"
                  style={{ borderColor: 'var(--decorative)' }}
                />

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {feature.expandedContent.ctas.map((cta, index) => (
                    <motion.div
                      key={index}
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      className="flex-1"
                    >
                      <Link
                        href={cta.href}
                        className={`
                          block w-full text-center py-3 px-6 rounded-full font-medium
                          transition-all transform hover:scale-105 hover:shadow-lg
                          ${cta.primary ? '' : 'border-2'}
                        `}
                        style={
                          cta.primary
                            ? {
                                background: 'linear-gradient(135deg, var(--decorative), var(--secondary-text))',
                                color: 'var(--white-soft)',
                              }
                            : {
                                borderColor: 'var(--decorative)',
                                color: 'var(--primary-text)',
                                background: 'transparent',
                              }
                        }
                      >
                        {cta.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
