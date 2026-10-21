'use client';

import React from 'react';
import { STORES } from '../data/mockData';
import { Store } from '../types';
import { LiveWebSettings } from '../types';
import { DEFAULT_LIVE_SETTINGS } from '../services/api';
import { 
  Store as StoreIcon, 
  MapPin, 
  Clock, 
  Star, 
  Truck, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

interface OtherStoresSectionProps {
  stores?: Store[];
  settings?: LiveWebSettings;
}

export default function OtherStoresSection({ 
  stores = STORES,
  settings = DEFAULT_LIVE_SETTINGS 
}: OtherStoresSectionProps) {
  const sourceStores = stores && stores.length > 0 ? stores : STORES;

  // Non-butcher stores: Supermarkets, Bakeries, Specialty Markets
  const otherStores = sourceStores.filter((s) => s.type !== 'butcher');

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#F68B62] mb-1.5 px-3 py-1 rounded-full bg-[#FCEFEA] border border-[#F68B62]/25 shadow-xs">
              <StoreIcon className="w-3.5 h-3.5" />
              <span>{settings?.otherStoresSectionTag || 'Commerces de proximité & Supermarchés'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {settings?.otherStoresSectionTitle || 'Autres magasins disponibles'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {settings?.otherStoresSectionSubtitle || 'Supermarchés orientaux, pâtisseries fines, épiceries de quartier et traiteurs pour votre adresse'}
            </p>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherStores.map((store) => (
            <div
              key={store.id}
              className="store-card group bg-stone-50/70 hover:bg-white rounded-3xl overflow-hidden border border-stone-200/80 hover:border-[#F68B62]/50 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Store Visual Header */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                      {store.typeLabel}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#F68B62]" />
                      <span>{store.city}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs text-[11px]">
                      <Clock className="w-3 h-3 text-[#F68B62]" />
                      <span>{store.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-base sm:text-lg text-stone-900 group-hover:text-[#F68B62] transition-colors duration-200 leading-snug">
                      {store.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-white text-stone-800 text-xs font-bold px-2 py-0.5 rounded-md border border-stone-200 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{store.rating}</span>
                      <span className="text-[10px] text-stone-400">({store.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{store.address}, {store.postalCode}</span>
                  </p>

                  {/* Delivery info */}
                  <div className="flex items-center justify-between text-xs text-stone-600 bg-[#FCEFEA]/45 p-2.5 rounded-xl border border-[#F68B62]/15">
                    <div className="flex items-center gap-1 font-semibold text-stone-900">
                      <Truck className="w-3.5 h-3.5 text-[#F68B62]" />
                      <span>{store.deliveryFee}</span>
                    </div>
                    <div>Min. : <strong className="text-stone-900">{store.minOrder}$</strong></div>
                    <div className="text-[#F68B62] font-semibold text-[11px]">Ouvert jusqu’à 21h</div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(store.tags || []).map((tag: string) => (
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
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F68B62] text-stone-900 hover:text-white border border-stone-300 hover:border-[#F68B62] font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md hover:shadow-[#F68B62]/20 active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#F68B62] group-hover:text-white transition-colors" />
                  <span>Magasiner ce magasin</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
