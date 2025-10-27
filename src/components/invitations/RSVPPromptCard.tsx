'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Invitation } from '@/types/wedding';
import {
  getRSVPDismissed,
  setRSVPDismissed,
  clearRSVPDismissed,
  getRSVPStatus,
} from '@/lib/utils/rsvp-cookies';
import RSVPQuickForm from './RSVPQuickForm';

interface RSVPPromptCardProps {
  invitation: Invitation;
}

export default function RSVPPromptCard({ invitation }: RSVPPromptCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check cookie state on mount
  // IMPORTANT: Always prioritize database state over cookies
  useEffect(() => {
    const dismissed = getRSVPDismissed(invitation.code);

    setIsDismissed(dismissed);

    // Database state is the source of truth
    if (invitation.rsvp_completed) {
      setIsConfirmed(true);
      setAttending(invitation.attending ?? null);
    } else {
      // Only use cookies as fallback if database has no RSVP yet
      const status = getRSVPStatus(invitation.code);
      if (status === 'confirmed' || status === 'declined') {
        setIsConfirmed(true);
        setAttending(status === 'confirmed');
      }
    }
  }, [invitation]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setRSVPDismissed(invitation.code);
  };

  const handleReopen = () => {
    setIsDismissed(false);
    setIsExpanded(true);
    clearRSVPDismissed(invitation.code);
  };

  const handleSuccess = (didAttend: boolean) => {
    setIsConfirmed(true);
    setAttending(didAttend);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  // Don't show if dismissed (show collapsed reminder later)
  if (isDismissed && !isConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 text-center">
          <p className="font-crimson text-amber-900 mb-2">
            📋 Não se esqueça de confirmar sua presença!
          </p>
          <button
            onClick={handleReopen}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-crimson text-sm"
          >
            Confirmar agora
          </button>
        </div>
      </motion.div>
    );
  }

  // Show confirmation state
  if (isConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div
          className={`rounded-2xl p-6 md:p-8 shadow-lg border-2 ${
            attending
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-gray-50 border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{attending ? '✅' : '📝'}</span>
                <h3 className="font-playfair text-2xl text-[#2C2C2C]">
                  {attending ? 'Confirmação recebida!' : 'Resposta recebida'}
                </h3>
              </div>
              <p className="font-crimson text-lg text-[#4A4A4A]">
                {attending
                  ? 'Obrigado por confirmar! Estamos ansiosos para celebrar com você.'
                  : 'Obrigado por nos informar. Sentiremos sua falta.'}
              </p>
            </div>

            {/* Edit button */}
            <button
              onClick={() => {
                setIsConfirmed(false);
                setIsExpanded(true);
                clearRSVPDismissed(invitation.code);
              }}
              className="ml-4 px-4 py-2 text-sm font-crimson text-[#4A4A4A] hover:text-[#2C2C2C] underline"
            >
              Editar resposta
            </button>
          </div>

          {/* Show additional info if available */}
          {attending && invitation.plus_one_name && (
            <div className="mt-4 pt-4 border-t border-emerald-200">
              <p className="font-crimson text-sm text-emerald-800">
                <strong>Acompanhante:</strong> {invitation.plus_one_name}
              </p>
            </div>
          )}
          {attending && invitation.dietary_restrictions && (
            <div className="mt-2">
              <p className="font-crimson text-sm text-emerald-800">
                <strong>Restrições alimentares:</strong>{' '}
                {invitation.dietary_restrictions}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Show RSVP form
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border-2 border-[#E8E6E3] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4A7C59] to-[#5A8C69] px-6 md:px-8 py-6 relative">
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white !w-fit"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-playfair text-2xl md:text-3xl text-white mb-2">
                Confirme sua presença
              </h2>
              <p className="font-crimson text-lg text-white/90">
                Mal podemos esperar para celebrar este momento especial com você!
              </p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border-b-2 border-red-200 px-6 md:px-8 py-4"
                >
                  <p className="font-crimson text-red-800 flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <div className="px-6 md:px-8 py-8">
              <RSVPQuickForm
                invitation={invitation}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed State */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-md border border-[#E8E6E3] p-4"
          >
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-playfair text-lg text-[#2C2C2C]">
                    Confirmar presença
                  </p>
                  <p className="font-crimson text-sm text-[#4A4A4A]">
                    Clique para responder
                  </p>
                </div>
              </div>
              <svg
                className="w-6 h-6 text-[#4A4A4A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
