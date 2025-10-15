'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Clock,
  Shirt,
  Car,
  Phone,
  Mail,
  Calendar,
  Users,
  Heart,
} from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import WeddingLocation from '@/components/sections/WeddingLocation';
import HYBadge from '@/components/ui/HYBadge';
const TIMELINE = [
  { time: '10:30', event: 'Chegada dos Convidados', icon: Users },
  { time: '11:00', event: 'Cerimônia de Casamento', icon: Heart },
  { time: '12:00', event: 'Recepção/Almoço', icon: Users },
  { time: '15:00', event: 'Corte de Bolo e Café', icon: Heart },
  { time: '16:00', event: 'Encerramento', icon: Users },
];

export default function DetalhesPage() {

  return (
    <>
      <Navigation />
      <div className="min-h-screen" >
        {/* Header - Matching Gallery Style */}
        <section className="relative pt-12 md:pt-24 pb-20 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* HY Monogram Logo */}
              <HYBadge />

              <h1 className="text-5xl md:text-7xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', letterSpacing: '0.15em', lineHeight: '1.1' }}>
                Detalhes do Dia 1000
              </h1>
              <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--decorative)' }} />
              <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                Tudo que você precisa saber sobre o grande dia
              </p>
            </motion.div>
          </div>
        </section>

      {/* Wedding Location Section */}
      <WeddingLocation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Timeline Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--decorative)' }}>
              <Clock className="w-6 h-6" style={{ color: 'var(--white-soft)' }} />
            </div>
            <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
              Programação do Dia
            </h2>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="mb-6 p-4 rounded-xl text-center bg-gray-50">
              <p className="text-lg font-semibold" style={{ color: 'var(--primary-text)' }}>
                <Calendar className="inline w-5 h-5 mr-2" />
                20 de Novembro de 2025
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--secondary-text)' }}>
                Início às 11h00
              </p>
            </div>

            <div className="space-y-4">
              {TIMELINE.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-opacity-50"
                    style={{
                      background: 'transparent',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(249, 250, 251, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div className="flex-shrink-0 w-16 text-right">
                      <span className="font-semibold" style={{ color: 'var(--decorative)' }}>
                        {item.time}
                      </span>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                      <Icon className="w-5 h-5" style={{ color: 'var(--decorative)' }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--primary-text)' }}>
                        {item.event}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Dress Code Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--decorative)' }}>
              <Shirt className="w-6 h-6" style={{ color: 'var(--white-soft)' }} />
            </div>
            <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
              Traje
            </h2>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="text-center mb-6">
              <p className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--decorative)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                Dress Code
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}>
                Social Elegante
              </h3>
              <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                O casamento será ao meio dia, no Ceará.. não vai de preto todo agasalhado, né meu filho?
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-3" style={{ color: 'var(--primary-text)' }}>
                  Para Elas
                </h4>
                <ul className="space-y-2" style={{ color: 'var(--secondary-text)' }}>
                  <li>• Vestidos de festa (longos, midi ou curtos)</li>
                  <li>• Cores vibrantes são bem-vindas</li>
                  <li>• Evite branco, off-white e bege claro</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3" style={{ color: 'var(--primary-text)' }}>
                  Para Eles
                </h4>
                <ul className="space-y-2" style={{ color: 'var(--secondary-text)' }}>
                  <li>• Terno completo ou blazer com calça social</li>
                  <li>• Camisa social</li>
                  <li>• Cores escuras ou tons pastéis</li>
                </ul>
              </div>
            </div>

          </div>
        </motion.section>

        {/* Parking Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--decorative)' }}>
              <Car className="w-6 h-6" style={{ color: 'var(--white-soft)' }} />
            </div>
            <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
              Estacionamento
            </h2>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
            <p className="text-lg" style={{ color: 'var(--secondary-text)' }}>
              Temos bastante vagas disponíveis na rua, com sombra, em local seguro. É tranquilo, fácil e rápido!
            </p>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="rounded-3xl p-8 text-center" style={{ background: 'var(--primary-text)', color: 'var(--white-soft)' }}>
            <h2 className="text-3xl font-light mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Ainda tem dúvidas?
            </h2>
            <p className="opacity-90 mb-6 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
              Entre em contato conosco! Estamos aqui para ajudar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+5585994198099"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
                style={{
                  background: 'var(--white-soft)',
                  color: 'var(--primary-text)'
                }}
              >
                <Phone className="w-5 h-5" />
                (85) 99419-8099
              </a>

              <a
                href="mailto:contato@thousanddaysof.love"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--white-soft)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <Mail className="w-5 h-5" />
                contato@thousanddaysof.love
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
    </>
  );
}
