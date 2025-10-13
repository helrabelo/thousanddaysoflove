import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'agora mesmo'
  if (diffMins === 1) return '1 minuto atrás'
  if (diffMins < 60) return `${diffMins} minutos atrás`
  if (diffHours === 1) return '1 hora atrás'
  if (diffHours < 24) return `${diffHours} horas atrás`
  if (diffDays === 1) return '1 dia atrás'
  return `${diffDays} dias atrás`
}

export * from './wedding'