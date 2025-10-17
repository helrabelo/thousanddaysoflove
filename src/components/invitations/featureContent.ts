/**
 * Feature Discovery Hub - Content Constants
 * All copy and content for the 5 feature cards
 */

import { Camera, MessageCircle, Radio, Gift, CheckCircle2, LucideIcon } from 'lucide-react';
import type { GuestProgress } from '@/types/wedding';

export interface WorkflowStep {
  number: number;
  icon: string;
  title: string;
  description: string;
  timing?: string;
}

export interface FeatureCardContent {
  key: 'photos' | 'posts' | 'live' | 'gifts' | 'rsvp';
  icon: LucideIcon;
  title: string;
  tagline: string;

  // Collapsed view (3 bullets)
  collapsedBullets: string[];

  // Expanded view
  expandedContent: {
    capabilities: string[];
    workflow?: WorkflowStep[];
    steps: string[];
    tip: string;
    ctas: Array<{
      label: string;
      href: string;
      primary: boolean;
    }>;
  };

  progressKey: keyof GuestProgress;
  completionBadge?: string;
  color: string; // Tailwind gradient classes
}

/**
 * Card 1: Photo & Video Uploads
 */
export const photosFeature: FeatureCardContent = {
  key: 'photos',
  icon: Camera,
  title: 'Compartilhe Fotos & Vídeos',
  tagline: 'Capture momentos antes, durante e depois',

  collapsedBullets: [
    'Envie múltiplas fotos e vídeos',
    'Organize por fase (antes/durante/depois)',
    'Suas fotos aparecem na galeria após moderação',
  ],

  expandedContent: {
    capabilities: [
      'Upload múltiplo: até 10 arquivos de uma vez',
      'Fotos E vídeos: ambos são bem-vindos',
      'Fases organizadas: antes, durante, depois',
      'Galeria pública: celebrando nossa história',
    ],

    workflow: [
      {
        number: 1,
        icon: '📱',
        title: 'VOCÊ ENVIA',
        description: 'Upload múltiplo',
      },
      {
        number: 2,
        icon: '👁️',
        title: 'MODERAÇÃO',
        description: 'Revisão em 24h',
        timing: '24h',
      },
      {
        number: 3,
        icon: '✅',
        title: 'APROVAÇÃO',
        description: 'Aceito!',
      },
      {
        number: 4,
        icon: '🎉',
        title: 'GALERIA',
        description: 'Visível a todos',
      },
    ],

    steps: [
      'Acesse /dia-1000/upload',
      'Escolha a fase (antes/durante/depois)',
      'Selecione seus arquivos',
      'Aguarde aprovação (~24h)',
      'Veja na galeria pública!',
    ],

    tip: 'Não precisa esperar o casamento! Envie fotos de memórias passadas na fase "antes".',

    ctas: [
      {
        label: 'Ver Galeria Atual',
        href: '/galeria',
        primary: false,
      },
      {
        label: 'Fazer Upload Agora',
        href: '/dia-1000/upload',
        primary: true,
      },
    ],
  },

  progressKey: 'photos_uploaded',
  completionBadge: '✅ Fotos enviadas',
  color: 'from-gray-100 to-gray-50',
};

/**
 * Card 2: Guest Posts & Social Feed
 */
export const postsFeature: FeatureCardContent = {
  key: 'posts',
  icon: MessageCircle,
  title: 'Crie Posts & Interaja',
  tagline: 'Mensagens, reações e comentários',

  collapsedBullets: [
    'Crie posts com texto, fotos ou vídeos',
    'Reaja com emojis (❤️ 👏 😂 🎉 💕)',
    'Comente posts de outros convidados',
  ],

  expandedContent: {
    capabilities: [
      '📝 Texto: Mensagens e desejos especiais',
      '🖼️ Fotos: Momentos memoráveis (até 10)',
      '🎥 Vídeos: Grave mensagens em vídeo',
      '🌈 Mistos: Combine texto + imagens + vídeos',
    ],

    steps: [
      'Acesse /mensagens',
      'Escolha tipo de post (texto/foto/vídeo/misto)',
      'Escreva sua mensagem',
      'Adicione fotos ou vídeos (opcional)',
      'Publique e aguarde aprovação (~24h)',
      'Interaja: reaja e comente outros posts!',
    ],

    tip: 'Use o emoji picker! 36 emojis de casamento disponíveis.',

    ctas: [
      {
        label: 'Ver Feed',
        href: '/mensagens',
        primary: false,
      },
      {
        label: 'Criar Post',
        href: '/mensagens',
        primary: true,
      },
    ],
  },

  progressKey: 'messages_sent',
  completionBadge: '✅ Mensagens enviadas',
  color: 'from-blue-100 to-cyan-50',
};

/**
 * Card 3: Live Wedding Feed
 */
