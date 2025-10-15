'use client'

import { motion } from 'framer-motion'
import { Heart, Sparkles, Home, Baby, Calendar, Plane, Gift } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { SectionDivider } from '@/components/ui/BotanicalDecorations'

interface JourneyMoment {
  id: string
  icon: React.ReactNode
  title: string
  date: string
  emotion: string
  description: string
  impact: 'low' | 'medium' | 'high' | 'peak'
  color: string
}

const journeyMoments: JourneyMoment[] = [
  {
    id: 'match',
    icon: <Sparkles className="w-6 h-6" />,
    title: 'O Match que Mudou Tudo',
    date: '6 de janeiro de 2023',
    emotion: 'Curiosidade & Esperança',
    description: 'Do Tinder ao WhatsApp. Primeiro "oi" que se tornaria mil dias de amor.',
    impact: 'medium',
    color: 'var(--decorative)'
  },
  {
    id: 'gesto',
    icon: <Heart className="w-6 h-6" />,
    title: 'O Gesto Definitivo',
    date: '15 de fevereiro de 2023',
    emotion: 'Certeza Absoluta',
    description: 'Remédio e chá quando estava doente. "Na hora eu já sabia: é ela".',
    impact: 'peak',
    color: 'var(--primary-text)'
  },
  {
    id: 'pedido',
    icon: <Calendar className="w-6 h-6" />,
    title: 'Guaramiranga Espontâneo',
    date: '25 de fevereiro de 2023',
    emotion: 'Amor Transbordante',
    description: 'Não conseguiu esperar o jantar. O coração não sabe de planos.',
    impact: 'peak',
    color: 'var(--primary-text)'
  },
  {
    id: 'casa',
    icon: <Home className="w-6 h-6" />,
    title: 'Casa Própria dos Sonhos',
    date: 'Março de 2024',
    emotion: 'Realização & Conquista',
    description: 'O apartamento que Hel passava de bicicleta sonhando na faculdade.',
    impact: 'high',
    color: 'var(--decorative)'
  },
  {
    id: 'familia',
    icon: <Baby className="w-6 h-6" />,
    title: 'Família Completa: 4 Pets',
    date: 'Março de 2024',
    emotion: 'Plenitude Familiar',
    description: 'Linda, Cacao, Olivia e Oliver. De 2 para 4 pets - lar cheio de amor.',
    impact: 'high',
    color: 'var(--decorative)'
  },
  {
    id: 'mangue',
    icon: <Plane className="w-6 h-6" />,
    title: 'Mangue Azul & Rio',
    date: 'Outubro de 2024',
    emotion: 'Celebração & Nostalgia',
    description: '2º aniversário no restaurante favorito. Se não tivesse fechado, casamento seria lá.',
    impact: 'high',
    color: 'var(--decorative)'
  },
  {
    id: 'pedido-casamento',
    icon: <Gift className="w-6 h-6" />,
    title: 'O Pedido Perfeito',
    date: '30 de agosto de 2025',
    emotion: 'Êxtase & Promessa',
    description: 'Icaraí surpresa. Câmeras ligadas, ajoelhado, anel na mão. "SIM" mais lindo do mundo.',
    impact: 'peak',
    color: 'var(--primary-text)'
  },
  {
    id: 'casamento',
    icon: <Heart className="w-6 h-6" />,
    title: 'Mil Dias Viram Para Sempre',
    date: '20 de novembro de 2025',
    emotion: 'Amor Eterno',
    description: 'Casa HY, 11h00. Caseiros celebrando com quem mais amam.',
    impact: 'peak',
    color: 'var(--primary-text)'
  }
]

