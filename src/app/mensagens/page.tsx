import Navigation from '@/components/ui/Navigation'
import MessagesFeed from '@/components/messages/MessagesFeed'

export default function MensagensPage() {
  return (
    <main className="min-h-screen pt-12 md:pt-0 bg-[#F8F6F3]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#2C2C2C] via-[#4A4A4A] to-[#2C2C2C]">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-white mb-6">
            Mensagens
          </h1>
          <p className="font-crimson italic text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Compartilhe suas mensagens, desejos e memórias especiais com os noivos
          </p>
        </div>
      </section>

      {/* Messages Feed */}
      <MessagesFeed />
    </main>
  )
}
