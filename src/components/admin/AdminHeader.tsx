'use client'

/**
 * Admin Header Component
 * Navigation header for all admin pages
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Image, MessageSquare, LogOut } from 'lucide-react'

export default function AdminHeader() {
  const pathname = usePathname()

  // Don't show header on login page
  if (pathname === '/admin/login') {
    return null
  }

  const navItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/guests', icon: Users, label: 'Convidados' },
    { href: '/admin/photos', icon: Image, label: 'Fotos' },
    { href: '/admin/posts', icon: MessageSquare, label: 'Mensagens' },
  ]

  return (
    <header className="bg-white border-b border-[#E8E6E3] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Title */}
          <div>
            <Link href="/" className="text-sm text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors">
              ← Voltar ao Site
            </Link>
            <h1 className="text-2xl font-serif text-[#2C2C2C] mt-1">
              Admin - Thousand Days of Love
            </h1>
          </div>

          {/* Logout */}
          <Link
            href="/admin/login"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#4A4A4A] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex gap-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#2C2C2C] text-white'
                    : 'text-[#4A4A4A] hover:bg-[#F8F6F3] hover:text-[#2C2C2C]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
