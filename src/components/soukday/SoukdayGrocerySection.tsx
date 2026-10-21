'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/SoukdayCartContext';
import { SOUKDAY_GROCERY_SUBCATEGORIES } from '@/data/mockData';
import { Product } from '@/types';
import { LiveWebSettings } from '@/types';
import { DEFAULT_LIVE_SETTINGS } from '@/services/soukdayApi';
import { useTranslation } from '@/utils/translation';
import { 
  Package, 
  Globe2, 
  Plus, 
  Minus, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Truck
} from 'lucide-react';

interface SoukdayGrocerySectionProps {
  products?: Product[];
  settings?: LiveWebSettings;
}

export default function SoukdayGrocerySection({ 
  products = [],
  settings = DEFAULT_LIVE_SETTINGS 
}: SoukdayGrocerySectionProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { isFrench } = useTranslation();
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);

  const sourceProducts = products || [];

  // Products belonging to Soukday Direct Grocery
  let groceryProducts = sourceProducts.filter((p) => p.storeType === 'soukday_direct');
  if (groceryProducts.length === 0) {
    groceryProducts = sourceProducts.slice(0, 12);
  }

  const filteredProducts = activeSubcat
    ? groceryProducts.filter((p) => p.subcategorySlug === activeSubcat)
    : groceryProducts;

  const getProductCartQuantity = (productId: number) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section className="w-full bg-gradient-to-b from-stone-50 via-white to-stone-50">
      {/* 1. Full-Width Edge-to-Edge Highlight Banner (No space left or right) */}
      <div className="w-full bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white py-12 sm:py-16 border-y border-stone-800 relative overflow-hidden shadow-lg">
        {/* Ambient atmospheric glows */}
        <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-[#F68B62]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F68B62]/20 text-[#F68B62] border border-[#F68B62]/30 text-xs font-bold tracking-wide">
                <Globe2 className="w-3.5 h-3.5" />
                <span>{settings?.directGroceryTag || (isFrench ? 'Expédition Nationale & Internationale' : 'National & International Shipping')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                {isFrench ? (
                  settings?.directGroceryTitle || <>Épicerie Directe <span className="text-[#F68B62]">Soukday</span></>
                ) : (
                  <>Soukday <span className="text-[#F68B62]">Direct Grocery</span></>
                )}
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                {settings?.directGroceryDescription || (isFrench ? (
                  <>
                    Les produits d’épicerie fine vendus directement par <strong className="text-white">Soukday</strong> peuvent être expédiés 
                    partout au <strong className="text-white">Canada (10 provinces)</strong> et vers les <strong className="text-white">destinations éligibles aux États-Unis</strong>. 
                    Emballage soigné, arrivages réguliers et marques authentiques.
                  </>
                ) : (
                  <>
                    Fine grocery products sold directly by <strong className="text-white">Soukday</strong> can be shipped 
                    across <strong className="text-white">Canada (10 provinces)</strong> and to <strong className="text-white">eligible destinations in the United States</strong>. 
                    Careful packaging, regular arrivals and authentic brands.
                  </>
                ))}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 text-xs">
              <div className="feature-card bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-[#F68B62]/60 cursor-pointer">
                <Truck className="w-5 h-5 text-[#F68B62] mb-1.5 transition-transform duration-300 group-hover:scale-110" />
                <div className="font-bold text-white text-sm">{settings?.directGroceryFeature1Title || 'Canada & USA'}</div>
                <div className="text-[11px] text-stone-300">{settings?.directGroceryFeature1Subtitle || (isFrench ? 'Postes Canada / UPS' : 'Canada Post / UPS')}</div>
              </div>
              <div className="feature-card bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-[#F68B62]/60 cursor-pointer">
                <ShieldCheck className="w-5 h-5 text-[#F68B62] mb-1.5 transition-transform duration-300 group-hover:scale-110" />
                <div className="font-bold text-white text-sm">{settings?.directGroceryFeature2Title || (isFrench ? 'Fraîcheur 100%' : '100% Freshness')}</div>
                <div className="text-[11px] text-stone-300">{settings?.directGroceryFeature2Subtitle || (isFrench ? 'Garantie Soukday' : 'Soukday Guarantee')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subcategories & Products Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-7">
        {/* Subcategories Horizontal Swipe Bar */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {isFrench ? "Rayons épicerie directe :" : "Direct grocery aisles:"}
            </span>
            <span className="text-xs text-[#F68B62] font-semibold flex items-center gap-1 cursor-pointer hover:underline group">
              <span>{isFrench ? "Voir tout le catalogue" : "View full catalog"}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => setActiveSubcat(null)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${
                activeSubcat === null
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-xs'
              }`}
            >
              Tous ({groceryProducts.length})
            </button>
            {SOUKDAY_GROCERY_SUBCATEGORIES.map((sub) => {
              const isSelected = activeSubcat === sub.slug;
              return (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => setActiveSubcat(isSelected ? null : sub.slug)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F68B62] text-white shadow-md shadow-[#F68B62]/20 font-bold'
                      : 'bg-white hover:bg-[#FCEFEA] text-stone-700 hover:text-[#F68B62] border border-stone-200 hover:border-[#F68B62]/30 shadow-xs'
                  }`}
                >
                  <span className="text-sm">{sub.icon}</span>
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 pt-2">
          {filteredProducts.map((product) => {
            const qty = getProductCartQuantity(product.id);
            return (
              <div
                key={product.id}
                className="product-card group bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200/80 hover:border-[#F68B62]/60 hover:shadow-xl hover:shadow-[#F68B62]/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Badges Row */}
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#F68B62] border border-orange-200/60 shadow-2xs">
                      <Truck className="w-2.5 h-2.5" />
                      <span>Canada &amp; USA</span>
                    </span>
                    {product.isHalal && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#e06836] bg-[#FFF5EF] px-2 py-0.5 rounded-full border border-[#FF7A45]/30/60 shadow-2xs">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>Halal</span>
                      </span>
                    )}
                  </div>

                  <Link href={`/product/${product.slug || product.id}`} className="block group/link">
                    {/* Product Image */}
                    <div className="aspect-square rounded-xl overflow-hidden bg-stone-50/70 border border-stone-100/80 p-2.5 sm:p-3 mb-2.5 relative flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out"
                      />
                    </div>

                    {/* Brand / Provenance */}
                    <div className="text-[10px] sm:text-[11px] font-semibold text-stone-400 flex items-center gap-1 mb-1 truncate">
                      <span>{product.brand || 'Soukday'}</span>
                      <span>•</span>
                      <span className="truncate">{product.storeName}</span>
                    </div>

                    {/* Title & Unit */}
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover/link:text-[#F68B62] transition-colors duration-200 min-h-[2.5rem] sm:min-h-[2.75rem]">
                      {product.name}
                    </h3>
                    <div className="text-[11px] sm:text-xs font-medium text-stone-500 mt-1">
                      {product.unit}
                    </div>
                  </Link>
                </div>

                {/* Price & Add to Cart button */}
                <div className="mt-3.5 pt-2.5 border-t border-stone-100">
                  <div className="flex items-baseline gap-1.5 mb-2.5">
                    <span className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                      {product.price.toFixed(2)}$
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {product.originalPrice.toFixed(2)}$
                      </span>
                    )}
                  </div>

                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => addToCart(product, 1)}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#F68B62] hover:bg-[#e07047] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-[#F68B62]/25 active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Ajouter</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-[#F68B62] text-white rounded-xl p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, qty - 1)}
                        className="w-7 h-7 rounded-lg bg-black/15 hover:bg-black/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs sm:text-sm font-black px-2">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, qty + 1)}
                        className="w-7 h-7 rounded-lg bg-black/15 hover:bg-black/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
