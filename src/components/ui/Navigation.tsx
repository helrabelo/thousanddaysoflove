'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart } from 'lucide-react'
import Link from 'next/link'

const navItems = [
  { name: 'Nossa História', href: '#story', icon: '♥' },
  { name: 'Galeria', href: '/galeria', icon: '📸' },
  { name: 'Confirmação', href: '/rsvp', icon: '💌' },
  { name: 'Lista de Presentes', href: '/presentes', icon: '🎁' },
  { name: 'Local', href: '/local', icon: '📍' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

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
                    fontFamily: 'var(--details-font)',
                    color: 'var(--secondary-text)',
                    fontWeight: '400',
                    fontSize: '0.9rem',
                    letterSpacing: '0.1em',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary-text)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--secondary-text)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
                    {item.icon}
                  </span>
                  {item.name}
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
                    fontFamily: 'var(--details-font)',
                    color: 'var(--secondary-text)',
                    fontWeight: '400',
                    fontSize: '0.9rem',
                    letterSpacing: '0.1em'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary-text)'
                    e.currentTarget.style.background = 'var(--accent)'
                    e.currentTarget.style.borderRadius = '8px'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--secondary-text)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}