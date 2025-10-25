/**
 * Gift Contribution Messaging System
 *
 * Psychology-driven messages that encourage contributions without overwhelming
 * donors with large numbers or demotivating progress percentages.
 *
 * Key Principles:
 * - Social proof: "X people have contributed" > "Only 2% funded"
 * - Milestone framing: Break big goals into meaningful chunks
 * - Pioneer effect: Make first contributors feel special
 * - Community narrative: "We" not "I"
 * - Story-first: Focus on the dream, not the number
 */

interface GiftMessageParams {
  fullPrice: number;
  totalContributed: number;
  contributorCount: number;
  giftTitle: string;
  giftCategory?: 'honeymoon' | 'home' | 'experience' | 'technology' | 'general';
}

interface GiftMessage {
  headline: string;
  subtext: string;
  callToAction: string;
  visualHint: 'sparkle' | 'fire' | 'heart' | 'star' | 'celebrate';
  emotion: 'inspiring' | 'warm' | 'celebratory' | 'urgent' | 'grateful';
}

/**
 * Returns the appropriate message based on contribution state
 */
export function getGiftContributionMessage(params: GiftMessageParams): GiftMessage {
  const { fullPrice, totalContributed, contributorCount, giftTitle, giftCategory = 'general' } = params;

  // Determine state
  const percentageFunded = (totalContributed / fullPrice) * 100;
  const isHighValue = fullPrice >= 10000; // R$10k+

  if (contributorCount === 0) {
    return getZeroContributionMessage(giftTitle, giftCategory, isHighValue);
  } else if (percentageFunded >= 100) {
    return getCompleteMessage(contributorCount, giftTitle);
  } else {
    return getPartialContributionMessage(
      totalContributed,
      contributorCount,
      giftTitle,
      giftCategory,
      isHighValue
    );
  }
}

/**
 * ZERO CONTRIBUTIONS - "Be the First" Messages
 *
 * Psychology:
 * - Pioneer Effect: People want to be "the first" (exclusivity)
 * - Story-First: Lead with emotion, not numbers
 * - Scarcity: "Only one person can be first" creates urgency
 * - No goal mention: Avoids sticker shock on big gifts
 */
