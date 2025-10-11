'use client'

import { motion } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionDivider } from '@/components/ui/BotanicalDecorations'
import Link from 'next/link'
import Image from 'next/image'

export default function StoryPreview() {
  return (
    <section className="py-32" style={{ background: 'var(--accent)' }}>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        {/* Split Layout: Image Left, Content Right */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column - Sticky Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32 relative"
          >
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
              {/* Placeholder for proposal photo */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--decorative) 0%, var(--accent) 100%)',
                }}
              >
                <div className="text-center p-8">
                  <Heart
                    className="w-16 h-16 mx-auto mb-4"
                    style={{
                      color: 'var(--white-soft)',
                      strokeWidth: 1,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1.125rem',
                      color: 'var(--white-soft)',
                      fontStyle: 'italic',
                      opacity: 0.9,
                    }}
                  >
                    [Foto do Pedido]
                  </p>
                </div>
              </div>

              {/* Decorative border overlay */}
              <div
                className="absolute inset-0 border-8 rounded-lg pointer-events-none"
                style={{
                  borderColor: 'var(--white-soft)',
                  opacity: 0.1,
                }}
              />
            </div>

            {/* Caption below image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-6 text-center"
            >
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1rem',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic',
                  lineHeight: '1.6',
                }}
              >
                Uma jornada de mil dias começa com um simples "oi"
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Story Content */}
          <div className="space-y-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2
                className="mb-6"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  fontWeight: '600',
                  color: 'var(--primary-text)',
                  letterSpacing: '0.05em',
                  lineHeight: '1.2',
                }}
              >
                Nossa História
              </h2>
              <p
                className="mb-8"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  lineHeight: '1.8',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic',
                }}
              >
                Caseiros e introvertidos de verdade. A gente é daqueles que realmente prefere ficar em casa. Unidos por boa comida (especialmente no Mangue Azul), vinhos que acompanham conversas longas, viagens quando dá, e 4 cachorros que fazem barulho demais mas a gente ama.
              </p>
              <SectionDivider className="my-8" />
            </motion.div>

            {/* Story Moments */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              {/* Day 1 */}
              <div className="relative pl-8 border-l-2" style={{ borderColor: 'var(--decorative)' }}>
                <div
                  className="absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--decorative)',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--white-soft)' }}
                  />
                </div>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    color: 'var(--primary-text)',
                    letterSpacing: '0.05em',
                  }}
                >
                  Do Tinder ao WhatsApp
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '1.125rem',
                    lineHeight: '1.8',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic',
                  }}
                >
                  6 de janeiro de 2023. Aquele primeiro "oi" meio sem graça no WhatsApp. A gente quase nem respondeu. Três anos depois, casamento. Vai entender.
                </p>
              </div>

              {/* Day 500 */}
              <div className="relative pl-8 border-l-2" style={{ borderColor: 'var(--decorative)' }}>
                <div
                  className="absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--decorative)',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--white-soft)' }}
                  />
                </div>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    color: 'var(--primary-text)',
                    letterSpacing: '0.05em',
                  }}
                >
                  O Momento
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '1.125rem',
                    lineHeight: '1.8',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic',
                  }}
                >
                  Hel ficou doente. Ylana apareceu com remédio e chá. "Na hora eu já sabia: 'é ela'". Simples assim.
                </p>
              </div>

              {/* Day 1000 */}
              <div className="relative pl-8 border-l-2" style={{ borderColor: 'var(--decorative)' }}>
                <div
                  className="absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--decorative)',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--white-soft)' }}
                  />
                </div>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    color: 'var(--primary-text)',
                    letterSpacing: '0.05em',
                  }}
                >
                  A Casa
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '1.125rem',
                    lineHeight: '1.8',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic',
                  }}
                >
                  Esse apartamento? Hel passava de bicicleta aqui indo pra faculdade. Sonhava morar aqui um dia. Anos de trabalho. Literalmente anos. Agora é nosso. Casa própria. Família de 6. Primeira vez na vida que ele não quer chegar no próximo nível.
                </p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="pt-8"
            >
              <Button variant="wedding" size="lg" asChild className="group">
                <Link href="/historia" className="flex items-center gap-2">
                  Ver História Completa
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    style={{ strokeWidth: 2 }}
                  />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}