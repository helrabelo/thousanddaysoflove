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

// Mensagens românticas específicas baseadas na história real de Hel & Ylana
export function getCountdownMessage(days: number): string {
  // Mensagens específicas para os momentos mais importantes
  if (days === 0) return "Hoje nossos 1000 dias viram para sempre! 💒"
  if (days === 1) return "Amanhã é o grande dia na Casa HY! ✨"
  if (days <= 7) return "Uma semana para nosso sonho no altar! 🤍"
  if (days <= 14) return "Duas semanas para celebrar nossos mil dias de amor!"
  if (days <= 30) return "O mês mais especial desde Guaramiranga 💕"
  if (days <= 50) return "Finalizando os preparativos no apartamento dos sonhos 🏠"
  if (days === 100) return "100 dias para celebrar nossos 1000! 🎉"
  if (days <= 180) return "Seis meses para o dia em que seremos uma família! 👰🤵"
  if (days <= 365) return "Contando cada dia desde 'na hora já sabia que era ela'..."
  if (days === 1000) return "De volta ao início: mil dias depois, aqui estamos! 💫"

  // Referências específicas aos momentos únicos
  if (days >= 900 && days <= 950) return "Lembrando do remédio e chá que mudou tudo 🍵"
  if (days >= 800 && days <= 850) return "Como em Casa Fontana + Avatar VIP F11/F12 🎬"
  if (days >= 700 && days <= 750) return "Guaramiranga espontâneo: 'não consegui esperar' 🏔️"
  if (days >= 600 && days <= 650) return "Realizando o sonho do apartamento da faculdade 🎓"
  if (days >= 500 && days <= 550) return "Se Mangue Azul não tivesse fechado... mas o destino nos trouxe aqui 🎭"
  if (days >= 400 && days <= 450) return "Nossa família de 4 pets: Linda, Cacao, Olivia e Oliver 🐾"

  return "Mil dias de amor se preparando para a eternidade 💫"
}

