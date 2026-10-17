'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { POPULAR_LOCATIONS } from '../data/mockData';
import { MapPin, ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HeroBanner() {
  const { selectedAddress, setSelectedAddress } = useCart();
  const [inputVal, setInputVal] = useState(selectedAddress.postalCode || '');
  const [successNotice, setSuccessNotice] = useState(false);

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

  const selectQuickLocation = (loc: typeof POPULAR_LOCATIONS[0]) => {
    setInputVal(loc.postalCode);
    setSelectedAddress({
      address: `${loc.city}, QC`,
      city: loc.city,
      postalCode: loc.postalCode,
    });
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 2500);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff7f4] via-stone-50 to-stone-100/60 pt-8 pb-14 px-4 sm:px-6 lg:px-8">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F68B62]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headline & Address Input */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F68B62]/10 text-[#F68B62] border border-[#F68B62]/20 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Votre marché oriental & local à portée de clic</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-[1.15]">
              Vos <span className="text-[#F68B62]">épiceries fines</span> & <span className="text-[#F68B62]">boucheries locales</span> livrées à votre porte.
            </h1>

            <p className="text-stone-600 text-sm sm:text-base max-w-xl leading-relaxed">
              Entrez votre code postal pour découvrir les boucheries halal et magasins qui livrent chez vous. 
              Les produits d’épicerie directe <strong>Soukday</strong> sont expédiés partout au Canada et aux États-Unis !
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
                    placeholder="Entrez votre code postal ou ville (ex: H4L 3M8, Montréal)"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-transparent focus:border-[#F68B62] focus:bg-white text-stone-900 font-semibold text-sm placeholder-stone-400 focus:outline-none transition-all uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#F68B62] hover:bg-[#e07750] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#F68B62]/30 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Voir les magasins</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Success Notification Feedback */}
              {successNotice && (
                <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1.5 px-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Magasins mis à jour pour {selectedAddress.city} ({selectedAddress.postalCode}) !</span>
                </div>
              )}
            </div>

            {/* Quick Postal Code Pills */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Villes & secteurs disponibles :
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_LOCATIONS.map((loc) => {
                  const isSelected = selectedAddress.postalCode === loc.postalCode;
                  return (
                    <button
                      key={loc.postalCode}
                      type="button"
                      onClick={() => selectQuickLocation(loc)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F68B62] text-white font-bold shadow-sm'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      {loc.label} <span className="text-[10px] opacity-75">({loc.postalCode})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-200/60 max-w-xl text-stone-700 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#F68B62] shrink-0" />
                <span className="font-medium">Livraison le jour même</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F68B62] shrink-0" />
                <span className="font-medium">Boucheries 100% Halal</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F68B62] shrink-0" />
                <span className="font-medium">Épicerie Canada & USA</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/10 border-4 border-white aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                  alt="Épicerie et produits frais Soukday"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#F68B62] text-[11px] font-bold uppercase tracking-wider mb-1">
                    Épicerie & Boucherie
                  </span>
                  <div className="text-lg font-bold">10 Magasins partenaires au Québec</div>
                  <div className="text-xs text-white/80">Montréal, Saint-Laurent, Laval, Brossard, Terrebonne, Saint-Jérôme</div>
                </div>
              </div>

              {/* Floating Badge 1: Local Butcher Highlight */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white p-3 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg">
                  🥩
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Boucheries Halal Locales</div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Livraison en 30-45 min
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Nationwide Grocery */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white p-3 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F68B62] flex items-center justify-center font-bold text-lg">
                  🇨🇦
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Expédition Nationale</div>
                  <div className="text-[11px] text-stone-500 font-medium">Partout au Canada & USA</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
