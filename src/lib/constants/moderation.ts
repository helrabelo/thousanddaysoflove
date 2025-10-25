/**
 * Centralized Moderation Constants
 *
 * Single source of truth for moderation statuses, labels, colors, and utilities.
 * Used across guest photos, posts, and all moderated content.
 */

import type { ModerationStatus } from '@/types/interactive-features'

/**
 * Valid moderation status values
 * Use this for validation and type guards
 */
export const VALID_MODERATION_STATUSES = ['pending', 'approved', 'rejected'] as const

/**
 * Moderation status constants
 * Prefer using these constants over string literals
 */
export const MODERATION_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

/**
 * Portuguese labels for moderation statuses
 * Use for displaying status in UI
 */
export const MODERATION_STATUS_LABELS: Record<ModerationStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
}

/**
 * Badge colors for moderation statuses
 * Tailwind CSS classes for status badges
 */
export const MODERATION_STATUS_BADGE_COLORS: Record<ModerationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  approved: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
}

/**
 * Text colors for moderation statuses
 * Tailwind CSS classes for status text
 */
export const MODERATION_STATUS_TEXT_COLORS: Record<ModerationStatus, string> = {
  pending: 'text-yellow-600',
  approved: 'text-green-600',
  rejected: 'text-red-600',
}

/**
 * Background colors for moderation statuses
 * Tailwind CSS classes for status backgrounds
 */
export const MODERATION_STATUS_BG_COLORS: Record<ModerationStatus, string> = {
  pending: 'bg-yellow-50',
  approved: 'bg-green-50',
  rejected: 'bg-red-50',
}

/**
 * Type guard to check if a value is a valid ModerationStatus
 *
 * @param status - Value to check
 * @returns true if status is a valid ModerationStatus
 *
 * @example
 * ```ts
 * if (isValidModerationStatus(userInput)) {
 *   // TypeScript now knows userInput is ModerationStatus
 *   const label = MODERATION_STATUS_LABELS[userInput]
 * }
 * ```
 */
export function isValidModerationStatus(status: unknown): status is ModerationStatus {
  return (
    typeof status === 'string' &&
    VALID_MODERATION_STATUSES.includes(status as ModerationStatus)
  )
}

/**
 * Map a string to a valid ModerationStatus with fallback
 *
 * @param status - String value to map
 * @param fallback - Fallback status if invalid (default: 'pending')
 * @returns Valid ModerationStatus
 *
 * @example
 * ```ts
 * const status = mapToModerationStatus(searchParams.get('status'))
 * // Returns 'pending' if invalid, otherwise the valid status
 * ```
 */
export function mapToModerationStatus(
  status: string | null | undefined,
  fallback: ModerationStatus = 'pending'
): ModerationStatus {
  if (status && isValidModerationStatus(status)) {
    return status
  }
  return fallback
}

/**
 * Get display label for a moderation status
 *
 * @param status - ModerationStatus to get label for
 * @returns Portuguese label string
 *
 * @example
 * ```ts
 * const label = getModerationStatusLabel('approved') // "Aprovado"
 * ```
 */
export function getModerationStatusLabel(status: ModerationStatus): string {
  return MODERATION_STATUS_LABELS[status]
}

/**
 * Get badge CSS classes for a moderation status
 *
 * @param status - ModerationStatus to get colors for
 * @returns Tailwind CSS class string
 *
 * @example
 * ```tsx
 * <span className={`badge ${getModerationStatusBadgeColors('pending')}`}>
 *   {getModerationStatusLabel('pending')}
 * </span>
 * ```
 */
export function getModerationStatusBadgeColors(status: ModerationStatus): string {
  return MODERATION_STATUS_BADGE_COLORS[status]
}

/**
 * Get text color CSS class for a moderation status
 *
 * @param status - ModerationStatus to get color for
 * @returns Tailwind CSS class string
 */
export function getModerationStatusTextColor(status: ModerationStatus): string {
  return MODERATION_STATUS_TEXT_COLORS[status]
}

/**
 * Get background color CSS class for a moderation status
 *
 * @param status - ModerationStatus to get color for
 * @returns Tailwind CSS class string
 */
export function getModerationStatusBgColor(status: ModerationStatus): string {
  return MODERATION_STATUS_BG_COLORS[status]
}

/**
 * Filter type for status filters (includes 'all' option)
 * Commonly used in admin dashboards
 */
export type StatusFilter = 'all' | ModerationStatus

/**
 * Check if a status filter is 'all'
 */
export function isAllStatusFilter(filter: StatusFilter): filter is 'all' {
  return filter === 'all'
}

/**
 * Map status filter to ModerationStatus or undefined
 * Returns undefined if filter is 'all' (for unfiltered queries)
 *
 * @example
 * ```ts
 * const filter = statusFilterToModerationStatus('all') // undefined
 * const filter = statusFilterToModerationStatus('pending') // 'pending'
 * ```
 */
export function statusFilterToModerationStatus(
  filter: StatusFilter
): ModerationStatus | undefined {
  return filter === 'all' ? undefined : filter
}
