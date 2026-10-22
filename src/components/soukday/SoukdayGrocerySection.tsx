'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/SoukdayCartContext';
import { SOUKDAY_GROCERY_SUBCATEGORIES, SOUKDAY_DIRECT_PRODUCTS } from '@/data/mockData';
import { Product } from '@/types';
import { LiveWebSettings } from '@/types';
import { DEFAULT_LIVE_SETTINGS } from '@/services/soukdayApi';
import { useTranslation } from '@/utils/translation';
import { getTranslatedCategoryName } from '@/utils/categoryTranslation';
import { 
  Plus, 
  Minus, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight,
  ArrowRight,
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
  const subcatScrollRef = useRef<HTMLDivElement>(null);

  const scrollSubcat = (direction: 'left' | 'right') => {
    if (subcatScrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      subcatScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Strict check: ONLY products sold by Soukday / Admin (never third-party vendors)
  const isSoukdayProduct = (p: Product) => {
    if (!p) return false;
    if (p.storeType === 'soukday_direct') return true;
    if (p.seller_id === 11 || p.seller_id === 0 || p.storeId === 11 || p.storeId === 0) return true;
    const sName = (p.storeName || '').toLowerCase();
    return sName.includes('soukday') || sName.includes('épicerie directe') || sName.includes('epicerie directe');
  };

  const incomingSoukday = (products || []).filter(isSoukdayProduct);
  // Fallback ONLY to default Soukday direct products, NEVER to third-party vendor products
  const groceryProducts = incomingSoukday.length > 0 
    ? incomingSoukday 
    : (SOUKDAY_DIRECT_PRODUCTS || []);

  // Sort helper: Top most selling products 1st (descending by salesCount / orderCounter / isTopSeller)
  const sortByTopSelling = (a: Product, b: Product) => {
    // 1. Explicit top seller flag
    if (a.isTopSeller && !b.isTopSeller) return -1;
    if (!a.isTopSeller && b.isTopSeller) return 1;

    // 2. By total sales / orders (highest sold first)
    const salesA = Number(a.salesCount ?? a.orderCounter ?? 0);
    const salesB = Number(b.salesCount ?? b.orderCounter ?? 0);
    if (salesB !== salesA) {
      return salesB - salesA;
    }

    // 3. By popularity flag
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;

    // 4. By row order if available
    const rowA = a.rowOrder ?? 9999;
    const rowB = b.rowOrder ?? 9999;
    if (rowA !== rowB) {
      return rowA - rowB;
    }

    return a.id - b.id;
  };

  const filteredProducts = (
    activeSubcat
      ? groceryProducts.filter((p) => {
          if (p.subcategorySlug === activeSubcat || p.categorySlug === activeSubcat) return true;
          // Fallback matching for subcategories
          const pName = (p.name || '').toLowerCase();
          if (activeSubcat === 'epices-et-herbes') {
            return pName.includes('curcuma') || pName.includes('thym') || pName.includes('épice') || pName.includes('amande');
          }
          if (activeSubcat === 'couscous-semoules-et-farine') {
            return pName.includes('makrout') || pName.includes('semoule') || pName.includes('couscous');
          }
          if (activeSubcat === 'conserves-poissons-et-harissa') {
            return pName.includes('sardine') || pName.includes('harissa') || pName.includes('poisson');
          }
          if (activeSubcat === 'conserves-haricots-et-legumineuses') {
            return pName.includes('frite') || pName.includes('haricot') || pName.includes('pois');
          }
          if (activeSubcat === 'tartinades-sauces-et-autres') {
            return pName.includes('salade') || pName.includes('sauce') || pName.includes('tartinade');
          }
          return false;
        })
      : [...groceryProducts]
  ).sort(sortByTopSelling);

  // Exactly 2 lines of 5 products on desktop (10 products total)
  const displayProducts = filteredProducts.slice(0, 10);

  const getProductCartQuantity = (productId: number) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section className="w-full bg-gradient-to-b from-stone-50 via-white to-stone-50 border-b border-stone-200/60 py-[80px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header - Styled identically to category section with CategorySlider arrows */}
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight leading-tight">
              {isFrench ? "L’épicerie Soukday" : "Soukday Grocery"}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium truncate sm:whitespace-normal mt-0.5">
              {isFrench 
                ? "Découvrez une sélection de produits d’épicerie maghrébine offerts par Soukday." 
                : "Discover a selection of North African & Maghreb grocery products offered by Soukday."}
            </p>
          </div>

          {/* Navigation Arrows for Categories Swipe - Same as Category Section */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollSubcat('left')}
              className="w-9 h-9 rounded-full border border-[#F68B62] bg-[#F68B62] hover:bg-[#e07750] hover:border-[#e07750] flex items-center justify-center text-white shadow-xs hover:shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label={isFrench ? "Précédent" : "Previous"}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              type="button"
              onClick={() => scrollSubcat('right')}
              className="w-9 h-9 rounded-full border border-[#F68B62] bg-[#F68B62] hover:bg-[#e07750] hover:border-[#e07750] flex items-center justify-center text-white shadow-xs hover:shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label={isFrench ? "Suivant" : "Next"}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Subcategories Horizontal Swipe Bar */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between sm:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {isFrench ? "Rayons épicerie directe :" : "Direct grocery aisles:"}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollSubcat('left')}
                className="w-7 h-7 rounded-full border border-[#F68B62] bg-[#F68B62] flex items-center justify-center text-white shadow-xs active:scale-90 transition-all cursor-pointer"
                aria-label={isFrench ? "Précédent" : "Previous"}
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                onClick={() => scrollSubcat('right')}
                className="w-7 h-7 rounded-full border border-[#F68B62] bg-[#F68B62] flex items-center justify-center text-white shadow-xs active:scale-90 transition-all cursor-pointer"
                aria-label={isFrench ? "Suivant" : "Next"}
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div 
            ref={subcatScrollRef}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            <button
              type="button"
              onClick={() => setActiveSubcat(null)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                activeSubcat === null
                  ? 'bg-[#F68B62] text-white shadow-md shadow-[#F68B62]/20 font-bold border border-[#F68B62]'
                  : 'bg-white hover:bg-[#FCEFEA] text-stone-700 hover:text-[#F68B62] border border-stone-200 hover:border-[#F68B62]/30 shadow-xs font-semibold'
              }`}
            >
              {isFrench ? "Tous" : "All"} ({groceryProducts.length})
            </button>
            {SOUKDAY_GROCERY_SUBCATEGORIES.map((sub) => {
              const isSelected = activeSubcat === sub.slug;
              const subName = getTranslatedCategoryName(sub, isFrench);
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
                  <span>{subName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-stone-200/80 p-6 space-y-3">
            <p className="text-stone-500 font-medium text-sm">
              {isFrench 
                ? "Aucun produit disponible dans ce rayon pour le moment." 
                : "No products currently available in this aisle."}
            </p>
            <button
              type="button"
              onClick={() => setActiveSubcat(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F68B62] text-white text-xs font-bold hover:bg-[#e07047] transition-all cursor-pointer shadow-xs"
            >
              <span>{isFrench ? "Voir tous les produits Soukday" : "View all Soukday products"}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 pt-2">
            {displayProducts.map((product) => {
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
                        <span>{isFrench ? "Ajouter" : "Add"}</span>
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
        )}

        {/* Dedicated Soukday Grocery Page CTA Button */}
        <div className="flex justify-center pt-6 sm:pt-8">
          <Link
            href="/epicerie-soukday"
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-[#F68B62] hover:bg-[#e07047] text-white font-black text-sm sm:text-base shadow-md hover:shadow-xl hover:shadow-[#F68B62]/30 active:scale-95 transition-all duration-200 cursor-pointer group"
          >
            <span>{isFrench ? "Toute l’épicerie Soukday" : "All Soukday Grocery"}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>
        </div>

      </div>
    </section>
  );
}
