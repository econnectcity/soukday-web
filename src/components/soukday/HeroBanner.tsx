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
    <section className="relative overflow-hidden bg-black text-white min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] flex items-center">
      {/* 1. Official Hero Banner Background Image with Butcher & Food Doodles */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat pointer-events-none select-none transition-all duration-500"
        style={{
          backgroundImage: `url('/images/hero-banner-bg.jpg')`,
          backgroundPosition: 'right center',
        }}
      />

      {/* 2. Responsive gradient overlay to guarantee 100% text legibility on all viewports */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent sm:via-black/60 lg:via-transparent pointer-events-none" />

      {/* 3. Main Content Container - Perfectly aligned with max-w-7xl Header and Category Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-md sm:max-w-lg lg:max-w-xl py-10 sm:py-12 lg:py-14 space-y-3.5 sm:space-y-4">
          
          {/* Top Subtitle */}
          <div className="text-[#FF7A45] font-semibold text-xs sm:text-sm md:text-base tracking-wide">
            Bienvenue sur Soukday
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-black text-white tracking-tight leading-[1.14]">
            Plusieurs magasins
            <span className="block mt-1 sm:mt-1.5">
              <span className="text-[#FF7A45] italic font-serif pr-2">Halal</span>
              <span className="text-white">sur un seul site</span>
            </span>
          </h1>

          {/* Address Search Bar */}
          <div className="pt-1.5 sm:pt-2 max-w-md sm:max-w-lg">
            <form onSubmit={handleApplyAddress} className="relative">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl flex items-center p-1 transition-all focus-within:ring-2 focus-within:ring-[#FF7A45]">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Saisir votre adresse..."
                  className="w-full pl-3.5 sm:pl-4 pr-3 py-2.5 sm:py-3 bg-transparent text-stone-900 placeholder:text-stone-400 font-medium text-sm sm:text-base focus:outline-none"
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

            {/* Address Applied Success Badge */}
            {successNotice && selectedAddress && (
              <div className="mt-2 text-xs sm:text-sm font-semibold text-emerald-400 flex items-center gap-1.5 px-1 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Adresse sélectionnée : {selectedAddress.city} {selectedAddress.postalCode ? `(${selectedAddress.postalCode})` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Delivery Tagline in Red */}
          <div className="text-[#FF1E1E] font-bold text-xs sm:text-sm md:text-base tracking-wide pt-1">
            Livraison à domicile 7 jours sur 7
          </div>

        </div>
      </div>
    </section>
  );
}
