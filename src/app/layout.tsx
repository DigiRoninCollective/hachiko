import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Hachiko Token | Japan's Most Loyal Dog on Solana",
  description: "Hachiko Token - A tribute to Japan's most loyal dog, now immortalized on Solana. Join the community celebrating unwavering devotion and loyalty. Built on Solana with 0% tax.",
  keywords: ["Hachiko", "Solana", "Memecoin", "Cryptocurrency", "Loyal Dog", "Japan", "Token", "Crypto", "DeFi", "Solana Token"],
  authors: [{ name: "Hachiko Token Team" }],
  creator: "Hachiko Token",
  publisher: "Hachiko Token",
  metadataBase: new URL('https://hachiko.fun'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hachiko.fun',
    title: 'Hachiko Token | Japan\'s Most Loyal Dog on Solana',
    description: 'A tribute to Japan\'s most loyal dog, now immortalized on Solana. Join the community celebrating unwavering devotion and loyalty.',
    siteName: 'Hachiko Token',
    images: [
      {
        url: '/images/hachiko/hachiko-family.webp',
        width: 1200,
        height: 630,
        alt: 'Hachiko Token - The Loyal Dog on Solana',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hachiko Token | Japan\'s Most Loyal Dog on Solana',
    description: 'A tribute to Japan\'s most loyal dog, now immortalized on Solana. Join the community celebrating unwavering devotion and loyalty.',
    images: ['/images/hachiko/hachiko-family.webp'],
    creator: '@HachikoToken',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
