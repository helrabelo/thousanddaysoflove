'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import {
  X,
  Calendar,
  MessageCircle,
  Radio,
  MapPin,
  Sparkles,
  User,
} from 'lucide-react'

interface MoreDrawerProps {
  isOpen: boolean
  onClose: () => void
}

interface DrawerItem {
  name: string
  href: string
  icon: React.ReactNode
  description: string
  category: 'guest' | 'info'
  badge?: string
  badgeColor?: string
}

const drawerItems: DrawerItem[] = [
  // Guest Features
  {
    name: 'Meu Convite',
    href: '/convite',
    icon: <User className="w-5 h-5" />,
    description: 'Seu convite pessoal',
    category: 'guest',
  },
  {
    name: 'Dia 1000',
    href: '/dia-1000',
    icon: <Radio className="w-5 h-5" />,
    description: 'Feed ao vivo com mensagens e fotos',
    category: 'guest',
    badge: 'Novo',
    badgeColor: 'var(--decorative)',
  },
  {
    name: 'Timeline Ao Vivo',
    href: '/dia-1000/timeline',
    icon: <MessageCircle className="w-5 h-5" />,
    description: 'Agenda do dia com status ao vivo',
    category: 'guest',
  },
  // Info Pages
  {
    name: 'Confirmação',
    href: '/rsvp',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Confirme sua presença',
    category: 'info',
  },
  {
    name: 'Detalhes',
    href: '/detalhes',
    icon: <MapPin className="w-5 h-5" />,
    description: 'Horários e local',
    category: 'info',
  },
  {
    name: 'Convite Geral',
    href: '/convite',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Página do convite',
    category: 'info',
  },
]

export default function MoreDrawer({ isOpen, onClose }: MoreDrawerProps) {
  const shouldReduceMotion = useReducedMotion()

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const guestItems = drawerItems.filter((item) => item.category === 'guest')
  const infoItems = drawerItems.filter((item) => item.category === 'info')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl overflow-hidden"
            style={{
              background: 'var(--white-soft)',
              maxHeight: '85vh',
              paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.12)',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: shouldReduceMotion ? 'tween' : 'spring',
              damping: 25,
              stiffness: 300,
              duration: shouldReduceMotion ? 0.3 : undefined,
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div
                className="w-12 h-1.5 rounded-full"
                style={{ background: 'var(--decorative)' }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--primary-text)',
                  }}
                >
                  Mais Opções
                </h2>
                <p
                  className="mt-0.5"
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontStyle: 'italic',
                    fontSize: '0.875rem',
                    color: 'var(--secondary-text)',
                  }}
                >
                  Explore todas as funcionalidades
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                style={{
                  color: 'var(--secondary-text)',
                  background: 'var(--accent)',
                }}
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(85vh - 140px)' }}>
              {/* Guest Features Section */}
              <div className="mb-6">
                <h3
                  className="mb-3 px-2"
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                    color: 'var(--secondary-text)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Experiência do Convidado
                </h3>
                <div className="space-y-2">
                  {guestItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 min-h-[68px]"
                        style={{
                          background: 'var(--accent)',
                          border: '1px solid var(--border-subtle)',
                          touchAction: 'manipulation',
                        }}
                      >
                        {/* Icon */}
                        <div
                          className="flex-shrink-0 p-2.5 rounded-lg"
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
                                fontSize: '1rem',
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

                        {/* Arrow */}
                        <div style={{ color: 'var(--decorative)' }}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 4L13 10L7 16"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Info Pages Section */}
              <div>
                <h3
                  className="mb-3 px-2"
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                    color: 'var(--secondary-text)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Informações
                </h3>
                <div className="space-y-2">
                  {infoItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (guestItems.length + index) * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 min-h-[68px]"
                        style={{
                          background: 'var(--accent)',
                          border: '1px solid var(--border-subtle)',
                          touchAction: 'manipulation',
                        }}
                      >
                        {/* Icon */}
                        <div
                          className="flex-shrink-0 p-2.5 rounded-lg"
                          style={{
                            background: 'var(--decorative)',
                            color: 'white',
                          }}
                        >
                          {item.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4
                            style={{
                              fontFamily: 'var(--font-playfair)',
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: 'var(--primary-text)',
                            }}
                          >
                            {item.name}
                          </h4>
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

                        {/* Arrow */}
                        <div style={{ color: 'var(--decorative)' }}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 4L13 10L7 16"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer Help Text */}
              <div
                className="mt-6 p-4 rounded-xl text-center"
                style={{
                  background: 'var(--primary-text)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontStyle: 'italic',
                    fontSize: '0.875rem',
                    color: 'var(--white-soft)',
                    lineHeight: '1.5',
                  }}
                >
                  Precisa de ajuda?{' '}
                  <Link href="/convite" className="font-semibold underline" onClick={onClose}>
                    Entre em contato
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
