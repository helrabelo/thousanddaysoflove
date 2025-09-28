import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export const WEDDING_DATE = new Date('2025-11-11T16:00:00');

export function getCountdown() {
  const now = new Date();
  const days = differenceInDays(WEDDING_DATE, now);
  const hours = differenceInHours(WEDDING_DATE, now) % 24;
  const minutes = differenceInMinutes(WEDDING_DATE, now) % 60;

  return {
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    isWeddingDay: days === 0 && hours < 24,
    hasWeddingPassed: WEDDING_DATE < now
  };
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('55')) {
    const brazilianNumber = cleaned.slice(2);
    return `+55 (${brazilianNumber.slice(0, 2)}) ${brazilianNumber.slice(2, 7)}-${brazilianNumber.slice(7)}`;
  }
  return phone;
}

export function generateInvitationCode(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}