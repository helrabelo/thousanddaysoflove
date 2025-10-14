'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, Image, Gift, MoreHorizontal } from 'lucide-react'
import MoreDrawer from './MoreDrawer'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  activeIcon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    name: 'Início',
    href: '/',
    icon: <Home className="w-5 h-5" strokeWidth={2} />,
    activeIcon: <Home className="w-5 h-5" strokeWidth={2.5} fill="currentColor" />,
  },
  {
    name: 'História',
    href: '/historia',
    icon: <Heart className="w-5 h-5" strokeWidth={2} />,
    activeIcon: <Heart className="w-5 h-5" strokeWidth={2.5} fill="currentColor" />,
  },
  {
    name: 'Galeria',
    href: '/galeria',
    icon: <Image className="w-5 h-5" strokeWidth={2} />,
    activeIcon: <Image className="w-5 h-5" strokeWidth={2.5} fill="currentColor" />,
  },
  {
    name: 'Presentes',
    href: '/presentes',
    icon: <Gift className="w-5 h-5" strokeWidth={2} />,
    activeIcon: <Gift className="w-5 h-5" strokeWidth={2.5} fill="currentColor" />,
  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Bottom Navigation Bar - HIDDEN */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-40 hidden"
        style={{
          background: 'var(--white-soft)',
          borderTop: '1px solid var(--border-subtle)',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
          boxShadow: '0 -2px 16px rgba(0, 0, 0, 0.08)',
        }}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-around px-2 pt-2">
          {/* Main Nav Items */}
          {navItems.map((item) => {
            const active = isActive(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center min-w-[60px] py-2 px-3 relative"
                style={{ touchAction: 'manipulation' }}
              >
                {/* Icon */}
                <motion.div
                  className="relative"
                  style={{
                    color: active ? 'var(--primary-text)' : 'var(--secondary-text)',
                  }}
                  whileTap={{ scale: 0.9 }}
                  animate={active ? { y: -2 } : { y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {active ? item.activeIcon : item.icon}

                  {/* Active indicator dot */}
                  {active && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: 'var(--primary-text)' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className="mt-1.5 text-xs"
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    color: active ? 'var(--primary-text)' : 'var(--secondary-text)',
                    fontWeight: active ? '600' : '400',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  {item.name}
                </span>
              </Link>
            )
          })}

          {/* More Button */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className="flex flex-col items-center justify-center min-w-[60px] py-2 px-3"
            style={{
              color: 'var(--secondary-text)',
              touchAction: 'manipulation',
            }}
            aria-label="Mais opções"
          >
            <motion.div whileTap={{ scale: 0.9 }}>
              <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
            </motion.div>
            <span
              className="mt-1.5 text-xs"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: '0.6875rem',
                letterSpacing: '0.02em',
              }}
            >
              Mais
            </span>
          </button>
        </div>
      </motion.nav>

      {/* More Drawer */}
      <MoreDrawer isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </>
  )
}
