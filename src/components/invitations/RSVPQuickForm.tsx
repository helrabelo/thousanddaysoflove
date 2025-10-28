'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitation } from '@/types/wedding';
import { setRSVPStatus, clearRSVPDismissed } from '@/lib/utils/rsvp-cookies';

interface RSVPQuickFormProps {
  invitation: Invitation;
  onSuccess?: (attending: boolean) => void;
  onError?: (error: string) => void;
}

export default function RSVPQuickForm({
  invitation,
  onSuccess,
  onError,
}: RSVPQuickFormProps) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (attending === null) {
      onError?.('Por favor, indique se você poderá comparecer');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/invitations/submit-rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: invitation.code,
          attending,
          dietary_restrictions: attending ? dietaryRestrictions.trim() : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar confirmação');
      }

      // Update cookie
      setRSVPStatus(invitation.code, attending ? 'confirmed' : 'declined');
      clearRSVPDismissed(invitation.code);

      // Show success animation
      setShowSuccess(true);

      // Call success callback
      onSuccess?.(attending);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      onError?.(
        error instanceof Error ? error.message : 'Erro ao enviar confirmação'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success state
  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="inline-block mb-4 text-6xl"
        >
          {attending ? '🎉' : '😔'}
        </motion.div>
        <h3 className="font-playfair text-2xl text-[#2C2C2C] mb-2">
          {attending
            ? 'Confirmação recebida!'
            : 'Recebemos sua resposta'}
        </h3>
        <p className="font-crimson text-lg text-[#4A4A4A]">
          {attending
            ? 'Mal podemos esperar para celebrar com você!'
            : 'Sentiremos sua falta, mas entendemos.'}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Attending Toggle */}
      <div>
        <label className="block font-crimson text-lg text-[#2C2C2C] mb-3">
          Você poderá comparecer?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setAttending(true)}
            disabled={isSubmitting}
            className={`flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
              attending === true
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-lg scale-105'
                : 'bg-white text-[#4A4A4A] border-[#E8E6E3] hover:border-emerald-400 hover:scale-102'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-2xl mb-1">🎊</div>
            <div className="font-playfair text-lg font-medium">
              Sim, vou!
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAttending(false)}
            disabled={isSubmitting}
            className={`flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
              attending === false
                ? 'bg-gray-500 text-white border-gray-600 shadow-lg scale-105'
                : 'bg-white text-[#4A4A4A] border-[#E8E6E3] hover:border-gray-400 hover:scale-102'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-2xl mb-1">😔</div>
            <div className="font-playfair text-lg font-medium">
              Não poderei ir
            </div>
          </button>
        </div>
      </div>


      {/* Dietary Restrictions (only if attending) */}
      <AnimatePresence>
        {attending && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label
              htmlFor="dietaryRestrictions"
              className="block font-crimson text-base text-[#4A4A4A] mb-2"
            >
              Restrições alimentares (opcional)
            </label>
            <textarea
              id="dietaryRestrictions"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
              disabled={isSubmitting}
              placeholder="Ex: Vegetariano, alergia a amendoim..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border-2 border-[#E8E6E3] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 font-crimson resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || attending === null}
        className="w-full px-8 py-4 bg-gradient-to-r from-[#4A7C59] to-[#5A8C69] text-white rounded-xl font-playfair text-lg font-medium shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enviando...
          </span>
        ) : (
          'Confirmar Presença'
        )}
      </button>
    </form>
  );
}
