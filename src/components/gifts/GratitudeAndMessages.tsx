'use client'

/**
 * Gratitude and Messages Component
 *
 * Beautiful full-width section celebrating gift contributions.
 * Left side: Gratitude messages with creative stats
 * Right side: Heartfelt messages from contributors
 */

import { motion } from 'framer-motion'
import { Heart, MessageCircle, Trophy, Users, Sparkles, TrendingUp, Clock } from 'lucide-react'
import { GiftWithProgress } from '@/lib/services/gifts'
import { getAllContributorMessages, type ContributorMessage } from '@/lib/utils/giftMessaging'

interface GratitudeAndMessagesProps {
  gifts: GiftWithProgress[]
}

export default function GratitudeAndMessages({ gifts }: GratitudeAndMessagesProps) {
  const messages = getAllContributorMessages(gifts)

  // Don't render if no messages
  if (messages.length === 0) {
    return null
  }

  // Calculate creative statistics
  const stats = calculateCreativeStats(gifts, messages)

  const formatBRL = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  return (
    <section className="px-6 pb-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--decorative) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Split Layout: Gratitude (Left) | Messages (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT SIDE: Gratitude & Creative Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Main Gratitude Message */}
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--white-soft) 100%)',
                border: '2px solid var(--border-subtle)',
                boxShadow: '0 8px 32px rgba(168, 168, 168, 0.12)',
              }}
            >
              {/* Decorative glow */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
                style={{ background: 'var(--decorative)' }}
              />

              <div className="relative z-10">
                <h3
                  className="text-3xl font-bold mb-6"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    color: 'var(--primary-text)',
                  }}
                >
                  O nosso mais sincero obrigado
                </h3>
                <p
                  className="text-lg leading-relaxed mb-4"
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic',
                  }}
                >
                  Sério. A gente não esperava isso. Cada contribuição que cai aqui será traduzida
                  
                </p>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic',
                  }}
                >
                  Cada mensagem que vocês deixam aqui a gente lê, relê, e guarda.
                  Obrigado por fazer parte disso.
                </p>
              </div>
            </div>

            {/* Creative Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Gift */}
              {stats.firstGift && (
                <StatCard
                  icon={<Clock className="w-6 h-6" />}
                  title="Quem deu o pontapé"
                  value={stats.firstGift.contributorName}
                  subtitle={`${stats.firstGift.giftName}`}
                  accent="purple"
                />
              )}

              {/* Most Loved Gift */}
              {stats.mostLovedGift && (
                <StatCard
                  icon={<Trophy className="w-6 h-6" />}
                  title="O queridinho"
                  value={stats.mostLovedGift.giftName}
                  subtitle={`${stats.mostLovedGift.contributorCount} ${
                    stats.mostLovedGift.contributorCount === 1 ? 'pessoa' : 'pessoas'
                  }`}
                  accent="gold"
                />
              )}

              {/* Total Contributors */}
              <StatCard
                icon={<Users className="w-6 h-6" />}
                title="Gente boa que ajudou"
                value={`${stats.totalContributors}`}
                subtitle={stats.totalContributors === 1 ? 'pessoa contribuiu' : 'pessoas contribuíram'}
                accent="pink"
              />

              {/* Total Love (Money) */}
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Total arrecadado"
                value={formatBRL(stats.totalLove)}
                subtitle="até agora"
                accent="green"
              />
            </div>

            {/* Fun Message */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-xl p-6"
              style={{
                background: 'var(--accent)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <p
                className="text-center text-sm italic"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--secondary-text)',
                }}
              >
                ✨ {stats.funFact}
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: Messages from Contributors */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="rounded-2xl p-8 h-full"
              style={{
                background: 'var(--white-soft)',
                border: '2px solid var(--border-subtle)',
                boxShadow: '0 8px 32px rgba(168, 168, 168, 0.12)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle
                  className="w-8 h-8"
                  style={{ color: 'var(--decorative)' }}
                />
                <h3
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    color: 'var(--primary-text)',
                  }}
                >
                  O que vocês escreveram
                </h3>
              </div>

              {/* Messages List - Scrollable */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {messages.map((msg, index) => (
                  <motion.div
                    key={`${msg.contributorName}-${msg.date}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <MessageCard message={msg} formatDate={formatDate} />
                  </motion.div>
                ))}
              </div>

              {/* Footer Note */}
              <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <p
                  className="text-center text-sm italic"
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    color: 'var(--secondary-text)',
                  }}
                >
                  A gente lê tudo. De verdade.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
  accent: 'purple' | 'gold' | 'pink' | 'green'
}

function StatCard({ icon, title, value, subtitle, accent }: StatCardProps) {
  const accentColors = {
    purple: { bg: 'rgba(147, 51, 234, 0.1)', text: 'rgb(147, 51, 234)' },
    gold: { bg: 'rgba(234, 179, 8, 0.1)', text: 'rgb(234, 179, 8)' },
    pink: { bg: 'rgba(236, 72, 153, 0.1)', text: 'rgb(236, 72, 153)' },
    green: { bg: 'rgba(34, 197, 94, 0.1)', text: 'rgb(34, 197, 94)' },
  }

  const colors = accentColors[accent]

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="rounded-xl p-5 relative overflow-hidden"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.text}15`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: colors.text, color: 'white' }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-medium mb-1 uppercase tracking-wide"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            {title}
          </p>
          <p
            className="text-xl font-bold mb-0.5 truncate"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: 'var(--primary-text)',
            }}
          >
            {value}
          </p>
          <p
            className="text-xs truncate"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'var(--secondary-text)',
              fontStyle: 'italic',
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

interface MessageCardProps {
  message: ContributorMessage
  formatDate: (date: string) => string
}

function MessageCard({ message, formatDate }: MessageCardProps) {
  return (
    <div
      className="rounded-lg p-4 transition-all duration-300"
      style={{
        background: 'var(--accent)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Contributor Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{
            background: 'var(--decorative)',
            color: 'var(--white-soft)',
            fontFamily: 'var(--font-playfair)',
          }}
        >
          {message.contributorName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className="font-semibold truncate"
            style={{
              color: 'var(--primary-text)',
              fontFamily: 'var(--font-crimson)',
            }}
          >
            {message.contributorName}
          </h4>
          <p
            className="text-xs truncate"
            style={{
              color: 'var(--decorative)',
              fontFamily: 'var(--font-crimson)',
            }}
          >
            {message.giftName}
          </p>
        </div>
        <span
          className="text-xs shrink-0"
          style={{
            color: 'var(--secondary-text)',
            fontFamily: 'var(--font-crimson)',
          }}
        >
          {formatDate(message.date)}
        </span>
      </div>

      {/* Message Content */}
      <div
        className="rounded p-3"
        style={{
          background: 'var(--white-soft)',
          borderLeft: '3px solid var(--decorative)',
        }}
      >
        <MessageCircle
          className="w-4 h-4 mb-1 inline opacity-50"
          style={{ color: 'var(--decorative)' }}
        />
        <p
          className="text-sm italic leading-relaxed"
          style={{
            color: 'var(--secondary-text)',
            fontFamily: 'var(--font-crimson)',
          }}
        >
          "{message.message}"
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

interface CreativeStats {
  firstGift: { contributorName: string; giftName: string; date: string } | null
  mostLovedGift: { giftName: string; contributorCount: number } | null
  totalContributors: number
  totalLove: number
  funFact: string
}

function calculateCreativeStats(
  gifts: GiftWithProgress[],
  messages: ContributorMessage[]
): CreativeStats {
  // Find first contribution ever
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const firstGift = sortedMessages[0] || null

  // Find gift with most contributors
  const giftContributorCounts = gifts.map((gift) => ({
    giftName: gift.title,
    contributorCount: gift.contributionCount,
  }))
  const mostLovedGift =
    giftContributorCounts.length > 0
      ? giftContributorCounts.reduce((max, gift) =>
          gift.contributorCount > max.contributorCount ? gift : max
        )
      : null

  // Total unique contributors (count unique names)
  const uniqueContributors = new Set(messages.map((m) => m.contributorName.toLowerCase()))
  const totalContributors = uniqueContributors.size

  // Total love (money) across all gifts
  const totalLove = gifts.reduce((sum, gift) => sum + gift.totalContributed, 0)

  // Fun facts rotation
  const funFacts = [
    `${messages.length} ${messages.length === 1 ? 'mensagem deixada' : 'mensagens deixadas'} até agora`,
    `${firstGift?.contributorName || 'Alguém'} deu a primeira contribuição`,
    `${totalContributors} ${
      totalContributors === 1 ? 'pessoa ajudou' : 'pessoas ajudaram'
    } até agora`,
    `Cada real que cai aqui vira móvel, panela, marcenaria funcionando`,
    mostLovedGift
      ? `${mostLovedGift.giftName} levou ${mostLovedGift.contributorCount} ${
          mostLovedGift.contributorCount === 1 ? 'contribuição' : 'contribuições'
        }`
      : 'Cada presente tem sua história',
  ]

  const funFact = funFacts[Math.floor(Math.random() * funFacts.length)]

  return {
    firstGift,
    mostLovedGift: mostLovedGift && mostLovedGift.contributorCount > 0 ? mostLovedGift : null,
    totalContributors,
    totalLove,
    funFact,
  }
}
