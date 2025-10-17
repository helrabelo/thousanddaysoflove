import { Metadata } from 'next'
import Navigation from '@/components/ui/Navigation'
import { GlobalGuestActions } from '@/components/ui/GlobalGuestActions'
import LiveTimelineMobile from '@/components/timeline/LiveTimelineMobile'

export const metadata: Metadata = {
  title: 'Timeline Ao Vivo - Dia 1000',
  description: 'Acompanhe cada momento do Dia 1000 em tempo real, direto da Casa HY.'
}

export default function LiveTimelinePage() {
  return (
    <div className="min-h-screen bg-[#0F0D0C]">
      <Navigation />
      <LiveTimelineMobile />
      <GlobalGuestActions />
    </div>
  )
}
