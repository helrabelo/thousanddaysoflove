'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface DressCodeItem {
  category: string;
  recommended: string[];
  avoid: string[];
  icon: string;
}

export default function DressCodeGuide() {
  const dressCode: DressCodeItem[] = [
    {
      category: 'Para Elas',
      icon: '👗',
      recommended: [
        'Vestidos midi ou longos',
        'Vestidos de cocktail',
        'Conjuntos elegantes',
        'Salto alto ou rasteirinha chique',
        'Acessórios delicados',
      ],
      avoid: [
        'Jeans casual',
        'Chinelos ou tênis',
        'Roupas muito decotadas',
        'Vestido branco ou creme',
      ],
    },
    {
      category: 'Para Eles',
      icon: '🤵',
      recommended: [
        'Terno completo ou blazer',
        'Calça social',
        'Camisa social (manga longa ou curta)',
        'Sapato social',
        'Gravata ou gravata borboleta (opcional)',
      ],
      avoid: [
        'Bermuda ou shorts',
        'Camiseta',
        'Tênis ou chinelos',
        'Jeans rasgado',
      ],
    },
  ];

  const colorPalette = [
    { name: 'Tons Terrosos', colors: ['#8B7355', '#A0826D', '#C19A6B'] },
    { name: 'Tons Neutros', colors: ['#2C2C2C', '#4A4A4A', '#F8F6F3'] },
    { name: 'Acentos', colors: ['#4A7C59', '#5A8C69', '#D4A574'] },
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
          <span className="text-2xl">👔</span>
          <span className="font-playfair text-lg text-[#2C2C2C] font-medium">
            Esporte Fino
          </span>
        </div>
        <p className="font-crimson text-lg text-[#4A4A4A] italic max-w-2xl mx-auto">
          Vista-se com elegância e conforto para celebrar este dia especial conosco
        </p>
      </motion.div>

      {/* Dress Code Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dressCode.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-[#E8E6E3] hover:shadow-xl transition-all duration-300"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F8F6F3] to-[#E8E6E3] flex items-center justify-center">
                <span className="text-3xl">{item.icon}</span>
              </div>
              <h3 className="font-playfair text-2xl text-[#2C2C2C]">
                {item.category}
              </h3>
            </div>

            {/* Recommended */}
            <div className="mb-6">
              <h4 className="font-playfair text-lg text-[#4A7C59] mb-3 flex items-center gap-2">
                <Check className="w-5 h-5" />
                Recomendado
              </h4>
              <ul className="space-y-2">
                {item.recommended.map((rec, i) => (
                  <li
                    key={i}
                    className="font-crimson text-[#4A4A4A] flex items-start gap-2"
                  >
                    <span className="text-[#4A7C59] mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Avoid */}
            <div>
              <h4 className="font-playfair text-lg text-[#A8A8A8] mb-3 flex items-center gap-2">
                <X className="w-5 h-5" />
                Evite
              </h4>
              <ul className="space-y-2">
                {item.avoid.map((av, i) => (
                  <li
                    key={i}
                    className="font-crimson text-[#A8A8A8] flex items-start gap-2"
                  >
                    <span className="mt-1">•</span>
                    <span>{av}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Color Palette Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-[#E8E6E3]"
      >
        <h3 className="font-playfair text-2xl text-[#2C2C2C] mb-4 text-center">
          Paleta de Cores Sugerida
        </h3>
        <p className="font-crimson text-[#4A4A4A] text-center mb-6 italic">
          Cores que harmonizam com a decoração (mas fique à vontade!)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {colorPalette.map((palette, index) => (
            <div key={index} className="text-center">
              <p className="font-crimson text-sm text-[#4A4A4A] mb-3">
                {palette.name}
              </p>
              <div className="flex justify-center gap-2">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-2 border-[#E8E6E3] shadow-md hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-[#F8F6F3] to-[#E8E6E3] rounded-2xl p-6 text-center"
      >
        <p className="font-crimson text-[#4A4A4A] italic">
          <strong className="text-[#2C2C2C]">Importante:</strong> O evento será realizado em ambiente coberto e climatizado.
          Considere a temperatura ao escolher seu traje!
        </p>
      </motion.div>
    </div>
  );
}
