import { Metadata } from 'next'
import Navigation from '@/components/ui/Navigation'
import WeddingLocation from '@/components/sections/WeddingLocation'

export const metadata: Metadata = {
  title: 'Local da Cerimônia | Mil Dias de Amor - Casamento Hel & Ylana',
  description: 'Constable Galerie em Fortaleza, CE - Local do casamento de Hel e Ylana em 20 de Novembro de 2025. Veja a localização, como chegar, e todas as informações importantes.',
  keywords: 'casamento, Fortaleza, Constable Galerie, Eng. Luciano Cavalcante, local cerimônia, wedding venue',
  openGraph: {
    title: 'Local da Cerimônia - Constable Galerie | Mil Dias de Amor',
    description: 'Junte-se a nós no Constable Galerie em Fortaleza para celebrar nosso casamento. Veja a localização no mapa e como chegar.',
    type: 'website',
    images: [
      {
        url: '/wedding-location-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Constable Galerie - Local do Casamento Hel & Ylana'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local da Cerimônia - Constable Galerie',
    description: 'Junte-se a nós no Constable Galerie em Fortaleza para celebrar nosso casamento.'
  }
}

export default function LocalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50">
      <Navigation />
      <WeddingLocation />
    </main>
  )
}