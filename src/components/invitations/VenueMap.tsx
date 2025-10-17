'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation, Car, Clock } from 'lucide-react';

export default function VenueMap() {
  const venueAddress = {
    name: 'Casa HY',
    street: 'Rua Coronel Francisco Flávio Carneiro, 200',
    neighborhood: 'Luciano Cavalcante',
    city: 'Fortaleza, CE',
    fullAddress: 'R. Coronel Francisco Flávio Carneiro, 200 - Luciano Cavalcante, Fortaleza - CE',
    googleMapsUrl: 'https://maps.google.com/?q=R.+Coronel+Francisco+Flávio+Carneiro+200+Luciano+Cavalcante+Fortaleza+CE',
    wazeUrl: 'https://waze.com/ul?q=R.+Coronel+Francisco+Flávio+Carneiro+200+Luciano+Cavalcante+Fortaleza+CE',
  };

  const practicalInfo = [
    {
      icon: Car,
      title: 'Estacionamento',
      description: 'Estacionamento disponível no local',
    },
    {
      icon: Clock,
      title: 'Chegada',
      description: 'Recomendamos chegar entre 10h45 e 11h15',
    },
    {
      icon: MapPin,
      title: 'Localização',
      description: 'Bairro Luciano Cavalcante, próximo ao Shopping RioMar',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Map Container - Modified for better mobile experience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        {/* Google Maps Embed - Full width without overlay on mobile */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-[#E8E6E3] bg-white">
          <div className="aspect-[16/9] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.2073870345!2d-38.47858!3d-3.77044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c748f1c0c0c0c0d%3A0x0!2sR.%20Coronel%20Francisco%20Fl%C3%A1vio%20Carneiro%2C%20200%20-%20Luciano%20Cavalcante%2C%20Fortaleza%20-%20CE!5e0!3m2!1sen!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>

          {/* Address Overlay Card - Desktop only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#E8E6E3]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A7C59] to-[#5A8C69] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-playfair text-xl text-[#2C2C2C] mb-1">
                  {venueAddress.name}
                </h3>
                <p className="font-crimson text-sm text-[#4A4A4A] mb-1">
                  {venueAddress.street}
                </p>
                <p className="font-crimson text-sm text-[#A8A8A8]">
                  {venueAddress.neighborhood}, {venueAddress.city}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Address Card - Mobile only (below map) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:hidden bg-white rounded-xl p-6 shadow-lg border border-[#E8E6E3]"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A7C59] to-[#5A8C69] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-playfair text-xl text-[#2C2C2C] mb-1">
                {venueAddress.name}
              </h3>
              <p className="font-crimson text-sm text-[#4A4A4A] mb-1">
                {venueAddress.street}
              </p>
              <p className="font-crimson text-sm text-[#A8A8A8]">
                {venueAddress.neighborhood}, {venueAddress.city}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* Google Maps Button */}
        <a
          href={venueAddress.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#4A7C59] to-[#5A8C69] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <Navigation className="w-5 h-5" />
          <span className="font-playfair text-lg font-medium">
            Abrir no Google Maps
          </span>
        </a>

        {/* Waze Button */}
        <a
          href={venueAddress.wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-white text-[#2C2C2C] rounded-xl shadow-lg border-2 border-[#E8E6E3] hover:border-[#A8A8A8] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="font-playfair text-lg font-medium">
            Abrir no Waze
          </span>
        </a>
      </motion.div>

      {/* Practical Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {practicalInfo.map((info, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg border border-[#E8E6E3] hover:shadow-xl transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-[#F8F6F3] flex items-center justify-center mb-4">
              <info.icon className="w-6 h-6 text-[#4A7C59]" />
            </div>
            <h4 className="font-playfair text-lg text-[#2C2C2C] mb-2">
              {info.title}
            </h4>
            <p className="font-crimson text-sm text-[#4A4A4A] leading-relaxed">
              {info.description}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