// Easter egg para clique no countdown
export function getCountdownEasterEgg(): string {
  const messages = [
    "Desde aquele primeiro 'oi' no WhatsApp... 📱",
    "Do Tinder ao altar Casa HY 💕",
    "Caseiros e introvertidos que se completam 🏠",
    "Remédio e chá: momento que mudou tudo 🍵",
    "'Na hora já sabia que era ela' ✨",
    "Linda (👑), Cacao (🍫), Olivia (🌸), Oliver (⚡) - nossa família",
    "Do sonho da faculdade à casa própria 🎓🏠"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
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
export function generateQRCodeData(invitationCode: string, baseUrl: string = 'https://thousanddaysoflove.vercel.app'): string {
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

// Utilities específicas para micro-interações românticas
export function getRandomPetReaction() {
  const pets = Object.values(petsPersonalities);
  const randomPet = pets[Math.floor(Math.random() * pets.length)];
  return `${randomPet.emoji} ${randomPet.story}`;
}

export function getBicycleAnimation() {
  return "Pedalando pelos sonhos da faculdade... 🚲";
}

export function getCameraFlash() {
  return "Capturando cada momento precioso 📸✨";
}

export function getWineClinkSound() {
  return "Noites de vinho e conversas em casa 🍷🔊";
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

// Funcionalidades específicas dos 4 pets únicos de Hel & Ylana
export const petsPersonalities = {
  linda: {
    emoji: "👑",
    name: "Linda",
    description: "Autista, mongol e perfeita desde sempre",
    story: "A matriarca da família! Mãe da Olivia e Oliver",
    speciality: "Perfeição em forma de pet"
  },
  cacao: {
    emoji: "🍫",
    name: "Cacao",
    description: "Chegou logo após o namoro",
    story: "Nossa companhia fiel desde março de 2023",
    speciality: "Doce como chocolate"
  },
  olivia: {
    emoji: "🌸",
    name: "Olivia",
    description: "Filha da Linda",
    story: "Princesinha que expandiu nossa família",
    speciality: "Delicada como uma flor"
  },
  oliver: {
    emoji: "⚡",
    name: "Oliver",
    description: "Filho da Linda",
    story: "O príncipe que completou nossos 4 pets",
    speciality: "Energia pura e amor"
  }
};

// Easter eggs românticos específicos
export function getSpecialMoments() {
  return {
    firstMessage: "Desde aquele primeiro 'oi' no WhatsApp",
    apartmentDream: "O apartamento dos sonhos da faculdade que virou realidade",
    avatarDate: "VIP F11 e F12 - nossa primeira aventura no cinema",
    guaramirangaSpontaneous: "Não consegui esperar o jantar planejado em Guaramiranga",
    mangueAzulMemory: "Se o Mangue Azul não tivesse fechado, seria lá nosso casamento",
    medicineAndTea: "O remédio e chá - momento em que 'já sabia que era ela'",
    couplePhilosophy: "O que temos entre nós é muito maior do que qualquer um pode imaginar"
  };
}

// Mensagens personalizadas para o RSVP baseadas na história
export const personalizedRSVPMessages = {
  welcome: "Encontrando você na nossa história de 1000 dias...",
  confirmation: "Confirme sua presença em nosso grande dia na Casa HY",
  dietaryNeeds: "Cuidaremos de você com todo carinho (como sempre fizemos em casa)",
  plusOne: "Mais amor é sempre bem-vindo em nossa celebração! 💕",
  success: "Mal podemos esperar para celebrar nossos 1000 dias com você! ✨",
  finalButton: "Confirmar presença nos mil dias 💕"
};

// Histórias específicas para presentes baseadas na personalidade do casal
export const giftStories = {
  "Casa": "Para construir nosso lar próprio - o sonho da faculdade que virou realidade 🏠",
  "Cozinha": "Para nossas noites de boa comida e vinho em casa 🍷",
  "Quarto": "Para nosso cantinho de introvertidos apaixonados 💤",
  "Sala": "Para receber amigos e família com alegria em nosso lar 🏡",
  "Banheiro": "Para cuidar um do outro com carinho todos os dias 💕",
  "Experiências": "Para criar mais memórias como Guaramiranga e viagens 🌊",
  "Eletrodomésticos": "Para temperar nosso amor com sabores especiais 🍳",
  "Decoração": "Para encher nosso lar dos sonhos de beleza ✨",
  "Pets": "Para nossa família de 4 patinhas: Linda, Cacao, Olivia e Oliver 🐾",
  "Vinhos": "Para nossas noites de introvertidos apaixonados em casa 🍷",
  "Fotografia": "Para capturar cada momento dos nossos próximos mil dias 📸",
  "Fitness": "Para mantermos nossa paixão por exercícios juntos 🏋️",
  "Moda": "Para a criatividade e estilo único da Ylana ✨",
  "Tecnologia": "Para o amor do Hel por inovação e fotografia 📱"
};

// Local romântico específico do casamento
export const venueStory = {
  title: "Casa HY - Onde a Arte Encontra o Amor",
  subtitle: "Nosso plano B que virou plano perfeito",
  description: "Se o Mangue Azul não tivesse fechado, nosso casamento seria lá. Mas o destino nos levou à Casa HY, onde celebraremos nossos 1000 dias rodeados de arte, assim como nossa história é uma obra de arte única.",
  directions: "Siga seu coração até nós - será fácil encontrar o lugar onde dois introvertidos se tornaram uma família 💕",
  arrival: "Chegue com tranquilidade, saia com alegria"
};

// Filosofia do casal para o footer ou seções especiais
export const couplePhilosophy = {
  quote: "Tem o que as pessoas sabem de nós, tem o que elas veem de nós, e tem o que nós temos entre nós...",
  emphasis: "E o que nós temos entre nós é muito maior.",
  signature: "- Hel & Ylana, 1000 dias depois"
};