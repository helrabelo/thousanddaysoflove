'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    name: 'Nossa História',
    href: '/historia',
    icon: '♥',
    hoverMessage: 'Do \'oi\' ao altar 💕',
    easterEgg: 'primeiro oi no WhatsApp'
  },
  {
    name: 'Galeria',
    href: '/galeria',
    icon: '📸',
    hoverMessage: '1000 dias em 📸',
    easterEgg: 'nossos highlights'
  },
  {
    name: 'Confirmação',
    href: '/rsvp',
    icon: '💌',
    hoverMessage: 'Colabore com o TOC da Ylana, confirme!',
    easterEgg: 'é serio, confirme por favor'
  },
  {
    name: 'Lista de Presentes',
    href: '/presentes',
    icon: '🎁',
    hoverMessage: 'Bora coçar os bolsos! 💸',
    easterEgg: 'bancar nossa lua de mel de pobre premium+Max pro'
  },
  {
    name: 'Detalhes',
    href: '/detalhes',
    icon: '📍',
    hoverMessage: 'Tudo sobre o grande dia',
    easterEgg: 'horários, traje, estacionamento e mais'
  },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  // Detect scroll position
  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true) // Always show navbar on non-home pages
      return
    }

    const handleScroll = () => {
      // Show navbar after scrolling past the hero section (viewport height)
      const heroHeight = window.innerHeight
      setScrolled(window.scrollY > heroHeight * 0.85) // Trigger at 85% of hero height
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'var(--white-soft)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
      initial={false}
      animate={{
        y: isHomePage && !scrolled ? '-100%' : '0%',
        opacity: isHomePage && !scrolled ? 0 : 1
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center h-20">
          {/* Elegant Logo */}
          <Link href="/" className="flex flex-row items-center min-w-[44px] min-h-[44px] flex-shrink-0">
            <Image
              src="/hy-logo.svg"
              alt="H & Y"
              width={100}
              height={34}
              className="h-auto"
              style={{
                width: 'clamp(80px, 12vw, 100px)',
                filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))'
              }}
              priority
            />
          </Link>

          {/* Elegant Desktop Navigation */}
          <div className="hidden md:flex md:flex-row space-x-12 flex-1 justify-center">
            {navItems.map((item) => (
              <motion.div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="flex flex-row items-center gap-2 transition-all duration-300 relative min-h-[44px] px-2"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    color: 'var(--secondary-text)',
                    fontWeight: '400',
                    fontSize: '0.9rem',
                    letterSpacing: '0.1em',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary-text)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    setHoveredItem(item.name)
                    setShowTooltip(true)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--secondary-text)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    setHoveredItem(null)
                    setShowTooltip(false)
                  }}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm animate-gentle-bounce">
                    {item.icon}
                  </span>
                  {item.name}

                  {/* Tooltip romântico */}
                  {hoveredItem === item.name && showTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap z-50"
                      style={{
                        background: 'var(--white-soft)',
                        color: 'var(--primary-text)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 4px 12px var(--shadow-subtle)',
                        fontFamily: 'var(--font-crimson)',
                        fontStyle: 'italic'
                      }}
                    >
                      {item.hoverMessage}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)' }}></div>
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile menu button - Increased touch target */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden transition-colors lg:min-w-[44px] lg:min-h-[44px] lg:max-w-full flex flex-row items-end lg:items-center justify-end lg:justify-center lg:flex-shrink-0"
            style={{ color: 'var(--primary-text)' }}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Enhanced Elegant Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 bottom-0 md:hidden z-40 overflow-y-auto"
            style={{
              background: 'var(--white-soft)',
              paddingBottom: 'calc(32px + env(safe-area-inset-bottom))'
            }}
          >
            <div className="px-6 py-8">
              {/* Elegant Header with Monogram */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-center mb-8"
              >
                <div className="flex justify-center mb-3">
                  <Image
                    src="/hy-logo.svg"
                    alt="H & Y"
                    width={120}
                    height={41}
                    className="h-auto"
                    style={{
                      width: 'clamp(100px, 25vw, 120px)',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />
                </div>
                <div
                  className="text-xs tracking-widest uppercase"
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontStyle: 'italic',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.15em'
                  }}
                >
                  Celebre nosso amor
                </div>
                {/* Decorative divider */}
                <div className="mt-4 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-decorative to-transparent opacity-50" />
              </motion.div>

              {/* Menu Items - Card-based Layout with Stagger Animation */}
              <div className="space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{
                      delay: index * 0.08 + 0.2,
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block group"
                    >
                      <div
                        className="flex flex-row items-center gap-4 py-4 px-2 transition-all duration-200 min-h-[68px]"
                        style={{
                          touchAction: 'manipulation'
                        }}
                        onTouchStart={(e) => {
                          e.currentTarget.style.opacity = '0.7'
                        }}
                        onTouchEnd={(e) => {
                          e.currentTarget.style.opacity = '1'
                        }}
                      >
                        {/* Icon */}
                        <motion.div
                          className="flex flex-row items-center justify-center"
                          style={{
                            fontSize: '1.75rem'
                          }}
                          whileTap={{ scale: 1.1 }}
                        >
                          {item.icon}
                        </motion.div>

                        {/* Text Content */}
                        <div>
                          <div
                            style={{
                              fontFamily: 'var(--font-playfair)',
                              fontSize: '1.125rem',
                              fontWeight: '500',
                              letterSpacing: '0.05em',
                              color: 'var(--primary-text)',
                              marginBottom: '2px'
                            }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-crimson)',
                              fontStyle: 'italic',
                              fontSize: '0.8125rem',
                              color: 'var(--text-muted)',
                              letterSpacing: '0.02em',
                              lineHeight: '1.3',
                              opacity: 0.85
                            }}
                          >
                            {item.easterEgg}
                          </div>
                        </div>

                        {/* Chevron indicator */}
                        <div
                          style={{ color: 'var(--decorative)' }}
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Countdown Timer - Days Until Wedding */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.08 + 0.5 }}
                className="mt-10 pt-8 text-center"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontStyle: 'italic',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    marginBottom: '12px',
                    letterSpacing: '0.05em'
                  }}
                >
                  Contagem regressiva
                </div>
                <motion.div
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '2rem',
                    fontWeight: '600',
                    color: 'var(--primary-text)',
                    marginBottom: '8px'
                  }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  {Math.max(0, Math.ceil((new Date('2025-11-20').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} dias
                </motion.div>
                <div
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontStyle: 'italic',
                    fontSize: '0.75rem',
                    color: 'var(--decorative)',
                    letterSpacing: '0.05em'
                  }}
                >
                  até nosso grande dia ♥
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
