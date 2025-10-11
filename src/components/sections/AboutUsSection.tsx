'use client'

import { motion } from 'framer-motion'
import { Heart, Home, Camera, Dumbbell, Wine, Plane, Coffee, PawPrint } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { SectionDivider, CardAccent } from '@/components/ui/BotanicalDecorations'

export default function AboutUsSection() {
  return (
    <section className="py-32" style={{ background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
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
            Sobre Nós
          </h2>
          <p
            className="max-w-4xl mx-auto mb-12"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              lineHeight: '1.8',
              color: 'var(--secondary-text)',
              fontStyle: 'italic'
            }}
          >
            "Tem o que as pessoas sabem. Tem o que elas veem. E tem o que a gente tem entre a gente.<br />
            E isso é muito maior do que qualquer um imagina."
          </p>
          <SectionDivider />
        </motion.div>

        {/* Personalidades & Paixões */}
        <div className="grid lg:grid-cols-2 gap-20 mb-24">
          {/* Personalidades */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card variant="wedding" className="relative group h-full">
              <CardAccent variant="corner" />
              <CardContent className="text-center">
                <div
                  className="w-16 h-16 flex items-center justify-center mx-auto mb-8 rounded-full"
                  style={{
                    background: 'var(--decorative)',
                    opacity: 0.9
                  }}
                >
                  <Home className="h-6 w-6" style={{ color: 'var(--white-soft)', strokeWidth: 1.5 }} />
                </div>
                <h3
                  className="mb-6"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.75rem',
                    fontWeight: '500',
                    color: 'var(--primary-text)',
                    letterSpacing: '0.1em'
                  }}
                >
                  Caseiros & Introvertidos de Verdade
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '1.125rem',
                    lineHeight: '1.8',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic'
                  }}
                >
                  A gente é daqueles que realmente prefere ficar em casa. Receber amigos aqui (grupos pequenos, por favor - introvertidos, lembra?), fazer aquela comida boa, conversar até tarde. Nosso programa perfeito tá aqui dentro, não lá fora.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Paixões Compartilhadas */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card variant="wedding" className="relative group h-full">
              <CardAccent variant="corner" />
              <CardContent className="text-center">
                <div
                  className="w-16 h-16 flex items-center justify-center mx-auto mb-8 rounded-full"
                  style={{
                    background: 'var(--decorative)',
                    opacity: 0.9
                  }}
                >
                  <Heart className="h-6 w-6" style={{ color: 'var(--white-soft)', strokeWidth: 1.5 }} />
                </div>
                <h3
                  className="mb-6"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.75rem',
                    fontWeight: '500',
                    color: 'var(--primary-text)',
                    letterSpacing: '0.1em'
                  }}
                >
                  O Que A Gente Curte
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '1.125rem',
                    lineHeight: '1.8',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic'
                  }}
                >
                  Boa comida (Mangue Azul era praticamente nossa segunda casa). Vinho bom que acompanha conversa boa. Viagens quando dá. Academia juntos (porque alguém tem que puxar o outro pra não desistir).
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Grid de Interesses */}
        <div className="grid md:grid-cols-4 gap-8 mb-24">
          {/* Ylana - Moda */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div
              className="w-12 h-12 flex items-center justify-center mx-auto mb-6 rounded-full"
              style={{
                background: 'var(--accent)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span className="text-2xl">✨</span>
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: 'var(--primary-text)',
                marginBottom: '0.5rem'
              }}
            >
              Ylana & Criatividade
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: '0.9rem',
                color: 'var(--secondary-text)',
                fontStyle: 'italic'
              }}
            >
              Moda, estilo e pensamento no futuro
            </p>
          </motion.div>

          {/* Hel - Fotografia */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div
              className="w-12 h-12 flex items-center justify-center mx-auto mb-6 rounded-full"
              style={{
                background: 'var(--accent)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Camera className="h-5 w-5" style={{ color: 'var(--decorative)' }} />
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: 'var(--primary-text)',
                marginBottom: '0.5rem'
              }}
            >
              Hel & Tecnologia
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: '0.9rem',
                color: 'var(--secondary-text)',
                fontStyle: 'italic'
              }}
            >
              Fotografia e trabalho duro
            </p>
          </motion.div>

          {/* Fitness Juntos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div
              className="w-12 h-12 flex items-center justify-center mx-auto mb-6 rounded-full"
              style={{
                background: 'var(--accent)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Dumbbell className="h-5 w-5" style={{ color: 'var(--decorative)' }} />
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: 'var(--primary-text)',
                marginBottom: '0.5rem'
              }}
            >
              Fitness Juntos
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: '0.9rem',
                color: 'var(--secondary-text)',
                fontStyle: 'italic'
              }}
            >
              Musculação e corrida
            </p>
          </motion.div>

          {/* Viagens */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div
              className="w-12 h-12 flex items-center justify-center mx-auto mb-6 rounded-full"
              style={{
                background: 'var(--accent)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Plane className="h-5 w-5" style={{ color: 'var(--decorative)' }} />
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: 'var(--primary-text)',
                marginBottom: '0.5rem'
              }}
            >
              Viagens
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: '0.9rem',
                color: 'var(--secondary-text)',
                fontStyle: 'italic'
              }}
            >
              Explorando o mundo
            </p>
          </motion.div>
        </div>

        {/* Nossa Família de 4 Pets */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Card variant="wedding" className="relative group">
            <CardAccent variant="corner" />
            <CardContent className="text-center">
              <div
                className="w-20 h-20 flex items-center justify-center mx-auto mb-8 rounded-full"
                style={{
                  background: 'var(--decorative)',
                  opacity: 0.9
                }}
              >
                <PawPrint className="h-8 w-8" style={{ color: 'var(--white-soft)', strokeWidth: 1.5 }} />
              </div>
              <h3
                className="mb-6"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '2rem',
                  fontWeight: '500',
                  color: 'var(--primary-text)',
                  letterSpacing: '0.1em'
                }}
              >
                Nossa Família: Agora Somos 6
              </h3>
              <p
                className="mb-8"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1.25rem',
                  lineHeight: '1.8',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic'
                }}
              >
                Começou com Linda. Depois Cacao (a Ylana não deu muita escolha pro Hel). Aí a Linda resolveu ter 4 filhotes - ficamos com Olivia e Oliver. De 2 pra 4. A casa não tem mais silêncio, mas tem muito mais vida.
              </p>

              {/* Grid dos Pets */}
              <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div
                    className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full"
                    style={{
                      background: 'var(--accent)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span className="text-2xl">👑</span>
                  </div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '1.125rem',
                      fontWeight: '500',
                      color: 'var(--primary-text)',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Linda 👑
                  </h4>
                  <p
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '0.9rem',
                      color: 'var(--secondary-text)',
                      fontStyle: 'italic'
                    }}
                  >
                    Veio primeiro. Autista, síndrome de Down, rainha absoluta desta casa.
                  </p>
                </div>

                <div className="text-center">
                  <div
                    className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full"
                    style={{
                      background: 'var(--accent)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span className="text-2xl">🍫</span>
                  </div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '1.125rem',
                      fontWeight: '500',
                      color: 'var(--primary-text)',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Cacao 🍫
                  </h4>
                  <p
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '0.9rem',
                      color: 'var(--secondary-text)',
                      fontStyle: 'italic'
                    }}
                  >
                    1 libra de Spitz Alemão. Volume no máximo 24/7. Hel paga o aluguel dela. Hel limpa a m*rda dela. Casamento, né?
                  </p>
                </div>

                <div className="text-center">
                  <div
                    className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full"
                    style={{
                      background: 'var(--accent)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span className="text-2xl">🌸</span>
                  </div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '1.125rem',
                      fontWeight: '500',
                      color: 'var(--primary-text)',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Olivia 🌸
                  </h4>
                  <p
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '0.9rem',
                      color: 'var(--secondary-text)',
                      fontStyle: 'italic'
                    }}
                  >
                    Filha da Linda. A calma da família (alguém tinha que ser).
                  </p>
                </div>

                <div className="text-center">
                  <div
                    className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full"
                    style={{
                      background: 'var(--accent)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '1.125rem',
                      fontWeight: '500',
                      color: 'var(--primary-text)',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Oliver ⚡
                  </h4>
                  <p
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '0.9rem',
                      color: 'var(--secondary-text)',
                      fontStyle: 'italic'
                    }}
                  >
                    Filho da Linda. Energia pura. Cacao versão 2.0 no quesito barulho.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}