// @ts-nocheck: wedding location map integration pending typed coordinates + maps utils
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
  const venueName = data?.weddingSettings?.venueName || 'Casa HY'
  const venueAddress = data?.weddingSettings?.venueAddress || 'Rua Coronel Francisco Flávio Carneiro, 200'
  const venueCity = data?.weddingSettings?.venueCity || 'Fortaleza'
  const venueState = data?.weddingSettings?.venueState || 'CE'
  const venueZip = data?.weddingSettings?.venueZip || '60813-690'
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
    parkingInfo: 'Há bastante estacionamento no local, na sombra, seguro, bonitinho!',
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
    '📍 Fácil acesso pela Washington Soares',
    '📍 Região nobre de Eng. Luciano Cavalcante'
  ]

  return (
    <section
      className="min-h-screen md:h-[calc(100vh-80px)] flex items-center py-12 md:py-0 px-4 md:px-8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Compact Section Header */}
        <motion.div
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: 'var(--primary-text)'
            }}
          >
            {sectionTitle}
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{
              color: 'var(--secondary-text)',
              fontFamily: 'var(--font-crimson)',
              fontStyle: 'italic',
              lineHeight: '1.6'
            }}
          >
            {sectionDescription}
          </p>
        </motion.div>

        {/* Mobile Layout - Stack Vertically */}
        <div className="md:hidden space-y-6">
          {/* Venue Information - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div
              className="rounded-3xl p-4"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 24px var(--shadow-medium)'
              }}
            >
              <div className="flex items-start gap-2.5 mb-3.5">
                <div
                  className="p-2 rounded-full flex-shrink-0"
                  style={{ background: 'var(--primary-text)' }}
                >
                  <MapPin className="w-6 h-6" style={{ color: 'var(--white-soft)' }} />
                </div>
                <div className="flex-1">
                  <h3
                    className="font-bold mb-1"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: 'var(--primary-text)',
                      fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                      lineHeight: '1.25'
                    }}
                  >
                    {venueName}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{
                      color: 'var(--secondary-text)',
                      fontFamily: 'var(--font-crimson)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
                      lineHeight: '1.5'
                    }}
                  >
                    Um espaço elegante e acolhedor
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p
                      className="font-medium text-gray-800"
                      style={{
                        fontSize: 'clamp(0.9375rem, 2vw, 1rem)'
                      }}
                    >
                      Endereço
                    </p>
                    <p
                      className="text-gray-600"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.8vw, 0.9375rem)',
                        lineHeight: '1.5'
                      }}
                    >
                      {fullAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p
                      className="font-medium text-gray-800"
                      style={{
                        fontSize: 'clamp(0.9375rem, 2vw, 1rem)'
                      }}
                    >
                      Data e Horário
                    </p>
                    <p
                      className="text-gray-600"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.8vw, 0.9375rem)',
                        lineHeight: '1.5'
                      }}
                    >
                      20 de Novembro de 2025, às 10:30h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Car className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p
                      className="font-medium text-gray-800"
                      style={{
                        fontSize: 'clamp(0.9375rem, 2vw, 1rem)'
                      }}
                    >
                      Estacionamento
                    </p>
                    <p
                      className="text-gray-600"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.8vw, 0.9375rem)',
                        lineHeight: '1.5'
                      }}
                    >
                      {locationData.parkingInfo}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p
                      className="font-medium text-gray-800"
                      style={{
                        fontSize: 'clamp(0.9375rem, 2vw, 1rem)'
                      }}
                    >
                      Acessibilidade
                    </p>
                    <p
                      className="text-gray-600"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.8vw, 0.9375rem)',
                        lineHeight: '1.5'
                      }}
                    >
                      {locationData.accessibilityInfo}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {showDirections && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleDirections}
                    className="flex-1 px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium love-cursor"
                    style={{
                      background: 'var(--primary-text)',
                      color: 'var(--white-soft)',
                      fontFamily: 'var(--font-playfair)',
                      fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
                      boxShadow: '0 4px 12px var(--shadow-subtle)'
                    }}
                  >
                    <Navigation className="w-4 h-4" />
                    Como Chegar
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="flex-1 px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium love-cursor"
                    style={{
                      background: 'var(--accent)',
                      color: 'var(--primary-text)',
                      fontFamily: 'var(--font-playfair)',
                      fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 4px 12px var(--shadow-subtle)'
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    TIZAP
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Nearby Landmarks - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 24px var(--shadow-medium)'
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="p-1.5 rounded-full"
                  style={{ background: 'var(--decorative)' }}
                >
                  <MapPin className="w-4.5 h-4.5" style={{ color: 'var(--white-soft)' }} />
                </div>
                <h4
                  className="font-semibold"
                  style={{
                    color: 'var(--primary-text)',
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 'clamp(0.9375rem, 2vw, 1rem)'
                  }}
                >
                  Pontos de Referência
                </h4>
              </div>
              <ul className="space-y-1">
                {nearbyLandmarks.map((landmark, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2"
                    style={{
                      color: 'var(--secondary-text)',
                      fontFamily: 'var(--font-crimson)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(0.875rem, 1.8vw, 0.9375rem)',
                      lineHeight: '1.5'
                    }}
                  >
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--primary-text)' }} />
                    {landmark}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Map - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-4 border border-white/30 shadow-xl">
              <h3
                className="font-semibold text-gray-800 text-center"
                style={{
                  fontSize: 'clamp(1.0625rem, 2.5vw, 1.125rem)',
                  lineHeight: '1.3',
                  marginBottom: '0.625rem'
                }}
              >
                Localização no Mapa
              </h3>

              <GoogleMap
                location={locationData}
                height="350px"
                className="rounded-2xl overflow-hidden"
                showControls={true}
                showDirections={showDirections}
              />

              <div
                className="mt-3 p-3 rounded-xl"
                style={{
                  background: 'var(--accent)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <h4
                  className="font-medium mb-1"
                  style={{
                    color: 'var(--primary-text)',
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 'clamp(0.9375rem, 2vw, 1rem)'
                  }}
                >
                  💕 Com Todo Nosso Amor
                </h4>
                <p
                  style={{
                    color: 'var(--secondary-text)',
                    fontFamily: 'var(--font-crimson)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(0.875rem, 1.8vw, 0.9375rem)',
                    lineHeight: '1.5'
                  }}
                >
                  O local fica na região nobre de Eng. Luciano Cavalcante.
                  Cheguem 15-20 minutos antes. A gente gosta de receber como se fosse em casa - casual, tranquilo, sem correria.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Desktop Layout - True 50/50 Split */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Column - Venue Information */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {/* Main Venue Details Card */}
            <div
              className="rounded-3xl p-5 flex-1"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 24px var(--shadow-medium)'
              }}
            >
              <div className="flex items-start gap-2.5 mb-4">
                <div
                  className="p-2 rounded-full flex-shrink-0"
                  style={{ background: 'var(--primary-text)' }}
                >
                  <MapPin className="w-5.5 h-5.5" style={{ color: 'var(--white-soft)' }} />
                </div>
                <div className="flex-1">
                  <h3
                    className="font-bold mb-1"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: 'var(--primary-text)',
                      fontSize: 'clamp(1.375rem, 2vw, 1.5rem)',
                      lineHeight: '1.25'
                    }}
                  >
                    {venueName}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{
                      color: 'var(--secondary-text)',
                      fontFamily: 'var(--font-crimson)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(0.9375rem, 1.2vw, 1rem)',
                      lineHeight: '1.5'
                    }}
                  >
                    Nosso dia, nossa casinha! Não podia ser mais especial.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p
                      className="font-medium text-gray-800"
                      style={{
                        fontSize: 'clamp(0.9375rem, 1.2vw, 1rem)'
                      }}
                    >
                      Endereço
                    </p>
                    <p
                      className="text-gray-600 leading-relaxed"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.1vw, 0.9375rem)',
                        lineHeight: '1.5'
                      }}
                    >
                      {fullAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p
                      className="font-medium text-gray-800"
                      style={{
                        fontSize: 'clamp(0.9375rem, 1.2vw, 1rem)'
                      }}
                    >
                      Data e Horário
                    </p>
                    <p
                      className="text-gray-600"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.1vw, 0.9375rem)',
                        lineHeight: '1.5'
                      }}
                    >
                      20 de Novembro de 2025, às 10:30h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Car className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p
                      className="font-medium text-gray-800"
                      style={{
                        fontSize: 'clamp(0.9375rem, 1.2vw, 1rem)'
                      }}
                    >
                      Estacionamento
                    </p>
                    <p
                      className="text-gray-600"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.1vw, 0.9375rem)',
                        lineHeight: '1.5'
                      }}
                    >
                      {locationData.parkingInfo}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Side by Side */}
              {showDirections && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleDirections}
                    className="flex-1 px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium love-cursor"
                    style={{
                      background: 'var(--primary-text)',
                      color: 'var(--white-soft)',
                      fontFamily: 'var(--font-playfair)',
                      fontSize: 'clamp(0.875rem, 1.1vw, 0.9375rem)',
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
                    <Navigation className="w-4 h-4" />
                    Como Chegar
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="flex-1 px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium love-cursor"
                    style={{
                      background: 'var(--accent)',
                      color: 'var(--primary-text)',
                      fontFamily: 'var(--font-playfair)',
                      fontSize: 'clamp(0.875rem, 1.1vw, 0.9375rem)',
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
                    <Share2 className="w-4 h-4" />
                    Mandar no TIZAP
                  </button>
                </div>
              )}
            </div>

            {/* Nearby Landmarks - Compact */}
            <div
              className="rounded-2xl p-3.5"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 24px var(--shadow-medium)'
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="p-1.5 rounded-full"
                  style={{ background: 'var(--decorative)' }}
                >
                  <MapPin className="w-4 h-4" style={{ color: 'var(--white-soft)' }} />
                </div>
                <h4
                  className="font-semibold"
                  style={{
                    color: 'var(--primary-text)',
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 'clamp(0.9375rem, 1.2vw, 1rem)'
                  }}
                >
                  Pontos de Referência
                </h4>
              </div>
              <ul className="space-y-1">
                {nearbyLandmarks.map((landmark, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2"
                    style={{
                      color: 'var(--secondary-text)',
                      fontFamily: 'var(--font-crimson)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(0.875rem, 1.1vw, 0.9375rem)',
                      lineHeight: '1.5'
                    }}
                  >
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--primary-text)' }} />
                    {landmark}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right Column - Map (Full Height) */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-4 border border-white/30 shadow-xl flex flex-col h-full">

              <div className="flex-1 min-h-0">
                <GoogleMap
                  location={locationData}
                  height="100%"
                  className="rounded-2xl overflow-hidden h-full"
                  showControls={true}
                  showDirections={showDirections}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
