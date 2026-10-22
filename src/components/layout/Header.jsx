'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedLanguage } from '@/redux/slices/languageSlice';
import { useCart } from '@/context/SoukdayCartContext';
import { useTranslation } from '@/utils/translation';
import { 
  MapPin, 
  Search, 
  ShoppingCart, 
  Globe, 
  ChevronDown, 
  User,
  Truck,
  Clock,
  Calendar
} from 'lucide-react';

const Login = dynamic(() => import('../login/Login'), { ssr: false });

function CanadaFlag({ className = "w-4 h-3" }) {
  return (
    <svg 
      viewBox="0 0 640 480" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path fill="#d80621" d="M0 0h640v480H0z"/>
      <path fill="#ffffff" d="M160 0h320v480H160z"/>
      <path fill="#d80621" d="m320 72.8 13.6 42.6 30.6-20.9-10 40 44-7.4-23.7 34.3 43.1 19.3-43 14 18.3 38.6-35.3-7.5 4.3 39-31.9-25.7-4 75.8h-12l-4-75.8-31.9 25.7 4.3-39-35.3 7.5 18.3-38.6-43-14 43.1-19.3-23.7-34.3 44 7.4-10-40 30.6 20.9z"/>
    </svg>
  );
}

export default function Header() {
  const dispatch = useDispatch();
  const settingState = useSelector((state) => state.Setting);
  const languageState = useSelector((state) => state.Language);
  const user = useSelector((state) => state.User?.user);
  const { currentCode, isFrench } = useTranslation();
  
  const [showLogin, setShowLogin] = useState(false);
  const [initialRegister, setInitialRegister] = useState(false);

  const handleOpenLogin = () => {
    setInitialRegister(false);
    setShowLogin(true);
  };

  const handleOpenRegister = () => {
    setInitialRegister(true);
    setShowLogin(true);
  };

  const setting = settingState?.setting || {};
  const webSettings = setting?.web_settings || {};

  const { 
    cartCount, 
    cartSubtotal, 
    setIsCartOpen, 
    selectedAddress, 
    setIsAddressModalOpen,
    searchQuery,
    setSearchQuery 
  } = useCart();

  const headerLogo =
    webSettings?.web_header_logo ||
    webSettings?.web_logo ||
    setting?.web_logo ||
    setting?.logo ||
    '/images/logo.png';

  const siteTitle = webSettings?.site_title || setting?.app_name || 'Soukday';

  // Has the customer entered a valid location/address?
  const hasSelectedLocation = Boolean(
    selectedAddress && (selectedAddress.city || selectedAddress.postalCode)
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-xs">
        {/* Top Marquee Announcement Bar (Continuous Right-to-Left Never-Ending Loop) */}
        <div className="bg-gradient-to-r from-[#F68B62] via-[#f89b77] to-[#F68B62] text-white text-xs py-2 font-medium overflow-hidden border-b border-[#e07750]/30 select-none shadow-2xs">
          <div 
            className="flex items-center w-max will-change-transform hover:[animation-play-state:paused]"
            style={{
              animation: 'marquee-rtl 32s linear infinite',
            }}
          >
            {/* Half 1 (50% of track) */}
            <div className="flex items-center shrink-0">
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Truck className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Livraison gratuite sur tout achat de 150$ et plus" : "Free delivery on all orders over $150"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Clock className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Délai de livraison 24 - 48 h" : "Delivery time: 24 - 48 hrs"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Calendar className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Livraison sur la Rive-sud seulement les fins de semaines" : "South Shore delivery on weekends only"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Truck className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Livraison gratuite sur tout achat de 150$ et plus" : "Free delivery on all orders over $150"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Clock className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Délai de livraison 24 - 48 h" : "Delivery time: 24 - 48 hrs"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Calendar className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Livraison sur la Rive-sud seulement les fins de semaines" : "South Shore delivery on weekends only"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
            </div>

            {/* Half 2 (Exact identical 50% duplicate for seamless infinite loop) */}
            <div className="flex items-center shrink-0" aria-hidden="true">
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Truck className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Livraison gratuite sur tout achat de 150$ et plus" : "Free delivery on all orders over $150"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Clock className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Délai de livraison 24 - 48 h" : "Delivery time: 24 - 48 hrs"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Calendar className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Livraison sur la Rive-sud seulement les fins de semaines" : "South Shore delivery on weekends only"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Truck className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Livraison gratuite sur tout achat de 150$ et plus" : "Free delivery on all orders over $150"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Clock className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Délai de livraison 24 - 48 h" : "Delivery time: 24 - 48 hrs"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
              <span className="inline-flex items-center gap-2 px-8 font-semibold tracking-wide">
                <Calendar className="w-3.5 h-3.5 text-black shrink-0" />
                {isFrench ? "Livraison sur la Rive-sud seulement les fins de semaines" : "South Shore delivery on weekends only"}
              </span>
              <span className="text-white/40 text-xs">✦</span>
            </div>
          </div>
        </div>

        {/* Main navigation bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            
            {/* 1. Header Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              {headerLogo ? (
                <img 
                  src={headerLogo} 
                  alt={siteTitle} 
                  className="h-9 sm:h-11 w-auto max-w-[170px] sm:max-w-[190px] object-contain group-hover:scale-105 transition-transform" 
                  onError={(e) => {
                    if (typeof window !== 'undefined' && e.currentTarget.src !== window.location.origin + '/images/logo.png') {
                      e.currentTarget.src = '/images/logo.png';
                    }
                  }}
                />
              ) : (
                <>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#F68B62] to-[#ff9e7a] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#F68B62]/20 group-hover:scale-105 transition-transform">
                    S
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 flex items-center">
                      Souk<span className="text-[#F68B62]">day</span>
                    </span>
                    <span className="block text-[10px] -mt-1 font-semibold uppercase tracking-wider text-stone-400">
                      {isFrench ? "Épiceries & Boucheries" : "Groceries & Butcheries"}
                    </span>
                  </div>
                </>
              )}
            </Link>

            {/* 2. Location Box (Only shown when location is put / chosen, otherwise hidden) */}
            {hasSelectedLocation && (
              <button 
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FCEFEA]/80 hover:bg-[#FCEFEA] border border-[#F68B62]/30 hover:border-[#F68B62]/60 hover:-translate-y-0.5 text-left transition-all duration-200 shrink-0 cursor-pointer shadow-2xs"
                title={isFrench ? "Modifier l'adresse de livraison" : "Change delivery address"}
              >
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#F68B62] border border-[#F68B62]/20 shadow-2xs shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <div className="text-stone-500 font-medium text-[9px] uppercase tracking-wider">
                    {isFrench ? "Livraison à" : "Deliver to"}
                  </div>
                  <div className="font-bold text-stone-800 flex items-center gap-1 max-w-[150px] truncate">
                    {selectedAddress.postalCode ? `${selectedAddress.postalCode} (${selectedAddress.city})` : selectedAddress.city}
                    <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
                  </div>
                </div>
              </button>
            )}

            {/* 3. Bigger & Wide Search Bar */}
            <div className={`flex-1 relative min-w-0 transition-all duration-300 ${hasSelectedLocation ? 'max-w-2xl' : 'max-w-4xl'}`}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isFrench ? "Rechercher couscous, agneau, bœuf, épices, boucheries..." : "Search couscous, lamb, beef, spices, butcher shops..."}
                  className="w-full h-11 sm:h-12 pl-11 sm:pl-12 pr-10 rounded-full bg-[#FCEFEA] hover:bg-[#fae6de] focus:bg-white border border-[#F68B62]/25 hover:border-[#F68B62]/50 focus:border-[#F68B62] text-sm sm:text-base text-stone-900 placeholder-stone-500/80 focus:outline-none focus:ring-3 focus:ring-[#F68B62]/20 shadow-xs transition-all duration-200"
                />
                <Search className="w-5 h-5 text-[#F68B62] absolute left-3.5 sm:left-4 pointer-events-none" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 text-xs text-[#F68B62] hover:text-[#e07750] bg-white hover:bg-stone-100 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* 4. Right Action Controls: Language, Login Icon, Cart Icon */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Language Switcher - Circular button like cart with Canadian flag & opposite target language */}
              <button 
                type="button" 
                onClick={() => {
                  const available = languageState?.availableLanguages || [];
                  const activeCode = (currentCode || 'fr').toLowerCase();
                  let nextLang = available.find(l => (l.code || '').toLowerCase() !== activeCode);
                  if (!nextLang) {
                    nextLang = activeCode === 'fr' 
                      ? { id: 3, name: "English", code: "en", type: "LTR", display_name: "English" }
                      : { id: 5, name: "Français", code: "fr", type: "LTR", display_name: "Français (CA)" };
                  }
                  dispatch(setSelectedLanguage({ data: nextLang }));
                }}
                title={isFrench ? "Passer en anglais / Switch to English" : "Passer en français / Switch to French"}
                aria-label={isFrench ? "Passer en anglais" : "Switch to French"}
                className="group relative flex items-center justify-center w-11 sm:w-12 h-11 sm:h-12 rounded-full border border-stone-200/80 bg-white hover:bg-stone-50 hover:border-stone-400 text-stone-900 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
              >
                <div className="flex items-center justify-center gap-1 select-none">
                  <span className="w-4 h-3 rounded-[2px] overflow-hidden border border-stone-200/60 shadow-2xs shrink-0 flex items-center justify-center">
                    <CanadaFlag className="w-full h-full object-cover" />
                  </span>
                  <span className="text-[11px] sm:text-xs font-black tracking-tight text-stone-800 group-hover:text-[#F68B62] transition-colors">
                    {isFrench ? "EN" : "FR"}
                  </span>
                </div>
              </button>

              {/* Login & Register Buttons (or User Profile when logged in) */}
              {user ? (
                <Link
                  href="/profile"
                  title={user.name || (isFrench ? 'Mon compte' : 'My Account')}
                  className="flex items-center gap-2 px-3.5 sm:px-4.5 h-11 sm:h-12 rounded-full border border-stone-200/80 bg-stone-50 hover:bg-[#FCEFEA] hover:border-[#F68B62]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0"
                  aria-label={user.name || (isFrench ? 'Mon compte' : 'Account')}
                >
                  <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#FCEFEA] flex items-center justify-center text-[#F68B62] font-bold text-xs border border-[#F68B62]/30 shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-stone-800 max-w-[110px] truncate">
                    {user.name || (isFrench ? 'Mon compte' : 'Account')}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                  {/* Connexion (Log in) - Same size top to bottom as search bar */}
                  <button
                    type="button"
                    onClick={handleOpenLogin}
                    className="h-11 sm:h-12 px-4 sm:px-6 rounded-full bg-white hover:bg-stone-50 border border-stone-300 hover:border-stone-400 text-stone-900 font-semibold text-xs sm:text-sm tracking-tight transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs whitespace-nowrap flex items-center justify-center"
                    title={isFrench ? "Connexion" : "Log in"}
                  >
                    {isFrench ? "Connexion" : "Log in"}
                  </button>

                  {/* S’inscrire (Sign up) - Same size top to bottom as search bar */}
                  <button
                    type="button"
                    onClick={handleOpenRegister}
                    className="h-11 sm:h-12 px-4 sm:px-6 rounded-full bg-[#F68B62] hover:bg-[#e07750] border border-[#F68B62] text-white font-semibold text-xs sm:text-sm tracking-tight transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap flex items-center justify-center"
                    title={isFrench ? "S’inscrire" : "Sign up"}
                  >
                    {isFrench ? "S’inscrire" : "Sign up"}
                  </button>
                </div>
              )}

              {/* Cart Icon (Red circular button matching 2nd image, same height as search bar) */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center w-11 sm:w-12 h-11 sm:h-12 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
                title="Panier"
                aria-label="Panier"
              >
                <ShoppingCart className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-stone-900 text-white border-2 border-white text-[10px] font-black h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Location bar (Only shown when location is put / chosen, otherwise hidden) */}
          {hasSelectedLocation && (
            <div className="sm:hidden mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="flex items-center gap-1.5 text-stone-700 font-medium"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F68B62] shrink-0" />
                <span>Livraison à : <strong className="font-bold text-stone-900">{selectedAddress.city} ({selectedAddress.postalCode})</strong></span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>
              <span className="text-[11px] font-semibold text-[#F68B62]">
                Changer
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Customer Login / Register Modal */}
      {showLogin && (
        <Login 
          showLogin={showLogin} 
          setShowLogin={(val) => {
            setShowLogin(val);
            if (!val) setInitialRegister(false);
          }}
          initialRegister={initialRegister}
        />
      )}
    </>
  );
}
