'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Gift,
  Camera,
  MessageSquare,
  CheckCircle2,
  Heart,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import GuestProgressTracker from '@/components/invitations/GuestProgressTracker';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  getInvitationByCode,
  trackInvitationOpen,
  calculateGuestProgress,
} from '@/lib/supabase/invitations';
import type { Invitation, GuestProgress } from '@/types/wedding';
import QRCode from 'qrcode';

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
    value: '10h30',
    detail: 'Chegada dos convidados',
  },
  {
    icon: MapPin,
    label: 'Local',
    value: 'Casa de Mãe Nádia',
    detail: 'R. Conselheiro Tristão, 1415 - Fortaleza, CE',
  },
];

const QUICK_ACTIONS = [
  {
    icon: CheckCircle2,
    title: 'Confirmar Presença',
    description: 'Complete seu RSVP',
    href: '/rsvp',
  },
  {
    icon: Gift,
    title: 'Ver Presentes',
    description: 'Escolha um presente',
    href: '/presentes',
  },
  {
    icon: Camera,
    title: 'Enviar Fotos',
    description: 'Compartilhe suas fotos',
    href: '/dia-1000/upload',
  },
  {
    icon: MessageSquare,
    title: 'Enviar Mensagem',
    description: 'Deixe uma mensagem (em breve)',
    href: '/mensagens',
    comingSoon: true,
  },
];

