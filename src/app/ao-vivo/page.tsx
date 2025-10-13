import { Metadata } from 'next'
import { LiveFeedPage } from './LiveFeedPage'

export const metadata: Metadata = {
  title: 'Celebração Ao Vivo - Hel & Ylana',
  description: 'Acompanhe em tempo real a celebração do casamento de Hel e Ylana'
}

export default function Page() {
  return <LiveFeedPage />
}
