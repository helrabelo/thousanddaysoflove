/**
 * Smart Gift Contribution Messaging System
 *
 * Creates compelling, psychology-driven messages for gift contributions
 * that don't overwhelm users with big numbers or scary percentages.
 *
 * Key principles:
 * - Compare gifts relative to each other (social competition)
 * - Focus on contributor count and community, not total amounts
 * - Make people feel special/pioneering when they contribute
 * - Use Brazilian Portuguese with warm, romantic wedding tone
 */

import { GiftWithProgress } from '@/lib/services/gifts'

export interface GiftContributionMessage {
  // Main headline message
  headline: string
  // Supporting detail text
  subtext: string
  // Badge text (optional, for special statuses)
  badge?: string
  // Show traditional progress bar and numbers?
  showProgressBar: boolean
  // Show total amount collected?
  showTotalCollected: boolean
}

/**
 * Determines contribution message based on gift state and comparison to other gifts
 */
export function getGiftContributionMessage(
  gift: GiftWithProgress,
  allGifts: GiftWithProgress[]
): GiftContributionMessage {
  const threshold = 1000 // Gifts over R$1000 get special treatment
  const isExpensive = gift.fullPrice > threshold
  const hasContributions = gift.contributionCount > 0
  const isComplete = gift.isFullyFunded

  // State 3: Completed (same for all gifts)
  if (isComplete) {
    return {
      headline: 'Sonho Realizado! 💝',
      subtext: `${gift.contributionCount} ${gift.contributionCount === 1 ? 'pessoa ajudou' : 'pessoas ajudaram'} a realizar este sonho`,
      badge: 'Completo',
      showProgressBar: false,
      showTotalCollected: false
    }
  }

  // For cheap gifts, use traditional display
  if (!isExpensive) {
    const remaining = gift.remainingAmount
    return {
      headline: `Faltam ${formatBRL(remaining)}`,
      subtext: `${gift.contributionCount} ${gift.contributionCount === 1 ? 'contribuição' : 'contribuições'} até agora`,
      showProgressBar: true,
      showTotalCollected: false
    }
  }

  // Expensive gifts: Smart messaging based on comparison

  // State 1: Zero contributions
  if (!hasContributions) {
    return getZeroContributionsMessage(gift)
  }

  // State 2: Partial contributions - compare with other gifts
  return getPartialContributionsMessage(gift, allGifts)
}

/**
 * Messages for expensive gifts with zero contributions
 */
function getZeroContributionsMessage(gift: GiftWithProgress): GiftContributionMessage {
  const messages = [
    {
      headline: 'Que tal ser o primeiro? 🌟',
      subtext: 'Sua contribuição vai iniciar este sonho especial'
    },
    {
      headline: 'Seja pioneiro neste presente! ✨',
      subtext: 'Qualquer valor faz diferença para começar'
    },
    {
      headline: 'Inicie este sonho com a gente 💫',
      subtext: 'Seja a primeira pessoa a contribuir'
    },
    {
      headline: 'Este sonho espera por você 💕',
      subtext: 'Faça a primeira contribuição e inspire outros'
    }
  ]

  // Pick based on gift category for variety
  const index = Math.abs(hashString(gift._id)) % messages.length
  return {
    ...messages[index],
    showProgressBar: false,
    showTotalCollected: false
  }
}

/**
 * Messages for expensive gifts with contributions - uses comparison logic
 */
function getPartialContributionsMessage(
  gift: GiftWithProgress,
  allGifts: GiftWithProgress[]
): GiftContributionMessage {
  // Calculate rankings among expensive incomplete gifts
  const expensiveGifts = allGifts.filter(g =>
    g.fullPrice > 1000 && !g.isFullyFunded && g._id !== gift._id
  )

  const myContributions = gift.totalContributed
  const myContributorCount = gift.contributionCount

  // Count how many gifts have more contributions than this one
  const giftsWithMore = expensiveGifts.filter(g =>
    g.totalContributed > myContributions
  ).length

  const totalExpensiveGifts = expensiveGifts.length + 1 // +1 for current gift
  const isTopContributed = giftsWithMore === 0 && totalExpensiveGifts > 1
  const isTop3 = giftsWithMore < 3 && totalExpensiveGifts >= 3

  // Special badge for top contributor
  if (isTopContributed) {
    return {
      headline: 'Favorito até agora! 🏆',
      subtext: `${myContributorCount} ${myContributorCount === 1 ? 'pessoa já contribuiu' : 'pessoas já contribuíram'}`,
      badge: 'Mais Amado',
      showProgressBar: false,
      showTotalCollected: true
    }
  }

  // Top 3 badge
  if (isTop3) {
    return {
      headline: 'Entre os mais queridos! ⭐',
      subtext: `${myContributorCount} ${myContributorCount === 1 ? 'pessoa já contribuiu' : 'pessoas já contribuíram'}`,
      badge: 'Popular',
      showProgressBar: false,
      showTotalCollected: true
    }
  }

  // Default: show community support
  const messages = [
    {
      headline: `${myContributorCount} ${myContributorCount === 1 ? 'pessoa acredita' : 'pessoas acreditam'} neste sonho 💫`,
      subtext: 'Junte-se a quem já contribuiu!'
    },
    {
      headline: 'Este sonho está crescendo! 🌱',
      subtext: `${myContributorCount} ${myContributorCount === 1 ? 'contribuição feita' : 'contribuições feitas'} - seja o próximo!`
    },
    {
      headline: 'Cada contribuição importa! 💕',
      subtext: `${myContributorCount} ${myContributorCount === 1 ? 'pessoa já ajudou' : 'pessoas já ajudaram'} - faça parte você também`
    }
  ]

  const index = Math.abs(hashString(gift._id)) % messages.length
  return {
    ...messages[index],
    showProgressBar: false,
    showTotalCollected: true
  }
}

/**
 * Simple hash function for consistent message selection
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

/**
 * Format currency in Brazilian Real
 */
function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

/**
 * Get all messages from contributors for display
 */
export function getAllContributorMessages(gifts: GiftWithProgress[]) {
  const messages: Array<{
    contributorName: string
    giftName: string
    message: string
    amount: number
    date: string
  }> = []

  gifts.forEach(gift => {
    gift.contributors
      .filter(c => c.message && c.message.trim().length > 0)
      .forEach(contributor => {
        messages.push({
          contributorName: contributor.contributor_name || 'Anônimo',
          giftName: gift.title,
          message: contributor.message!,
          amount: contributor.amount,
          date: contributor.payment_date
        })
      })
  })

  // Sort by date, most recent first
  return messages.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