export default function EmotionalJourneyMap() {
  const getImpactSize = (impact: JourneyMoment['impact']) => {
    const sizes = {
      low: 'w-16 h-16',
      medium: 'w-20 h-20',
      high: 'w-24 h-24',
      peak: 'w-28 h-28'
    }
    return sizes[impact]
  }

  const getImpactGlow = (impact: JourneyMoment['impact']) => {
    const glows = {
      low: '0 4px 15px rgba(168, 168, 168, 0.3)',
      medium: '0 6px 20px rgba(168, 168, 168, 0.4)',
      high: '0 8px 25px rgba(168, 168, 168, 0.5)',
      peak: '0 12px 35px rgba(44, 44, 44, 0.4), 0 0 20px rgba(168, 168, 168, 0.6)'
    }
    return glows[impact]
  }

  return (
    <section className="py-32" >
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        {/* Header */}
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
            Jornada de 1000 Dias
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
            Cada momento construiu o amor que celebramos hoje. Uma jornada emocional que nos trouxe até aqui.
          </p>
          <SectionDivider className="mt-12" />
        </motion.div>

        {/* Journey Timeline */}
        <div className="relative">
          {/* Linha Emocional Fluida */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `linear-gradient(to bottom,
                  var(--decorative) 0%,
                  var(--primary-text) 25%,
                  var(--decorative) 50%,
                  var(--primary-text) 75%,
                  var(--primary-text) 100%)`
              }}
            />
          </div>

          {/* Momentos da Jornada */}
          <div className="space-y-24">
            {journeyMoments.map((moment, index) => (
              <motion.div
                key={moment.id}
                className={`flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                } relative`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Card de Conteúdo */}
                <div className="w-5/12">
                  <Card
                    variant="wedding"
                    className="relative group transform transition-all duration-300 hover:scale-105"
                  >
                    <CardContent className="text-center">
                      {/* Emoção */}
                      <div
                        className="text-sm font-medium mb-4 uppercase tracking-wide"
                        style={{
                          color: 'var(--decorative)',
                          fontFamily: 'var(--font-playfair)',
                          letterSpacing: '0.1em'
                        }}
                      >
                        {moment.emotion}
                      </div>

                      {/* Título */}
                      <h3
                        className="text-2xl font-bold mb-3"
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          color: 'var(--primary-text)',
                          lineHeight: '1.3'
                        }}
                      >
                        {moment.title}
                      </h3>

                      {/* Data */}
                      <div
                        className="text-lg mb-4"
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          color: 'var(--decorative)',
                          fontWeight: '500'
                        }}
                      >
                        {moment.date}
                      </div>

                      {/* Descrição */}
                      <p
                        style={{
                          fontFamily: 'var(--font-crimson)',
                          fontSize: '1.125rem',
                          lineHeight: '1.8',
                          color: 'var(--secondary-text)',
                          fontStyle: 'italic'
                        }}
                      >
                        {moment.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Ícone Central com Impacto Visual */}
                <div className="w-2/12 flex justify-center relative z-10">
                  <motion.div
                    className={`${getImpactSize(moment.impact)} rounded-full flex items-center justify-center transition-all duration-300`}
                    style={{
                      background: moment.color,
                      boxShadow: getImpactGlow(moment.impact),
                      border: '4px solid var(--white-soft)'
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate: moment.impact === 'peak' ? 360 : 10
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div style={{ color: 'var(--white-soft)' }}>
                      {moment.icon}
                    </div>

                    {/* Pulso para momentos Peak */}
                    {moment.impact === 'peak' && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: `${moment.color}40` }}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.8, 0, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Espaço Visual */}
                <div className="w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call-to-Action Final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-32"
        >
          <div
            className="max-w-3xl mx-auto p-12 rounded-lg"
            style={{
              background: 'var(--white-soft)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 8px 32px var(--shadow-subtle)'
            }}
          >
            <h3
              className="text-3xl font-bold mb-6"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
                letterSpacing: '0.1em'
              }}
            >
              Faça Parte da Nossa História
            </h3>
            <p
              className="text-xl mb-8"
              style={{
                fontFamily: 'var(--font-crimson)',
                color: 'var(--secondary-text)',
                fontStyle: 'italic',
                lineHeight: '1.8'
              }}
            >
              Cada pessoa que celebra conosco torna este dia ainda mais especial.
              Sua presença é o presente mais valioso que podemos receber.
            </p>
            <div className="text-center">
              <span
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                  color: 'var(--decorative)',
                  fontWeight: '500'
                }}
              >
                20 de novembro de 2025 • 11h00 • Casa HY
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
