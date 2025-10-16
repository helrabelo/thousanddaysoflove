'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Gift,
  Camera,
  CheckCircle2,
  Heart,
  User,
  ArrowRight,
} from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import Link from 'next/link';
import HYBadge from '@/components/ui/HYBadge';

const WEBSITE_FEATURES = [
  {
    icon: CheckCircle2,
    title: 'Confirmar Presença',
    description: 'Confirme sua presença e nos conte se virá acompanhado',
    action: 'Fazer RSVP',
    href: '/rsvp',
  },
  {
    icon: Camera,
    title: 'Dia 1000',
    description: 'Compartilhe fotos e mensagens em tempo real durante o casamento',
    action: 'Acessar Feed',
    href: '/dia-1000',
  },
  {
    icon: Gift,
    title: 'Presente',
    description: 'Veja nossa lista de presentes e escolha o seu',
    action: 'Ver Presentes',
    href: '/presentes',
  },
];

const EVENT_DETAILS = [
  {
    icon: Calendar,
    label: 'Data',
    value: '20 de Novembro de 2025',
    detail: 'Quinta-feira',
  },
  {
    icon: Clock,
    label: 'Horário',
    value: '11h00',
    detail: 'Chegada dos convidados',
  },
  {
    icon: MapPin,
    label: 'Local',
    value: 'Casa HY',
    detail: 'R. Coronel Francisco Flávio Carneiro, 200 - Fortaleza, CE',
  },
];

export default function ConvitePageClient() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');

  const handleAccessInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim()) {
      router.push(`/convite/${inviteCode.trim().toUpperCase()}`);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-12">
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Header with HY Logo */}
              <HYBadge />

              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-light mb-4"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                }}
              >
                Você está convidado?
              </h1>

              {/* Call to action for personalized invite */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 p-6 rounded-2xl border"
                style={{
                  background: 'var(--accent)',
                  borderColor: 'var(--decorative)',
                }}
              >
                <p
                  className="text-sm mb-4"
                  style={{ color: 'var(--secondary-text)' }}
                >
                  <User className="inline w-4 h-4 mr-2" />
                  Tem um código de convite personalizado?
                </p>
                <form onSubmit={handleAccessInvite} className="space-y-3">
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Digite seu código (ex: FAMILY001)"
                    className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--decorative)',
                      background: 'var(--white-soft)',
                      color: 'var(--primary-text)',
                    }}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg transform hover:scale-105"
                    style={{
                      background: 'var(--decorative)',
                      color: 'var(--white-soft)',
                    }}
                  >
                    Acessar Convite Personalizado
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* Event Details */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2
              className="text-3xl sm:text-4xl font-light text-center mb-12"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
              }}
            >
              Detalhes do Evento
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {EVENT_DETAILS.map((detail, index) => {
                const Icon = detail.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 text-center"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'var(--accent)' }}
                    >
                      <Icon
                        className="w-8 h-8"
                        style={{ color: 'var(--decorative)' }}
                      />
                    </div>
                    <h3
                      className="text-sm uppercase tracking-wider mb-2"
                      style={{
                        color: 'var(--decorative)',
                        fontFamily: 'var(--font-crimson)',
                      }}
                    >
                      {detail.label}
                    </h3>
                    <p
                      className="text-xl font-semibold mb-1"
                      style={{
                        color: 'var(--primary-text)',
                        fontFamily: 'var(--font-playfair)',
                      }}
                    >
                      {detail.value}
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        color: 'var(--secondary-text)',
                        fontFamily: 'var(--font-crimson)',
                        fontStyle: 'italic',
                      }}
                    >
                      {detail.detail}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Website Features Guide */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl font-light mb-4"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                }}
              >
                Como Participar
              </h2>
              <p
                className="text-lg opacity-90 max-w-2xl mx-auto"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontStyle: 'italic',
                  color: 'var(--secondary-text)',
                }}
              >
                Explore nosso site e interaja com as seguintes funcionalidades
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {WEBSITE_FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="relative group"
                  >
                    <div className="h-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                      {/* Accent line */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                        style={{ background: 'var(--decorative)' }}
                      />

                      {/* Coming soon badge */}
                      {feature.comingSoon && (
                        <div
                          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: 'var(--accent)',
                            color: 'var(--secondary-text)',
                          }}
                        >
                          Em breve
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
                          style={{
                            background: 'var(--decorative)',
                            color: 'var(--white-soft)',
                          }}
                        >
                          <Icon className="w-7 h-7" />
                        </div>

                        <div className="flex-1">
                          <h3
                            className="text-xl font-semibold mb-2"
                            style={{
                              color: 'var(--primary-text)',
                              fontFamily: 'var(--font-playfair)',
                            }}
                          >
                            {feature.title}
                          </h3>
                          <p
                            className="text-sm mb-4"
                            style={{ color: 'var(--secondary-text)' }}
                          >
                            {feature.description}
                          </p>

                          <Link
                            href={feature.href}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${feature.comingSoon
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:shadow-md transform hover:scale-105'
                              }`}
                            style={{
                              background: feature.comingSoon
                                ? 'var(--accent)'
                                : 'var(--decorative)',
                              color: 'var(--white-soft)',
                            }}
                            onClick={(e) =>
                              feature.comingSoon && e.preventDefault()
                            }
                          >
                            {feature.action}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Additional Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center"
          >
            <div
              className="rounded-3xl p-12"
              style={{
                background: 'var(--primary-text)',
                color: 'var(--white-soft)',
              }}
            >
              <Heart className="w-12 h-12 mx-auto mb-6 animate-pulse" />
              <h2
                className="text-3xl font-light mb-4"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Sua presença é o nosso maior presente
              </h2>
              <p
                className="text-lg opacity-90 max-w-2xl mx-auto mb-8"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontStyle: 'italic',
                }}
              >
                Estamos muito felizes em compartilhar este momento especial com
                você!<br /> ( mas só se você tiver sido convidado 😄 )
              </p>

              <Link
                href="/detalhes"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-all hover:shadow-xl transform hover:scale-105"
                style={{
                  background: 'var(--white-soft)',
                  color: 'var(--primary-text)',
                }}
              >
                Ver Mais Detalhes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
}
