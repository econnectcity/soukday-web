'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/SoukdayCartContext';
import { POPULAR_LOCATIONS } from '@/data/mockData';
import { LiveWebSettings } from '@/types';
import { DEFAULT_LIVE_SETTINGS } from '@/services/soukdayApi';
import { useTranslation } from '@/utils/translation';
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  settings?: LiveWebSettings;
}

export default function HeroBanner({ settings = DEFAULT_LIVE_SETTINGS }: HeroBannerProps) {
  const { selectedAddress, setSelectedAddress } = useCart();
  const { isFrench } = useTranslation();
  const [inputVal, setInputVal] = useState(selectedAddress?.postalCode || '');
  const [successNotice, setSuccessNotice] = useState(false);

  React.useEffect(() => {
    if (selectedAddress?.postalCode) {
      setInputVal(selectedAddress.postalCode);
    } else {
      setInputVal('');
    }
  }, [selectedAddress]);

  const handleApplyAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputVal.trim().toUpperCase();
    if (!clean) return;

    // Match with one of our Quebec locations or use default
    const matched = POPULAR_LOCATIONS.find(
      (loc) => loc.postalCode.replace(/\s+/g, '') === clean.replace(/\s+/g, '') ||
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
        city: 'Montréal & Région',
        postalCode: clean,
      });
    }

    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 2500);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FCEFEA] via-[#FCEFEA]/35 to-stone-50 pt-10 sm:pt-14 pb-14 sm:pb-20">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F68B62]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#FCEFEA] rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headline & Address Input */}
          <div className="lg:col-span-7 space-y-6">
            

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-[1.15]">
              {isFrench ? (
                <>
                  <span className="block">Plusieurs magasins</span>
                  <span className="block mt-1">
                    <span className="text-[#F68B62] italic">Halal</span> sur un seul site
                  </span>
                </>
              ) : (
                <>
                  <span className="block">Multiple stores</span>
                  <span className="block mt-1">
                    <span className="text-[#F68B62] italic">Halal</span> on a single site
                  </span>
                </>
              )}
            </h1>

            <p className="text-stone-600 text-sm sm:text-base max-w-xl leading-relaxed">
              {isFrench 
                ? 'Soukday regroupe plusieurs commerces sur une même plateforme. Saisissez votre adresse pour découvrir les magasins et produits disponibles en livraison chez vous.'
                : 'Soukday brings multiple businesses together on a single platform. Enter your address to discover the stores and products available for delivery to your door.'}
            </p>

            {/* Address / Postal Code Form */}
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-[#F68B62]/10 border border-stone-200/80 max-w-xl">
              <form onSubmit={handleApplyAddress} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <MapPin className="w-5 h-5 text-[#F68B62] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={isFrench ? "Saisissez votre adresse" : "Enter your address"}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-transparent focus:border-[#F68B62] focus:bg-white text-stone-900 font-semibold text-sm placeholder-stone-400 placeholder:normal-case focus:outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#F68B62] hover:bg-[#e07750] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#F68B62]/30 active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap group hover:shadow-lg hover:shadow-[#F68B62]/40"
                >
                  <span>{isFrench ? "DÉCOUVRIR" : "DISCOVER"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </form>

              {/* Success Notification Feedback */}
              {successNotice && selectedAddress && (
                <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1.5 px-2 animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {isFrench 
                      ? `Magasins mis à jour pour ${selectedAddress.city} (${selectedAddress.postalCode}) !`
                      : `Stores updated for ${selectedAddress.city} (${selectedAddress.postalCode})!`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Soft Warm Orange Glow / Shadow behind the Right Section Image */}
              <div className="absolute -inset-6 bg-[#F68B62]/20 rounded-3xl blur-3xl -z-10 pointer-events-none" />

              {/* Main Card Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/10 border-4 border-white aspect-[4/3] sm:aspect-[16/11] group cursor-pointer hover:shadow-3xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                  alt={isFrench ? "Épicerie et produits frais Soukday" : "Fresh groceries and products Soukday"}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
