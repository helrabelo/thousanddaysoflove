'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export default function CountdownTimer() {
  const shouldReduceMotion = useReducedMotion();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E8E6E3]">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-12 h-12 bg-[#F8F6F3] rounded-full mb-3 shadow-md"
        >
          <Calendar className="w-6 h-6 text-[#A8A8A8]" />
        </motion.div>
        <h2 className="font-playfair text-2xl md:text-3xl text-[#2C2C2C] mb-1">
          Contagem Regressiva
        </h2>
        <p className="font-crimson text-sm text-[#4A4A4A] italic">
          Para o dia mais especial das nossas vidas
        </p>
      </div>

      {/* Countdown */}
      {timeLeft.isPast ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center py-8"
        >
          <p className="font-playfair text-4xl md:text-5xl text-[#2C2C2C] mb-2">
            É HOJE! 🎉
          </p>
          <p className="font-crimson text-lg text-[#4A4A4A] italic">
            Nosso dia chegou!
          </p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <TimeUnit
              value={timeLeft.days}
              label="Dias"
              delay={0}
              shouldReduceMotion={shouldReduceMotion}
            />
            <TimeUnit
              value={timeLeft.hours}
              label="Horas"
              delay={0.1}
              shouldReduceMotion={shouldReduceMotion}
            />
            <TimeUnit
              value={timeLeft.minutes}
              label="Min"
              delay={0.2}
              shouldReduceMotion={shouldReduceMotion}
            />
            <TimeUnit
              value={timeLeft.seconds}
              label="Seg"
              delay={0.3}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center font-crimson text-base text-[#4A4A4A] italic"
          >
            Faltam{' '}
            <span className="font-semibold text-[#2C2C2C]">
              {timeLeft.days} dias
            </span>{' '}
            para o grande dia! 💕
          </motion.p>
        </>
      )}
    </div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
  delay: number;
  shouldReduceMotion?: boolean;
}

function TimeUnit({ value, label, delay, shouldReduceMotion }: TimeUnitProps) {
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (value !== prevValue) {
      setPrevValue(value);
    }
  }, [value, prevValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      <div className="bg-white rounded-xl shadow-md p-3 text-center">
        {/* Value with flip animation */}
        <motion.div
          key={value}
          initial={
            !shouldReduceMotion && value !== prevValue
              ? { opacity: 0, y: -10 }
              : false
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-playfair text-3xl md:text-4xl font-bold text-[#2C2C2C]"
        >
          {value.toString().padStart(2, '0')}
        </motion.div>

        {/* Label */}
        <p className="font-crimson text-xs text-[#4A4A4A] mt-1">{label}</p>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-[#E8E6E3]/20 rounded-xl blur-sm -z-10" />
    </motion.div>
  );
}

function calculateTimeLeft(): TimeLeft {
  const weddingDate = new Date('2025-11-20T18:00:00');
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isPast: false,
  };
}
