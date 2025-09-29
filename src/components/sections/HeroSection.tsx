'use client'

import { motion } from 'framer-motion'
import CountdownTimer from '@/components/ui/CountdownTimer'
import { Heart, Calendar, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { CONSTABLE_GALERIE } from '@/lib/utils/maps'
import { CornerFlourish, SectionDivider } from '@/components/ui/BotanicalDecorations'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Fundo com cor do convite */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--background)' }}
      />

      {/* Elegant botanical corner flourishes */}
      <CornerFlourish position="top-right" size="lg" className="top-16 right-16" />
      <CornerFlourish position="bottom-left" size="lg" className="bottom-16 left-16" />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Monograma H ♥ Y */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="wedding-monogram mb-8"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(4rem, 10vw, 7rem)',
            fontWeight: '300',
            color: 'var(--primary-text)',
            letterSpacing: '0.15em',
            lineHeight: '1.1'
          }}
        >
          H <span className="heart-symbol text-[var(--decorative)]" style={{ fontSize: '0.9em' }}>♥</span> Y
        </motion.div>

        {/* Nomes dos noivos */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="mb-8"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: '400',
            color: 'var(--primary-text)',
            letterSpacing: '0.15em',
            lineHeight: '1.2',
            textTransform: 'uppercase'
          }}
        >
          Hel & Ylana
        </motion.div>

        {/* Texto elegante */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-12 max-w-2xl mx-auto text-center"
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: '400',
            lineHeight: '1.8',
            color: 'var(--secondary-text)',
            fontStyle: 'italic'
          }}
        >
          Do primeiro "oi" no WhatsApp até o altar no Constable Galerie<br />
          <span style={{ fontSize: '1.1em', fontWeight: 500, color: 'var(--primary-text)' }}>1000 dias de puro amor</span><br />
          <span style={{ fontSize: '0.9em', opacity: 0.8, marginTop: '0.5rem', display: 'block' }}>"O que temos entre nós é muito maior do que qualquer um pode imaginar"</span>
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <CountdownTimer />
        </motion.div>

        {/* Divisor botânico */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <SectionDivider />
        </motion.div>

        {/* Informações do evento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16 max-w-4xl mx-auto"
        >
          <div
            className="grid md:grid-cols-3 gap-12 text-center p-12 rounded-lg"
            style={{
              background: 'var(--white-soft)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 8px var(--shadow-subtle)'
            }}
          >
            <div className="ceremony-details">
              <Calendar className="w-6 h-6 mx-auto mb-6" style={{ color: 'var(--decorative)', strokeWidth: 1.5 }} />
              <h3
                className="font-medium mb-4 uppercase"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                  letterSpacing: '0.1em',
                  fontSize: '1.125rem'
                }}
              >
                Data
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1.125rem',
                  lineHeight: '1.6',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic'
                }}
              >
                20 de Novembro de 2025<br />
                <span style={{ color: 'var(--decorative)' }}>Exatamente 1000 dias desde 6 de janeiro de 2023</span>
              </p>
            </div>

            <div className="ceremony-details">
              <Clock className="w-6 h-6 mx-auto mb-6" style={{ color: 'var(--decorative)', strokeWidth: 1.5 }} />
              <h3
                className="font-medium mb-4 uppercase"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                  letterSpacing: '0.1em',
                  fontSize: '1.125rem'
                }}
              >
                Horário
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1.125rem',
                  lineHeight: '1.6',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic'
                }}
              >
                10h30 da manhã<br />
                <span style={{ color: 'var(--decorative)' }}>Cerimônia entre amigos e família</span>
              </p>
            </div>

            <div className="ceremony-details">
              <MapPin className="w-6 h-6 mx-auto mb-6" style={{ color: 'var(--decorative)', strokeWidth: 1.5 }} />
              <h3
                className="font-medium mb-4 uppercase"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                  letterSpacing: '0.1em',
                  fontSize: '1.125rem'
                }}
              >
                Local
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1.125rem',
                  lineHeight: '1.6',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic'
                }}
              >
                {CONSTABLE_GALERIE.name}<br />
                <span style={{ color: 'var(--decorative)' }}>Onde a arte encontra o amor</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Botões de ação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center"
        >
          <Button
            variant="wedding"
            size="lg"
            asChild
          >
            <Link href="/rsvp" className="flex items-center">
              <Heart className="inline-block w-5 h-5 mr-3" style={{ strokeWidth: 1.5 }} />
              Confirmar Presença
            </Link>
          </Button>

          <Button
            variant="wedding-outline"
            size="lg"
            asChild
          >
            <Link href="/presentes" className="flex items-center">
              Lista de Presentes
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}