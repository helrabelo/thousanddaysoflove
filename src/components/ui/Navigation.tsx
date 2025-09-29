'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart } from 'lucide-react'
import Link from 'next/link'

const navItems = [
  {
    name: 'Nossa História',
    href: '/historia',
    icon: '♥',
    hoverMessage: 'Do Tinder ao altar 💕',
    easterEgg: 'primeiro oi no WhatsApp'
  },
  {
    name: 'Galeria',
    href: '/galeria',
    icon: '📸',
    hoverMessage: '1000 dias em fotografias 📸',
    easterEgg: 'cada momento capturado'
  },
  {
    name: 'Confirmação',
    href: '/rsvp',
    icon: '💌',
    hoverMessage: 'Venha celebrar conosco no Constable Galerie 📝',
    easterEgg: 'sua presença é o maior presente'
  },
  {
    name: 'Lista de Presentes',
    href: '/presentes',
    icon: '🎁',
    hoverMessage: 'Ajudem a construir nosso lar 🏠',
    easterEgg: 'apartamento dos sonhos'
  },
  {
    name: 'Local',
    href: '/local',
    icon: '📍',
    hoverMessage: 'Onde a arte encontra o amor 🎭',
    easterEgg: 'se Mangue Azul não tivesse fechado...'
  },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'var(--white-soft)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Elegant Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl" style={{ fontFamily: 'var(--monogram-font)', color: 'var(--primary-text)', fontWeight: '300', letterSpacing: '0.15em' }}>
              H <span className="heart-symbol">♥</span> Y
            </span>
          </Link>

          {/* Elegant Desktop Navigation */}
          <div className="hidden md:flex space-x-12">
            {navItems.map((item) => (
              <motion.div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center gap-2 transition-all duration-300 relative"
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

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 transition-colors"
            style={{ color: 'var(--primary-text)' }}
          >
            {isOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
            style={{ background: 'var(--white-soft)', borderTop: '1px solid var(--border-subtle)' }}
          >
            <div className="px-6 py-6 space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 transition-all duration-200 text-center py-2"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    color: 'var(--secondary-text)',
                    fontWeight: '400',
                    fontSize: '0.9rem',
                    letterSpacing: '0.1em'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary-text)'
                    e.currentTarget.style.background = 'var(--accent)'
                    e.currentTarget.style.borderRadius = '8px'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--secondary-text)'
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <span className="text-sm animate-gentle-bounce">{item.icon}</span>
                  {item.name}
                  <div className="text-xs opacity-60 mt-1" style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                    {item.easterEgg}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}