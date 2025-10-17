import { Metadata } from 'next'
import Navigation from '@/components/ui/Navigation'
import { LiveFeedPage } from '../LiveFeedPage'

export const metadata: Metadata = {
  title: 'Celebração Ao Vivo - Exibição TV',
  description: 'Versão otimizada para exibição na TV com timeline e feed em tempo real.',
}

export default function LiveFeedTVPage() {
  return (
    <>
      <Navigation />
      <LiveFeedPage variant="tv" />
    </>
  )
}
