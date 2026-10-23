'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/utils/localizedNav';
import { useCart } from '@/context/SoukdayCartContext';
import { Product } from '@/types';
import { useTranslation } from '@/utils/translation';
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

export default function PopularProductsSection({ products = [] }: PopularProductsSectionProps) {
  const { cart, addToCart, updateQuantity, searchQuery, selectedCategory } = useCart();
  const { isFrench } = useTranslation();

  const sourceProducts = products || [];

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
              <span>{isFrench ? "Coups de cœur de nos clients" : "Customer Favorites"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {isFrench ? "Produits populaires & recommandés" : "Popular & Recommended Products"}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {isFrench 
                ? "Les incontournables des épiceries orientales et boucheries artisanales du Québec"
                : "Top picks from Quebec oriental grocery stores and artisan butcher shops"}
            </p>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            {filteredProducts.length} {isFrench ? "articles disponibles" : "items available"}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const qty = getProductCartQuantity(product.id);
            const [dollars, cents] = (product.price || 0).toFixed(2).split('.');
            const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
            const discountPercent = hasDiscount 
              ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
              : 0;

            const sName = (product.storeName || '').trim();
            const isSoukday = !sName || sName.toLowerCase().includes('soukday');
            const vendorText = isSoukday
              ? (isFrench ? "Vendu par Soukday" : "Sold by Soukday")
              : `${isFrench ? "Vendu par " : "Sold by "}${sName}`;

            return (
              <div
                key={product.id}
                className="product-card group bg-white rounded-2xl p-2.5 sm:p-3 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Product Visual & Top Floating Instacart-style Add Button */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-50/70 p-2.5 sm:p-3 mb-2 flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                    <Link href={`/product/${product.slug || product.id}`} className="w-full h-full flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out"
                      />
                    </Link>

                    {/* Floating Add to Cart Button */}
                    <div className="absolute top-2 right-2 z-10">
                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                          className="flex items-center gap-1 bg-[#F68B62] hover:bg-[#e07047] text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{isFrench ? "Ajouter" : "Add"}</span>
                        </button>
                      ) : (
                        <div 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="flex items-center bg-[#F68B62] text-white rounded-full p-0.5 shadow-md"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuantity(product.id, qty - 1);
                            }}
                            className="w-6 h-6 rounded-full bg-black/15 hover:bg-black/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black px-1.5 min-w-[1.25rem] text-center">{qty}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuantity(product.id, qty + 1);
                            }}
                            className="w-6 h-6 rounded-full bg-black/15 hover:bg-black/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <Link href={`/product/${product.slug || product.id}`} className="block group/link">
                    {/* Price Badge with Hero Banner Color (#FCEFEA) */}
                    <div className="flex items-center flex-wrap gap-1.5">
                      <div className="inline-flex items-start px-2 py-0.5 rounded-lg bg-[#FCEFEA] border border-[#F68B62]/20 shadow-2xs">
                        <span className="text-lg sm:text-xl font-black text-stone-900 leading-none">
                          {dollars}
                        </span>
                        <span className="text-[10px] sm:text-xs font-black text-[#D9531E] leading-none ml-0.5 mt-0.5">
                          {cents}$
                        </span>
                      </div>
                      {hasDiscount && (
                        <span className="text-xs text-stone-400 line-through">
                          {product.originalPrice!.toFixed(2)}$
                        </span>
                      )}
                    </div>

                    {/* Discount Tag like Instacart */}
                    {discountPercent > 0 && (
                      <div className="text-[11px] font-bold text-emerald-600 mt-1">
                        {isFrench ? `Réduction de ${discountPercent}%` : `${discountPercent}% off`}
                      </div>
                    )}

                    {/* Product Name (Bigger font like Instacart) */}
                    <h3 className="text-sm sm:text-[15px] font-bold text-stone-900 line-clamp-2 leading-snug group-hover/link:text-[#F68B62] transition-colors duration-200 mt-1.5 min-h-[2.4rem] sm:min-h-[2.6rem]">
                      {product.name}
                    </h3>

                    {/* Vendor Attribution: Vendu par Soukday / Vendu par [store name] */}
                    <div className="text-[11px] font-medium text-stone-400 truncate mt-1.5">
                      {vendorText}
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
