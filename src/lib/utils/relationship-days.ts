import { differenceInDays, parseISO, startOfDay } from 'date-fns'

/**
 * Reference date for the relationship - Day 1
 * February 25, 2023 - The day they officially started dating in Guaramiranga
 * Using parseISO to ensure consistent timezone handling
 */
export const RELATIONSHIP_START_DATE = startOfDay(parseISO('2023-02-25'))

/**
 * Calculate the day number for a given date relative to the relationship start date
 *
 * @param date - The date to calculate (can be string in ISO format or Date object)
 * @returns The day number (1 for Feb 25 2023, 0 for Feb 24, negative for dates before)
 *
 * @example
 * calculateDayNumber('2023-02-25') // Returns 1 (Day 1 - the official start)
 * calculateDayNumber('2023-02-24') // Returns 0 (day before)
 * calculateDayNumber('2023-02-23') // Returns -1 (2 days before)
 * calculateDayNumber('2023-02-26') // Returns 2 (Day 2)
 * calculateDayNumber('2025-11-20') // Returns 1000 (Wedding day)
 */
export function calculateDayNumber(date: string | Date): number {
  // Normalize both dates to start of day in local timezone to avoid timezone issues
  const targetDate = startOfDay(typeof date === 'string' ? parseISO(date) : date)
  const startDate = RELATIONSHIP_START_DATE

  // Calculate the difference in calendar days
  // differenceInDays returns 0 for the same day, 1 for one day later, -1 for one day earlier
  const daysDifference = differenceInDays(targetDate, startDate)

  // For the start date itself (Feb 25, 2023), daysDifference = 0
  // We want this to be Day 1, so we add 1
  // For Feb 24 (day before), daysDifference = -1, so -1 + 1 = 0
  // For Feb 26 (day after), daysDifference = 1, so 1 + 1 = 2
  return daysDifference + 1
}

/**
 * Format a day number for display
 *
 * @param dayNumber - The day number to format
 * @returns Formatted string (e.g., "Dia 1", "Dia -1", "Dia 1000")
 *
 * @example
 * formatDayNumber(1) // "Dia 1"
 * formatDayNumber(-1) // "Dia -1"
 * formatDayNumber(1000) // "Dia 1000"
 */
export function formatDayNumber(dayNumber: number): string {
  return `Dia ${dayNumber}`
}

/**
 * Calculate day range for a phase based on its story moments
 *
 * @param moments - Array of story moments with dates
 * @returns Formatted day range string (e.g., "Dia 1 - 100")
 */
export function calculatePhaseRange(moments: Array<{ date: string }>): string {
  if (moments.length === 0) return 'Sem momentos'

  const dayNumbers = moments.map(m => calculateDayNumber(m.date))
  const minDay = Math.min(...dayNumbers)
  const maxDay = Math.max(...dayNumbers)

  if (minDay === maxDay) {
    return formatDayNumber(minDay)
  }

  return `Dia ${minDay} - ${maxDay}`
}

/**
 * Verify if the wedding date is actually Day 1000
 * This is a sanity check for the calculation
 */
export function verifyWeddingDayCalculation(): {
  isCorrect: boolean
  calculatedDay: number
  expectedDay: number
  difference: number
} {
  // Use the same date format as Sanity stores (ISO string)
  const calculatedDay = calculateDayNumber('2025-11-20')
  const expectedDay = 1000

  return {
    isCorrect: calculatedDay === expectedDay,
    calculatedDay,
    expectedDay,
    difference: calculatedDay - expectedDay
  }
}
