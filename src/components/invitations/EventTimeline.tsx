'use client';

import { motion } from 'framer-motion';
import { Clock, Users, Heart, Camera, Music, Utensils } from 'lucide-react';

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  duration?: string;
}

export default function EventTimeline() {
  const events: TimelineEvent[] = [
    {
      time: '10:45',
      title: 'Chegada dos Convidados',
      description: 'Recepção com welcome drink e música ambiente',
      icon: Users,
      color: 'from-[#4A7C59] to-[#5A8C69]',
      duration: '45 min',
    },
    {
      time: '11:30',
      title: 'Cerimônia',
      description: 'Momento especial onde celebramos 1000 dias de amor',
      icon: Heart,
      color: 'from-[#D4A574] to-[#C19A6B]',
      duration: '30 min',
    },
    {
      time: '12:00',
      title: 'Sessão de Fotos',
      description: 'Registre este momento especial conosco!',
      icon: Camera,
      color: 'from-[#8B7355] to-[#A0826D]',
      duration: '30 min',
    },
    {
      time: '12:30',
      title: 'Almoço',
      description: 'Buffet completo com opções deliciosas',
      icon: Utensils,
      color: 'from-[#4A7C59] to-[#5A8C69]',
      duration: '90 min',
    },
    {
      time: '14:00',
      title: 'Celebração',
      description: 'Música, dança e muita alegria!',
      icon: Music,
      color: 'from-[#D4A574] to-[#C19A6B]',
      duration: '3 horas',
    },
  ];

  return (
    <div className="relative">
      {/* Timeline Line - Desktop */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E8E6E3] via-[#A8A8A8] to-[#E8E6E3]" />

      {/* Timeline Events */}
      <div className="space-y-12 md:space-y-16">
        {events.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 ${
                isEven ? '' : 'md:flex-row-reverse'
              }`}
            >
              {/* Left Side - Even items */}
              {isEven && (
                <>
                  {/* Desktop: Event Card on Left */}
                  <div className="hidden md:block">
                    <EventCard event={event} align="right" />
                  </div>

                  {/* Center: Time Badge */}
                  <div className="hidden md:flex items-center justify-center">
                    <TimeBadge time={event.time} duration={event.duration} />
                  </div>

                  {/* Mobile: Full Width */}
                  <div className="md:hidden">
                    <div className="flex items-center gap-4 mb-4">
                      <TimeBadge time={event.time} duration={event.duration} />
                    </div>
                    <EventCard event={event} align="left" />
                  </div>
                </>
              )}

              {/* Right Side - Odd items */}
              {!isEven && (
                <>
                  {/* Desktop: Time Badge on Left */}
                  <div className="hidden md:flex items-center justify-center">
                    <TimeBadge time={event.time} duration={event.duration} />
                  </div>

                  {/* Desktop: Event Card on Right */}
                  <div className="hidden md:block">
                    <EventCard event={event} align="left" />
                  </div>

                  {/* Mobile: Full Width */}
                  <div className="md:hidden">
                    <div className="flex items-center gap-4 mb-4">
                      <TimeBadge time={event.time} duration={event.duration} />
                    </div>
                    <EventCard event={event} align="left" />
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TimeBadge({ time, duration }: { time: string; duration?: string }) {
  return (
    <div className="relative z-10">
      <div className="bg-white border-4 border-[#E8E6E3] rounded-full p-4 shadow-lg">
        <div className="text-center">
          <div className="font-playfair text-2xl font-bold text-[#2C2C2C]">
            {time}
          </div>
          {duration && (
            <div className="font-crimson text-xs text-[#A8A8A8] mt-1">
              {duration}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({
  event,
  align,
}: {
  event: TimelineEvent;
  align: 'left' | 'right';
}) {
  const IconComponent = event.icon;

  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg border border-[#E8E6E3] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        align === 'right' ? 'md:text-right' : ''
      }`}
    >
      {/* Icon */}
      <div
        className={`inline-flex w-14 h-14 rounded-full bg-gradient-to-br ${event.color} items-center justify-center mb-4`}
      >
        <IconComponent className="w-7 h-7 text-white" />
      </div>

      {/* Title */}
      <h3 className="font-playfair text-2xl text-[#2C2C2C] mb-2">
        {event.title}
      </h3>

      {/* Description */}
      <p className="font-crimson text-base text-[#4A4A4A] leading-relaxed">
        {event.description}
      </p>
    </div>
  );
}
