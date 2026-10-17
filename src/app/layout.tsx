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

import { fetchLiveWebSettings } from '../services/api';

export async function generateMetadata(): Promise<Metadata> {
  const webSettings = await fetchLiveWebSettings();
  const title = webSettings.siteTitle || 'Soukday - Épiceries orientales, Boucheries Halal & Marchés locaux';
  const description = webSettings.commonMetaDescription || 'Commandez en ligne auprès de vos boucheries halal et épiceries locales au Québec. Épicerie directe expédiée partout au Canada et aux États-Unis.';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${webSettings.siteTitle ? webSettings.siteTitle.split(' - ')[0] : 'Soukday'}`,
    },
    description,
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
    icons: webSettings.favicon ? { icon: webSettings.favicon } : undefined,
    alternates: {
      canonical: siteUrl,
      languages: {
        'fr-CA': siteUrl,
        'en-CA': `${siteUrl}?lang=en`,
      },
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: 'Soukday',
      locale: 'fr_CA',
      type: 'website',
      images: [
        {
          url: webSettings.placeholderImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&h=630&q=80',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [webSettings.placeholderImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&h=630&q=80'],
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webSettings = await fetchLiveWebSettings();

  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <head>
        <JsonLd />
        {webSettings.favicon && (
          <link rel="icon" href={webSettings.favicon} />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <CartProvider>
          <Header settings={webSettings} />
          <main className="flex-1">
            {children}
          </main>
          <Footer settings={webSettings} />
          <CartDrawer />
          <AddressModal />
        </CartProvider>
      </body>
    </html>
  );
}
