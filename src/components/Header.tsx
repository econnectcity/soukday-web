'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { LiveWebSettings } from '../types';
import { DEFAULT_LIVE_SETTINGS } from '../services/api';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  Store as StoreIcon, 
  Globe, 
  ChevronDown, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface HeaderProps {
  settings?: LiveWebSettings;
}

export default function Header({ settings = DEFAULT_LIVE_SETTINGS }: HeaderProps) {
  const { 
    cartCount, 
    cartSubtotal, 
    setIsCartOpen, 
    selectedAddress, 
    setIsAddressModalOpen,
    searchQuery,
    setSearchQuery 
  } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-[#F68B62] via-[#f79d79] to-[#F68B62] text-white text-xs py-1.5 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings?.headerAnnouncementTag && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {settings.headerAnnouncementTag}
              </span>
            )}
            <span>
              {settings?.headerAnnouncementText || 'Épicerie Soukday expédiée partout au Canada et vers les États-Unis éligibles !'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px]">
            <a 
              href={settings?.headerPartnerUrl || "https://admin.soukday.ca/#/seller/register"} 
              target="_blank" 
              rel="noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <StoreIcon className="w-3 h-3" /> {settings?.headerPartnerText || 'Devenir vendeur partenaire'}
            </a>
            <span className="opacity-60">|</span>
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> {settings?.headerSupportPhone ? `${settings.headerSupportText}: ${settings.headerSupportPhone}` : (settings?.headerSupportText || 'Support client 7j/7')}
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            {settings?.webHeaderLogo ? (
              <img 
                src={settings.webHeaderLogo} 
                alt={settings.siteTitle || 'Soukday'} 
                className="h-10 sm:h-11 w-auto max-w-[190px] object-contain group-hover:scale-105 transition-transform" 
              />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F68B62] to-[#ff9e7a] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#F68B62]/20 group-hover:scale-105 transition-transform">
                  S
                </div>
                <div>
                  <span className="text-2xl font-black tracking-tight text-stone-900 flex items-center">
                    Souk<span className="text-[#F68B62]">day</span>
                  </span>
                  <span className="block text-[10px] -mt-1 font-semibold uppercase tracking-wider text-stone-400">
                    Épiceries & Boucheries
                  </span>
                </div>
              </>
            )}
          </Link>


          {/* Location / Address Picker Button */}
          <button 
            type="button"
            onClick={() => setIsAddressModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FCEFEA]/60 hover:bg-[#FCEFEA] border border-[#F68B62]/25 hover:border-[#F68B62]/50 hover:-translate-y-0.5 hover:shadow-xs text-left transition-all duration-200 shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FCEFEA] flex items-center justify-center text-[#F68B62] border border-[#F68B62]/20 group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="text-stone-500 font-medium text-[10px]">Livraison à / Postal</div>
              <div className="font-bold text-stone-800 flex items-center gap-1 max-w-[150px] truncate">
                {selectedAddress.postalCode ? `${selectedAddress.postalCode} (${selectedAddress.city})` : selectedAddress.city}
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </div>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher couscous, agneau, bœuf, épices, boucheries..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-[#F68B62] text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#F68B62]/20 transition-all duration-200"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-stone-400 hover:text-stone-600 bg-stone-200 hover:bg-stone-300 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language toggle */}
            <button 
              type="button" 
              className="hidden lg:flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-[#F68B62] px-2.5 py-1.5 rounded-lg hover:bg-stone-50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>FR</span>
            </button>

            {/* Seller login link */}
            <a 
              href="https://admin.soukday.ca/#/seller/login"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex text-xs font-semibold text-stone-700 hover:text-[#F68B62] px-3 py-2 rounded-xl hover:bg-stone-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Espace Vendeur
            </a>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#F68B62] hover:bg-[#e07750] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-[#F68B62]/25 hover:shadow-lg hover:shadow-[#F68B62]/35 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Panier</span>
              {cartCount > 0 ? (
                <span className="bg-white text-[#F68B62] text-xs font-black px-2 py-0.5 rounded-full">
                  {cartCount} • {cartSubtotal.toFixed(2)}$
                </span>
              ) : (
                <span className="hidden sm:inline text-xs font-medium text-white/80">0</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Location bar */}
        <div className="sm:hidden mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setIsAddressModalOpen(true)}
            className="flex items-center gap-1.5 text-stone-700 font-medium"
          >
            <MapPin className="w-3.5 h-3.5 text-[#F68B62]" />
            <span>Livraison à : <strong className="font-bold text-stone-900">{selectedAddress.city} ({selectedAddress.postalCode})</strong></span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>
          <span className="text-[11px] font-semibold text-[#F68B62]">Changer</span>
        </div>
      </div>
    </header>
  );
}
