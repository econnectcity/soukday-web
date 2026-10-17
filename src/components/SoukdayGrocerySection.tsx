'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { SOUKDAY_GROCERY_SUBCATEGORIES, PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import { LiveWebSettings } from '../types';
import { DEFAULT_LIVE_SETTINGS } from '../services/api';
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
  products = PRODUCTS,
  settings = DEFAULT_LIVE_SETTINGS 
}: SoukdayGrocerySectionProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);

  const sourceProducts = products && products.length > 0 ? products : PRODUCTS;

  // Products belonging to Soukday Direct Grocery
  const groceryProducts = sourceProducts.filter((p) => p.storeType === 'soukday_direct');

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
                <span>{settings?.directGroceryTag || 'Expédition Nationale & Internationale'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                {settings?.directGroceryTitle ? (
                  settings.directGroceryTitle
                ) : (
                  <>Épicerie Directe <span className="text-[#F68B62]">Soukday</span></>
                )}
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                {settings?.directGroceryDescription || (
                  <>
                    Les produits d’épicerie fine vendus directement par <strong className="text-white">Soukday</strong> peuvent être expédiés 
                    partout au <strong className="text-white">Canada (10 provinces)</strong> et vers les <strong className="text-white">destinations éligibles aux États-Unis</strong>. 
                    Emballage soigné, arrivages réguliers et marques authentiques.
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 text-xs">
              <div className="feature-card bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-[#F68B62]/60 cursor-pointer">
                <Truck className="w-5 h-5 text-[#F68B62] mb-1.5 transition-transform duration-300 group-hover:scale-110" />
                <div className="font-bold text-white text-sm">{settings?.directGroceryFeature1Title || 'Canada & USA'}</div>
                <div className="text-[11px] text-stone-300">{settings?.directGroceryFeature1Subtitle || 'Postes Canada / UPS'}</div>
              </div>
              <div className="feature-card bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-[#F68B62]/60 cursor-pointer">
                <ShieldCheck className="w-5 h-5 text-[#F68B62] mb-1.5 transition-transform duration-300 group-hover:scale-110" />
                <div className="font-bold text-white text-sm">{settings?.directGroceryFeature2Title || 'Fraîcheur 100%'}</div>
                <div className="text-[11px] text-stone-300">{settings?.directGroceryFeature2Subtitle || 'Garantie Soukday'}</div>
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
              Rayons épicerie directe :
            </span>
            <span className="text-xs text-[#F68B62] font-semibold flex items-center gap-1 cursor-pointer hover:underline group">
              <span>Voir tout le catalogue</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
          {filteredProducts.map((product) => {
            const qty = getProductCartQuantity(product.id);
            return (
              <div
                key={product.id}
                className="product-card group bg-white rounded-2xl p-3 border border-stone-200/70 hover:border-[#F68B62]/50 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FCEFEA] text-[#F68B62] border border-[#F68B62]/20 truncate">
                      {product.badge || 'Expédition Canada'}
                    </span>
                    {product.brand && (
                      <span className="text-[10px] font-semibold text-stone-400">
                        {product.brand}
                      </span>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-stone-50 mb-2 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Title & Unit */}
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-[#F68B62] transition-colors duration-200">
                    {product.name}
                  </h3>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {product.unit} {product.weightOrVolume ? `(${product.weightOrVolume})` : ''}
                  </div>
                </div>

                {/* Price & Add to Cart button */}
                <div className="mt-3 pt-2 border-t border-stone-100">
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-sm sm:text-base font-black text-stone-900">
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
                      className="w-full py-2 px-3 rounded-xl bg-[#FCEFEA] hover:bg-[#F68B62] text-stone-800 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer border border-[#F68B62]/30 hover:border-transparent hover:shadow-md hover:shadow-[#F68B62]/20 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-[#F68B62] text-white rounded-xl p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, qty - 1)}
                        className="w-6 h-6 rounded-lg bg-black/15 hover:bg-black/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-2">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, qty + 1)}
                        className="w-6 h-6 rounded-lg bg-black/15 hover:bg-black/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
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
