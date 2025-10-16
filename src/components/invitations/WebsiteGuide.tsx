'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

interface WebsiteGuideProps {
  rsvpCompleted?: boolean;
}

interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  isCompleted?: boolean;
  isTimeLocked?: boolean;
  unlockDate?: string;
}

export default function WebsiteGuide({ rsvpCompleted = false }: WebsiteGuideProps) {
  const features: FeatureCard[] = [
    {
      id: 'historia',
      icon: '📖',
      title: 'Nossa História',
      description: 'Conheça a jornada de 1000 dias que nos trouxe até aqui',
      href: '/historia',
    },
    {
      id: 'galeria',
      icon: '📸',
      title: 'Galeria',
      description: 'Veja nossos momentos especiais e compartilhe os seus',
      href: '/galeria',
    },
    {
      id: 'confirmacao',
      icon: '✅',
      title: 'Confirmação',
      description: 'Confirme sua presença no nosso grande dia',
      href: '/rsvp',
      isCompleted: rsvpCompleted,
    },
    {
      id: 'presentes',
      icon: '🎁',
      title: 'Presentes',
      description: 'Escolha um presente especial da nossa lista',
      href: '/presentes',
    },
    {
      id: 'detalhes',
      icon: '📍',
      title: 'Detalhes',
      description: 'Local, horário e todas as informações do evento',
      href: '/detalhes',
    },
    {
      id: 'dia-1000',
      icon: '📡',
      title: 'Dia 1000',
      description: 'Acompanhe nossa celebração ao vivo',
      href: '/ao-vivo',
      isTimeLocked: true,
      unlockDate: '20 Nov 2025',
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={feature.id}
          custom={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
        >
          <Link href={feature.href}>
            <div
              className={`
                relative h-full bg-white rounded-2xl p-8 shadow-lg border-2
                transition-all duration-300 ease-out
                hover:shadow-xl hover:-translate-y-2
                ${feature.isTimeLocked
                  ? 'border-[#E8E6E3] opacity-75 cursor-not-allowed'
                  : 'border-[#E8E6E3] hover:border-[#A8A8A8]'
                }
              `}
              onClick={(e) => {
                if (feature.isTimeLocked) {
                  e.preventDefault();
                }
              }}
            >
              {/* Completed Badge */}
              {feature.isCompleted && (
                <div className="absolute top-4 right-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-[#4A7C59]" />
                  </motion.div>
                </div>
              )}

              {/* Time-Locked Badge */}
              {feature.isTimeLocked && (
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 bg-[#E8E6E3] rounded-full">
                    <p className="font-crimson text-xs text-[#4A4A4A]">
                      {feature.unlockDate}
                    </p>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F8F6F3] to-[#E8E6E3] flex items-center justify-center mb-6 mx-auto">
                <span className="text-4xl">{feature.icon}</span>
              </div>

              {/* Title */}
              <h3 className="font-playfair text-2xl text-[#2C2C2C] text-center mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="font-crimson text-base text-[#4A4A4A] text-center leading-relaxed">
                {feature.description}
              </p>

              {/* Time-Locked Message */}
              {feature.isTimeLocked && (
                <p className="font-crimson text-sm text-[#A8A8A8] text-center italic mt-4">
                  Disponível no dia do casamento
                </p>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
