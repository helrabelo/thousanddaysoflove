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
  title: "Thousand Days of Love | Hel & Ylana's Wedding",
  description: "Join Hel and Ylana as they celebrate their 1000 days of love with their wedding on November 11th, 2025. RSVP, explore their registry, and be part of their special day.",
  keywords: "wedding, Hel and Ylana, November 11 2025, thousand days of love, RSVP, wedding registry",
  authors: [{ name: "Hel & Ylana" }],
  openGraph: {
    title: "Thousand Days of Love | Hel & Ylana's Wedding",
    description: "Join us as we celebrate 1000 days of love becoming forever on November 11th, 2025",
    type: "website",
    url: "https://thousandaysof.love",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thousand Days of Love | Hel & Ylana's Wedding",
    description: "Join us as we celebrate 1000 days of love becoming forever on November 11th, 2025",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
