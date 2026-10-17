import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import AddressModal from '../components/AddressModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Soukday - Épiceries orientales, Boucheries Halal & Marchés locaux',
  description: 'Commandez en ligne auprès de vos boucheries halal et épiceries locales au Québec. Épicerie directe expédiée partout au Canada et aux États-Unis.',
  keywords: 'Soukday, épicerie orientale, boucherie halal, couscous, viande halal Montréal, épicerie Canada',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
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
