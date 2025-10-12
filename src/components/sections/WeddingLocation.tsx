'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Car, Info, Navigation, Share2 } from 'lucide-react'
import GoogleMap from '@/components/ui/GoogleMap'
import GoogleMapsService from '@/lib/utils/maps'

interface VenueLocation {
  lat: number
  lng: number
  placeId?: string
}

interface WeddingSettings {
  venueName: string
  venueAddress: string
  venueCity: string
  venueState: string
  venueZip: string
  venueLocation: VenueLocation
}

interface WeddingLocationData {
  sectionTitle?: string
  sectionDescription?: string
  weddingSettings?: WeddingSettings
  mapStyle?: string
  showDirections?: boolean
}

interface WeddingLocationProps {
  data?: WeddingLocationData
}

export default function WeddingLocation({ data }: WeddingLocationProps) {
  // Extract values with fallbacks
  const sectionTitle = data?.sectionTitle || 'Onde Vamos Nos Casar'
  const sectionDescription = data?.sectionDescription || 'Um lugar especial para celebrar nosso amor'
  const showDirections = data?.showDirections !== false // default true

  // Wedding settings with fallbacks
  const venueName = data?.weddingSettings?.venueName || 'Constable Galerie'
  const venueAddress = data?.weddingSettings?.venueAddress || 'Rua Osvaldo Cruz, 2001'
  const venueCity = data?.weddingSettings?.venueCity || 'Fortaleza'
  const venueState = data?.weddingSettings?.venueState || 'CE'
  const venueZip = data?.weddingSettings?.venueZip || '60125-151'
  const venueLocation = data?.weddingSettings?.venueLocation || {
    lat: -3.7480656,
    lng: -38.5099456
  }

  // Build full address
  const fullAddress = `${venueAddress}, ${venueCity} - ${venueState}, ${venueZip}`

  // Create location object for GoogleMap component
  const locationData = {
    name: venueName,
    address: fullAddress,
    lat: venueLocation.lat,
    lng: venueLocation.lng,
    placeId: venueLocation.placeId,
    parkingInfo: 'Estacionamento gratuito com manobrista',
    accessibilityInfo: 'Local com acessibilidade completa'
  }

  const handleDirections = () => {
    const directionsUrl = GoogleMapsService.generateDirectionsUrl(fullAddress)
    window.open(directionsUrl, '_blank')
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = GoogleMapsService.generateWhatsAppLocationMessage(locationData)
    window.open(whatsappUrl, '_blank')
  }

  const nearbyLandmarks = [
    '📍 Próximo ao Shopping Iguatemi',
    '📍 Região nobre de Eng. Luciano Cavalcante',
    '📍 Fácil acesso pela Washington Soares'
  ]

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Subtle botanical decorations */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="absolute top-20 left-20 w-64 h-64"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="var(--decorative)" strokeWidth="1" fill="none">
            <circle cx="100" cy="100" r="60" />
            <circle cx="100" cy="100" r="20" fill="var(--decorative)" opacity="0.1" />
            <path d="M40 100 Q70 70 100 100 Q130 130 160 100" strokeLinecap="round" />
            <path d="M100 40 Q70 70 100 100 Q130 70 100 40" strokeLinecap="round" opacity="0.5" />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: 'var(--primary-text)'
            }}
          >
            {sectionTitle}
          </h2>
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{
              color: 'var(--secondary-text)',
              fontFamily: 'var(--font-crimson)',
              fontStyle: 'italic',
              lineHeight: '1.8'
            }}
          >
            {sectionDescription}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Venue Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Venue Details Card */}
            <div
              className="rounded-3xl p-8"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 24px var(--shadow-medium)'
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="p-3 rounded-full"
                  style={{ background: 'var(--primary-text)' }}
                >
                  <MapPin className="w-6 h-6" style={{ color: 'var(--white-soft)' }} />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: 'var(--primary-text)'
                    }}
                  >
                    {venueName}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{
                      color: 'var(--secondary-text)',
                      fontFamily: 'var(--font-crimson)',
                      fontStyle: 'italic'
                    }}
                  >
                    Um espaço elegante e acolhedor para nosso dia especial
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Endereço</p>
                    <p className="text-gray-600 text-sm">{fullAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Data e Horário</p>
                    <p className="text-gray-600 text-sm">20 de Novembro de 2025, às 10:30h</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Estacionamento</p>
                    <p className="text-gray-600 text-sm">{locationData.parkingInfo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Acessibilidade</p>
                    <p className="text-gray-600 text-sm">{locationData.accessibilityInfo}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {showDirections && (
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button
                    onClick={handleDirections}
                    className="flex-1 px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium love-cursor"
                    style={{
                      background: 'var(--primary-text)',
                      color: 'var(--white-soft)',
                      fontFamily: 'var(--font-playfair)',
                      boxShadow: '0 4px 12px var(--shadow-subtle)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px var(--shadow-medium)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-subtle)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <Navigation className="w-5 h-5" />
                    Como Chegar
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="flex-1 px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium love-cursor"
                    style={{
                      background: 'var(--accent)',
                      color: 'var(--primary-text)',
                      fontFamily: 'var(--font-playfair)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 4px 12px var(--shadow-subtle)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px var(--shadow-medium)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.background = 'var(--decorative-light)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-subtle)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.background = 'var(--accent)'
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                    Mandar no TIZAP
                  </button>
                </div>
              )}
            </div>

            {/* Nearby Landmarks */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 24px var(--shadow-medium)'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-full"
                  style={{ background: 'var(--decorative)' }}
                >
                  <MapPin className="w-5 h-5" style={{ color: 'var(--white-soft)' }} />
                </div>
                <h4
                  className="font-semibold"
                  style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}
                >
                  Pontos de Referência Especiais
                </h4>
              </div>
              <ul className="space-y-2">
                {nearbyLandmarks.map((landmark, index) => (
                  <li key={index} className="text-sm flex items-start gap-2" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                    <div className="w-1 h-1 rounded-full mt-2" style={{ background: 'var(--primary-text)' }} />
                    {landmark}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Interactive Map */}
          <motion.div
            className="lg:sticky lg:top-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Localização no Mapa
              </h3>

              <GoogleMap
                location={locationData}
                height="500px"
                className="rounded-2xl overflow-hidden"
                showControls={true}
                showDirections={showDirections}
              />

              <div
                className="mt-6 p-4 rounded-xl"
                style={{
                  background: 'var(--accent)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <h4
                  className="font-medium mb-2"
                  style={{
                    color: 'var(--primary-text)',
                    fontFamily: 'var(--font-playfair)'
                  }}
                >
                  💕 Com Todo Nosso Amor
                </h4>
                <p
                  className="text-sm"
                  style={{
                    color: 'var(--secondary-text)',
                    fontFamily: 'var(--font-crimson)',
                    fontStyle: 'italic'
                  }}
                >
                  O local fica na região nobre de Eng. Luciano Cavalcante.
                  Cheguem 15-20 minutos antes. A gente gosta de receber como se fosse em casa - casual, tranquilo, sem correria.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          className="mt-16 rounded-3xl p-8"
          style={{
            background: 'var(--white-soft)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 8px 24px var(--shadow-medium)'
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}
          >
            Tudo para Nosso Dia Perfeito
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div
                className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'var(--primary-text)' }}
              >
                <Clock className="w-8 h-8" style={{ color: 'var(--white-soft)' }} />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}>Horário da Cerimônia</h4>
              <p className="text-sm" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                Começa às 10:30h da manhã<br />
                2-3 horas de celebração (com comida boa)
              </p>
            </div>

            <div className="text-center">
              <div
                className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'var(--decorative)' }}
              >
                <Car className="w-8 h-8" style={{ color: 'var(--white-soft)' }} />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}>Estacionamento</h4>
              <p className="text-sm" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                Vagas gratuitas + manobrista<br />
                (Sim, de verdade. É de graça.)
              </p>
            </div>

            <div className="text-center">
              <div
                className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'var(--secondary-text)' }}
              >
                <Info className="w-8 h-8" style={{ color: 'var(--white-soft)' }} />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}>Dress Code</h4>
              <p className="text-sm" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                Traje social<br />
                Cores claras são bem-vindas (é cerimônia de manhã no Ceará)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
