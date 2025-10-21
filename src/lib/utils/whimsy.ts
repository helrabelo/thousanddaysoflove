// Whimsy & Delight Utilities for Thousand Days of Love
// Micro-interactions, easter eggs, and joyful moments

import { petsPersonalities } from './wedding'

// Confetti system for celebrations
export interface ConfettiConfig {
  count?: number
  spread?: number
  duration?: number
  colors?: string[]
}

export const confettiPresets = {
  rsvpSuccess: {
    count: 100,
    spread: 160,
    duration: 3000,
    colors: ['#F8F6F3', '#A8A8A8', '#E8E6E3', '#2C2C2C']
  },
  giftPurchase: {
    count: 80,
    spread: 120,
    duration: 2500,
    colors: ['#F8F6F3', '#A8A8A8', '#E8E6E3']
  },
  petClick: {
    count: 30,
    spread: 90,
    duration: 1500,
    colors: ['#F8F6F3', '#A8A8A8']
  },
  milestoneReached: {
    count: 150,
    spread: 180,
    duration: 4000,
    colors: ['#F8F6F3', '#A8A8A8', '#E8E6E3', '#2C2C2C']
  }
}

// Heart particles for romantic moments
export interface HeartParticle {
  id: string
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

export function generateHeartParticles(count: number = 10): HeartParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `heart-${i}-${Date.now()}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 12 + Math.random() * 12,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2
  }))
}

// Loading messages with personality
export const loadingMessages = {
  rsvp: [
    "Linda está verificando a lista de convidados... 👑",
    "Cacao está preparando as boas-vindas... 🍫",
    "Organizando nosso universo particular... ✨",
    "Consultando o coração sobre sua presença... 💕"
  ],
  gifts: [
    "Olivia está escolhendo os presentes... 🌸",
    "Oliver está contando os sonhos... ⚡",
    "Preparando ideias para nosso lar... 🏠",
    "Verificando nossa lista de desejos... 🎁"
  ],
  gallery: [
    "Revelando nossos 1000 dias em fotos... 📸",
    "Carregando memórias preciosas... ✨",
    "Do Tinder ao altar em imagens... 💕",
    "Preparando nossa história visual... 🖼️"
  ],
  payment: [
    "Processando seu gesto de amor... 💕",
    "PIX de carinho sendo confirmado... ✨",
    "Agradecendo de coração... 🙏",
    "Transformando amor em realidade... 🏠"
  ],
  timeline: [
    "Relembrando Casa Fontana e Avatar VIP... 🎬",
    "Voltando a Guaramiranga espontânea... 🏔️",
    "Percorrendo nossos 1000 dias... 📅",
    "Organizando momentos especiais... ⏰"
  ]
}

export function getRandomLoadingMessage(category: keyof typeof loadingMessages): string {
  const messages = loadingMessages[category]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Success messages with emotion
export const successMessages = {
  rsvpConfirmed: [
    "Yay! Mal podemos esperar para ver você na Casa HY! 🎉",
    "Linda, Cacao, Olivia e Oliver também ficaram felizes! 🐾💕",
    "Nosso universo particular vai ficar ainda mais especial com você! ✨",
    "Que alegria! Já estamos contando os dias até te ver! 💒"
  ],
  giftPurchased: [
    "Obrigado por ajudar a construir nosso lar dos sonhos! 🏠💕",
    "Cada gesto conta muito para nós e nossa família de 4 patinhas! 🐾",
    "Seu carinho nos aproxima do apartamento perfeito! ✨",
    "De coração cheio, agradecemos! Nos vemos em 20 de novembro! 💒"
  ],
  formSubmitted: [
    "Recebido com muito amor! Obrigado por compartilhar conosco! 💕",
    "Sua mensagem aqueceu nossos corações caseiros! 🏠",
    "Guardamos cada palavra com carinho! ✨"
  ]
}

export function getRandomSuccessMessage(category: keyof typeof successMessages): string {
  const messages = successMessages[category]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Error messages with warmth (Brazilian humor)
export const errorMessages = {
  networkError: [
    "Ops! Até o amor precisa de internet... 📡",
    "Parece que o sinal está tímido como nós... Tente novamente! 🙈",
    "Momento introvertido da conexão... Aguarde um pouquinho! 💭"
  ],
  formValidation: [
    "Faltou um detalhe para completarmos sua história conosco... 💕",
    "Quase lá! Só precisamos de mais algumas informações... ✨",
    "Deixe-nos conhecer você melhor para cuidar de tudo! 🤗"
  ],
  paymentError: [
    "O PIX ficou tímido... Vamos tentar de novo? 💳",
    "Parece que o amor digital precisa de um empurrãozinho... 🔄",
    "Ops! Nosso sistema de carinho deu uma pausinha... ⏸️"
  ],
  notFound: [
    "Parece que você se perdeu no caminho... 🗺️",
    "Esta página foi para Guaramiranga sem avisar! 🏔️",
    "404: Assim como o Mangue Azul, esta página não está mais aqui... 💔"
  ]
}

export function getRandomErrorMessage(category: keyof typeof errorMessages): string {
  const messages = errorMessages[category]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Pet interactions and reactions
export function getPetReaction(petName: keyof typeof petsPersonalities): string {
  const reactions = {
    linda: [
      "Linda aprova com sua perfeição autista! 👑✨",
      "A matriarca está orgulhosa de você! 👑💕",
      "Linda manda um abraço especial (do jeito dela)! 👑"
    ],
    cacao: [
      "Cacao está abanando de alegria! 🍫🐾",
      "Nosso chocolatinho está feliz com você! 🍫💕",
      "Cacao manda lambidas de carinho! 🍫👅"
    ],
    olivia: [
      "Olivia ficou toda faceira com você! 🌸✨",
      "A princesinha está encantada! 🌸👑",
      "Olivia manda beijinhos delicados! 🌸💋"
    ],
    oliver: [
      "Oliver está pulando de alegria! ⚡🎉",
      "O príncipe está animadíssimo! ⚡👑",
      "Oliver manda energia positiva pra você! ⚡✨"
    ]
  }

  const petReactions = reactions[petName]
  return petReactions[Math.floor(Math.random() * petReactions.length)]
}

// Timeline milestone tooltips
export const milestoneTooltips = {
  "dia-1": "Do 'oi' no WhatsApp ao altar... Que jornada! 📱💒",
  "casa-fontana": "Avatar VIP F11/F12 - Nossa primeira aventura! 🎬🍿",
  "remedio-cha": "O momento em que 'já sabia que era ela' 🍵💕",
  "guaramiranga": "Não consegui esperar o jantar planejado... 🏔️💍",
  "apartamento": "O sonho da faculdade virando realidade! 🎓🏠",
  "linda-familia": "A perfeita Linda completando tudo! 👑",
  "cacao-chegada": "Nosso chocolatinho de companhia! 🍫",
  "gemeos": "Olivia e Oliver expandindo o amor! 🌸⚡",
  "mangue-azul": "Se não tivesse fechado... mas o destino sabia! 🎭",
  "casa-hy": "Onde a arte encontra o amor! 🎨💒"
}

// Scroll progress messages
export function getScrollProgressMessage(progress: number): string {
  if (progress < 10) return "Começando nossa jornada... ✨"
  if (progress < 25) return "Conhecendo nossa história... 📖"
  if (progress < 50) return "Do Tinder ao amor verdadeiro... 💕"
  if (progress < 75) return "Construindo nosso lar dos sonhos... 🏠"
  if (progress < 90) return "Quase no altar... 💒"
  return "1000 dias de amor esperando por você! 🎉"
}

// Gift category easter eggs
export const giftCategoryStories = {
  "Casa e Decoracao": "Transformando casa em lar com estilo único da Ylana ✨",
  "Cozinha": "Para temperar nosso amor com sabores especiais 🍳",
  "Quarto": "Nosso refúgio de introvertidos apaixonados 💤",
  "Banheiro": "Autocuidado a dois, todos os dias 💆",
  "Eletronicos": "Para capturar e eternizar cada momento 📸",
  "Experiencias": "Mais memórias como Guaramiranga nos esperam 🌊"
}

// Special number celebrations
export function checkSpecialNumber(amount: number): string | null {
  if (amount === 1000) return "MIL! O número da nossa história! 🎊"
  if (amount === 500) return "Metade da jornada até aqui! 💕"
  if (amount === 365) return "Um ano de amor! 🗓️"
  if (amount === 100) return "Cem motivos para celebrar! 🎉"
  if (amount === 42) return "A resposta para tudo (incluindo o amor)! 🌌"
  if (amount % 100 === 0) return `${amount} reais de puro amor! 💰`
  return null
}

// Romantic hover effects data
export const hoverEffects = {
  countdownCard: {
    message: "Cada segundo nos aproxima do para sempre... ⏰",
    emoji: "💕"
  },
  petCard: {
    linda: { emoji: "👑", bounce: true },
    cacao: { emoji: "🍫", bounce: true },
    olivia: { emoji: "🌸", bounce: true },
    oliver: { emoji: "⚡", bounce: true }
  },
  giftCard: {
    message: "Ajude a construir nosso lar dos sonhos! 🏠",
    emoji: "💝"
  },
  navigationLink: {
    historia: { emoji: "📖", tooltip: "Nossa jornada de 1000 dias" },
    galeria: { emoji: "📸", tooltip: "Do Tinder ao altar em imagens" },
    rsvp: { emoji: "💌", tooltip: "Confirme sua presença" },
    presentes: { emoji: "🎁", tooltip: "Ajude nosso sonho" },
    local: { emoji: "📍", tooltip: "Casa HY nos espera" }
  }
}

// Page-specific delights
export const pageDelights = {
  home: {
    heroSubtitle: "Do primeiro 'oi' no WhatsApp até o altar na Casa HY",
    scrollHint: "Role para descobrir nossa história de 1000 dias ↓"
  },
  rsvp: {
    stepTitles: [
      "Conhecendo você melhor... 💕",
      "Sua presença no nosso dia especial! ✨",
      "Últimos toques de carinho... 🤗"
    ],
    completionMessage: "Linda, Cacao, Olivia e Oliver também esperam você! 🐾"
  },
  gifts: {
    emptyStateMessage: "Em breve, mais sonhos para realizar juntos... ✨",
    filterHint: "Encontre o presente perfeito para nosso lar! 🏠"
  },
  gallery: {
    loadingMessage: "Revelando 1000 dias de amor em fotografias... 📸",
    firstPhotoTooltip: "Tudo começou com um 'oi'... 💕"
  }
}

// Animation timing helpers
export const animationTimings = {
  gentle: { duration: 0.6, ease: "easeOut" },
  bounce: { type: "spring", stiffness: 400, damping: 25 },
  romantic: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
  sparkle: { duration: 0.4, ease: "easeInOut" },
  celebration: { duration: 2, ease: "easeOut" }
}

// Keyboard shortcuts (easter eggs)
export const keyboardShortcuts = {
  'h+y': 'Reveal couple philosophy',
  'l+i+n+d+a': 'Linda appreciation message',
  '1+0+0+0': 'Special 1000 days celebration',
  'p+e+t+s': 'Show all 4 pets together'
}

// Social share messages
export function generateShareMessage(context: 'rsvp' | 'gift' | 'general'): string {
  const messages = {
    rsvp: "Acabei de confirmar presença no casamento do Hel & Ylana! 1000 dias de amor virando eternidade! 💒✨",
    gift: "Contribuí para o lar dos sonhos do Hel & Ylana! Linda, Cacao, Olivia e Oliver agradecem! 🏠🐾💕",
    general: "Hel & Ylana: 1000 dias de amor se preparando para o altar! Do Tinder à Casa HY 💒✨"
  }
  return messages[context]
}

// Cursor trail effect configuration
export const cursorTrailConfig = {
  enabled: true,
  particles: ['💕', '✨', '🤍'],
  maxParticles: 20,
  fadeDelay: 800,
  size: 16
}

// Parallax scroll effects
export const parallaxLayers = {
  botanical: { speed: 0.5, direction: 'up' },
  hearts: { speed: 0.3, direction: 'float' },
  text: { speed: 0.2, direction: 'fade' }
}
