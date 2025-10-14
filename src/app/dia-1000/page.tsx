import { Metadata } from 'next'
import { LiveFeedPage } from './LiveFeedPage'
import Navigation from '@/components/ui/Navigation'

export const metadata: Metadata = {
  title: 'Celebração Ao Vivo - Hel & Ylana',
  description: 'Acompanhe em tempo real a celebração do casamento de Hel e Ylana'
}

export default function Page() {
  return (
    <>
      <Navigation />
      <LiveFeedPage />
    </>
  )
}
