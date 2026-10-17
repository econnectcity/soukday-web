'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { STORES } from '../data/mockData';
import { Store } from '../types';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Star, 
  Truck, 
  ArrowRight, 
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function ButcherSection() {
  const { selectedAddress, setIsAddressModalOpen } = useCart();

  // All butchers
  const allButchers = STORES.filter((s) => s.type === 'butcher');

  // Filter based on user address city or postal code
  // If user selected Laval -> Boucherie Mamounia; Saint-Jérôme -> Boucherie Melia; etc.
  const activeCity = selectedAddress.city?.toLowerCase() || '';
  const localButchers = allButchers.filter((b) => {
    if (activeCity.includes('laval')) return b.city.toLowerCase() === 'laval';
    if (activeCity.includes('jérôme') || activeCity.includes('jerome')) return b.city.toLowerCase().includes('jérôme');
    if (activeCity.includes('léonard') || activeCity.includes('leonard')) {
      return b.city.toLowerCase().includes('léonard') || b.city.toLowerCase() === 'montréal';
    }
    // Default to Montreal butchers
    return b.city.toLowerCase() === 'montréal' || b.city.toLowerCase().includes('léonard');
  });

  const displayButchers = localButchers.length > 0 ? localButchers : allButchers;

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-stone-50/80 border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-600 mb-1">
              <Flame className="w-3.5 h-3.5 fill-red-600" />
              <span>Viandes fraîches & artisanales</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Boucheries livrant chez vous
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Boucheries 100% Halal certifiées avec découpe à la commande, livrées directement à{' '}
              <strong className="text-stone-900 underline decoration-[#F68B62] decoration-2">
                {selectedAddress.city} ({selectedAddress.postalCode})
              </strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddressModalOpen(true)}
            className="text-xs font-bold text-[#F68B62] hover:text-[#e07750] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Changer d’adresse de livraison</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notice for number of butchers */}
        <div className="flex items-center gap-2 text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200/70">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {displayButchers.length === 1 ? (
              <>
                <strong>1 boucherie partenaire exclusive</strong> dessert actuellement votre secteur à {selectedAddress.city}.
              </>
            ) : (
              <>
                <strong>{displayButchers.length} boucheries partenaires</strong> peuvent vous livrer aujourd’hui à {selectedAddress.city}.
              </>
            )}
          </span>
        </div>

        {/* Butcher Cards Grid / Swipeable Carousel */}
        <div className={`grid gap-4 ${
          displayButchers.length === 1 
            ? 'grid-cols-1 md:grid-cols-2' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {displayButchers.map((butcher) => (
            <div
              key={butcher.id}
              className="store-card group bg-white rounded-3xl overflow-hidden border border-stone-200/80 hover:border-[#F68B62]/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Store Cover Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
                  <img
                    src={butcher.image}
                    alt={butcher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3" /> 100% Halal
                    </span>
                    <span className="bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {butcher.typeLabel}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#F68B62]" />
                      <span>{butcher.city}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{butcher.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-base sm:text-lg text-stone-900 group-hover:text-[#F68B62] transition-colors leading-snug">
                        {butcher.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-md shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{butcher.rating}</span>
                        <span className="text-[10px] text-stone-400">({butcher.reviewsCount})</span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {butcher.address}, {butcher.postalCode}
                    </p>
                  </div>

                  {/* Delivery & Min order pills */}
                  <div className="flex items-center gap-3 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <div className="flex items-center gap-1 font-semibold text-stone-800">
                      <Truck className="w-3.5 h-3.5 text-[#F68B62]" />
                      <span>{butcher.deliveryFee}</span>
                    </div>
                    <span className="text-stone-300">•</span>
                    <div>Min. commande : <strong className="text-stone-800">{butcher.minOrder}$</strong></div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {butcher.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 sm:p-5 pt-0">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 group-hover:bg-[#F68B62] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Commander les viandes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
