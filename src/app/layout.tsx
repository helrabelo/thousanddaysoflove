import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Mil Dias de Amor | Casamento Hel & Ylana",
  description: "Junte-se a Hel e Ylana para celebrar seus 1000 dias de amor com o casamento em 20 de novembro de 2025. Confirme presença, explore nossa lista de presentes e faça parte do nosso dia especial.",
  keywords: "casamento, Hel e Ylana, 11 novembro 2025, mil dias de amor, RSVP, lista de presentes",
  authors: [{ name: "Hel & Ylana" }],
  openGraph: {
    title: "Mil Dias de Amor | Casamento Hel & Ylana",
    description: "Junte-se a nós para celebrar 1000 dias de amor se tornando para sempre em 20 de novembro de 2025",
    type: "website",
    url: "https://thousandaysof.love",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mil Dias de Amor | Casamento Hel & Ylana",
    description: "Junte-se a nós para celebrar 1000 dias de amor se tornando para sempre em 20 de novembro de 2025",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
