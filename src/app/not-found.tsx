'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardAccent } from '@/components/ui/BotanicalDecorations'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CardAccent variant="corner" className="opacity-40" />

          <div
            className="p-16 rounded-lg mb-8"
            style={{
              background: 'var(--white-soft)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 12px var(--shadow-subtle)'
            }}
          >
            {/* Large 404 with heart */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div
                className="text-9xl font-light mb-4"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--decorative)',
                  letterSpacing: '0.1em'
                }}
              >
                4♥4
              </div>
            </motion.div>

            {/* Romantic message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8"
            >
              <h1
                className="text-3xl font-semibold mb-4"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)'
                }}
              >
                Parece que você se perdeu...
              </h1>

              <p
                className="text-xl mb-6"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic',
                  lineHeight: '1.8'
                }}
              >
                Mas o amor sempre encontra um caminho de volta 💕
              </p>

              <p
                className="text-lg"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  lineHeight: '1.6'
                }}
              >
                Assim como Hel e Ylana encontraram um ao outro depois de mil dias,
                vamos ajudar você a encontrar o caminho certo.
              </p>
            </motion.div>

            {/* Navigation options */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link href="/">
                <Button
                  variant="wedding"
                  className="flex items-center gap-2 px-8 py-3"
                >
                  <Home className="w-4 h-4" />
                  Voltar ao Início
                </Button>
              </Link>

              <Link href="/rsvp">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-8 py-3"
                >
                  <Heart className="w-4 h-4" />
                  Confirmar Presença
                </Button>
              </Link>
            </motion.div>

            {/* Fun suggestion */}
            <motion.div
              className="mt-12 pt-8"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <p
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic'
                }}
              >
                Enquanto você está aqui, que tal conhecer nossa{' '}
                <Link
                  href="/galeria"
                  className="underline hover:no-underline transition-all duration-200"
                  style={{ color: 'var(--primary-text)' }}
                >
                  história de amor em fotos
                </Link>
                {' '}ou conferir nossa{' '}
                <Link
                  href="/presentes"
                  className="underline hover:no-underline transition-all duration-200"
                  style={{ color: 'var(--primary-text)' }}
                >
                  lista de presentes
                </Link>?
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}