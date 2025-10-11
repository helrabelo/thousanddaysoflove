'use client'

import { motion } from 'framer-motion'
import { Gift, Users, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'
import { CONSTABLE_GALERIE } from '@/lib/utils/maps'
import { Card, CardContent } from '@/components/ui/card'
import { SectionDivider, CardAccent } from '@/components/ui/BotanicalDecorations'

const features = [
  {
    icon: Users,
    title: 'Confirmação',
    description: 'Junte-se a nós para celebrar nosso dia especial',
    href: '/rsvp'
  },
  {
    icon: Gift,
    title: 'Lista de Presentes',
    description: 'Nos ajude a começar nosso novo capítulo juntos',
    href: '/presentes'
  },
  {
    icon: Calendar,
    title: 'Cronograma',
    description: 'Datas importantes e eventos',
    href: '#timeline'
  },
  {
    icon: MapPin,
    title: 'Local',
    description: 'Casa HY - Fortaleza, CE',
    href: '/local'
  }
]

export default function QuickPreview() {
  return (
    <section className="py-32" style={{ background: 'var(--accent)' }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2
            className="mb-8"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '600',
              color: 'var(--primary-text)',
              letterSpacing: '0.05em',
              lineHeight: '1.2'
            }}
          >
            Tudo Que Você Precisa
          </h2>
          <p
            className="max-w-4xl mx-auto"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              lineHeight: '1.8',
              color: 'var(--secondary-text)',
              fontStyle: 'italic'
            }}
          >
            Da confirmação à lista de presentes, facilitamos para você fazer parte da nossa celebração.
          </p>
          <SectionDivider className="mt-12" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <Link href={feature.href} className="block h-full">
                  <Card variant="elegant" className="h-full relative group cursor-pointer">
                    <CardAccent variant="top" className="opacity-30" />
                    <CardContent className="text-center h-full flex flex-col">
                      <div
                        className="w-14 h-14 flex items-center justify-center mx-auto mb-6 rounded-full transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: 'var(--decorative)',
                          opacity: 0.9
                        }}
                      >
                        <Icon className="h-6 w-6" style={{ color: 'var(--white-soft)', strokeWidth: 1.5 }} />
                      </div>

                      <h3
                        className="mb-4"
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: '1.25rem',
                          fontWeight: '500',
                          color: 'var(--primary-text)',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {feature.title}
                      </h3>

                      <p
                        className="mb-6 flex-1"
                        style={{
                          fontFamily: 'var(--font-crimson)',
                          fontSize: '1rem',
                          lineHeight: '1.6',
                          color: 'var(--secondary-text)',
                          fontStyle: 'italic'
                        }}
                      >
                        {feature.description}
                      </p>

                      <div
                        className="group-hover:underline transition-all duration-200"
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          color: 'var(--decorative)',
                          fontSize: '0.9rem',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          fontWeight: '500'
                        }}
                      >
                        {feature.title === 'Confirmação' ? 'Confirmar Presença' : feature.title === 'Local' ? 'Ver Localização' : 'Saiba Mais'}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Wedding Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <Card variant="invitation" className="relative">
            <CardAccent variant="corner" className="opacity-20" />
            <CardContent>
              <h3
                className="mb-12"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--primary-text)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
              >
                Reserve a Data: 20 de Novembro de 2025
              </h3>
              <SectionDivider className="mb-12" />
              <div className="grid md:grid-cols-4 gap-12">
                <div className="text-center">
                  <div
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: 'var(--primary-text)',
                      fontSize: '1rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: '500'
                    }}
                  >
                    Cerimônia
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1.125rem',
                      color: 'var(--secondary-text)',
                      fontStyle: 'italic',
                      lineHeight: '1.6'
                    }}
                  >
                    10:30h
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: 'var(--primary-text)',
                      fontSize: '1rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: '500'
                    }}
                  >
                    Local
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1.125rem',
                      color: 'var(--secondary-text)',
                      fontStyle: 'italic',
                      lineHeight: '1.6'
                    }}
                  >
                    {CONSTABLE_GALERIE.name}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: 'var(--primary-text)',
                      fontSize: '1rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: '500'
                    }}
                  >
                    Bairro
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1.125rem',
                      color: 'var(--secondary-text)',
                      fontStyle: 'italic',
                      lineHeight: '1.6'
                    }}
                  >
                    Eng. Luciano Cavalcante
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: 'var(--primary-text)',
                      fontSize: '1rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: '500'
                    }}
                  >
                    Dress Code
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1.125rem',
                      color: 'var(--secondary-text)',
                      fontStyle: 'italic',
                      lineHeight: '1.6'
                    }}
                  >
                    Traje Social
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}