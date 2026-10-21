'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/SoukdayCartContext';
import { POPULAR_LOCATIONS } from '@/data/mockData';
import { LiveWebSettings } from '@/types';
import { DEFAULT_LIVE_SETTINGS } from '@/services/soukdayApi';
import { useTranslation } from '@/utils/translation';
import { MapPin, ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';

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
            
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCEFEA] text-[#F68B62] border border-[#F68B62]/30 text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {settings?.heroTagline || (isFrench ? 'Votre marché oriental & local à portée de clic' : 'Your oriental & local market at your fingertips')}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-[1.15]">
              {isFrench ? (
                settings?.heroTitle || (
                  <>Vos <span className="text-[#F68B62]">épiceries fines</span> & <span className="text-[#F68B62]">boucheries locales</span> livrées à votre porte.</>
                )
              ) : (
                <>Your <span className="text-[#F68B62]">fine groceries</span> & <span className="text-[#F68B62]">local butcher shops</span> delivered to your door.</>
              )}
            </h1>

            <p className="text-stone-600 text-sm sm:text-base max-w-xl leading-relaxed">
              {isFrench 
                ? (settings?.heroSubtitle || 'Entrez votre code postal pour découvrir les boucheries halal et magasins qui livrent chez vous. Les produits d’épicerie directe Soukday sont expédiés partout au Canada et aux États-Unis !')
                : 'Enter your postal code to discover halal butcher shops and stores delivering to you. Soukday direct grocery items are shipped across Canada and the United States!'}
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
                    placeholder={isFrench ? "Entrez votre code postal ou ville (ex: H4L 3M8, Montréal)" : "Enter your postal code or city (e.g. H4L 3M8, Montreal)"}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-transparent focus:border-[#F68B62] focus:bg-white text-stone-900 font-semibold text-sm placeholder-stone-400 focus:outline-none transition-all uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#F68B62] hover:bg-[#e07750] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#F68B62]/30 active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap group hover:shadow-lg hover:shadow-[#F68B62]/40"
                >
                  <span>{isFrench ? "Voir les magasins" : "See stores"}</span>
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

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-200/60 max-w-xl text-stone-700 text-xs">
              <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#FCEFEA]/60 transition-colors duration-200 cursor-pointer">
                <Truck className="w-4 h-4 text-[#F68B62] shrink-0" />
                <span className="font-medium">{settings?.heroBadge1 || (isFrench ? 'Livraison le jour même' : 'Same-day delivery')}</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#FCEFEA]/60 transition-colors duration-200 cursor-pointer">
                <ShieldCheck className="w-4 h-4 text-[#F68B62] shrink-0" />
                <span className="font-medium">{settings?.heroBadge2 || (isFrench ? 'Boucheries 100% Halal' : '100% Halal Butchers')}</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#FCEFEA]/60 transition-colors duration-200 cursor-pointer">
                <Sparkles className="w-4 h-4 text-[#F68B62] shrink-0" />
                <span className="font-medium">{settings?.heroBadge3 || (isFrench ? 'Épicerie Canada & USA' : 'Groceries Canada & USA')}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/10 border-4 border-white aspect-[4/3] sm:aspect-[16/11] group cursor-pointer hover:shadow-3xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                  alt={isFrench ? "Épicerie et produits frais Soukday" : "Fresh groceries and products Soukday"}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Clean Top-Left Partner Counter Badge */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isFrench ? "10+ Magasins & Boucheries Partenaires" : "10+ Partner Stores & Butcheries"}</span>
                  </div>
                </div>

                {/* Clean Bottom-Right Fresh Guarantee Badge */}
                <div className="absolute bottom-3.5 right-3.5 z-10 text-right">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-stone-900 text-[11px] font-bold border border-white shadow-sm">
                    {isFrench ? "Frais du jour garantis" : "Daily Fresh Guaranteed"}
                  </span>
                </div>
              </div>

              {/* Floating Badge 1: Local Halal Butcher Highlight */}
              <div className="absolute -bottom-5 -left-3 sm:-left-5 z-20 bg-white/98 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl shadow-stone-900/10 border border-stone-100 flex items-center gap-3 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                  🥩
                </div>
                <div>
                  <div className="text-xs font-black text-stone-900 leading-tight">
                    {isFrench ? "Boucheries Halal Locales" : "Local Halal Butcheries"}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {isFrench ? "Livraison en 30-45 min" : "Delivery in 30-45 min"}
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Nationwide Grocery */}
              <div className="absolute -top-4 -right-3 sm:-right-5 z-20 bg-white/98 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl shadow-stone-900/10 border border-stone-100 flex items-center gap-3 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#FCEFEA] text-[#F68B62] flex items-center justify-center font-bold text-lg border border-[#F68B62]/20 shadow-xs shrink-0">
                  🇨🇦
                </div>
                <div>
                  <div className="text-xs font-black text-stone-900 leading-tight">
                    {isFrench ? "Expédition Nationale" : "Nationwide Shipping"}
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                    {isFrench ? "Partout au Canada & USA" : "All across Canada & USA"}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
