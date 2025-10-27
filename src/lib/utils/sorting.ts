/**
 * Sorting utilities for gift registry
 * Provides shuffling with session-based seeding for consistent randomization
 */

import { GiftWithProgress } from '@/lib/services/gifts'

export type SortOption = 'random' | 'price-low' | 'price-high' | 'most-funded' | 'least-funded' | 'newest'

export interface SortConfig {
  value: SortOption
  label: string
  description: string
}

export const SORT_OPTIONS: SortConfig[] = [
  {
    value: 'random',
    label: 'Aleatório',
    description: 'Ordem surpresa (muda a cada sessão)',
  },
  {
    value: 'price-low',
    label: 'Menor Preço',
    description: 'Do mais barato ao mais caro',
  },
  {
    value: 'price-high',
    label: 'Maior Preço',
    description: 'Do mais caro ao mais barato',
  },
  {
    value: 'most-funded',
    label: 'Mais Contribuído',
    description: 'Com mais contribuições',
  },
  {
    value: 'least-funded',
    label: 'Menos Contribuído',
    description: 'Precisa de mais ajuda',
  },
]

/**
 * Get or create a session-based random seed
 * This ensures the random order stays consistent during a session
 * but changes between page loads/sessions
 */
export function getSessionSeed(): number {
  if (typeof window === 'undefined') return Date.now()

  const SEED_KEY = 'gifts-random-seed'
  const SESSION_KEY = 'gifts-session-id'

  // Check if we have an active session
  const sessionId = sessionStorage.getItem(SESSION_KEY)
  const currentSession = Date.now().toString()

  // If no session or it's been more than 30 minutes, create new seed
  if (!sessionId || Date.now() - parseInt(sessionId) > 30 * 60 * 1000) {
    const newSeed = Math.random() * 1000000
    sessionStorage.setItem(SEED_KEY, newSeed.toString())
    sessionStorage.setItem(SESSION_KEY, currentSession)
    return newSeed
  }

  // Use existing seed for this session
  const existingSeed = sessionStorage.getItem(SEED_KEY)
  return existingSeed ? parseFloat(existingSeed) : Date.now()
}

/**
 * Seeded random number generator
 * Uses a simple LCG (Linear Congruential Generator)
 */
function seededRandom(seed: number): () => number {
  let state = seed
  return function () {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm with seeded randomization
 * This ensures the same seed produces the same shuffle order
 */
export function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  const random = seededRandom(seed)

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

/**
 * Sort gifts based on selected option
 */
export function sortGifts(gifts: GiftWithProgress[], sortBy: SortOption): GiftWithProgress[] {
  switch (sortBy) {
    case 'random':
      return shuffleArray(gifts, getSessionSeed())

    case 'price-low':
      return [...gifts].sort((a, b) => a.fullPrice - b.fullPrice)

    case 'price-high':
      return [...gifts].sort((a, b) => b.fullPrice - a.fullPrice)

    case 'most-funded':
      return [...gifts].sort((a, b) => {
        // Sort by percent funded first, then by total contributed
        if (b.percentFunded !== a.percentFunded) {
          return b.percentFunded - a.percentFunded
        }
        return b.totalContributed - a.totalContributed
      })

    case 'least-funded':
      return [...gifts].sort((a, b) => {
        // Sort by percent funded first (ascending), then by total contributed
        if (a.percentFunded !== b.percentFunded) {
          return a.percentFunded - b.percentFunded
        }
        return a.totalContributed - b.totalContributed
      })

    default:
      return gifts
  }
}

/**
 * Get saved sort preference from localStorage
 */
export function getSavedSortPreference(): SortOption {
  if (typeof window === 'undefined') return 'random'

  const saved = localStorage.getItem('gifts-sort-preference')
  return (saved as SortOption) || 'random'
}

/**
 * Save sort preference to localStorage
 */
export function saveSortPreference(sortBy: SortOption): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('gifts-sort-preference', sortBy)
}
