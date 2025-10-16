'use client';

import { motion } from 'framer-motion';
import {
  Gift,
  Camera,
  Smartphone,
  Heart,
  Users,
  MessageCircle,
  Baby,
  Wine,
  Music,
  Info,
} from 'lucide-react';

interface Orientation {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

export default function GeneralOrientations() {
  const orientations: Orientation[] = [
    {
      icon: Gift,
      title: 'Lista de Presentes',
      description: 'Temos uma lista especial disponível no site. Sua presença é o maior presente, mas se quiser nos presentear, ficaremos muito felizes!',
      color: 'from-[#4A7C59] to-[#5A8C69]',
    },
    {
      icon: Camera,
      title: 'Compartilhe Momentos',
      description: 'Use nosso sistema de upload de fotos no site! Queremos ver o casamento através dos seus olhos.',
      color: 'from-[#D4A574] to-[#C19A6B]',
    },
    {
      icon: Smartphone,
      title: 'Modo Avião Durante a Cerimônia',
      description: 'Pedimos que deixem os celulares no silencioso durante a cerimônia. Nosso fotógrafo capturará todos os momentos especiais!',
      color: 'from-[#8B7355] to-[#A0826D]',
    },
    {
      icon: Heart,
      title: 'Confirmação de Presença',
      description: 'Por favor, confirme sua presença até 10 dias antes do evento através do formulário no site.',
      color: 'from-[#4A7C59] to-[#5A8C69]',
    },
    {
      icon: Users,
      title: 'Acompanhantes',
      description: 'Se seu convite permite acompanhante, por favor informe o nome no RSVP. Não podemos aceitar acompanhantes não confirmados.',
      color: 'from-[#D4A574] to-[#C19A6B]',
    },
    {
      icon: MessageCircle,
      title: 'Deixe uma Mensagem',
      description: 'Compartilhe seus votos, desejos e mensagens especiais conosco através da área de mensagens do site!',
      color: 'from-[#8B7355] to-[#A0826D]',
    },
    {
      icon: Baby,
      title: 'Crianças',
      description: 'Crianças são bem-vindas! Teremos um espaço especial com atividades para os pequenos se divertirem.',
      color: 'from-[#4A7C59] to-[#5A8C69]',
    },
    {
      icon: Wine,
      title: 'Open Bar',
      description: 'Teremos open bar durante toda a celebração com diversas opções de bebidas e drinks especiais.',
      color: 'from-[#D4A574] to-[#C19A6B]',
    },
    {
      icon: Music,
      title: 'Playlist Colaborativa',
      description: 'Quer sugerir uma música para tocar na festa? Entre em contato conosco antes do evento!',
      color: 'from-[#8B7355] to-[#A0826D]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#F8F6F3] to-[#E8E6E3] rounded-full mb-6">
          <Info className="w-5 h-5 text-[#4A7C59]" />
          <span className="font-playfair text-lg text-[#2C2C2C] font-medium">
            Informações Úteis
          </span>
        </div>
        <p className="font-crimson text-lg text-[#4A4A4A] italic max-w-2xl mx-auto">
          Tudo que você precisa saber para aproveitar ao máximo nossa celebração
        </p>
      </motion.div>

      {/* Orientations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orientations.map((orientation, index) => {
          const IconComponent = orientation.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-[#E8E6E3] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`inline-flex w-12 h-12 rounded-full bg-gradient-to-br ${orientation.color} items-center justify-center mb-4`}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="font-playfair text-xl text-[#2C2C2C] mb-3">
                {orientation.title}
              </h3>

              {/* Description */}
              <p className="font-crimson text-sm text-[#4A4A4A] leading-relaxed">
                {orientation.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-[#4A7C59] to-[#5A8C69] rounded-2xl p-8 text-center text-white shadow-xl"
      >
        <MessageCircle className="w-12 h-12 mx-auto mb-4" />
        <h3 className="font-playfair text-2xl mb-3">
          Ainda tem dúvidas?
        </h3>
        <p className="font-crimson text-lg mb-6 opacity-90">
          Entre em contato conosco pelo WhatsApp ou através das mensagens do site
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/5585999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4A7C59] rounded-xl font-playfair font-medium hover:bg-[#F8F6F3] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
          <a
            href="/mensagens"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-playfair font-medium hover:bg-white/20 transition-colors"
          >
            <Heart className="w-5 h-5" />
            Enviar Mensagem
          </a>
        </div>
      </motion.div>
    </div>
  );
}
