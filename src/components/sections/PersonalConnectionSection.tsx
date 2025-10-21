'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Coffee, Camera } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionDivider } from '@/components/ui/BotanicalDecorations'
import Link from 'next/link'

interface PersonaCard {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  connectionPoint: string
  callToAction: string
  href: string
}

const personaCards: PersonaCard[] = [
  {
    id: 'close-friends',
    icon: <Heart className="w-6 h-6" />,
    title: 'Para Nossos Amigos do Coração',
    description: 'Vocês acompanharam nossa história desde o início. Viram nossos sorrisos quando falávamos um do outro, comemoraram nossos marcos e fizeram parte da nossa jornada.',
    connectionPoint: 'Vocês já sabem: somos caseiros que adoram receber. Venham celebrar em nosso estilo: com muito amor, boa comida e momentos especiais entre pessoas queridas.',
    callToAction: 'Confirmar Presença',
    href: '/rsvp'
  },
  {
    id: 'family',
    icon: <Users className="w-6 h-6" />,
    title: 'Para Nossa Família Querida',
    description: 'Vocês nos viram crescer, apoiaram nossos sonhos e agora celebram conosco o maior deles: construir uma família juntos.',
    connectionPoint: 'Da nossa casa com Linda, Cacao, Olivia e Oliver, para a cerimônia na Casa HY - vocês sempre foram nossa base de amor e apoio.',
    callToAction: 'Detalhes do Evento',
    href: '/detalhes'
  },
  {
    id: 'colleagues',
    icon: <Coffee className="w-6 h-6" />,
    title: 'Para Nossos Colegas e Conhecidos',
    description: 'Talvez vocês não conheçam todos os detalhes da nossa história, mas sabem o essencial: somos um casal que se completa e trabalha duro pelos nossos sonhos.',
    connectionPoint: 'Hel trabalhou anos para conseguir nossa casa própria. Ylana pensa sempre no futuro. Juntos, construímos algo especial que queremos celebrar com vocês.',
    callToAction: 'Conhecer Nossa História',
    href: '/historia'
  },
  {
    id: 'plus-ones',
    icon: <Camera className="w-6 h-6" />,
    title: 'Para Quem Está Conhecendo Nossa História',
    description: 'Bem-vindos ao nosso mundo! Somos Hel & Ylana, um casal caseiro e introvertido que encontrou no amor de casa a base para uma vida feliz.',
    connectionPoint: 'Em 1000 dias, do primeiro "oi" no WhatsApp até o altar, construímos uma história linda com nossos 4 pets e muitos sonhos realizados.',
    callToAction: 'Ver Nossa Galeria',
    href: '/galeria'
  }
]

const sharedMoments = [
  {
    title: 'Casa Fontana & Avatar',
    description: 'Nosso primeiro encontro que já mostrou nossa sintonia perfeita'
  },
  {
    title: 'O Apartamento dos Sonhos',
    description: 'Da bicicleta da faculdade até a chave na mão - sonho realizado'
  },
  {
    title: 'Nossa Família de 4 Pets',
    description: 'Linda, Cacao, Olivia e Oliver completam nosso universo de amor'
  },
  {
    title: 'Mangue Azul',
    description: 'O restaurante favorito que se não tivesse fechado, seria onde nos casaríamos'
  }
]

export default function PersonalConnectionSection() {
  return (
    <section className="py-32" >
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        {/* Header Principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
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
            Para Cada Pessoa Especial
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
            Cada convidado nosso tem um lugar especial em nossos corações. Seja você família, amigo íntimo ou alguém que está conhecendo nossa história agora, sua presença torna este dia ainda mais especial.
          </p>
          <SectionDivider className="mt-12" />
        </motion.div>

        {/* Cards de Personas */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {personaCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card variant="wedding" className="h-full group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  {/* Ícone e Título */}
                  <div className="flex items-center mb-6">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                      style={{
                        background: 'var(--decorative)',
                        opacity: 0.9
                      }}
                    >
                      <div style={{ color: 'var(--white-soft)' }}>
                        {card.icon}
                      </div>
                    </div>
                    <h3
                      className="text-xl font-semibold"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        color: 'var(--primary-text)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {card.title}
                    </h3>
                  </div>

                  {/* Descrição */}
                  <p
                    className="mb-6"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1.125rem',
                      lineHeight: '1.7',
                      color: 'var(--secondary-text)',
                      fontStyle: 'italic'
                    }}
                  >
                    {card.description}
                  </p>

                  {/* Ponto de Conexão */}
                  <div
                    className="p-4 rounded-lg mb-6"
                    style={{
                      background: 'var(--accent)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        color: 'var(--primary-text)',
                        fontStyle: 'italic'
                      }}
                    >
                      {card.connectionPoint}
                    </p>
                  </div>

                  {/* Call to Action */}
                  <div className="text-center">
                    <Button variant="wedding-outline" size="lg" asChild>
                      <Link href={card.href}>
                        {card.callToAction}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Momentos Compartilhados */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div
            className="rounded-xl p-12"
            style={{
              background: 'var(--white-soft)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 8px 32px var(--shadow-subtle)'
            }}
          >
            <h3
              className="text-center text-3xl font-bold mb-8"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
                letterSpacing: '0.1em'
              }}
            >
              Momentos que Marcaram Nossa Jornada
            </h3>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {sharedMoments.map((moment, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="w-3 h-3 rounded-full mt-2 mr-4 flex-shrink-0"
                    style={{ background: 'var(--decorative)' }}
                  />
                  <div>
                    <h4
                      className="font-semibold mb-2"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        color: 'var(--primary-text)',
                        fontSize: '1.125rem'
                      }}
                    >
                      {moment.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        color: 'var(--secondary-text)',
                        fontStyle: 'italic',
                        lineHeight: '1.6'
                      }}
                    >
                      {moment.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mensagem Final Universal */}
            <div className="text-center">
              <p
                className="text-xl mb-6"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic',
                  lineHeight: '1.7'
                }}
              >
                Independente de como você chegou até nossa história, o importante é que você está aqui.
                Sua presença no nosso dia especial é o presente mais valioso que podemos receber.
              </p>
              <div
                className="inline-block px-6 py-3 rounded-lg"
                style={{
                  background: 'var(--decorative)',
                  color: 'var(--white-soft)'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    letterSpacing: '0.05em'
                  }}
                >
                  20 de Novembro • 11h15 • Casa HY
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