function getZeroContributionMessage(
  giftTitle: string,
  category: string,
  isHighValue: boolean
): GiftMessage {
  const messages: GiftMessage[] = [
    {
      headline: "Seja a primeira pessoa a realizar este sonho",
      subtext: "Toda grande jornada começa com um único gesto de amor. Ajude Hel e Ylana a darem o primeiro passo.",
      callToAction: "Fazer a primeira contribuição",
      visualHint: 'sparkle',
      emotion: 'inspiring'
    },
    {
      headline: "Este presente ainda não tem nenhum padrinho",
      subtext: "Que tal ser a pessoa especial que iniciou este sonho? Seu nome será lembrado para sempre.",
      callToAction: "Ser o pioneiro",
      visualHint: 'star',
      emotion: 'inspiring'
    },
    {
      headline: "Um sonho esperando para se tornar realidade",
      subtext: "Hel e Ylana imaginam este momento há muito tempo. Você pode ser quem faz tudo começar.",
      callToAction: "Iniciar a magia",
      visualHint: 'heart',
      emotion: 'warm'
    },
    {
      headline: "Nenhuma contribuição ainda - seja você a mudar isso",
      subtext: "Há algo mágico em ser o primeiro. Inspire outros a se juntarem a você neste presente especial.",
      callToAction: "Liderar o caminho",
      visualHint: 'fire',
      emotion: 'urgent'
    },
    {
      headline: "O primeiro gesto é sempre o mais memorável",
      subtext: "Em 1000 dias, muitas histórias começaram com um único momento. Este pode ser o seu.",
      callToAction: "Criar o primeiro momento",
      visualHint: 'sparkle',
      emotion: 'inspiring'
    },
    {
      headline: "Este presente está guardando seu lugar",
      subtext: "Como a primeira pedra de uma fundação, sua contribuição dará início a algo lindo.",
      callToAction: "Colocar a primeira pedra",
      visualHint: 'star',
      emotion: 'warm'
    },
    {
      headline: "Ninguém contribuiu ainda - que honra será sua!",
      subtext: "Imagine contar que você foi a primeira pessoa a acreditar neste sonho.",
      callToAction: "Ser o primeiro a acreditar",
      visualHint: 'heart',
      emotion: 'inspiring'
    }
  ];

  // Add category-specific variation for high-value gifts
  if (isHighValue && category === 'honeymoon') {
    messages.push({
      headline: "A lua de mel ainda é só um sonho no papel",
      subtext: "Mil dias de amor merecem uma celebração inesquecível. Você pode dar o primeiro passo dessa viagem.",
      callToAction: "Iniciar a aventura",
      visualHint: 'sparkle',
      emotion: 'inspiring'
    });
  }

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * PARTIAL CONTRIBUTIONS - "Join the Movement" Messages
 *
 * Psychology:
 * - Social Proof: "X people already contributed" (not percentages!)
 * - Milestone Framing: Show actual money collected (achievement)
 * - Bandwagon Effect: "Don't be left out"
 * - Progress Momentum: "We're getting closer" (not "we're still far")
 * - Community Building: "Join this group of generous friends"
 */
function getPartialContributionMessage(
  totalContributed: number,
  contributorCount: number,
  giftTitle: string,
  category: string,
  isHighValue: boolean
): GiftMessage {
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalContributed);

  // Different messages based on number of contributors
  const isSmallGroup = contributorCount < 5;
  const isMediumGroup = contributorCount >= 5 && contributorCount < 15;
  const isLargeGroup = contributorCount >= 15;

  const messages: GiftMessage[] = [];

  // SMALL GROUP (2-4 people) - "Be next to join this intimate group"
  if (isSmallGroup) {
    messages.push(
      {
        headline: `${contributorCount} pessoas especiais já contribuíram`,
        subtext: `Juntos, já reunimos ${formattedAmount}. Faça parte deste grupo seleto de amigos.`,
        callToAction: "Juntar-me ao grupo",
        visualHint: 'heart',
        emotion: 'warm'
      },
      {
        headline: `Um pequeno grupo já está construindo este sonho`,
        subtext: `${contributorCount} pessoas iniciaram esta jornada com ${formattedAmount}. Seja a próxima.`,
        callToAction: "Contribuir também",
        visualHint: 'star',
        emotion: 'inspiring'
      },
      {
        headline: `${contributorCount} corações generosos já se juntaram`,
        subtext: `Cada contribuição importa. Juntos já somamos ${formattedAmount} de amor.`,
        callToAction: "Adicionar meu gesto",
        visualHint: 'heart',
        emotion: 'warm'
      }
    );
  }

  // MEDIUM GROUP (5-14 people) - "Join the momentum"
  if (isMediumGroup) {
    messages.push(
      {
        headline: `${contributorCount} amigos já apoiaram este presente`,
        subtext: `A comunidade reuniu ${formattedAmount} até agora. O sonho está ganhando vida!`,
        callToAction: "Fortalecer o movimento",
        visualHint: 'fire',
        emotion: 'urgent'
      },
      {
        headline: `Você não está sozinho - ${contributorCount} pessoas já ajudaram`,
        subtext: `Juntos, já construímos ${formattedAmount}. Cada nova contribuição nos aproxima mais.`,
        callToAction: "Somar forças",
        visualHint: 'star',
        emotion: 'inspiring'
      },
      {
        headline: `${contributorCount} contribuidores, ${formattedAmount} reunidos, 1 sonho compartilhado`,
        subtext: `Esta é a magia de fazer junto. Seja parte desta história.`,
        callToAction: "Fazer parte da história",
        visualHint: 'sparkle',
        emotion: 'warm'
      }
    );
  }

  // LARGE GROUP (15+ people) - "Join this amazing community"
  if (isLargeGroup) {
    messages.push(
      {
        headline: `Incrível! ${contributorCount} pessoas já acreditaram neste sonho`,
        subtext: `Uma comunidade incrível reuniu ${formattedAmount}. Junte-se a este movimento lindo.`,
        callToAction: "Entrar para o movimento",
        visualHint: 'celebrate',
        emotion: 'celebratory'
      },
      {
        headline: `${contributorCount} corações batendo juntos`,
        subtext: `Já arrecadamos ${formattedAmount} de puro amor coletivo. Você pode fazer a diferença também.`,
        callToAction: "Bater junto",
        visualHint: 'heart',
        emotion: 'warm'
      },
      {
        headline: `A força da comunidade: ${contributorCount} pessoas unidas`,
        subtext: `${formattedAmount} já foram reunidos por amigos como você. Cada gesto importa.`,
        callToAction: "Unir minha voz",
        visualHint: 'star',
        emotion: 'inspiring'
      }
    );
  }

  // UNIVERSAL MESSAGES (work for any group size)
  messages.push(
    {
      headline: `${contributorCount} pessoas transformando sonhos em realidade`,
      subtext: `Juntos já reunimos ${formattedAmount}. Imagine o impacto da sua contribuição.`,
      callToAction: "Fazer minha parte",
      visualHint: 'sparkle',
      emotion: 'inspiring'
    },
    {
      headline: `Você não contribui sozinho - ${contributorCount} amigos estão com você`,
      subtext: `Este é um esforço coletivo de amor. ${formattedAmount} já mostram que juntos podemos tudo.`,
      callToAction: "Contribuir em comunidade",
      visualHint: 'heart',
      emotion: 'warm'
    },
    {
      headline: `O poder da generosidade compartilhada`,
      subtext: `${contributorCount} contribuidores | ${formattedAmount} de amor | 100% de impacto`,
      callToAction: "Compartilhar minha generosidade",
      visualHint: 'star',
      emotion: 'inspiring'
    }
  );

  // Category-specific messages for high-value partial contributions
  if (isHighValue && category === 'honeymoon' && isMediumGroup) {
    messages.push({
      headline: `${contributorCount} amigos já embarcaram nesta lua de mel`,
      subtext: `Juntos reunimos ${formattedAmount} para a viagem dos sonhos de Hel e Ylana. Vamos mais longe juntos!`,
      callToAction: "Embarcar também",
      visualHint: 'sparkle',
      emotion: 'inspiring'
    });
  }

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * COMPLETE - "Celebrate Together" Messages
 *
 * Psychology:
 * - Collective Achievement: "We did it" (not "they did it")
 * - Gratitude: Heartfelt thanks to the community
 * - Legacy: "You'll be remembered for this"
 * - Completion Satisfaction: The dopamine hit of 100%
 */
function getCompleteMessage(contributorCount: number, giftTitle: string): GiftMessage {
  const messages: GiftMessage[] = [
    {
      headline: `Realizado! ${contributorCount} pessoas fizeram este sonho acontecer`,
      subtext: "Hel e Ylana terão para sempre a lembrança deste gesto coletivo de amor. Obrigado por fazer parte.",
      callToAction: "Ver outros presentes",
      visualHint: 'celebrate',
      emotion: 'celebratory'
    },
    {
      headline: `Missão cumprida com amor por ${contributorCount} amigos`,
      subtext: "Juntos, vocês transformaram um sonho em realidade. Esta conquista é de todos nós.",
      callToAction: "Continuar ajudando",
      visualHint: 'star',
      emotion: 'grateful'
    },
    {
      headline: `100% de amor, 100% de gratidão`,
      subtext: `Graças a ${contributorCount} corações generosos, este presente está completo. Vocês são incríveis!`,
      callToAction: "Conhecer mais sonhos",
      visualHint: 'heart',
      emotion: 'celebratory'
    },
    {
      headline: `Sonho realizado por ${contributorCount} pessoas especiais`,
      subtext: "Cada contribuição foi uma peça fundamental. Hel e Ylana são imensamente gratos a cada um de vocês.",
      callToAction: "Explorar outros presentes",
      visualHint: 'celebrate',
      emotion: 'grateful'
    },
    {
      headline: `A magia aconteceu!`,
      subtext: `${contributorCount} amigos unidos fizeram este presente se tornar realidade. Vocês escreveram parte desta história de amor.`,
      callToAction: "Ver mais histórias",
      visualHint: 'sparkle',
      emotion: 'celebratory'
    },
    {
      headline: `Completo com muito amor`,
      subtext: `${contributorCount} contribuidores provaram que juntos podemos realizar sonhos. Hel e Ylana carregarão para sempre este gesto no coração.`,
      callToAction: "Apoiar outro sonho",
      visualHint: 'heart',
      emotion: 'grateful'
    },
    {
      headline: `Vocês fizeram acontecer!`,
      subtext: `${contributorCount} pessoas transformaram este sonho em certeza. Que lindo é ver uma comunidade tão generosa.`,
      callToAction: "Continuar a generosidade",
      visualHint: 'star',
      emotion: 'celebratory'
    }
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Helper: Get visual styling hints for each emotion
 */
export function getMessageStyling(emotion: GiftMessage['emotion']) {
  const styles = {
    inspiring: {
      gradient: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-900',
      accentColor: 'text-purple-600',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
    },
    warm: {
      gradient: 'from-amber-50 to-orange-50',
      textColor: 'text-gray-900',
      accentColor: 'text-orange-600',
      buttonStyle: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
    },
    celebratory: {
      gradient: 'from-green-50 to-emerald-50',
      textColor: 'text-gray-900',
      accentColor: 'text-emerald-600',
      buttonStyle: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
    },
    urgent: {
      gradient: 'from-red-50 to-rose-50',
      textColor: 'text-gray-900',
      accentColor: 'text-rose-600',
      buttonStyle: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
    },
    grateful: {
      gradient: 'from-blue-50 to-indigo-50',
      textColor: 'text-gray-900',
      accentColor: 'text-indigo-600',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
    }
  };

  return styles[emotion];
}

/**
 * Helper: Get icon component name for visual hint
 */
export function getMessageIcon(visualHint: GiftMessage['visualHint']) {
  const icons = {
    sparkle: 'SparklesIcon',
    fire: 'FireIcon',
    heart: 'HeartIcon',
    star: 'StarIcon',
    celebrate: 'TrophyIcon'
  };

  return icons[visualHint];
}

/**
 * MILESTONE PROGRESS BAR (Alternative to percentage)
 *
 * Instead of "2% complete", show milestone achievements:
 * - "Primeiro marco alcançado!" (First R$1000)
 * - "Metade do caminho!" (50% but framed as achievement)
 * - "Quase lá!" (75%+)
 *
 * Psychology: Milestone framing makes progress feel faster
 */
export function getMilestoneProgress(totalContributed: number, fullPrice: number) {
  const percentage = (totalContributed / fullPrice) * 100;
  const milestones = [
    { threshold: 100, label: 'Sonho realizado!', icon: 'celebrate', color: 'emerald' },
    { threshold: 75, label: 'Quase lá!', icon: 'fire', color: 'orange' },
    { threshold: 50, label: 'Metade do caminho!', icon: 'star', color: 'purple' },
    { threshold: 25, label: 'Ganhando força!', icon: 'sparkle', color: 'blue' },
    { threshold: 10, label: 'Primeiros passos dados!', icon: 'heart', color: 'pink' },
    { threshold: 0, label: 'Aguardando início', icon: 'heart', color: 'gray' }
  ];

  const milestone = milestones.find(m => percentage >= m.threshold) || milestones[milestones.length - 1];

  return {
    label: milestone.label,
    icon: milestone.icon as GiftMessage['visualHint'],
    color: milestone.color,
    percentage: Math.min(percentage, 100),
    showPercentage: percentage >= 25 // Only show % after 25% to avoid demotivation
  };
}
