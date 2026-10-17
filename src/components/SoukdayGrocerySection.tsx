'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { SOUKDAY_GROCERY_SUBCATEGORIES, PRODUCTS } from '../data/mockData';
import { Product } from '../types';
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

export default function SoukdayGrocerySection() {
  const { cart, addToCart, updateQuantity } = useCart();
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);

  // Products belonging to Soukday Direct Grocery
  const groceryProducts = PRODUCTS.filter((p) => p.storeType === 'soukday_direct');

  const filteredProducts = activeSubcat
    ? groceryProducts.filter((p) => p.subcategorySlug === activeSubcat)
    : groceryProducts;

  const getProductCartQuantity = (productId: number) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 via-white to-stone-50">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Highlight Banner / Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 sm:p-8 shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#F68B62]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F68B62]/20 text-[#F68B62] border border-[#F68B62]/30 text-xs font-bold tracking-wide">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Expédition Nationale & Internationale</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                Épicerie Directe <span className="text-[#F68B62]">Soukday</span>
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                Les produits d’épicerie fine vendus directement par <strong>Soukday</strong> peuvent être expédiés 
                partout au <strong>Canada (10 provinces)</strong> et vers les <strong>destinations éligibles aux États-Unis</strong>. 
                Emballage soigné, arrivages réguliers et marques authentiques.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0 text-xs">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <Truck className="w-4 h-4 text-[#F68B62] mb-1" />
                <div className="font-bold text-white">Canada & USA</div>
                <div className="text-[10px] text-stone-300">Postes Canada / UPS</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#F68B62] mb-1" />
                <div className="font-bold text-white">Fraîcheur 100%</div>
                <div className="text-[10px] text-stone-300">Garantie Soukday</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategories Horizontal Swipe Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Rayons épicerie directe :
            </span>
            <span className="text-xs text-[#F68B62] font-semibold flex items-center gap-1 cursor-pointer hover:underline">
              Voir tout le catalogue <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => setActiveSubcat(null)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubcat === null
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
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
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F68B62] text-white shadow-sm font-bold'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  <span>{sub.icon}</span>
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
                className="product-card group bg-white rounded-2xl p-3 border border-stone-100 flex flex-col justify-between"
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F68B62]/10 text-[#F68B62] truncate">
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Unit */}
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-[#F68B62] transition-colors">
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
                      className="w-full py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-[#F68B62] text-stone-800 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-[#F68B62] text-white rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, qty - 1)}
                        className="w-6 h-6 rounded-lg bg-black/15 hover:bg-black/25 flex items-center justify-center text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-2">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, qty + 1)}
                        className="w-6 h-6 rounded-lg bg-black/15 hover:bg-black/25 flex items-center justify-center text-white cursor-pointer"
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
