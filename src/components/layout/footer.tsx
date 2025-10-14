"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Share2,
  Calendar,
  Gift,
  Users
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CountdownTimer from "@/components/ui/CountdownTimer"
import { cn } from "@/lib/utils"

export interface FooterProps {
  variant?: "default" | "minimal" | "extended"
  showCountdown?: boolean
  showSocialLinks?: boolean
  className?: string
}

const quickLinks = [
  { href: "/rsvp", label: "Confirmar Presença", icon: Users },
  { href: "/presentes", label: "Lista de Presentes", icon: Gift },
  { href: "/detalhes", label: "Detalhes do Evento", icon: Calendar }
]

const contactInfo = [
  {
    icon: Mail,
    label: "Email dos Noivos",
    value: "hel.ylana@thousandaysof.love",
    href: "mailto:hel.ylana@thousandaysof.love"
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "(11) 99999-9999",
    href: "https://wa.me/5511999999999"
  },
  {
    icon: MapPin,
    label: "Local da Cerimônia",
    value: "São Paulo, SP",
    href: "#venue"
  }
]

const Footer: React.FC<FooterProps> = ({
  variant = "default",
  showCountdown = true,
  showSocialLinks = true,
  className
}) => {
  if (variant === "minimal") {
    return (
      <footer className={cn("bg-white/90 backdrop-blur-sm border-t border-blush-200", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blush-400 to-blush-600 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-heading font-semibold text-burgundy-800">
                  Hel & Ylana
                </p>
                <p className="text-sm text-sage-600">20 de Novembro de 2025</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-sage-600">
                Feito com <Heart className="h-4 w-4 inline text-blush-500" /> para nosso grande dia
              </p>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className={cn("bg-gradient-to-t from-blush-50 to-white border-t border-blush-200", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Countdown Section */}
        {showCountdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-12 border-b border-blush-200"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-burgundy-800 mb-2">
                Nosso Grande Dia Está Chegando!
              </h2>
              <p className="text-sage-600 font-body">
                Acompanhe a contagem regressiva para o momento mais especial das nossas vidas
              </p>
            </div>
            <CountdownTimer className="max-w-4xl mx-auto" />
          </motion.div>
        )}

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Couple Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blush-400 to-blush-600 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white animate-heartbeat" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-burgundy-800">
                    Hel & Ylana
                  </h3>
                  <p className="text-sage-600 font-body">1000 Dias de Amor</p>
                </div>
              </div>

              <p className="text-sm text-sage-700 font-body leading-relaxed">
                Celebrando nosso amor e compartilhando a alegria do nosso casamento com as pessoas mais especiais das nossas vidas.
              </p>

              <div className="text-center p-4 bg-gradient-to-r from-blush-100 to-cream-100 rounded-lg border border-blush-200">
                <p className="text-lg font-heading font-semibold text-burgundy-800 mb-1">
                  20 de Novembro de 2025
                </p>
                <p className="text-sm text-sage-600">
                  São Paulo, SP
                </p>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-heading font-semibold text-burgundy-800">
                Links Rápidos
              </h3>

              <nav className="space-y-2">
                {quickLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-2 text-sage-700 hover:text-blush-600 transition-colors duration-200 group"
                    >
                      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-body">{link.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {showSocialLinks && (
                <div className="pt-4 space-y-3">
                  <h4 className="text-sm font-medium text-burgundy-700">
                    Compartilhe Nosso Site
                  </h4>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Instagram className="h-4 w-4 mr-1" />
                      Instagram
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-heading font-semibold text-burgundy-800">
                Contato
              </h3>

              <div className="space-y-3">
                {contactInfo.map((contact) => {
                  const Icon = contact.icon
                  return (
                    <a
                      key={contact.label}
                      href={contact.href}
                      className="flex items-start space-x-3 text-sage-700 hover:text-blush-600 transition-colors duration-200 group"
                    >
                      <Icon className="h-4 w-4 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <p className="text-sm font-medium">{contact.label}</p>
                        <p className="text-sm font-body">{contact.value}</p>
                      </div>
                    </a>
                  )
                })}
              </div>
            </motion.div>

            {/* Wedding Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-heading font-semibold text-burgundy-800">
                Informações do Evento
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-blush-200">
                  <p className="text-sm font-medium text-burgundy-700 mb-1">
                    Cerimônia
                  </p>
                  <p className="text-sm text-sage-600 font-body">
                    18:00 - Local a ser confirmado
                  </p>
                </div>

                <div className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-blush-200">
                  <p className="text-sm font-medium text-burgundy-700 mb-1">
                    Recepção
                  </p>
                  <p className="text-sm text-sage-600 font-body">
                    19:30 - Festa até amanhecer
                  </p>
                </div>

                <div className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-blush-200">
                  <p className="text-sm font-medium text-burgundy-700 mb-1">
                    Dress Code
                  </p>
                  <p className="text-sm text-sage-600 font-body">
                    Traje esporte fino
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-6 border-t border-blush-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-sage-600">
              <span>Feito com</span>
              <Heart className="h-4 w-4 text-blush-500 animate-heartbeat" />
              <span>para nosso grande dia</span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-sage-600">
              <span>© 2025 Hel & Ylana</span>
              <span>•</span>
              <Link
                href="/rsvp"
                className="text-blush-600 hover:text-blush-700 font-medium"
              >
                Confirme sua presença
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

Footer.displayName = "Footer"

export { Footer }
