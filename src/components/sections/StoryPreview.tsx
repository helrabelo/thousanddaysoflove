'use client'

import { motion } from 'framer-motion'
import { Heart, Calendar, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionDivider, CardAccent } from '@/components/ui/BotanicalDecorations'
import Link from 'next/link'

export default function StoryPreview() {
  return (
    <section className="py-32" style={{ background: 'var(--background)' }}>
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
            Nossa História de Amor
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
            Caseiros e introvertidos de verdade. A gente é daqueles que realmente prefere ficar em casa. Unidos por boa comida (especialmente no Mangue Azul), vinhos que acompanham conversas longas, viagens quando dá, e 4 cachorros que fazem barulho demais mas a gente ama.
          </p>
          <SectionDivider className="mt-12" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-16">
          {/* Day 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card variant="wedding" className="relative group">
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
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    color: 'var(--primary-text)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
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
                    fontStyle: 'italic'
                  }}
                >
                  6 de janeiro de 2023. Aquele primeiro "oi" meio sem graça no WhatsApp. A gente quase nem respondeu. Três anos depois, casamento. Vai entender.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Day 500 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card variant="wedding" className="relative group">
              <CardAccent variant="corner" />
              <CardContent className="text-center">
                <div
                  className="w-16 h-16 flex items-center justify-center mx-auto mb-8 rounded-full"
                  style={{
                    background: 'var(--decorative)',
                    opacity: 0.9
                  }}
                >
                  <Star className="h-6 w-6" style={{ color: 'var(--white-soft)', strokeWidth: 1.5 }} />
                </div>
                <h3
                  className="mb-6"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    color: 'var(--primary-text)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
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
                    fontStyle: 'italic'
                  }}
                >
                  Hel ficou doente. Ylana apareceu com remédio e chá. "Na hora eu já sabia: 'é ela'". Simples assim.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Day 1000 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card variant="wedding" className="relative group">
              <CardAccent variant="corner" />
              <CardContent className="text-center">
                <div
                  className="w-16 h-16 flex items-center justify-center mx-auto mb-8 rounded-full"
                  style={{
                    background: 'var(--decorative)',
                    opacity: 0.9
                  }}
                >
                  <Calendar className="h-6 w-6" style={{ color: 'var(--white-soft)', strokeWidth: 1.5 }} />
                </div>
                <h3
                  className="mb-6"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    color: 'var(--primary-text)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
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
                    fontStyle: 'italic'
                  }}
                >
                  Esse apartamento? Hel passava de bicicleta aqui indo pra faculdade. Sonhava morar aqui um dia. Anos de trabalho. Literalmente anos. Agora é nosso. Casa própria. Família de 6. Primeira vez na vida que ele não quer chegar no próximo nível.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Button variant="wedding-outline" size="lg" asChild>
            <Link href="/historia">
              Leia Nossa História Completa
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}