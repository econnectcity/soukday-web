'use client';

import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useCart } from '@/context/SoukdayCartContext';
import { Store as StoreType, LiveWebSettings } from '@/types';
import { DEFAULT_LIVE_SETTINGS } from '@/services/soukdayApi';
import { useTranslation } from '@/utils/translation';
import { setFilterBySeller } from '@/redux/slices/productFilterSlice';
import { 
  Zap, 
  Store as StoreIcon, 
  ArrowRight 
} from 'lucide-react';

interface ButcherSectionProps {
  stores?: StoreType[];
  settings?: LiveWebSettings;
}

export default function ButcherSection({ 
  stores = [],
  settings = DEFAULT_LIVE_SETTINGS 
}: ButcherSectionProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedAddress, setIsAddressModalOpen } = useCart();
  const { isFrench, currentCode } = useTranslation();

  const isFr = isFrench || currentCode === 'fr' || !currentCode || currentCode.startsWith('fr');
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

  const handleStoreClick = (butcher: StoreType) => {
    try {
      if (dispatch) {
        dispatch(setFilterBySeller({ data: butcher.id }));
      }
    } catch (e) {
      console.warn('Dispatch failed:', e);
    }
    router.push(`/products?seller_id=${butcher.id}`);
  };

  /**
   * Helper to format delivery line (e.g. Delivery by 12:00pm • 1.8 mi • $)
   */
  const getDeliveryByText = (butcher: StoreType) => {
    const val = typeof butcher.deliveryBy === 'string' && butcher.deliveryBy !== '[object Object]' 
      ? butcher.deliveryBy 
      : (typeof butcher.deliveryTime === 'string' ? butcher.deliveryTime : '12:00pm');
    return isFr ? `Livraison d’ici ${val}` : `Delivery by ${val}`;
  };

  /**
   * Helper to format pickup line (e.g. Pickup ready by 10:45am • 9.8 mi)
   */
  const getPickupText = (butcher: StoreType) => {
    if (typeof butcher.pickupReadyBy === 'string' && butcher.pickupReadyBy.trim() !== '' && butcher.pickupReadyBy !== '[object Object]') {
      return isFr 
        ? `Ramassage prêt d’ici ${butcher.pickupReadyBy}` 
        : `Pickup ready by ${butcher.pickupReadyBy}`;
    }
    return null;
  };

  /**
   * Helper to format categories line, sanitizing against [object Object]
   */
  const getCategoriesText = (butcher: StoreType) => {
    const rawList = Array.isArray(butcher.categories) && butcher.categories.length > 0
      ? butcher.categories
      : (Array.isArray(butcher.tags) && butcher.tags.length > 0 ? butcher.tags : []);

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

    const typeStr = typeof butcher.typeLabel === 'string' && butcher.typeLabel !== '[object Object]'
      ? butcher.typeLabel
      : (isFr ? 'Boucherie Halal' : 'Halal Butcher');
    return `${typeStr} • ${isFr ? 'Découpe fraîche' : 'Fresh cuts'}`;
  };

  /**
   * Helper for store logo image / avatar
   */
  const getStoreLogoSrc = (butcher: StoreType) => {
    if (typeof butcher.logo === 'string' && butcher.logo.trim() !== '' && butcher.logo !== '[object Object]') {
      return butcher.logo;
    }
    const nameLower = (typeof butcher.name === 'string' ? butcher.name : '').toLowerCase();
    if (nameLower.includes('zakiya')) return '/images/butchers/boucherie-zakiya.svg';
    if (nameLower.includes('koutoubia')) return '/images/butchers/boucherie-koutoubia.svg';
    if (nameLower.includes('mamounia')) return '/images/butchers/boucherie-mamounia.svg';
    if (nameLower.includes('melia')) return '/images/butchers/boucherie-melia.svg';
    return (typeof butcher.image === 'string' && butcher.image !== '[object Object]') ? butcher.image : '/images/favicon.png';
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {isFr ? 'Vos boucheries halal à proximité' : 'Halal butcher shops near you'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {isFr ? 'Choisissez parmi les boucheries disponibles dans votre secteur.' : 'Choose from available butchers in your area.'}
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
          {displayButchers.map((butcher) => {
            const storeName = typeof butcher.name === 'string' && butcher.name !== '[object Object]' 
              ? butcher.name 
              : 'Boucherie Halal';
            const logoSrc = getStoreLogoSrc(butcher);
            const deliveryText = getDeliveryByText(butcher);
            const pickupText = getPickupText(butcher);
            const categoriesText = getCategoriesText(butcher);
            const distance = butcher.distanceKm ? `${butcher.distanceKm.toFixed(1)} km` : '2.1 km';
            const priceTier = typeof butcher.priceTier === 'string' && butcher.priceTier !== '[object Object]'
              ? butcher.priceTier
              : (butcher.minOrder > 30 ? '$$$' : butcher.minOrder > 20 ? '$$' : '$');
            
            const highlightBadge = typeof butcher.highlightBadge === 'string' && butcher.highlightBadge !== '[object Object]'
              ? butcher.highlightBadge
              : (butcher.isHalalCertified ? '100% Halal' : undefined);

            const badgesList = Array.isArray(butcher.badges) && butcher.badges.length > 0
              ? butcher.badges
              : (Array.isArray(butcher.tags) && butcher.tags.length > 0 ? butcher.tags : ['Découpe fraîche', 'Prix direct']);

            const cleanBadges = badgesList
              .map((b: any) => {
                if (!b) return '';
                if (typeof b === 'string') return b;
                if (typeof b === 'object') return b.name || b.tag || b.translations?.name || '';
                return String(b);
              })
              .filter((b: string) => b && b.trim() !== '' && b !== '[object Object]')
              .slice(0, 3);

            return (
              <div
                key={butcher.id}
                onClick={() => handleStoreClick(butcher)}
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
                  <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-emerald-700 leading-tight">
                    <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 shrink-0" />
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
                    {/* Highlighted Yellow Badge (like "No markups") */}
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
