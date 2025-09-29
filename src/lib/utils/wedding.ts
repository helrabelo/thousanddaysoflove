import { differenceInDays, differenceInHours, differenceInMinutes, addDays, subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const WEDDING_DATE = new Date('2025-11-20T10:30:00');

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

// Special milestone messages for countdown romance
export function getCountdownMessage(days: number): string {
  if (days === 0) return "Hoje é o grande dia! ✨"
  if (days === 1) return "Amanhã nos casamos! 💕"
  if (days <= 7) return "Uma semana de amor pela frente!"
  if (days <= 30) return "O mês mais especial das nossas vidas!"
  if (days === 365) return "Exatamente um ano para o sim!"
  if (days === 1000) return "Mil dias até o para sempre!"
  if (days >= 500 && days <= 600) return "Quinhentos dias de preparação para a eternidade"
  return "Contando os dias até o para sempre..."
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('55')) {
    const brazilianNumber = cleaned.slice(2);
    return `+55 (${brazilianNumber.slice(0, 2)}) ${brazilianNumber.slice(2, 7)}-${brazilianNumber.slice(7)}`;
  }
  return phone;
}

export function formatWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  // Add Brazil country code if not present
  if (!cleaned.startsWith('55') && cleaned.length === 11) {
    return `55${cleaned}`;
  }

  return cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
}

export function isValidWhatsAppNumber(phone: string): boolean {
  const whatsappNumber = formatWhatsAppNumber(phone);
  // Brazilian WhatsApp numbers: 55 + area code (2 digits) + 9 + 8 digits
  return /^55[1-9]{2}9\d{8}$/.test(whatsappNumber);
}

export function generateInvitationCode(prefix: string = 'HY25'): string {
  // Generate Brazilian wedding format: HY25-XXXX (HY = Hel & Ylana, 2025 = year)
  const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${randomSuffix}`;
}

export function generateFamilyInvitationCode(familyName: string): string {
  // Generate family code: HY25-FAM-XXXX
  const cleanFamilyName = familyName.replace(/[^a-zA-Z]/g, '').substr(0, 3).toUpperCase();
  const randomSuffix = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `HY25-${cleanFamilyName}-${randomSuffix}`;
}

export function generateBulkInvitationCodes(count: number, prefix: string = 'HY25'): string[] {
  const codes = new Set<string>();

  while (codes.size < count) {
    codes.add(generateInvitationCode(prefix));
  }

  return Array.from(codes);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateBrazilianPhone(phone: string): boolean {
  if (!phone) return true; // Phone is optional

  // Brazilian phone formats:
  // +55 (11) 99999-9999
  // +55 11 99999-9999
  // (11) 99999-9999
  // 11 99999-9999
  const brazilianPhoneRegex = /^(\+55\s?)?\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/;
  return brazilianPhoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateCPF(cpf: string): boolean {
  if (!cpf) return true; // CPF is optional

  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, '');

  // Check if CPF has 11 digits
  if (cleanCPF.length !== 11) return false;

  // Check for known invalid CPFs (all same digits)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // CPF validation algorithm
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }

  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
}

export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatBrazilianCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
}

export function formatBrazilianDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
}

export function formatBrazilianDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

// QR Code utilities for mobile-first Brazilian experience
export function generateQRCodeData(invitationCode: string, baseUrl: string = 'https://thousandaysof.love'): string {
  return `${baseUrl}/rsvp?code=${invitationCode}`;
}

export function generateWhatsAppShareURL(invitationCode: string, guestName: string, baseUrl: string = 'https://thousandaysof.love'): string {
  const rsvpUrl = `${baseUrl}/rsvp?code=${invitationCode}`;
  const message = encodeURIComponent(
    `🎉 Convite para o Casamento de Hel & Ylana\n\n` +
    `Olá ${guestName}! Você está convidado(a) para nosso casamento!\n\n` +
    `📅 Data: 20 de Novembro de 2025\n` +
    `⏰ Horário: 10:30h\n\n` +
    `Para confirmar sua presença, acesse:\n${rsvpUrl}\n\n` +
    `Código do convite: ${invitationCode}\n\n` +
    `Não vemos a hora de celebrar com você! 💕`
  );

  return `https://wa.me/?text=${message}`;
}

export function generateWeddingTimelineData() {
  const weddingDate = new Date('2025-11-20');
  const today = new Date();
  const daysToWedding = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    weddingDate,
    daysToWedding,
    isWeddingDay: daysToWedding === 0,
    hasWeddingPassed: daysToWedding < 0,
    milestones: {
      '6months': daysToWedding <= 180,
      '3months': daysToWedding <= 90,
      '1month': daysToWedding <= 30,
      '2weeks': daysToWedding <= 14,
      '1week': daysToWedding <= 7,
      'countdown': daysToWedding <= 3
    }
  };
}

// Brazilian wedding specific utilities
export function getBrazilianWeddingGreeting(timeOfDay: 'morning' | 'afternoon' | 'evening'): string {
  const greetings = {
    morning: 'Bom dia',
    afternoon: 'Boa tarde',
    evening: 'Boa noite'
  };

  return greetings[timeOfDay];
}

export function getBrazilianRelationshipTitle(relationship: string, gender: 'M' | 'F' = 'M'): string {
  const titles = {
    family: gender === 'M' ? 'Querido familiar' : 'Querida familiar',
    friend: gender === 'M' ? 'Querido amigo' : 'Querida amiga',
    work: gender === 'M' ? 'Estimado colega' : 'Estimada colega',
    school: gender === 'M' ? 'Querido amigo' : 'Querida amiga',
    other: gender === 'M' ? 'Querido convidado' : 'Querida convidada'
  };

  return titles[relationship as keyof typeof titles] || titles.other;
}