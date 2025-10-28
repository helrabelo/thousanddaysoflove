/**
 * Invitation Helper Utilities
 *
 * Helper functions for personalized invitation page including:
 * - Guest name formatting
 * - Relationship type labels
 * - Wedding countdown calculations
 * - Guest progress tracking
 */

import { Invitation } from '@/types/wedding';

// ============================================================================
// Wedding Date Configuration
// ============================================================================

export const WEDDING_DATE = new Date('2025-11-20T11:30:00-03:00'); // November 20, 2025, 11:30 AM BRT

/**
 * Calculate days remaining until wedding
 * Returns 0 if wedding day has passed
 */
export function getDaysUntilWedding(): number {
  const now = new Date();
  const diffTime = WEDDING_DATE.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Check if today is the wedding day
 */
export function isWeddingDay(): boolean {
  const now = new Date();
  const weddingDay = new Date(WEDDING_DATE);

  return (
    now.getFullYear() === weddingDay.getFullYear() &&
    now.getMonth() === weddingDay.getMonth() &&
    now.getDate() === weddingDay.getDate()
  );
}

/**
 * Check if wedding has already happened
 */
export function hasWeddingPassed(): boolean {
  const now = new Date();
  return now > WEDDING_DATE;
}

/**
 * Format wedding date for display
 * Returns: "20 de Novembro de 2025"
 */
export function getFormattedWeddingDate(): string {
  return WEDDING_DATE.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ============================================================================
// Guest Name Formatting
// ============================================================================

/**
 * Format guest name for personalized greeting
 * Returns first name + last name, or full name if only one word
 */
export function formatGuestName(fullName: string): string {
  const nameParts = fullName.trim().split(' ');

  if (nameParts.length === 1) {
    return nameParts[0]; // Single name (e.g., "Maria")
  }

  // Return first + last name (e.g., "João Silva")
  return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
}

/**
 * Get first name only
 */
export function getFirstName(fullName: string): string {
  return fullName.trim().split(' ')[0];
}

// ============================================================================
// Relationship Type Labels
// ============================================================================

export type RelationshipType = 'family' | 'friend' | 'colleague' | 'other';

/**
 * Get Portuguese label for relationship type
 */
export function getRelationshipLabel(type: RelationshipType): string {
  const labels: Record<RelationshipType, string> = {
    family: 'Família',
    friend: 'Amigo',
    colleague: 'Colega',
    other: 'Convidado',
  };

  return labels[type] || labels.other;
}

/**
 * Get relationship emoji
 */
export function getRelationshipEmoji(type: RelationshipType): string {
  const emojis: Record<RelationshipType, string> = {
    family: '👨‍👩‍👧‍👦',
    friend: '🤝',
    colleague: '💼',
    other: '🎉',
  };

  return emojis[type] || emojis.other;
}

/**
 * Get relationship color class for badges
 */
export function getRelationshipColorClass(type: RelationshipType): string {
  const colors: Record<RelationshipType, string> = {
    family: 'bg-gray-100 text-gray-800 border-gray-300',
    friend: 'bg-gray-200 text-gray-800 border-gray-400',
    colleague: 'bg-gray-100 text-gray-700 border-gray-300',
    other: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return colors[type] || colors.other;
}

// ============================================================================
// Personalized Invitation Text
// ============================================================================

/**
 * Generate personalized invitation title
 * Example:
 * - "João Silva, você está convidado!"
 */
export function getInvitationTitle(
  guestName: string
): string {
  const formattedName = formatGuestName(guestName);
  return `${formattedName}, você está convidado!`;
}

/**
 * Generate personalized welcome message
 */
export function getWelcomeMessage(
  guestName: string,
  relationshipType: RelationshipType
): string {
  const firstName = getFirstName(guestName);

  const messages: Record<RelationshipType, string> = {
    family: `${firstName}, é uma honra compartilhar este momento especial com nossa família!`,
    friend: `${firstName}, sua amizade tornou nossa jornada ainda mais especial. Não pode faltar!`,
    colleague: `${firstName}, será um prazer celebrar este momento com você!`,
    other: `${firstName}, sua presença tornará nosso dia ainda mais especial!`,
  };

  return messages[relationshipType] || messages.other;
}

// ============================================================================
// Guest Progress Tracking
// ============================================================================

export interface GuestProgress {
  rsvpConfirmed: boolean;
  giftSelected: boolean;
  photoUploaded: boolean;
  messagePosted: boolean;
  completionPercentage: number;
}

/**
 * Calculate guest completion progress
 * Returns percentage based on completed actions
 */
export function calculateGuestProgress(
  invitation: Invitation,
  additionalData?: {
    hasSelectedGift?: boolean;
    hasUploadedPhoto?: boolean;
    hasPostedMessage?: boolean;
  }
): GuestProgress {
  const rsvpConfirmed = invitation.rsvp_confirmed || false;
  const giftSelected = additionalData?.hasSelectedGift || false;
  const photoUploaded = additionalData?.hasUploadedPhoto || false;
  const messagePosted = additionalData?.hasPostedMessage || false;

  // Calculate completion (4 total actions)
  const completed = [rsvpConfirmed, giftSelected, photoUploaded, messagePosted].filter(
    Boolean
  ).length;
  const completionPercentage = Math.round((completed / 4) * 100);

  return {
    rsvpConfirmed,
    giftSelected,
    photoUploaded,
    messagePosted,
    completionPercentage,
  };
}

/**
 * Get progress message based on completion
 */
export function getProgressMessage(completionPercentage: number): string {
  if (completionPercentage === 0) {
    return 'Vamos começar! Confirme sua presença abaixo.';
  }

  if (completionPercentage < 50) {
    return 'Ótimo começo! Continue explorando.';
  }

  if (completionPercentage < 100) {
    return 'Quase lá! Só faltam alguns passos.';
  }

  return 'Tudo pronto! Mal podemos esperar para te ver! 🎉';
}

