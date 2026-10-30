'use client';

import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useCart } from '@/context/SoukdayCartContext';
import { Store as StoreType, LiveWebSettings } from '@/types';
import { DEFAULT_LIVE_SETTINGS } from '@/services/soukdayApi';
import { STORES } from '@/data/mockData';
import { useTranslation } from '@/utils/translation';
import { setFilterBySeller } from '@/redux/slices/productFilterSlice';
import { 
  Zap, 
  Store as StoreIcon, 
  ArrowRight 
} from 'lucide-react';

interface OtherStoresSectionProps {
  stores?: StoreType[];
  settings?: LiveWebSettings;
}

export default function OtherStoresSection({ 
  stores = [],
  settings = DEFAULT_LIVE_SETTINGS 
}: OtherStoresSectionProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedAddress, setIsAddressModalOpen } = useCart();
  const { isFrench, currentCode } = useTranslation();

  const isFr = isFrench || currentCode === 'fr' || !currentCode || currentCode.startsWith('fr');
  const sourceStores = (stores && stores.length > 0) ? stores : (STORES || []);

  // Non-butcher partner stores: Supermarkets, Bakeries, Specialty Markets (Soukday direct has its own dedicated section)
  const allOtherStores = sourceStores.filter(
    (s) => s.type !== 'butcher' && s.id !== 11 && !s.slug?.includes('soukday')
  );

  // Fallback to mock other stores if live list has no other stores
  const fallbackOtherStores = (STORES || []).filter(
    (s) => s.type !== 'butcher' && s.id !== 11 && !s.slug?.includes('soukday')
  );
  const baseStores = allOtherStores.length > 0 ? allOtherStores : fallbackOtherStores;

  // Filter based on user address city or postal code
  const activeCity = selectedAddress?.city?.toLowerCase() || '';
  const localStores = activeCity ? baseStores.filter((s) => {
    const sCity = (s.city || '').toLowerCase();
    if (activeCity.includes('laval')) return sCity === 'laval';
    if (activeCity.includes('jérôme') || activeCity.includes('jerome')) return sCity.includes('jérôme') || sCity.includes('jerome');
    if (activeCity.includes('brossard')) return sCity.includes('brossard');
    if (activeCity.includes('terrebonne')) return sCity.includes('terrebonne');
    if (activeCity.includes('léonard') || activeCity.includes('leonard')) {
      return sCity.includes('léonard') || sCity.includes('leonard') || sCity === 'montréal' || sCity === 'montreal';
    }
    return sCity === 'montréal' || sCity === 'montreal' || sCity.includes('saint-laurent');
  }) : baseStores;

  const displayStores = localStores.length > 0 ? localStores : baseStores;

  const handleStoreClick = (store: StoreType) => {
    try {
      if (dispatch) {
        dispatch(setFilterBySeller({ data: store.id }));
      }
    } catch (e) {
      console.warn('Dispatch failed:', e);
    }
    const storeSlug = store.slug || String(store.name || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `store-${store.id}`;
    router.push(`/store/${storeSlug}`);
  };

  /**
   * Helper to format delivery line (e.g. Livraison d’ici 12:00pm • 4.6 km • $$)
   */
  const getDeliveryByText = (store: StoreType) => {
    const val = typeof store.deliveryBy === 'string' && store.deliveryBy !== '[object Object]' 
      ? store.deliveryBy 
      : (typeof store.deliveryTime === 'string' ? store.deliveryTime : '12:00pm');
    return isFr ? `Livraison d’ici ${val}` : `Delivery by ${val}`;
  };

  /**
   * Helper to format pickup line (e.g. Ramassage prêt d’ici 10:45am)
   */
  const getPickupText = (store: StoreType) => {
    if (typeof store.pickupReadyBy === 'string' && store.pickupReadyBy.trim() !== '' && store.pickupReadyBy !== '[object Object]') {
      return isFr 
        ? `Ramassage prêt d’ici ${store.pickupReadyBy}` 
        : `Pickup ready by ${store.pickupReadyBy}`;
    }
    return null;
  };

  /**
   * Helper to format categories line, sanitizing against [object Object]
   */
  const getCategoriesText = (store: StoreType) => {
    const rawList = Array.isArray(store.categories) && store.categories.length > 0
      ? store.categories
      : (Array.isArray(store.tags) && store.tags.length > 0 ? store.tags : []);

    const extracted = rawList
      .map((item: any) => {
        if (!item) return '';
        if (typeof item === 'string') return item;
        if (typeof item === 'object') {
          return item.translations?.name || item.name || item.title || item.tag || '';
        }
        return String(item);
      })
      .filter((s: string) => s && s.trim() !== '' && s !== '[object Object]');

    if (extracted.length > 0) {
      return extracted.slice(0, 3).join(' • ');
    }

    const typeStr = typeof store.typeLabel === 'string' && store.typeLabel !== '[object Object]'
      ? store.typeLabel
      : (isFr ? 'Supermarché & Épicerie' : 'Supermarket & Grocery');
    return `${typeStr} • ${isFr ? 'Produits frais' : 'Fresh products'}`;
  };

  /**
   * Helper for store logo image / avatar
   */
  const getStoreLogoSrc = (store: StoreType) => {
    if (typeof store.logo === 'string' && store.logo.trim() !== '' && store.logo !== '[object Object]') {
      return store.logo;
    }
    if (typeof store.image === 'string' && store.image.trim() !== '' && store.image !== '[object Object]') {
      return store.image;
    }
    return '/images/favicon.png';
  };

  return (
    <section className="py-12 sm:py-16 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {isFr ? 'Encore plus à découvrir' : 'Even more to discover'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {isFr 
                ? 'Pâtisseries, traiteurs et autres commerces disponibles près de chez vous.' 
                : 'Bakeries, caterers, and other shops available near you.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddressModalOpen(true)}
            className="text-xs font-bold text-[#F68B62] hover:text-[#e07750] flex items-center gap-1.5 self-start sm:self-center cursor-pointer px-4 py-2.5 rounded-xl bg-[#FCEFEA] border border-[#F68B62]/20 hover:border-[#F68B62]/40 transition-all shadow-2xs shrink-0"
          >
            <span>
              {selectedAddress 
                ? (isFr ? 'Changer d’adresse de livraison' : 'Change delivery address') 
                : (isFr ? 'Sélectionner mon adresse' : 'Select my address')}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ================= Instacart-Style Store Cards Grid ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {displayStores.map((store) => {
            const storeName = typeof store.name === 'string' && store.name !== '[object Object]' 
              ? store.name 
              : 'Commerce Partenaire';
            const logoSrc = getStoreLogoSrc(store);
            const deliveryText = getDeliveryByText(store);
            const pickupText = getPickupText(store);
            const categoriesText = getCategoriesText(store);
            const distance = store.distanceKm ? `${store.distanceKm.toFixed(1)} km` : '3.5 km';
            const priceTier = typeof store.priceTier === 'string' && store.priceTier !== '[object Object]'
              ? store.priceTier
              : (store.minOrder > 30 ? '$$$' : store.minOrder > 20 ? '$$' : '$');
            
            const highlightBadge = typeof store.highlightBadge === 'string' && store.highlightBadge !== '[object Object]'
              ? store.highlightBadge
              : (store.isHalalCertified ? '100% Halal' : undefined);

            const badgesList = Array.isArray(store.badges) && store.badges.length > 0
              ? store.badges
              : (Array.isArray(store.tags) && store.tags.length > 0 ? store.tags : ['Prix bas', 'Frais du jour']);

            const cleanBadges = badgesList
              .map((b: any) => {
                if (!b) return '';
                if (typeof b === 'string') return b;
                if (typeof b === 'object') return b.name || b.tag || b.translations?.name || '';
                return String(b);
              })
              .filter((b: string) => b && b.trim() !== '' && b !== '[object Object]' && b !== highlightBadge)
              .slice(0, 3);

            return (
              <div
                key={store.id}
                onClick={() => handleStoreClick(store)}
                className="group relative bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs hover:border-[#F68B62]/50 hover:shadow-md transition-all duration-200 flex items-start gap-3.5 sm:gap-4 cursor-pointer"
              >
                {/* Left: Square Store Logo Container */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border border-stone-100 bg-white p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <img
                    src={logoSrc}
                    alt={storeName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/images/favicon.png';
                    }}
                  />
                </div>

                {/* Right: Store Details Stack */}
                <div className="flex-1 min-w-0 space-y-1">
                  
                  {/* Line 1: Store Name */}
                  <h3 className="font-bold text-[15px] sm:text-base text-stone-900 group-hover:text-[#F68B62] transition-colors leading-tight truncate">
                    {storeName}
                  </h3>

                  {/* Line 2: Delivery Line (Green Lightning Bolt) */}
                  <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-[#F68B62] leading-tight">
                    <Zap className="w-3.5 h-3.5 fill-[#F68B62] text-[#F68B62] shrink-0" />
                    <span className="truncate">
                      {deliveryText}
                      <span className="mx-1 text-stone-300 font-normal">•</span>
                      {distance}
                      <span className="mx-1 text-stone-300 font-normal">•</span>
                      {priceTier}
                    </span>
                  </div>

                  {/* Line 3: Optional Pickup Line (Storefront Icon) */}
                  {pickupText && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 leading-tight">
                      <StoreIcon className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span className="truncate">{pickupText}</span>
                    </div>
                  )}

                  {/* Line 4: Categories / Specialties Line */}
                  <p className="text-xs text-stone-500 truncate leading-tight">
                    {categoriesText}
                  </p>

                  {/* Line 5: Badge Pills Row */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {/* Highlighted Yellow Badge */}
                    {highlightBadge && (
                      <span className="bg-amber-300 text-stone-950 font-bold px-1.5 py-0.5 rounded text-[11px] leading-tight">
                        {highlightBadge}
                      </span>
                    )}

                    {/* Regular Grey Badges */}
                    {cleanBadges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="bg-stone-100 text-stone-600 font-medium px-2 py-0.5 rounded text-[11px] leading-tight"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
