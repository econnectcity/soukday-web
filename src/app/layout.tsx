import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import AddressModal from '../components/AddressModal';
import JsonLd from '../components/JsonLd';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://soukday.ca';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Soukday - Épiceries orientales, Boucheries Halal & Marchés locaux',
    template: '%s | Soukday',
  },
  description: 'Commandez en ligne auprès de vos boucheries halal et épiceries locales au Québec. Épicerie directe expédiée partout au Canada et aux États-Unis.',
  keywords: [
    'Soukday',
    'épicerie orientale',
    'boucherie halal Montréal',
    'couscous en ligne Canada',
    'viande halal Québec',
    'épicerie maghrébine',
    'livraison épicerie Montréal',
    'boucherie halal Laval',
    'boucherie halal Brossard',
    'marché oriental',
  ],
  alternates: {
    canonical: siteUrl,
    languages: {
      'fr-CA': siteUrl,
      'en-CA': `${siteUrl}?lang=en`,
    },
  },
  openGraph: {
    title: 'Soukday - Épiceries orientales, Boucheries Halal & Marchés locaux',
    description: 'Vos épiceries fines et boucheries locales livrées à votre porte. Épicerie directe expédiée partout au Canada et aux États-Unis.',
    url: siteUrl,
    siteName: 'Soukday',
    locale: 'fr_CA',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Soukday - Épiceries orientales & Boucheries Halal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soukday - Épiceries orientales & Boucheries Halal',
    description: 'Vos épiceries fines et boucheries locales livrées à votre porte au Québec et partout au Canada.',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
  robots: {
    index: false, // Set to true when launching production on soukday.ca
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <CartProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <AddressModal />
        </CartProvider>
      </body>
    </html>
  );
}
