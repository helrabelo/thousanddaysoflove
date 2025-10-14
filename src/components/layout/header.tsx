"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Heart,
  Home,
  Users,
  Gift,
  Calendar,
  MessageSquare,
  Camera
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface HeaderProps {
  variant?: "default" | "transparent" | "solid"
  showCountdown?: boolean
  className?: string
}

const navigationItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/nossa-historia", label: "Nossa História", icon: Heart },
  { href: "/rsvp", label: "Confirmar Presença", icon: Users },
  { href: "/presentes", label: "Lista de Presentes", icon: Gift },
  { href: "/fotos", label: "Galeria", icon: Camera },
  { href: "/detalhes", label: "Detalhes do Evento", icon: Calendar },
  { href: "/dia-1000", label: "Dia 1000", icon: MessageSquare }
]

const Header: React.FC<HeaderProps> = ({
  variant = "default",
  className
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const headerVariants = {
    default: cn(
      "bg-white/90 backdrop-blur-md border-b border-blush-200",
      isScrolled && "shadow-lg"
    ),
    transparent: cn(
      "bg-transparent",
      isScrolled && "bg-white/90 backdrop-blur-md border-b border-blush-200 shadow-lg"
    ),
    solid: "bg-white border-b border-blush-200 shadow-sm"
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          headerVariants[variant],
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blush-400 to-blush-600 rounded-full flex items-center justify-center group-hover:from-blush-500 group-hover:to-blush-700 transition-all duration-300">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-blush-600 to-burgundy-700 bg-clip-text text-transparent">
                    Hel & Ylana
                  </h1>
                  <p className="text-xs text-sage-600 -mt-1">11.11.2025</p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-blush-100 text-blush-700 shadow-sm"
                          : "text-sage-700 hover:bg-blush-50 hover:text-blush-600"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </nav>

            {/* RSVP Button (Desktop) */}
            <div className="hidden lg:block">
              <Link href="/rsvp">
                <Button
                  variant="romantic"
                  size="sm"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Confirmar Presença
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white/95 backdrop-blur-md border-t border-blush-200"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={item.href}>
                        <div
                          className={cn(
                            "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-blush-100 text-blush-700"
                              : "text-sage-700 hover:bg-blush-50 hover:text-blush-600"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navigationItems.length * 0.1 }}
                  className="pt-4 border-t border-blush-200"
                >
                  <Link href="/rsvp" className="w-full">
                    <Button
                      variant="romantic"
                      size="md"
                      className="w-full"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Confirmar Presença
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to prevent content overlap */}
      <div className="h-16" />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

Header.displayName = "Header"

export { Header }