export const liveFeature: FeatureCardContent = {
  key: 'live',
  icon: Radio,
  title: 'Feed ao Vivo',
  tagline: 'Celebração em tempo real (Dia do Casamento)',

  collapsedBullets: [
    'Feed ao vivo durante o casamento',
    'Galeria com apresentação automática',
    'Momentos especiais marcados',
  ],

  expandedContent: {
    capabilities: [
      '📱 Stream de posts: Mensagens em tempo real',
      '📸 Galeria slideshow: Fotos em rotação',
      '📊 Estatísticas: Acompanhe a celebração',
      '⭐ Momentos especiais: Posts marcados',
    ],

    steps: [
      'Acesse /ao-vivo no dia 20/11',
      'Feed atualiza em tempo real',
      'Compartilhe posts da festa',
      'Reaja e comente instantaneamente',
    ],

    tip: 'Deixe /ao-vivo aberto durante a festa para não perder momentos especiais!',

    ctas: [
      {
        label: 'Ver Preview',
        href: '/ao-vivo',
        primary: false,
      },
    ],
  },

  progressKey: 'photos_uploaded', // No specific progress for live (future)
  color: 'from-gray-100 to-gray-50',
};

/**
 * Card 4: Gift Registry
 */
export const giftsFeature: FeatureCardContent = {
  key: 'gifts',
  icon: Gift,
  title: 'Lista de Presentes',
  tagline: 'Contribua para nossa nova jornada',

  collapsedBullets: [
    'Escolha presentes da nossa lista',
    'Pagamento fácil via PIX',
    'Deixe mensagem especial',
  ],

  expandedContent: {
    capabilities: [
      'Navegue pela lista de presentes',
      'Contribua valor total ou parcial',
      'Pague via PIX (instantâneo e seguro)',
      'Deixe mensagem especial (opcional)',
    ],

    steps: [
      'Navegue pela lista de presentes',
      'Escolha o que combina com você',
      'Contribua valor total ou parcial',
      'Pague via PIX (instantâneo e seguro)',
      'Deixe mensagem especial (opcional)',
    ],

    tip: 'Contribuições parciais são bem-vindas e muito apreciadas!',

    ctas: [
      {
        label: 'Ver Lista',
        href: '/presentes',
        primary: false,
      },
      {
        label: 'Contribuir',
        href: '/presentes',
        primary: true,
      },
    ],
  },

  progressKey: 'gift_selected',
  completionBadge: '✅ Presente escolhido',
  color: 'from-amber-100 to-yellow-50',
};

/**
 * Card 5: RSVP
 */
export const rsvpFeature: FeatureCardContent = {
  key: 'rsvp',
  icon: CheckCircle2,
  title: 'Confirme Sua Presença',
  tagline: 'Ajude-nos a planejar o dia perfeito',

  collapsedBullets: [
    'Confirme sua presença',
    'Informe restrições alimentares',
    'Confirme acompanhante (se permitido)',
  ],

  expandedContent: {
    capabilities: [
      '✓ Você vem? Confirme ou decline',
      '✓ Restrições alimentares? Nos avise',
      '✓ Acompanhante? Se permitido, quem vem',
    ],

    steps: [
      'Acesse /rsvp',
      'Confirme ou decline sua presença',
      'Informe restrições alimentares (se houver)',
      'Confirme acompanhante (se permitido)',
      'Aguarde confirmação por email',
    ],

    tip: 'Pode mudar de ideia! Atualize sempre que necessário até 1º de novembro.',

    ctas: [
      {
        label: 'Completar RSVP',
        href: '/rsvp',
        primary: true,
      },
    ],
  },

  progressKey: 'rsvp_completed',
  completionBadge: '✅ Presença confirmada',
  color: 'from-green-100 to-emerald-50',
};

/**
 * All features array (ordered for display)
 */
export const ALL_FEATURES: FeatureCardContent[] = [
  photosFeature,
  postsFeature,
  liveFeature,
  giftsFeature,
  rsvpFeature,
];

/**
 * Post idea prompts for inspiration
 */
export const POST_IDEAS = [
  {
    category: 'Memórias',
    prompts: [
      'Conte história engraçada com o casal',
      'Compartilhe momento especial que viveram juntos',
      'Primeira impressão de Hel e Ylana',
      'Memória favorita com um deles',
    ],
  },
  {
    category: 'Desejos',
    prompts: [
      'Compartilhe desejos para a nova jornada',
      'Conselho para o casamento',
      'O que você deseja para os próximos 1000 dias',
      'Mensagem de amor e felicidade',
    ],
  },
  {
    category: 'Celebração',
    prompts: [
      'Poste fotos de momentos especiais',
      'Grave vídeo com mensagem',
      'Compartilhe expectativa para o casamento',
      'Mostre preparação para o dia',
    ],
  },
  {
    category: 'Diversão',
    prompts: [
      'Preveja como será a festa',
      'Compartilhe gif ou meme engraçado',
      'Conte piada sobre casamento',
      'Faça pergunta divertida para outros convidados',
    ],
  },
];
