import React from 'react'
import WeddingInvitation from '@/components/WeddingInvitation'
import Navigation from '@/components/ui/Navigation'

export const metadata = {
  title: 'Convite de Casamento | Hel & Ylana',
  description: 'Convite de casamento de Hel e Ylana - 20 de novembro de 2025. Nosso salão de festas, onde celebraremos juntos este dia inesquecível.',
}

export default function ConvitePage() {
  return (
    <>
      <Navigation />
      <div className="invitation-background pt-20">
        <WeddingInvitation />
      </div>
    </>
  )
}
