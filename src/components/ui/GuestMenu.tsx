'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown, Calendar, MessageCircle, Radio, Sparkles, LogOut } from 'lucide-react'
import { useGuestSession } from '@/hooks/useGuestSession'
import { useRouter } from 'next/navigation'

interface GuestMenuItem {
  name: string
  href: string
  icon: React.ReactNode
  description: string
  badge?: string
  badgeColor?: string
  timeGated?: boolean
  availableDate?: Date
}

const getGuestMenuItems = (inviteCode?: string): GuestMenuItem[] => [
  {
    name: 'Meu Convite',
    href: inviteCode ? `/convite/${inviteCode}` : '/convite',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Seu convite pessoal e progresso',
  },
  {
    name: 'Dia 1000',
    href: '/dia-1000',
    icon: <Radio className="w-5 h-5" />,
    description: 'Acompanhe a festa em tempo real',
    timeGated: true,
    availableDate: new Date('2025-11-20'),
    badge: '20 Nov',
    badgeColor: 'var(--secondary-text)',
  },
  {
    name: 'Timeline Ao Vivo',
    href: '/dia-1000/timeline',
    icon: <MessageCircle className="w-5 h-5" />,
    description: 'Veja o que está rolando agora',
    timeGated: true,
    availableDate: new Date('2025-11-20'),
  },
]

export default function GuestMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { session, loading, logout } = useGuestSession()
  const router = useRouter()

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close menu on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const isWeddingDay = () => {
    const today = new Date()
    const weddingDate = new Date('2025-11-20')
    return today.toDateString() === weddingDate.toDateString()
  }

  const isTimeGatedAvailable = (item: GuestMenuItem) => {
    if (!item.timeGated || !item.availableDate) return true
    return new Date() >= item.availableDate || isWeddingDay()
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const result = await logout()

      if (result.success) {
        // Close menu
        setIsOpen(false)

        // Redirect to home page
        router.push('/')
        router.refresh()
      } else {
        alert('Erro ao fazer logout. Por favor, tente novamente.')
      }
    } catch (error) {
      console.error('Logout error:', error)
      alert('Erro ao fazer logout. Por favor, tente novamente.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Get guest name from session, or use default
  const guestName = session?.guest?.name || 'Meu Espaço'
  const isLoggedIn = !!session?.guest
  const guestMenuItems = getGuestMenuItems(session?.guest?.invitation_code)

  // When NOT logged in: Show simple invitation button
  if (!loading && !isLoggedIn) {
    return (
      <Link
        href="/convite"
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 min-h-[44px]"
        style={{
          fontFamily: 'var(--font-playfair)',
          color: 'var(--secondary-text)',
          fontWeight: '400',
          fontSize: '1rem',
          letterSpacing: '0.05em',
          background: 'transparent',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--primary-text)'
          e.currentTarget.style.background = 'var(--accent)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--secondary-text)'
          e.currentTarget.style.background = 'transparent'
        }}
        aria-label="Ver meu convite"
      >
        <Sparkles className="w-4 h-4" />
        <span>Meu Convite</span>
      </Link>
    )
  }

  // When logged in: Show full dropdown menu
  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button - Matches Navigation Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 min-h-[44px]"
        style={{
          fontFamily: 'var(--font-playfair)',
          color: isOpen ? 'var(--primary-text)' : 'var(--secondary-text)',
          fontWeight: isOpen ? '500' : '400',
          fontSize: '1rem',
          letterSpacing: '0.05em',
          background: isOpen ? 'var(--accent)' : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.color = 'var(--primary-text)'
            e.currentTarget.style.background = 'var(--accent)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.color = 'var(--secondary-text)'
            e.currentTarget.style.background = 'transparent'
          }
        }}
        aria-label="Menu de convidados"
        aria-expanded={isOpen}
      >
        <Sparkles className="w-4 h-4" />
        <span className="max-w-[150px] truncate">{loading ? 'Meu Espaço' : guestName}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 rounded-xl overflow-hidden shadow-2xl z-50"
            style={{
              background: 'var(--white-soft)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 border-b"
              style={{
                background: 'var(--primary-text)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--white-soft)',
                  letterSpacing: '0.02em',
                }}
              >
                Experiência do Convidado
              </h3>
              <p
                className="mt-1"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontStyle: 'italic',
                  fontSize: '0.75rem',
                  color: 'var(--accent)',
                }}
              >
                Acesse recursos exclusivos
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {guestMenuItems.map((item, index) => {
                const isAvailable = isTimeGatedAvailable(item)

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {isAvailable ? (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 transition-all duration-200 hover:bg-[var(--accent)]"
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className="flex-shrink-0 p-2 rounded-lg"
                            style={{
                              background: 'var(--decorative)',
                              color: 'var(--white-soft)',
                            }}
                          >
                            {item.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4
                                style={{
                                  fontFamily: 'var(--font-playfair)',
                                  fontSize: '0.9375rem',
                                  fontWeight: '600',
                                  color: 'var(--primary-text)',
                                }}
                              >
                                {item.name}
                              </h4>
                              {item.badge && (
                                <span
                                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                                  style={{
                                    fontFamily: 'var(--font-crimson)',
                                    background: item.badgeColor,
                                    color: 'var(--white-soft)',
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p
                              className="mt-0.5"
                              style={{
                                fontFamily: 'var(--font-crimson)',
                                fontSize: '0.8125rem',
                                color: 'var(--secondary-text)',
                                lineHeight: '1.4',
                              }}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="px-4 py-3 opacity-50 cursor-not-allowed">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className="flex-shrink-0 p-2 rounded-lg"
                            style={{
                              background: 'var(--decorative)',
                              color: 'white',
                            }}
                          >
                            {item.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4
                                style={{
                                  fontFamily: 'var(--font-playfair)',
                                  fontSize: '0.9375rem',
                                  fontWeight: '600',
                                  color: 'var(--secondary-text)',
                                }}
                              >
                                {item.name}
                              </h4>
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  fontFamily: 'var(--font-crimson)',
                                  background: 'var(--decorative)',
                                  color: 'white',
                                }}
                              >
                                Em breve
                              </span>
                            </div>
                            <p
                              className="mt-0.5"
                              style={{
                                fontFamily: 'var(--font-crimson)',
                                fontSize: '0.8125rem',
                                color: 'var(--secondary-text)',
                                lineHeight: '1.4',
                              }}
                            >
                              Disponível no dia do casamento
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Footer - Logout Button */}
            <div
              className="px-4 py-3 border-t"
              style={{
                borderColor: 'var(--border-subtle)',
                background: 'var(--accent)',
              }}
            >
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 disabled:opacity-50"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '0.875rem',
                  color: 'var(--secondary-text)',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? 'Saindo...' : 'Sair da Conta'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
