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

// Sub-component: Venue Information Card
interface VenueInfoCardProps {
  venueName: string
  fullAddress: string
  parkingInfo: string
  accessibilityInfo: string
  showDirections: boolean
  onDirectionsClick: () => void
  onWhatsAppClick: () => void
}

function VenueInfoCard({
  venueName,
  fullAddress,
  parkingInfo,
  accessibilityInfo,
  showDirections,
  onDirectionsClick,
  onWhatsAppClick
}: VenueInfoCardProps) {
  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background: 'var(--white-soft)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 8px 24px var(--shadow-medium)'
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div
          className="p-2.5 rounded-full flex-shrink-0"
          style={{ background: 'var(--primary-text)' }}
        >
          <MapPin className="w-5 h-5" style={{ color: 'var(--white-soft)' }} />
        </div>
        <div className="flex-1">
          <h3
            className="text-xl md:text-2xl font-bold mb-1"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: 'var(--primary-text)'
            }}
          >
            {venueName}
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: 'var(--secondary-text)',
              fontFamily: 'var(--font-crimson)',
              fontStyle: 'italic'
            }}
          >
            Um espaço elegante e acolhedor<span className="hidden md:inline"> para nosso dia especial</span>
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800 text-sm">Endereço</p>
            <p className="text-gray-600 text-xs leading-relaxed">{fullAddress}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800 text-sm">Data e Horário</p>
            <p className="text-gray-600 text-xs">20 de Novembro de 2025, às 10:30h</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Car className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800 text-sm">Estacionamento</p>
            <p className="text-gray-600 text-xs">{parkingInfo}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800 text-sm">Acessibilidade</p>
            <p className="text-gray-600 text-xs">{accessibilityInfo}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showDirections && (
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={onDirectionsClick}
            className="flex-1 px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium love-cursor text-sm"
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
            <Navigation className="w-4 h-4" />
            Como Chegar
          </button>

          <button
            onClick={onWhatsAppClick}
            className="flex-1 px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium love-cursor text-sm"
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
            <Share2 className="w-4 h-4" />
            <span className="hidden md:inline">Mandar no </span>TIZAP
          </button>
        </div>
      )}
    </div>
  )
}

// Sub-component: Nearby Landmarks Card
interface NearbyLandmarksCardProps {
  landmarks: string[]
}

function NearbyLandmarksCard({ landmarks }: NearbyLandmarksCardProps) {
  return (
    <div
      className="rounded-2xl p-4 md:p-4"
      style={{
        background: 'var(--white-soft)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 8px 24px var(--shadow-medium)'
      }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="p-1.5 rounded-full"
          style={{ background: 'var(--decorative)' }}
        >
          <MapPin className="w-4 h-4" style={{ color: 'var(--white-soft)' }} />
        </div>
        <h4
          className="font-semibold text-sm"
          style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}
        >
          Pontos de Referência
        </h4>
      </div>
      <ul className="space-y-1.5">
        {landmarks.map((landmark, index) => (
          <li
            key={index}
            className="text-xs flex items-start gap-2"
            style={{
              color: 'var(--secondary-text)',
              fontFamily: 'var(--font-crimson)',
              fontStyle: 'italic'
            }}
          >
            <div
              className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
              style={{ background: 'var(--primary-text)' }}
            />
            {landmark}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Sub-component: Map Card
interface MapCardProps {
  locationData: {
    name: string
    address: string
    lat: number
    lng: number
    placeId?: string
    parkingInfo: string
    accessibilityInfo: string
  }
  showDirections: boolean
}

function MapCard({ locationData, showDirections }: MapCardProps) {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-5 border border-white/30 shadow-xl flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 md:mb-4 text-center">
        Localização no Mapa
      </h3>

      <div className="flex-1 min-h-0">
        <GoogleMap
          location={locationData}
          height="350px"
          className="rounded-2xl overflow-hidden md:h-full"
          showControls={true}
          showDirections={showDirections}
        />
      </div>

      <div
        className="mt-4 p-3.5 rounded-xl"
        style={{
          background: 'var(--accent)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <h4
          className="font-medium mb-1.5 text-sm"
          style={{
            color: 'var(--primary-text)',
            fontFamily: 'var(--font-playfair)'
          }}
        >
          📍 Informações Práticas
        </h4>
        <p
          className="text-xs"
          style={{
            color: 'var(--secondary-text)',
            fontFamily: 'var(--font-crimson)',
            fontStyle: 'italic',
            lineHeight: '1.5'
          }}
        >
          O local fica na região nobre de Eng. Luciano Cavalcante.
          Cheguem 15-20 minutos antes. A gente gosta de receber como se fosse em casa - casual, tranquilo, sem correria.
        </p>
      </div>
    </div>
  )
}

// Main component
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
      className="min-h-screen md:h-[calc(100vh-80px)] flex items-center py-12 md:py-0 px-4 md:px-8 relative overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Subtle botanical decorations */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
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

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Section Header */}
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

        {/* Unified Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Venue Information & Landmarks */}
          <motion.div
            className="flex flex-col gap-4 md:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <VenueInfoCard
              venueName={venueName}
              fullAddress={fullAddress}
              parkingInfo={locationData.parkingInfo}
              accessibilityInfo={locationData.accessibilityInfo}
              showDirections={showDirections}
              onDirectionsClick={handleDirections}
              onWhatsAppClick={handleWhatsAppShare}
            />
            <NearbyLandmarksCard landmarks={nearbyLandmarks} />
          </motion.div>

          {/* Right Column - Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <MapCard locationData={locationData} showDirections={showDirections} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
