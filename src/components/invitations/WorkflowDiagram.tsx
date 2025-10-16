'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { WorkflowStep } from './featureContent';

interface WorkflowDiagramProps {
  steps: WorkflowStep[];
  layout?: 'horizontal' | 'vertical' | 'auto';
  showTip?: boolean;
  tip?: string;
}

/**
 * WorkflowDiagram - Visual 4-step workflow component
 * Shows how guest contributions flow through the system
 *
 * Layouts:
 * - Desktop: Horizontal with arrows between steps
 * - Mobile: Vertical with downward arrows
 * - Auto: Responsive (horizontal on lg+, vertical on mobile)
 */
export default function WorkflowDiagram({
  steps,
  layout = 'auto',
  showTip = true,
  tip = 'Escolha a fase (antes/durante/depois) para organizar suas memórias!',
}: WorkflowDiagramProps) {
  const shouldReduceMotion = useReducedMotion();

  // Determine layout based on screen size if 'auto'
  const isHorizontal = layout === 'horizontal' || (layout === 'auto');
  const isVertical = layout === 'vertical';

  return (
    <div className="w-full">
      {/* Title */}
      <h4
        className="text-center text-sm uppercase tracking-wider mb-6"
        style={{
          color: 'var(--decorative)',
          fontFamily: 'var(--font-crimson)',
        }}
      >
        Como suas fotos chegam à galeria
      </h4>

      {/* Desktop: Horizontal Layout */}
      <div className={`hidden lg:block ${isVertical ? '!hidden' : ''}`}>
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.4,
                ease: 'easeOut',
              }}
              className="flex items-center"
            >
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-shrink-0">
                <motion.div
                  initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
                  animate={{ scale: [0, 1.1, 1] }}
                  transition={{
                    delay: index * 0.1 + 0.1,
                    duration: 0.5,
                    times: [0, 0.6, 1],
                  }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: `linear-gradient(135deg, var(--accent), var(--decorative))`,
                  }}
                >
                  <span className="text-3xl">{step.icon}</span>
                </motion.div>

                {/* Step Number & Title */}
                <div className="text-center mb-1">
                  <span className="text-xl">{step.number}️⃣</span>
                  <p
                    className="text-sm font-bold mt-1"
                    style={{
                      color: 'var(--primary-text)',
                      fontFamily: 'var(--font-playfair)',
                    }}
                  >
                    {step.title}
                  </p>
                </div>

                {/* Description */}
                <p
                  className="text-xs max-w-[100px] text-center"
                  style={{
                    color: 'var(--secondary-text)',
                    fontFamily: 'var(--font-crimson)',
                  }}
                >
                  {step.description}
                </p>
                {step.timing && (
                  <p
                    className="text-xs italic mt-1"
                    style={{ color: 'var(--decorative)' }}
                  >
                    {step.timing}
                  </p>
                )}
              </div>

              {/* Arrow (except after last step) */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  className="flex items-center mx-2 mb-12"
                >
                  <svg
                    className="w-8 h-8"
                    style={{ color: 'var(--decorative)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical Layout */}
      <div className={`lg:hidden ${isHorizontal && layout !== 'auto' ? '!hidden' : ''}`}>
        <div className="flex flex-col items-center space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.4,
                ease: 'easeOut',
              }}
              className="flex flex-col items-center w-full max-w-xs"
            >
              {/* Step Circle */}
              <motion.div
                initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
                animate={{ scale: [0, 1.1, 1] }}
                transition={{
                  delay: index * 0.1 + 0.1,
                  duration: 0.5,
                  times: [0, 0.6, 1],
                }}
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: `linear-gradient(135deg, var(--accent), var(--decorative))`,
                }}
              >
                <span className="text-2xl">{step.icon}</span>
              </motion.div>

              {/* Step Number & Title */}
              <div className="text-center mb-1">
                <span className="text-lg">{step.number}️⃣</span>
                <p
                  className="text-sm font-bold mt-1"
                  style={{
                    color: 'var(--primary-text)',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  {step.title}
                </p>
              </div>

              {/* Description */}
              <p
                className="text-xs text-center"
                style={{
                  color: 'var(--secondary-text)',
                  fontFamily: 'var(--font-crimson)',
                }}
              >
                {step.description}
              </p>
              {step.timing && (
                <p
                  className="text-xs italic mt-1"
                  style={{ color: 'var(--decorative)' }}
                >
                  {step.timing}
                </p>
              )}

              {/* Downward Arrow (except after last step) */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  className="my-3"
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: 'var(--decorative)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tip Card */}
      {showTip && tip && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: steps.length * 0.1 + 0.2, duration: 0.4 }}
          className="mt-6 p-4 rounded-lg"
          style={{
            background: 'var(--accent)',
            border: '1px solid var(--decorative)',
          }}
        >
          <p
            className="text-sm italic text-center"
            style={{
              color: 'var(--secondary-text)',
              fontFamily: 'var(--font-crimson)',
            }}
          >
            💡 {tip}
          </p>
        </motion.div>
      )}
    </div>
  );
}
