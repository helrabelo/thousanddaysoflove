import { Metadata } from 'next'
import LiveTimelineTV from '@/components/timeline/LiveTimelineTV'

export const metadata: Metadata = {
  title: 'Timeline TV - Hel & Ylana',
  description: 'Visao para TV do casamento, com atualizacoes em tempo real.'
}

export default function LiveTimelineTVPage() {
  return <LiveTimelineTV />
}
