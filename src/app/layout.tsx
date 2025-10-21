import type { Metadata } from "next";
import { Inter, Playfair_Display, Crimson_Text, Cormorant, Shadows_Into_Light } from "next/font/google";
import "./globals.css";
import "../styles/wedding-theme.css";
import { sanityFetch } from '@/sanity/lib/client'
import { seoSettingsQuery } from '@/sanity/queries/seo'
import { GlobalGuestActions } from '@/components/ui/GlobalGuestActions'

type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player'

interface SeoSettings {
  defaultTitle?: string
  defaultDescription?: string
  keywords?: string[]
  robotsIndex?: boolean
  openGraph?: {
    siteName?: string
    type?: string
    locale?: string
  }
  twitter?: {
    cardType?: string
    handle?: string
  }
}

const allowedOpenGraphTypes = [
  'article',
  'website',
  'book',
  'profile',
  'music.song',
  'music.album',
  'music.playlist',
  'music.radio_station',
  'video.movie',
  'video.episode',
  'video.tv_show',
  'video.other'
] as const

function isAllowedOpenGraphType(value?: string): value is typeof allowedOpenGraphTypes[number] {
  return !!value && (allowedOpenGraphTypes as readonly string[]).includes(value)
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const shadowsIntoLight = Shadows_Into_Light({
  variable: "--font-shadows",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400'],
});

// Generate metadata from Sanity
export async function generateMetadata(): Promise<Metadata> {
  // Fetch SEO settings from Sanity
  const seoSettings = await sanityFetch<SeoSettings | null>({
    query: seoSettingsQuery,
    tags: ['seoSettings'],
  })

  // Fallback values if Sanity data is not available
  const defaultTitle = seoSettings?.defaultTitle || "Mil Dias de Amor | Casamento Hel & Ylana"
  const defaultDescription = seoSettings?.defaultDescription || "Junte-se a Hel e Ylana para celebrar seus 1000 dias de amor com o casamento em 20 de novembro de 2025. Confirme presença, explore nossa lista de presentes e faça parte do nosso dia especial."
  const keywords = seoSettings?.keywords?.join(', ') || "casamento, Hel e Ylana, 20 novembro 2025, mil dias de amor, RSVP, lista de presentes"
  const siteName = seoSettings?.openGraph?.siteName || "Thousand Days of Love"
  const rawTwitterCard = seoSettings?.twitter?.cardType
  const twitterCard: TwitterCardType = rawTwitterCard === 'summary' || rawTwitterCard === 'summary_large_image' || rawTwitterCard === 'app' || rawTwitterCard === 'player'
    ? rawTwitterCard
    : 'summary_large_image'
  const rawOpenGraphType = seoSettings?.openGraph?.type
  const openGraphType = isAllowedOpenGraphType(rawOpenGraphType)
    ? rawOpenGraphType
    : 'website'

  return {
    title: defaultTitle,
    description: defaultDescription,
    keywords: keywords,
    authors: [{ name: "Hel & Ylana" }],
    robots: seoSettings?.robotsIndex !== false ? 'index, follow' : 'noindex, nofollow',
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      type: openGraphType,
      locale: seoSettings?.openGraph?.locale || "pt_BR",
      url: "https://thousandaysof.love",
      siteName: siteName,
      images: [
        {
          url: "/og/wedding-invitation.png",
          width: 1200,
          height: 630,
          alt: "Hel & Ylana - Casamento 20 de Novembro 2025",
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title: defaultTitle,
      description: defaultDescription,
      images: ["/og/wedding-invitation.png"],
      site: seoSettings?.twitter?.handle,
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${playfair.variable} ${crimsonText.variable} ${cormorant.variable} ${shadowsIntoLight.variable} font-serif antialiased`}
      >
        {children}
        <GlobalGuestActions />
      </body>
    </html>
  );
}
