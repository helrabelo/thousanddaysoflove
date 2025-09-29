import React from 'react'
import WeddingInvitation from '@/components/WeddingInvitation'

export const metadata = {
  title: 'Convite de Casamento | Hel & Ylana',
  description: 'Convite de casamento de Hel e Ylana - 20 de novembro de 2025. Nosso salão de festas, onde celebraremos juntos este dia inesquecível.',
}

export default function ConvitePage() {
  return (
    <div className="invitation-background">
      <WeddingInvitation />
    </div>
  )
}