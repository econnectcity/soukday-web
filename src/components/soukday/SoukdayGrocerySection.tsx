'use client';

import React, { useState, useRef } from 'react';
import { LocalizedLink as Link } from '@/utils/localizedNav';
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

  // Exactly 2 lines of 6 products on desktop (12 products total)
  const displayProducts = filteredProducts.slice(0, 12);

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-2.5 sm:gap-3 pt-2">
            {displayProducts.map((product) => {
              const qty = getProductCartQuantity(product.id);
              const [dollars, cents] = (product.price || 0).toFixed(2).split('.');
              const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
              const discountPercent = hasDiscount 
                ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
                : 0;

              const sName = (product.storeName || '').trim();
              const isSoukday = !sName || sName.toLowerCase().includes('soukday');

              return (
                <div
                  key={product.id}
                  className="product-card group bg-white rounded-2xl p-2 sm:p-2.5 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Product Image & Top Floating Instacart-style Add Button */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-50/70 p-2 sm:p-2.5 mb-2 flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                      <Link href={`/product/${product.slug || product.id}`} className="w-full h-full flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out"
                        />
                      </Link>

                      {/* Floating Add to Cart Button */}
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10">
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product, 1);
                            }}
                            className="flex items-center gap-1 bg-[#F68B62] hover:bg-[#e07047] text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
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
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/15 hover:bg-black/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[11px] sm:text-xs font-black px-1 sm:px-1.5 min-w-[1.1rem] sm:min-w-[1.25rem] text-center">{qty}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateQuantity(product.id, qty + 1);
                              }}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/15 hover:bg-black/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
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
                      <div className="flex items-center flex-wrap gap-1">
                        <div className="inline-flex items-start px-1.5 py-0.5 rounded-lg bg-[#FCEFEA] border border-[#F68B62]/20 shadow-2xs">
                          <span className="text-base sm:text-lg font-black text-stone-900 leading-none">
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
                        <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
                          {isFrench ? `Réduction de ${discountPercent}%` : `${discountPercent}% off`}
                        </div>
                      )}

                      {/* Product Name (Natural 1 or 2 lines without reserved blank height) */}
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover/link:text-[#F68B62] transition-colors duration-200 mt-1">
                        {product.name}
                      </h3>

                      {/* Vendor Attribution: Vendu par in black and seller in orange */}
                      <div className="text-[11px] sm:text-xs truncate mt-1">
                        <span className="font-semibold text-stone-900">
                          {isFrench ? "Vendu par " : "Sold by "}
                        </span>
                        <span className="font-bold text-[#F68B62]">
                          {isSoukday ? "Soukday" : sName}
                        </span>
                      </div>
                    </Link>
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
