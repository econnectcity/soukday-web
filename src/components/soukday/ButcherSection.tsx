'use client';

import React from 'react';
import { useCart } from '@/context/SoukdayCartContext';
import { Store } from '@/types';
import { LiveWebSettings } from '@/types';
import { DEFAULT_LIVE_SETTINGS } from '@/services/soukdayApi';
import { useTranslation } from '@/utils/translation';
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

interface ButcherSectionProps {
  stores?: Store[];
  settings?: LiveWebSettings;
}

export default function ButcherSection({ 
  stores = [],
  settings = DEFAULT_LIVE_SETTINGS 
}: ButcherSectionProps) {
  const { selectedAddress, setIsAddressModalOpen } = useCart();
  const { isFrench } = useTranslation();

  const sourceStores = stores || [];

  // All butchers
  const allButchers = sourceStores.filter((s) => s.type === 'butcher');

  // Filter based on user address city or postal code
  const activeCity = selectedAddress?.city?.toLowerCase() || '';
  const localButchers = activeCity ? allButchers.filter((b) => {
    if (activeCity.includes('laval')) return b.city.toLowerCase() === 'laval';
    if (activeCity.includes('jérôme') || activeCity.includes('jerome')) return b.city.toLowerCase().includes('jérôme');
    if (activeCity.includes('léonard') || activeCity.includes('leonard')) {
      return b.city.toLowerCase().includes('léonard') || b.city.toLowerCase() === 'montréal';
    }
    return b.city.toLowerCase() === 'montréal' || b.city.toLowerCase().includes('léonard');
  }) : allButchers;

  const displayButchers = localButchers.length > 0 ? localButchers : allButchers;

  return (
    <section className="py-14 sm:py-20 bg-stone-100/70 border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-600 mb-1">
              <Flame className="w-3.5 h-3.5 fill-red-600" />
              <span>{settings?.butcherSectionTag || (isFrench ? 'Viandes fraîches & artisanales' : 'Fresh & craft meats')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {isFrench ? (settings?.butcherSectionTitle || 'Boucheries livrant chez vous') : 'Butcher shops delivering to you'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {selectedAddress ? (
                <>
                  {settings?.butcherSectionSubtitle || (isFrench ? 'Boucheries 100% Halal certifiées avec découpe à la commande, livrées directement à' : '100% Certified Halal butchers with custom cuts, delivered to')}{' '}
                  <strong className="text-stone-900 underline decoration-[#F68B62] decoration-2">
                    {selectedAddress.city} ({selectedAddress.postalCode})
                  </strong>
                </>
              ) : (
                <>
                  {settings?.butcherSectionSubtitle || (isFrench ? 'Boucheries 100% Halal certifiées avec découpe à la commande, livrées directement chez vous.' : '100% Certified Halal butchers with custom cuts, delivered directly to your door.')}
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddressModalOpen(true)}
            className="text-xs font-bold text-[#F68B62] hover:text-[#e07750] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer px-3 py-1.5 rounded-xl bg-[#FCEFEA] border border-[#F68B62]/20 hover:border-[#F68B62]/40 transition-all shadow-xs"
          >
            <span>
              {selectedAddress 
                ? (isFrench ? 'Changer d’adresse de livraison' : 'Change delivery address') 
                : (isFrench ? 'Sélectionner mon adresse' : 'Select my address')}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notice for number of butchers */}
        <div className="flex items-center gap-2 text-xs text-stone-700 bg-white p-3 rounded-2xl border border-stone-200/70 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#FF7A45] shrink-0" />
          <span>
            {selectedAddress ? (
              displayButchers.length === 1 ? (
                <>
                  {isFrench ? (
                    <><strong>1 boucherie partenaire exclusive</strong> dessert actuellement votre secteur à {selectedAddress.city}.</>
                  ) : (
                    <><strong>1 exclusive partner butcher</strong> currently serves your area in {selectedAddress.city}.</>
                  )}
                </>
              ) : (
                <>
                  {isFrench ? (
                    <><strong>{displayButchers.length} boucheries partenaires</strong> peuvent vous livrer aujourd’hui à {selectedAddress.city}.</>
                  ) : (
                    <><strong>{displayButchers.length} partner butchers</strong> can deliver to you today in {selectedAddress.city}.</>
                  )}
                </>
              )
            ) : (
              <>
                {isFrench ? (
                  <><strong>{allButchers.length} boucheries partenaires Halal</strong> disponibles au Québec. Sélectionnez votre adresse pour filtrer par proximité.</>
                ) : (
                  <><strong>{allButchers.length} Halal partner butchers</strong> available across Quebec. Select your address to filter by proximity.</>
                )}
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
              className="store-card group bg-white rounded-3xl overflow-hidden border border-stone-200/80 hover:border-[#F68B62]/50 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Store Cover Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
                  <img
                    src={butcher.image}
                    alt={butcher.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-[#FF7A45] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
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
                      <Clock className="w-3 h-3 text-[#FF7A45]" />
                      <span>{butcher.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-base sm:text-lg text-stone-900 group-hover:text-[#F68B62] transition-colors duration-200 leading-snug">
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
                  <div className="flex items-center gap-3 text-xs text-stone-600 bg-[#FCEFEA]/45 p-2.5 rounded-xl border border-[#F68B62]/15">
                    <div className="flex items-center gap-1 font-semibold text-stone-800">
                      <Truck className="w-3.5 h-3.5 text-[#F68B62]" />
                      <span>{butcher.deliveryFee}</span>
                    </div>
                    <span className="text-stone-300">•</span>
                    <div>Min. commande : <strong className="text-stone-800">{butcher.minOrder}$</strong></div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(butcher.tags || []).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FCEFEA]/60 text-stone-700 border border-[#F68B62]/10"
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
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 group-hover:bg-[#F68B62] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-xs group-hover:shadow-md group-hover:shadow-[#F68B62]/25 active:scale-95"
                >
                  <span>Commander les viandes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
