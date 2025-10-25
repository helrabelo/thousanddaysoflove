'use client'

/**
 * Messages From Loved Ones Component
 *
 * Displays all heartfelt messages from gift contributors in a beautiful,
 * consolidated section. Shows the community love and support for the couple.
 */

import { motion } from 'framer-motion'
import { MessageCircle, Heart } from 'lucide-react'
import { GiftWithProgress } from '@/lib/services/gifts'
import { getAllContributorMessages } from '@/lib/utils/giftMessaging'

interface MessagesFromLovedOnesProps {
  gifts: GiftWithProgress[]
}

export default function MessagesFromLovedOnes({ gifts }: MessagesFromLovedOnesProps) {
  const messages = getAllContributorMessages(gifts)

  // Don't render if no messages
  if (messages.length === 0) {
    return null
  }

  const formatBRL = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8" style={{ color: 'var(--decorative)' }} />
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)'
              }}
            >
              Mensagens de Quem Ama
            </h2>
            <Heart className="w-8 h-8" style={{ color: 'var(--decorative)' }} />
          </div>
          <div className="w-24 h-px mx-auto mb-6" style={{ background: 'var(--decorative)' }} />
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto italic"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'var(--secondary-text)'
            }}
          >
            Cada mensagem é um pedacinho de amor que guiaremos para sempre 💕
          </p>
        </motion.div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((msg, index) => (
            <motion.div
              key={`${msg.contributorName}-${msg.date}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl p-6 relative overflow-hidden group"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 12px var(--shadow-subtle)'
              }}
              whileHover={{
                y: -4,
                boxShadow: '0 8px 24px rgba(168, 168, 168, 0.15)'
              }}
            >
              {/* Decorative corner accent */}
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-10"
                style={{
                  background: 'linear-gradient(135deg, var(--decorative) 0%, transparent 100%)'
                }}
              />

              {/* Message Icon */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'var(--decorative)',
                    color: 'var(--white-soft)'
                  }}
                >
                  <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {msg.contributorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-lg truncate"
                    style={{
                      color: 'var(--primary-text)',
                      fontFamily: 'var(--font-crimson)'
                    }}
                  >
                    {msg.contributorName}
                  </h3>
                  <p
                    className="text-xs"
                    style={{
                      color: 'var(--decorative)',
                      fontFamily: 'var(--font-crimson)'
                    }}
                  >
                    {msg.giftName}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div
                className="mb-4 p-3 rounded-lg relative"
                style={{
                  background: 'var(--accent)',
                  borderLeft: '3px solid var(--decorative)'
                }}
              >
                <MessageCircle
                  className="absolute -top-2 -left-2 w-5 h-5"
                  style={{ color: 'var(--decorative)' }}
                />
                <p
                  className="text-sm italic leading-relaxed"
                  style={{
                    color: 'var(--secondary-text)',
                    fontFamily: 'var(--font-crimson)'
                  }}
                >
                  "{msg.message}"
                </p>
              </div>

              {/* Message Footer */}
              <div className="flex items-center justify-end text-xs">
                <span
                  style={{
                    color: 'var(--secondary-text)',
                    fontFamily: 'var(--font-crimson)'
                  }}
                >
                  {formatDate(msg.date)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p
            className="text-sm italic max-w-xl mx-auto"
            style={{
              color: 'var(--secondary-text)',
              fontFamily: 'var(--font-crimson)'
            }}
          >
            Cada contribuição e mensagem torna nosso sonho mais real.
            Obrigado por fazer parte da nossa história! 💝
          </p>
        </motion.div>
      </div>
    </section>
  )
}
