'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import { 
  Sparkles, 
  Plus, 
  Minus, 
  Star, 
  Check, 
  Store as StoreIcon, 
  ShieldCheck,
  Truck
} from 'lucide-react';

interface PopularProductsSectionProps {
  products?: Product[];
}

export default function PopularProductsSection({ products = PRODUCTS }: PopularProductsSectionProps) {
  const { cart, addToCart, updateQuantity, searchQuery, selectedCategory } = useCart();

  const sourceProducts = products && products.length > 0 ? products : PRODUCTS;

  // Filter products by search query or category if selected
  const filteredProducts = sourceProducts.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchStore = p.storeName.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      if (!matchName && !matchStore && !matchBrand) return false;
    }
    if (selectedCategory) {
      if (p.categorySlug !== selectedCategory) return false;
    }
    return true;
  });

  const getProductCartQuantity = (productId: number) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section className="py-14 sm:py-20 bg-stone-50/80 border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#F68B62] mb-1.5 px-3 py-1 rounded-full bg-[#FCEFEA] border border-[#F68B62]/25 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-[#F68B62] text-[#F68B62]" />
              <span>Coups de cœur de nos clients</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Produits populaires & recommandés
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Les incontournables des épiceries orientales et boucheries artisanales du Québec
            </p>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            {filteredProducts.length} articles disponibles
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const qty = getProductCartQuantity(product.id);
            const isSoukdayDirect = product.storeType === 'soukday_direct';

            return (
              <div
                key={product.id}
                className="product-card group bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200/80 hover:border-[#F68B62]/60 hover:shadow-xl hover:shadow-[#F68B62]/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Store & Badges row */}
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs ${
                      isSoukdayDirect
                        ? 'bg-orange-50 text-[#F68B62] border border-orange-200/60'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    }`}>
                      {isSoukdayDirect ? <Truck className="w-2.5 h-2.5" /> : <StoreIcon className="w-2.5 h-2.5" />}
                      <span>{isSoukdayDirect ? 'Canada &amp; USA' : 'Boutique Locale'}</span>
                    </span>
                    {product.isHalal && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs">
                        <ShieldCheck className="w-2.5 h-2.5" /> Halal
                      </span>
                    )}
                  </div>

                  {/* Product Visual */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-stone-50/70 border border-stone-100/80 p-2.5 sm:p-3 mb-2.5 relative flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out"
                    />
                  </div>

                  {/* Store Name Provenance */}
                  <div className="text-[10px] sm:text-[11px] font-semibold text-stone-400 mb-1 flex items-center gap-1 truncate">
                    <StoreIcon className="w-3 h-3 text-[#F68B62] shrink-0" />
                    <span className="truncate">{product.storeName}</span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#F68B62] transition-colors duration-200 line-clamp-2 leading-snug min-h-[2.5rem] sm:min-h-[2.75rem]">
                    {product.name}
                  </h3>

                  {/* Unit / Weight */}
                  <div className="text-[11px] sm:text-xs font-medium text-stone-500 mt-1">
                    {product.unit}
                  </div>
                </div>

                {/* Bottom Pricing & Cart Action */}
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
