'use client'

import Link from 'next/link'
import { Heart, Users, Calendar, Gift, CreditCard, BarChart3, ImageIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  const weddingDate = new Date('2025-11-20T00:00:00')
  const today = new Date()
  const daysToWedding = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const adminSections = [
    {
      href: '/admin/guests',
      icon: Users,
      title: 'Gerenciar Convidados',
      description: 'Adicionar convidados e confirmar RSVPs',
      color: 'blush'
    },
    {
      href: '/admin/posts',
      icon: Heart,
      title: 'Moderação de Mensagens',
      description: 'Aprovar/rejeitar mensagens dos convidados',
      color: 'blush'
    },
    {
      href: '/admin/photos',
      icon: ImageIcon,
      title: 'Moderação de Fotos',
      description: 'Aprovar/rejeitar fotos dos convidados',
      color: 'purple'
    },
    {
      href: '/admin/pagamentos',
      icon: CreditCard,
      title: 'Pagamentos',
      description: 'Rastrear pagamentos PIX',
      color: 'sage'
    },
    {
      href: '/admin/analytics',
      icon: BarChart3,
      title: 'Analytics',
      description: 'Estatísticas do casamento',
      color: 'purple'
    },
    {
      href: '/studio',
      icon: Calendar,
      title: 'Sanity Studio',
      description: 'Gerenciar conteúdo: História, Galeria, Pets, Sobre Nós, Lista de Presentes',
      color: 'sage',
      external: true
    }
  ]

  return (
    <div className="min-h-screen bg-hero-gradient py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-burgundy-700 hover:text-blush-600 inline-block mb-6">
            ← Voltar ao site
          </Link>
          <Heart className="h-16 w-16 text-blush-500 mx-auto mb-4" fill="currentColor" />
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-burgundy-800 mb-4">
            Admin - Mil Dias de Amor
          </h1>
          <p className="text-xl text-burgundy-600">
            Hel & Ylana • Casa própria • 4 pets • {daysToWedding} dias para Casa HY
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href}>
                <Card className="glass p-8 text-center hover:shadow-xl transition-shadow cursor-pointer h-full">
                  <Icon className={`w-16 h-16 text-${section.color}-500 mx-auto mb-4`} />
                  <h2 className="text-xl font-bold text-burgundy-800 mb-3">
                    {section.title}
                  </h2>
                  <p className="text-burgundy-600 mb-6">
                    {section.description}
                  </p>
                  <Button className="w-full">
                    Abrir
                  </Button>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}