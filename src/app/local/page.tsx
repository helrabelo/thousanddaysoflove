import { Metadata } from 'next'
import Navigation from '@/components/ui/Navigation'
import WeddingLocation from '@/components/sections/WeddingLocation'

export const metadata: Metadata = {
  title: 'Local da Cerimônia | Mil Dias de Amor - Casamento Hel & Ylana',
  description: 'Casa HY em Fortaleza, CE - Local do casamento de Hel e Ylana em 20 de Novembro de 2025. Veja a localização, como chegar, e todas as informações importantes.',
  keywords: 'casamento, Fortaleza, Casa HY, Eng. Luciano Cavalcante, local cerimônia, wedding venue',
  openGraph: {
    title: 'Local da Cerimônia - Casa HY | Mil Dias de Amor',
    description: 'Junte-se a nós na Casa HY em Fortaleza para celebrar nosso casamento. Veja a localização no mapa e como chegar.',
    type: 'website',
    images: [
      {
        url: '/wedding-location-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Casa HY - Local do Casamento Hel & Ylana'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local da Cerimônia - Casa HY',
    description: 'Junte-se a nós na Casa HY em Fortaleza para celebrar nosso casamento.'
  }
}

export default function LocalPage() {
  return (
    <main className="min-h-screen pt-20" style={{ background: 'var(--background)' }}>
      <Navigation />
      <WeddingLocation />
    </main>
  )
}
