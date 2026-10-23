'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { LocalizedLink as Link } from '@/utils/localizedNav';
import { useCart } from '@/context/SoukdayCartContext';
import { SOUKDAY_GROCERY_SUBCATEGORIES, SOUKDAY_DIRECT_PRODUCTS } from '@/data/mockData';
import { Product } from '@/types';
import { fetchLiveSoukdayProducts } from '@/services/soukdayApi';
import { useTranslation } from '@/utils/translation';
import { getTranslatedCategoryName } from '@/utils/categoryTranslation';
import {
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  ChevronRight,
  Filter,
  X,
  Search,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
  Check
} from 'lucide-react';

interface SoukdayDedicatedGroceryPageProps {
  initialProducts?: Product[];
}

export default function SoukdayDedicatedGroceryPage({
  initialProducts = [],
}: SoukdayDedicatedGroceryPageProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { isFrench } = useTranslation();

  // Products state with live fetch fallback
  const [allProducts, setAllProducts] = useState<Product[]>(
    initialProducts.length > 0 ? initialProducts : SOUKDAY_DIRECT_PRODUCTS
  );
  const [isLoading, setIsLoading] = useState(false);

  // Filters State
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'name_asc'>('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150]);
  const [halalOnly, setHalalOnly] = useState(false);
  const [nationwideOnly, setNationwideOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch live products for Soukday on mount
  useEffect(() => {
    let isMounted = true;
    async function loadLiveSoukday() {
      try {
        setIsLoading(true);
        const lang = isFrench ? 'fr' : 'en';
        const liveProds = await fetchLiveSoukdayProducts(lang);
        if (isMounted && liveProds && liveProds.length > 0) {
          // Merge live items with any custom mock items to ensure rich catalog
          const map = new Map<number, Product>();
          SOUKDAY_DIRECT_PRODUCTS.forEach((p) => map.set(p.id, p));
          liveProds.forEach((p) => map.set(p.id, { ...map.get(p.id), ...p }));
          setAllProducts(Array.from(map.values()));
        }
      } catch (err) {
        console.warn('Could not fetch live Soukday products, using catalog fallback', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadLiveSoukday();
    return () => {
      isMounted = false;
    };
  }, [isFrench]);

  // Strict guard: Admin / Soukday direct products only
  const isSoukdayProduct = (p: Product) => {
    if (!p) return false;
    if (p.storeType === 'soukday_direct') return true;
    if (p.seller_id === 11 || p.seller_id === 0 || p.storeId === 11 || p.storeId === 0) return true;
    const sName = (p.storeName || '').toLowerCase();
    return sName.includes('soukday') || sName.includes('épicerie directe') || sName.includes('epicerie directe');
  };

  const soukdayOnlyCatalog = useMemo(() => {
    return allProducts.filter(isSoukdayProduct);
  }, [allProducts]);

  // Category product count calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SOUKDAY_GROCERY_SUBCATEGORIES.forEach((cat) => {
      const matchCount = soukdayOnlyCatalog.filter((p) => {
        if (p.subcategorySlug === cat.slug || p.categorySlug === cat.slug) return true;
        const pName = (p.name || '').toLowerCase();
        if (cat.slug === 'epices-et-herbes') {
          return pName.includes('curcuma') || pName.includes('thym') || pName.includes('épice') || pName.includes('amande');
        }
        if (cat.slug === 'couscous-semoules-et-farine') {
          return pName.includes('makrout') || pName.includes('semoule') || pName.includes('couscous');
        }
        if (cat.slug === 'conserves-poissons-et-harissa') {
          return pName.includes('sardine') || pName.includes('harissa') || pName.includes('poisson');
        }
        if (cat.slug === 'conserves-haricots-et-legumineuses') {
          return pName.includes('frite') || pName.includes('haricot') || pName.includes('pois');
        }
        if (cat.slug === 'huiles-et-vinaigres') {
          return pName.includes('huile') || pName.includes('vinaigre');
        }
        if (cat.slug === 'pates-riz-et-feves') {
          return pName.includes('riz') || pName.includes('pâte') || pName.includes('fève');
        }
        if (cat.slug === 'thes-cafes-et-tisanes') {
          return pName.includes('thé') || pName.includes('café') || pName.includes('tisane');
        }
        if (cat.slug === 'tartinades-sauces-et-autres') {
          return pName.includes('salade') || pName.includes('sauce') || pName.includes('tartinade');
        }
        return false;
      }).length;
      counts[cat.slug] = matchCount;
    });
    return counts;
  }, [soukdayOnlyCatalog]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...soukdayOnlyCatalog];

    // 1. Subcategory filter
    if (selectedSubcat) {
      result = result.filter((p) => {
        if (p.subcategorySlug === selectedSubcat || p.categorySlug === selectedSubcat) return true;
        const pName = (p.name || '').toLowerCase();
        if (selectedSubcat === 'epices-et-herbes') {
          return pName.includes('curcuma') || pName.includes('thym') || pName.includes('épice') || pName.includes('amande');
        }
        if (selectedSubcat === 'couscous-semoules-et-farine') {
          return pName.includes('makrout') || pName.includes('semoule') || pName.includes('couscous');
        }
        if (selectedSubcat === 'conserves-poissons-et-harissa') {
          return pName.includes('sardine') || pName.includes('harissa') || pName.includes('poisson');
        }
        if (selectedSubcat === 'conserves-haricots-et-legumineuses') {
          return pName.includes('frite') || pName.includes('haricot') || pName.includes('pois');
        }
        if (selectedSubcat === 'huiles-et-vinaigres') {
          return pName.includes('huile') || pName.includes('vinaigre');
        }
        if (selectedSubcat === 'pates-riz-et-feves') {
          return pName.includes('riz') || pName.includes('pâte') || pName.includes('fève');
        }
        if (selectedSubcat === 'thes-cafes-et-tisanes') {
          return pName.includes('thé') || pName.includes('café') || pName.includes('tisane');
        }
        if (selectedSubcat === 'tartinades-sauces-et-autres') {
          return pName.includes('salade') || pName.includes('sauce') || pName.includes('tartinade');
        }
        return false;
      });
    }

    // 2. Keyword Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.unit && p.unit.toLowerCase().includes(q))
        );
      });
    }

    // 3. Price Filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // 4. Badges
    if (halalOnly) {
      result = result.filter((p) => p.isHalal);
    }
    if (nationwideOnly) {
      result = result.filter((p) => p.canShipNationwide);
    }

    // 5. Sorting (Default: Most selling product 1st)
    result.sort((a, b) => {
      if (sortBy === 'popular') {
        // Highest sales / order counter first
        if (a.isTopSeller && !b.isTopSeller) return -1;
        if (!a.isTopSeller && b.isTopSeller) return 1;
        const salesA = Number(a.salesCount ?? a.orderCounter ?? 0);
        const salesB = Number(b.salesCount ?? b.orderCounter ?? 0);
        if (salesB !== salesA) return salesB - salesA;
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return a.id - b.id;
      }
      if (sortBy === 'price_low') {
        return a.price - b.price;
      }
      if (sortBy === 'price_high') {
        return b.price - a.price;
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [soukdayOnlyCatalog, selectedSubcat, searchQuery, priceRange, halalOnly, nationwideOnly, sortBy]);

  const resetAllFilters = () => {
    setSelectedSubcat(null);
    setSearchQuery('');
    setSortBy('popular');
    setPriceRange([0, 150]);
    setHalalOnly(false);
    setNationwideOnly(false);
  };

  const hasActiveFilters =
    selectedSubcat !== null ||
    searchQuery.trim() !== '' ||
    sortBy !== 'popular' ||
    priceRange[0] > 0 ||
    priceRange[1] < 150 ||
    halalOnly ||
    nationwideOnly;

  const getProductCartQuantity = (productId: number) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-stone-50">
      
      {/* 1. Header Banner & Breadcrumb */}
      <div className="bg-white border-b border-stone-200/70 pt-6 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-4">
            <Link href="/" className="hover:text-[#F68B62] transition-colors">
              {isFrench ? "Accueil" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold">
              {isFrench ? "Toute l’épicerie Soukday" : "All Soukday Grocery"}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-[#F68B62] text-xs font-bold mb-2.5 shadow-2xs">
                <Truck className="w-3.5 h-3.5" />
                <span>{isFrench ? "Vendu et expédié directement par Soukday" : "Sold and shipped directly by Soukday"}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
                {isFrench ? "L’épicerie Soukday" : "Soukday Grocery"}
              </h1>
              <p className="text-sm sm:text-base text-stone-600 font-medium max-w-2xl mt-1.5">
                {isFrench 
                  ? "Découvrez l’intégralité de nos produits d’épicerie maghrébine et orientale. Produits exclusifs, authentiques et expédiés partout au Canada et aux États-Unis."
                  : "Discover our full range of North African & oriental grocery products. Exclusive, authentic items shipped across Canada and the United States."}
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-stone-500 font-medium">{isFrench ? "Produits disponibles" : "Available Products"}</div>
                  <div className="text-lg font-black text-stone-900">{filteredProducts.length} / {soukdayOnlyCatalog.length}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F68B62]/10 flex items-center justify-center text-[#F68B62]">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Body: Sidebar + Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT SIDEBAR: Categories with count + Filters */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">

            {/* Search Input */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
              <label htmlFor="search-input" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                {isFrench ? "Rechercher un produit" : "Search Product"}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isFrench ? "ex: Makrout, Curcuma..." : "e.g. Makrout, Turmeric..."}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#F68B62] focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Dedicated Categories Section with Item Counts */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                  {isFrench ? "Rayons Soukday" : "Soukday Aisles"}
                </h3>
                <span className="text-[11px] font-bold text-stone-400">
                  {soukdayOnlyCatalog.length} {isFrench ? "articles" : "items"}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                {/* All Categories Option */}
                <button
                  type="button"
                  onClick={() => setSelectedSubcat(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSubcat === null
                      ? 'bg-[#F68B62] text-white shadow-sm shadow-[#F68B62]/30'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>✨</span>
                    <span>{isFrench ? "Tous les rayons" : "All aisles"}</span>
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      selectedSubcat === null
                        ? 'bg-white/20 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {soukdayOnlyCatalog.length}
                  </span>
                </button>

                {/* Subcategory List with Number of Products */}
                {SOUKDAY_GROCERY_SUBCATEGORIES.map((cat) => {
                  const isSelected = selectedSubcat === cat.slug;
                  const count = categoryCounts[cat.slug] || 0;
                  const catName = getTranslatedCategoryName(cat, isFrench);

                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => setSelectedSubcat(isSelected ? null : cat.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F68B62] text-white font-bold shadow-sm shadow-[#F68B62]/30'
                          : 'hover:bg-stone-50 text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="text-sm">{cat.icon}</span>
                        <span className="truncate">{catName}</span>
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters Section: Price, Halal, Shipping */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-[#F68B62]" />
                  <span>{isFrench ? "Filtres" : "Filters"}</span>
                </h3>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs text-[#F68B62] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{isFrench ? "Réinitialiser" : "Reset"}</span>
                  </button>
                )}
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>{isFrench ? "Prix maximal" : "Max Price"}</span>
                  <span className="text-[#F68B62] font-black">{priceRange[1]}$</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseFloat(e.target.value)])}
                  className="w-full accent-[#F68B62] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-semibold text-stone-400">
                  <span>0$</span>
                  <span>75$</span>
                  <span>150$+</span>
                </div>
              </div>

              {/* Badges Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2.5 text-xs font-bold text-stone-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={halalOnly}
                    onChange={(e) => setHalalOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#F68B62] focus:ring-[#F68B62] border-stone-300 cursor-pointer"
                  />
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                    <span>{isFrench ? "100% Halal uniquement" : "100% Halal Only"}</span>
                  </span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-bold text-stone-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={nationwideOnly}
                    onChange={(e) => setNationwideOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#F68B62] focus:ring-[#F68B62] border-stone-300 cursor-pointer"
                  />
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#F68B62]" />
                    <span>{isFrench ? "Expédition Canada & USA" : "Canada & USA Shipping"}</span>
                  </span>
                </label>
              </div>
            </div>

          </aside>

          {/* RIGHT PRODUCT GRID & TOOLBAR */}
          <main className="flex-1 w-full space-y-6">

            {/* Top Toolbar: Count + Sort Dropdown (DEFAULT: Most Selling Product) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-900">
                  {isFrench ? "Affichage de" : "Showing"}{' '}
                  <strong className="text-[#F68B62] font-black">{filteredProducts.length}</strong>{' '}
                  {isFrench ? "produits exclusifs Soukday" : "exclusive Soukday products"}
                </span>
                {selectedSubcat && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#FCEFEA] text-[#F68B62] border border-[#F68B62]/30">
                    <span>{getTranslatedCategoryName({ slug: selectedSubcat }, isFrench)}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedSubcat(null)}
                      className="hover:text-red-600 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Sort By Filter: Default is 'popular' (Most Selling Product) */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-xs font-bold text-stone-500 whitespace-nowrap flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>{isFrench ? "Trier par :" : "Sort by:"}</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#F68B62] cursor-pointer"
                >
                  <option value="popular">
                    {isFrench ? "🔥 Meilleures ventes (Par défaut)" : "🔥 Best Sellers (Default)"}
                  </option>
                  <option value="price_low">
                    {isFrench ? "Prix : Moins cher au plus cher" : "Price: Low to High"}
                  </option>
                  <option value="price_high">
                    {isFrench ? "Prix : Plus cher au moins cher" : "Price: High to Low"}
                  </option>
                  <option value="name_asc">
                    {isFrench ? "Nom : A à Z" : "Name: A to Z"}
                  </option>
                </select>
              </div>

            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#F68B62] flex items-center justify-center mx-auto text-2xl font-bold">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  {isFrench ? "Aucun produit ne correspond à vos filtres" : "No products match your criteria"}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                  {isFrench
                    ? "Essayez de modifier votre catégorie ou de réinitialiser la plage de prix pour voir tous les produits d’épicerie Soukday."
                    : "Try adjusting your category filter or price range to see all available Soukday grocery items."}
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F68B62] hover:bg-[#e07047] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isFrench ? "Réinitialiser tous les filtres" : "Reset all filters"}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.map((product, index) => {
                  const qty = getProductCartQuantity(product.id);
                  const isTopOne = index === 0 && (product.isTopSeller || (product.salesCount && product.salesCount > 1000));
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
                        {/* Product Image & Top Floating Instacart-style Add Button */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-50/70 p-2.5 sm:p-3 mb-2 flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                          <Link href={`/product/${product.slug || product.id}`} className="w-full h-full flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out"
                            />
                          </Link>

                          {/* Top Seller Badge (Top Left) */}
                          {isTopOne && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-stone-900 text-white text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 z-10">
                              <span>★</span>
                              <span>{isFrench ? "N°1" : "Top Seller"}</span>
                            </div>
                          )}

                          {/* Floating Add to Cart Button (Top Right) */}
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
            )}

          </main>

        </div>
      </div>

    </div>
  );
}
