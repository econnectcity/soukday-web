'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/SoukdayCartContext';
import { POPULAR_LOCATIONS } from '@/data/mockData';
import { LiveWebSettings } from '@/types';
import { DEFAULT_LIVE_SETTINGS } from '@/services/soukdayApi';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface HeroBannerProps {
  settings?: LiveWebSettings;
}

export default function HeroBanner({ settings = DEFAULT_LIVE_SETTINGS }: HeroBannerProps) {
  const { selectedAddress, setSelectedAddress, setIsAddressModalOpen } = useCart();
  const [inputVal, setInputVal] = useState(selectedAddress?.postalCode || '');
  const [geoLoading, setGeoLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    if (selectedAddress?.postalCode) {
      setInputVal(selectedAddress.postalCode);
    } else if (selectedAddress?.city) {
      setInputVal(selectedAddress.city);
    } else {
      setInputVal('');
    }
  }, [selectedAddress]);

  const handleApplyAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputVal.trim();
    if (!clean) return;

    // Match with one of our Quebec locations or use user input
    const matched = POPULAR_LOCATIONS.find(
      (loc) =>
        loc.postalCode.replace(/\s+/g, '').toUpperCase() === clean.replace(/\s+/g, '').toUpperCase() ||
        loc.city.toLowerCase() === clean.toLowerCase()
    );

    if (matched) {
      setSelectedAddress({
        address: `${matched.city}, QC`,
        city: matched.city,
        postalCode: matched.postalCode,
      });
    } else {
      setSelectedAddress({
        address: `${clean}, QC`,
        city: clean,
        postalCode: clean.toUpperCase(),
      });
    }

    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 3000);
  };

  const handleGeolocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoLoading(false);
          setSelectedAddress({
            address: 'Montréal & Région, QC',
            city: 'Montréal',
            postalCode: 'H4L 3M8',
          });
          setInputVal('Montréal, QC');
          setSuccessNotice(true);
          setTimeout(() => setSuccessNotice(false), 3000);
        },
        () => {
          setGeoLoading(false);
          if (setIsAddressModalOpen) {
            setIsAddressModalOpen(true);
          }
        },
        { timeout: 8000 }
      );
    } else if (setIsAddressModalOpen) {
      setIsAddressModalOpen(true);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] text-white">
      {/* Background Food Doodle Watermark Icons */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Chicken Leg Doodle (Top Left) */}
        <svg
          className="absolute -top-4 left-4 sm:left-10 w-28 sm:w-36 h-28 sm:h-36 text-white/10 stroke-current fill-none"
          viewBox="0 0 100 100"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M65 20 C50 10 30 25 35 45 C40 60 55 65 65 55 C75 45 75 28 65 20 Z" />
          <path d="M36 50 L18 72" />
          <circle cx="14" cy="74" r="5" />
          <circle cx="16" cy="80" r="5" />
        </svg>

        {/* Star Anise / Spice Doodle (Bottom Left) */}
        <svg
          className="absolute bottom-2 left-2 sm:left-6 w-24 sm:w-32 h-24 sm:h-32 text-white/10 stroke-current fill-none"
          viewBox="0 0 100 100"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M75 25 L25 75" />
          <circle cx="50" cy="50" r="10" />
          <circle cx="50" cy="22" r="4" />
          <circle cx="50" cy="78" r="4" />
          <circle cx="22" cy="50" r="4" />
          <circle cx="78" cy="50" r="4" />
        </svg>

        {/* Garlic Bulb Doodle (Top Center) */}
        <svg
          className="absolute -top-2 left-1/3 sm:left-[45%] w-24 sm:w-28 h-24 sm:h-28 text-white/10 stroke-current fill-none"
          viewBox="0 0 100 100"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M50 15 L50 25 M50 25 C30 28 20 45 20 65 C20 80 32 90 50 90 C68 90 80 80 80 65 C80 45 70 28 50 25 Z" />
          <path d="M38 32 C32 45 32 70 42 88" />
          <path d="M62 32 C68 45 68 70 58 88" />
        </svg>

        {/* Sauce / Oil Bottle Doodle (Bottom Center) */}
        <svg
          className="absolute -bottom-6 left-[40%] sm:left-[46%] w-20 sm:w-24 h-28 sm:h-36 text-white/10 stroke-current fill-none"
          viewBox="0 0 100 100"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="42" y="10" width="16" height="14" rx="2" />
          <path d="M42 24 L32 40 L32 90 L68 90 L68 40 L58 24 Z" />
          <line x1="32" y1="52" x2="68" y2="52" />
          <line x1="32" y1="74" x2="68" y2="74" />
        </svg>

        {/* Pepper / Spice Branch (Right background) */}
        <svg
          className="absolute top-1/2 left-[28%] w-20 h-20 text-white/8 stroke-current fill-none"
          viewBox="0 0 100 100"
          strokeWidth="2"
        >
          <path d="M20 70 C40 85 70 70 80 40 C85 25 75 15 65 25 C50 40 30 50 20 70 Z" />
          <path d="M75 20 C78 12 85 10 90 12" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-8 min-h-[360px] sm:min-h-[420px] lg:min-h-[480px]">
          
          {/* Left Column: Text & Address Input */}
          <div className="lg:col-span-7 pt-10 pb-8 sm:py-12 lg:py-16 space-y-4 sm:space-y-6">
            
            {/* 1. Subtitle */}
            <div className="text-[#FF7A45] font-semibold text-sm sm:text-base tracking-wide">
              Bienvenue sur Soukday
            </div>

            {/* 2. Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-tight leading-[1.12]">
              Plusieurs magasins
              <span className="block mt-1 sm:mt-2">
                <span className="text-[#FF7A45] italic font-serif pr-2">Halal</span>
                <span className="text-white">sur un seul site</span>
              </span>
            </h1>

            {/* 3. Address Input Field */}
            <div className="pt-2 max-w-xl">
              <form onSubmit={handleApplyAddress} className="relative">
                <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl flex items-center p-1 sm:p-1.5 transition-all focus-within:ring-2 focus-within:ring-[#FF7A45]">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Saisir votre adresse..."
                    className="w-full pl-4 pr-3 py-3 sm:py-3.5 bg-transparent text-stone-900 placeholder:text-stone-400 font-medium text-sm sm:text-base focus:outline-none"
                  />
                  
                  {/* GPS Target / Crosshair Locator Button */}
                  <button
                    type="button"
                    onClick={handleGeolocation}
                    disabled={geoLoading}
                    title="Détecter ma position"
                    aria-label="Détecter ma position"
                    className="p-2 sm:p-2.5 text-stone-700 hover:text-[#FF7A45] transition-colors rounded-lg hover:bg-stone-100 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    {geoLoading ? (
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-[#FF7A45]" />
                    ) : (
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 stroke-current"
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="7" />
                        <line x1="12" y1="2" x2="12" y2="5" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                        <line x1="2" y1="12" x2="5" y2="12" />
                        <line x1="19" y1="12" x2="22" y2="12" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>

              {/* Feedback toast when address applied */}
              {successNotice && selectedAddress && (
                <div className="mt-2.5 text-xs sm:text-sm font-semibold text-emerald-400 flex items-center gap-1.5 px-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Adresse sélectionnée : {selectedAddress.city} {selectedAddress.postalCode ? `(${selectedAddress.postalCode})` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* 4. Red Subtitle: Livraison à domicile 7 jours sur 7 */}
            <div className="text-[#FF1E1E] font-bold text-sm sm:text-base tracking-wide pt-1">
              Livraison à domicile 7 jours sur 7
            </div>

          </div>

          {/* Right Column: Organic Orange Curved Arch with Butcher Showcase */}
          <div className="lg:col-span-5 relative h-full flex items-center justify-center lg:justify-end pb-8 lg:pb-0">
            <div className="relative w-full max-w-[520px] aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-[440px] xl:h-[480px]">
              {/* Curved Orange Arch Frame */}
              <div className="w-full h-full relative overflow-hidden rounded-t-[40px] rounded-b-[40px] lg:rounded-t-none lg:rounded-b-none lg:rounded-tl-[240px] lg:rounded-bl-[240px] border-[10px] sm:border-[14px] lg:border-[18px] border-[#F68B62] shadow-2xl bg-stone-900">
                <img
                  src="/images/hero-banner-butcher.jpg"
                  alt="Boucherie Halal Soukday - Viande fraîche et service traditionnel"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Subtle depth gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