export default function PersonalizedInvitePage() {
  const params = useParams();
  const code = params?.code as string;

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [progress, setProgress] = useState<GuestProgress | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState(false);

  useEffect(() => {
    async function loadInvitation() {
      if (!code) {
        setError('Código de convite não fornecido');
        setLoading(false);
        return;
      }

      try {
        // Fetch invitation
        const inv = await getInvitationByCode(code);

        if (!inv) {
          setError(
            'Convite não encontrado. Verifique o código e tente novamente.'
          );
          setLoading(false);
          return;
        }

        setInvitation(inv);

        // Calculate progress
        const prog = calculateGuestProgress(inv);
        setProgress(prog);

        // Track invitation open
        await trackInvitationOpen(code);

        // Generate QR code
        const inviteUrl = `${window.location.origin}/convite/${code}`;
        const qr = await QRCode.toDataURL(inviteUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#2C2C2C', // primary-text
            light: '#F8F6F3', // background
          },
        });
        setQrCodeUrl(qr);
      } catch (err) {
        console.error('Error loading invitation:', err);
        setError('Erro ao carregar convite. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    loadInvitation();
  }, [code]);

  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <Loader2
              className="w-12 h-12 animate-spin mx-auto"
              style={{ color: 'var(--decorative)' }}
            />
            <p
              className="text-lg"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontStyle: 'italic',
                color: 'var(--secondary-text)',
              }}
            >
              Carregando seu convite personalizado...
            </p>
          </motion.div>
        </div>
      </>
    );
  }

  // Error state
  if (error || !invitation || !progress) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-20 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md text-center space-y-6"
          >
            <AlertCircle
              className="w-16 h-16 mx-auto"
              style={{ color: 'var(--decorative)' }}
            />
            <h1
              className="text-2xl font-light"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
              }}
            >
              Ops! Algo deu errado
            </h1>
            <p
              className="text-lg"
              style={{
                fontFamily: 'var(--font-crimson)',
                color: 'var(--secondary-text)',
              }}
            >
              {error}
            </p>
            <Link
              href="/convite"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg transform hover:scale-105"
              style={{
                background: 'var(--decorative)',
                color: 'var(--white-soft)',
              }}
            >
              Voltar ao Convite
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20">
        {/* Personalized Hero Section */}
        <div className="text-center py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Decorative top ornament */}
              <div className="flex justify-center mb-6">
                <Heart
                  className="w-16 h-16 animate-pulse"
                  style={{ color: 'var(--decorative)' }}
                />
              </div>

              {/* Personalized greeting */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-light mb-4"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                }}
              >
                Olá, {invitation.guest_name}! 👋
              </h1>

              <div className="space-y-2">
                <p
                  className="text-2xl sm:text-3xl font-light"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    color: 'var(--decorative)',
                  }}
                >
                  Hel & Ylana
                </p>
                <p
                  className="text-lg opacity-90 max-w-2xl mx-auto"
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontStyle: 'italic',
                    color: 'var(--secondary-text)',
                  }}
                >
                  Celebrando 1000 dias de amor
                </p>
              </div>

              {/* Custom message if available */}
              {invitation.custom_message && (
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
                    className="text-lg leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontStyle: 'italic',
                      color: 'var(--secondary-text)',
                    }}
                  >
                    "{invitation.custom_message}"
                  </p>
                </motion.div>
              )}

              {/* Plus one indicator */}
              {invitation.plus_one_allowed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
                  style={{
                    background: 'var(--accent)',
                    borderColor: 'var(--decorative)',
                  }}
                >
                  <User
                    className="w-4 h-4"
                    style={{ color: 'var(--decorative)' }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: 'var(--secondary-text)' }}
                  >
                    {invitation.plus_one_name
                      ? `Você e ${invitation.plus_one_name}`
                      : 'Você pode trazer um acompanhante'}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* Guest Progress Tracker */}
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
              Seu Progresso
            </h2>
            <div className="max-w-3xl mx-auto">
              <GuestProgressTracker
                progress={progress}
                guestName={invitation.guest_name.split(' ')[0]}
              />
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2
              className="text-3xl sm:text-4xl font-light text-center mb-12"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
              }}
            >
              Ações Rápidas
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {QUICK_ACTIONS.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <Link
                      href={action.href}
                      className={`block h-full bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 ${
                        action.comingSoon
                          ? 'opacity-60 cursor-not-allowed'
                          : 'transform hover:scale-105'
                      }`}
                      onClick={(e) => action.comingSoon && e.preventDefault()}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                        style={{ background: 'var(--decorative)' }}
                      />
                      {action.comingSoon && (
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
                      <div className="flex items-center gap-4">
                        <div
                          className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
                          style={{
                            background: 'var(--decorative)',
                            color: 'var(--white-soft)',
                          }}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h3
                            className="text-xl font-semibold mb-1"
                            style={{
                              color: 'var(--primary-text)',
                              fontFamily: 'var(--font-playfair)',
                            }}
                          >
                            {action.title}
                          </h3>
                          <p
                            className="text-sm"
                            style={{ color: 'var(--secondary-text)' }}
                          >
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Event Details */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
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
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
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

          {/* QR Code Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center"
          >
            <div
              className="rounded-3xl p-12"
              style={{
                background: 'var(--accent)',
                border: '1px solid var(--decorative)',
              }}
            >
              <Share2
                className="w-12 h-12 mx-auto mb-6"
                style={{ color: 'var(--decorative)' }}
              />
              <h2
                className="text-3xl font-light mb-4"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                }}
              >
                Compartilhe Seu Convite
              </h2>
              <p
                className="text-lg opacity-90 max-w-2xl mx-auto mb-8"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontStyle: 'italic',
                  color: 'var(--secondary-text)',
                }}
              >
                Mostre seu convite personalizado para amigos e familiares
              </p>

              <button
                onClick={() => setShowQrCode(!showQrCode)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-all hover:shadow-xl transform hover:scale-105"
                style={{
                  background: 'var(--decorative)',
                  color: 'var(--white-soft)',
                }}
              >
                {showQrCode ? 'Ocultar' : 'Mostrar'} QR Code
                <ArrowRight className="w-5 h-5" />
              </button>

              {showQrCode && qrCodeUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 inline-block p-6 bg-white rounded-2xl shadow-xl"
                >
                  <img
                    src={qrCodeUrl}
                    alt="QR Code do Convite"
                    className="w-64 h-64 mx-auto"
                  />
                  <p
                    className="mt-4 text-sm"
                    style={{
                      color: 'var(--secondary-text)',
                      fontFamily: 'var(--font-crimson)',
                    }}
                  >
                    Código: {invitation.code}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
}
