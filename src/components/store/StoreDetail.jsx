'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { LocalizedLink as Link } from '@/utils/localizedNav';
import { useCart } from '@/context/SoukdayCartContext';
import { STORES, PRODUCTS } from '@/data/mockData';
import { Store as StoreType, Product } from '@/types';
import * as api from '@/api/apiRoutes';
import { fetchLiveSellers } from '@/services/soukdayApi';
import { useTranslation } from '@/utils/translation';
import {
  Search,
  X,
  Sparkles,
  MapPin,
  Clock,
  Star,
  Phone,
  ShieldCheck,
  Truck,
  Zap,
  ShoppingBag,
  Store as StoreIcon,
  ChevronRight,
  Filter,
  Plus,
  Minus,
  Info,
  Check,
  Copy,
  ExternalLink,
  SlidersHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';

export default function StoreDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { cart, addToCart, updateQuantity } = useCart();
  const { isFrench } = useTranslation();

  // Slug resolution
  const slugArray = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const currentSlug = (slugArray[slugArray.length - 1] || '').trim();

  // Normalize slug helper
  const slugify = (text = '') =>
    String(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  // 1. Resolve Store Info
  const [store, setStore] = useState(() => {
    if (!currentSlug) return STORES[0] || null;
    const directMatch = STORES.find(
      (s) =>
        s.slug === currentSlug ||
        slugify(s.name) === currentSlug ||
        String(s.id) === currentSlug
    );
    return directMatch || STORES[0] || null;
  });

  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // 2. Products state
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price_low' | 'price_high' | 'name_asc'
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [halalOnly, setHalalOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Load store details from API or catalog
  useEffect(() => {
    if (!currentSlug) return;
    let isMounted = true;

    async function loadStore() {
      setIsLoadingStore(true);
      try {
        // First check static catalog
        const match = STORES.find(
          (s) =>
            s.slug === currentSlug ||
            slugify(s.name) === currentSlug ||
            String(s.id) === currentSlug
        );

        if (match && isMounted) {
          setStore(match);
        }

        // Fetch live sellers to get exact seller details
        const liveSellers = await fetchLiveSellers();
        if (liveSellers && liveSellers.length > 0 && isMounted) {
          const liveMatch = liveSellers.find(
            (s) =>
              s.slug === currentSlug ||
              slugify(s.name) === currentSlug ||
              String(s.id) === currentSlug
          );
          if (liveMatch) {
            setStore((prev) => ({
              ...(prev || {}),
              ...liveMatch,
              // Keep badges or tags if live seller lacks them
              badges: liveMatch.badges?.length ? liveMatch.badges : (prev?.badges || ['Frais du jour', 'Prix direct']),
              tags: liveMatch.tags?.length ? liveMatch.tags : (prev?.tags || ['Boucherie Halal', 'Viande Fraîche']),
            }));
          }
        }

        // Try single seller endpoint if available
        try {
          const singleRes = await api.getSeller({ slug: currentSlug });
          if (singleRes?.status === 1 && singleRes.data && isMounted) {
            const data = singleRes.data;
            setStore((prev) => ({
              ...(prev || {}),
              id: data.id || prev?.id,
              name: data.translations?.store_name || data.store_name || data.name || prev?.name,
              slug: data.slug || prev?.slug || currentSlug,
              address: data.street || data.formatted_address || prev?.address || 'Montréal, QC',
              city: data.city_name || prev?.city || 'Montréal',
              rating: 4.9,
              reviewsCount: prev?.reviewsCount || 140,
              logo: data.logo_url || prev?.logo,
              description: data.translations?.store_description || data.store_description || prev?.description,
            }));
          }
        } catch (e) {
          // Fallback silently if single endpoint is not supported
        }
      } catch (err) {
        console.warn('Store load failed:', err);
      } finally {
        if (isMounted) setIsLoadingStore(false);
      }
    }

    loadStore();
    return () => {
      isMounted = false;
    };
  }, [currentSlug]);

  // Load products for this store
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        const storeId = store?.id;
        // Call backend API for seller products
        const filterParams = {
          seller_slug: currentSlug,
          ...(storeId && { seller_id: storeId }),
          limit: 100,
        };

        const res = await api.getProductByFilter({
          latitude: 45.5017,
          longitude: -73.5673,
          filters: filterParams,
        });

        if (res?.status === 1 && Array.isArray(res.data) && res.data.length > 0 && isMounted) {
          const mapped = res.data.map((item) => {
            const variant = item.variants?.[0] || {};
            const price = parseFloat(variant.discounted_price || variant.price || item.price || 0);
            const originalPrice = variant.discounted_price > 0 && variant.discounted_price < variant.price ? parseFloat(variant.price) : undefined;
            return {
              id: item.id,
              name: item.translations?.name || item.name,
              categoryName: item.category_name || item.category?.name || 'Général',
              categorySlug: item.category?.slug || slugify(item.category_name || 'general'),
              price,
              originalPrice,
              image: item.image_url || item.image || '/images/default-product.png',
              unit: variant.stock_unit_name || variant.unit || '1 unit',
              storeId: item.seller_id || storeId,
              storeName: item.seller_name || item.seller?.store_name || store?.name,
              seller_id: item.seller_id || storeId,
              isHalal: true,
              inStock: (variant.stock || 10) > 0,
            };
          });
          setProducts(mapped);
          setIsLoadingProducts(false);
          return;
        }

        // Fallback: match products from catalog
        if (isMounted) {
          const storeNameLower = (store?.name || '').toLowerCase();
          const isButcher = store?.type === 'butcher' || storeNameLower.includes('boucherie');

          // Find products matching seller_id or storeName
          let matched = PRODUCTS.filter((p) => {
            if (p.seller_id && storeId && p.seller_id === storeId) return true;
            if (p.storeName && store?.name && p.storeName.toLowerCase() === storeNameLower) return true;
            return false;
          });

          // If no direct matches, load specialty products for this store type
          if (matched.length === 0) {
            matched = PRODUCTS.filter((p) => {
              if (isButcher) {
                return (
                  p.categorySlug === 'viande-et-poulet-halal' ||
                  p.categorySlug === 'boucherie-halal' ||
                  (p.tags && p.tags.some((t) => t.toLowerCase().includes('viande') || t.toLowerCase().includes('poulet') || t.toLowerCase().includes('halal'))) ||
                  (p.name && (p.name.toLowerCase().includes('viande') || p.name.toLowerCase().includes('bœuf') || p.name.toLowerCase().includes('boeuf') || p.name.toLowerCase().includes('agneau') || p.name.toLowerCase().includes('poulet') || p.name.toLowerCase().includes('veau') || p.name.toLowerCase().includes('merguez')))
                );
              } else {
                return (
                  p.categorySlug === 'epicerie-maghrebine' ||
                  p.categorySlug === 'epices-et-herbes' ||
                  p.categorySlug === 'boulangerie-et-patisserie' ||
                  p.categorySlug === 'fruits-et-legumes'
                );
              }
            });
          }

          // If still small, take relevant items and assign store name
          const finalFallback = matched.length > 0 ? matched : PRODUCTS.slice(0, 16);
          const enriched = finalFallback.map((p) => ({
            ...p,
            storeId: store?.id || 5,
            storeName: store?.name || 'Boutique Partenaire',
            seller_id: store?.id || 5,
          }));

          setProducts(enriched);
        }
      } catch (err) {
        console.warn('Failed to load store products, using catalog fallback:', err);
        if (isMounted) {
          const fallback = PRODUCTS.slice(0, 16).map((p) => ({
            ...p,
            storeId: store?.id || 5,
            storeName: store?.name || 'Boutique Partenaire',
            seller_id: store?.id || 5,
          }));
          setProducts(fallback);
        }
      } finally {
        if (isMounted) setIsLoadingProducts(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [store?.id, currentSlug]);

  // Derived categories from available products
  const storeCategories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const catName = p.categoryName || (p.categorySlug ? p.categorySlug.replace(/-/g, ' ') : 'Rayon');
      const catSlug = p.categorySlug || slugify(catName);
      if (!map.has(catSlug)) {
        map.set(catSlug, { slug: catSlug, name: catName, count: 0 });
      }
      map.get(catSlug).count += 1;
    });
    return Array.from(map.values());
  }, [products]);

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory && p.categorySlug !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (p.name || '').toLowerCase().includes(q);
          const matchCat = (p.categoryName || '').toLowerCase().includes(q);
          if (!matchName && !matchCat) return false;
        }
        // Price Range
        if (p.price < priceRange[0] || p.price > priceRange[1]) {
          return false;
        }
        // Halal only
        if (halalOnly && !p.isHalal) {
          return false;
        }
        // In Stock only
        if (inStockOnly && p.inStock === false) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
        return 0; // default / popular
      });
  }, [products, selectedCategory, searchQuery, priceRange, halalOnly, inStockOnly, sortBy]);

  // Cart quantity helper
  const getProductQuantity = (productId) => {
    const item = cart?.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleCopyAddress = () => {
    const addr = `${store?.address || ''}, ${store?.city || 'Montréal'}`;
    navigator.clipboard?.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const storeName = store?.name || (isFrench ? 'Boutique Partenaire' : 'Partner Store');
  const isButcher = store?.type === 'butcher' || storeName.toLowerCase().includes('boucherie');
  const storeLogo = store?.logo || store?.image || (isButcher ? '/images/butchers/boucherie-zakiya.svg' : '/images/default-store.png');

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      
      {/* ─── 1. Breadcrumb & Store Hero Header ───────────────────────── */}
      <section className="bg-white border-b border-stone-200/80 pt-4 pb-6 sm:pb-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Trail */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-5">
            <Link href="/" className="hover:text-[#F68B62] transition-colors">
              {isFrench ? 'Accueil' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link href="/sellers" className="hover:text-[#F68B62] transition-colors">
              {isFrench ? 'Commerces & Boucheries' : 'Stores & Butchers'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold truncate max-w-[200px] sm:max-w-none">
              {storeName}
            </span>
          </nav>

          {/* Store Presentation Card */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Store Avatar Logo */}
              <div className="relative shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white border border-stone-200 p-2 shadow-sm overflow-hidden flex items-center justify-center">
                <img
                  src={storeLogo}
                  alt={storeName}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = isButcher ? '/images/butchers/boucherie-zakiya.svg' : '/images/default-store.png';
                  }}
                />
              </div>

              {/* Store Titles & Key Metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#F68B62] text-xs font-bold shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F68B62]" />
                    <span>{isFrench ? 'Partenaire Vérifié' : 'Verified Partner'}</span>
                  </span>
                  {isButcher && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      <span>✓ 100% Halal Certifié</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight">
                  {storeName}
                </h1>

                {/* Subtitle / Type & Address */}
                <p className="text-xs sm:text-sm text-stone-600 font-medium flex items-center gap-2 mt-1">
                  <span>{store?.typeLabel || (isButcher ? 'Boucherie Halal' : 'Supermarché & Épicerie')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {store?.address || 'Montréal'}, {store?.city || 'QC'}
                  </span>
                </p>

                {/* Badges / Operational Highlights */}
                <div className="flex items-center flex-wrap gap-2 pt-3">
                  {/* Rating */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{store?.rating || 4.9}</span>
                    <span className="text-amber-600/70 font-normal">({store?.reviewsCount || 140}+)</span>
                  </div>

                  {/* Delivery Info */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold">
                    <Zap className="w-3.5 h-3.5 text-[#F68B62]" />
                    <span>
                      {store?.deliveryBy ? `${isFrench ? 'Livraison d’ici' : 'Delivery by'} ${store.deliveryBy}` : `${store?.deliveryTime || '30-45 min'}`}
                    </span>
                  </div>

                  {/* Distance */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold">
                    <span>📍 {store?.distanceKm || 2.1} km</span>
                  </div>

                  {/* Min order / Delivery Fee */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold">
                    <Truck className="w-3.5 h-3.5 text-stone-500" />
                    <span>{store?.deliveryFee || (isFrench ? 'Gratuite dès 50$' : 'Free over $50')}</span>
                  </div>

                  {/* Open Status */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{isFrench ? 'Ouvert aujourd’hui (09h - 21h)' : 'Open today (9am - 9pm)'}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Actions & Store Info Pill */}
            <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
              <button
                type="button"
                onClick={() => setIsStoreModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Info className="w-4 h-4 text-[#F68B62]" />
                <span>{isFrench ? 'Infos sur la boutique' : 'Store Details'}</span>
              </button>

              <div className="text-right">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  {isFrench ? 'Catalogue' : 'Catalog'}
                </div>
                <div className="text-base sm:text-lg font-black text-stone-900">
                  {filteredProducts.length} {isFrench ? 'articles' : 'items'}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 2. In-Store Department Tabs & Quick Search ────────────── */}
      <section className="bg-white border-b border-stone-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search within this store */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFrench ? `Rechercher chez ${storeName}...` : `Search inside ${storeName}...`}
                className="w-full pl-9 pr-8 py-2 rounded-full bg-stone-100 border border-transparent focus:border-[#F68B62] focus:bg-white text-xs font-medium text-stone-900 placeholder-stone-400 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Department horizontal pill chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {/* All Products pill */}
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === null
                    ? 'bg-[#F68B62] text-white shadow-sm shadow-[#F68B62]/30'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{isFrench ? 'Tous les produits' : 'All Products'}</span>
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === null ? 'bg-white/20' : 'bg-stone-200 text-stone-600'}`}>
                  {products.length}
                </span>
              </button>

              {/* Dynamic categories for this store */}
              {storeCategories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(isSelected ? null : cat.slug)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F68B62] text-white shadow-sm shadow-[#F68B62]/30'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-stone-200 text-stone-600'}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. Main Catalog Body: Sidebar + Product Grid ─────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6">
            
            {/* Departments Box */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
              <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider mb-3">
                {isFrench ? 'Rayons du magasin' : 'Store Aisles'}
              </h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === null ? 'bg-orange-50 text-[#F68B62]' : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span>{isFrench ? 'Tous les articles' : 'All Items'}</span>
                  <span className="text-[10px] text-stone-400">{products.length}</span>
                </button>
                {storeCategories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      selectedCategory === c.slug ? 'bg-orange-50 text-[#F68B62]' : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="truncate pr-2">{c.name}</span>
                    <span className="text-[10px] text-stone-400">{c.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Box */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
              <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider mb-3">
                {isFrench ? 'Prix maximal' : 'Max Price'} : ${priceRange[1]}
              </h3>
              <input
                type="range"
                min="0"
                max="150"
                step="5"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                className="w-full accent-[#F68B62] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-bold text-stone-400 mt-1">
                <span>$0</span>
                <span>$75</span>
                <span>$150+</span>
              </div>
            </div>

            {/* Quick Badges Filter Box */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2.5">
              <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider mb-2">
                {isFrench ? 'Préférences' : 'Preferences'}
              </h3>
              
              <label className="flex items-center gap-2.5 text-xs font-bold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={halalOnly}
                  onChange={(e) => setHalalOnly(e.target.checked)}
                  className="rounded text-[#F68B62] focus:ring-[#F68B62] accent-[#F68B62]"
                />
                <span>{isFrench ? '100% Halal Certifié' : '100% Halal Certified'}</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#F68B62] focus:ring-[#F68B62] accent-[#F68B62]"
                />
                <span>{isFrench ? 'En stock uniquement' : 'In Stock only'}</span>
              </label>
            </div>

          </aside>

          {/* Catalog View & Grid */}
          <div className="flex-1 min-w-0 w-full">
            
            {/* Top Toolbar: Active Department + Sorting + Grid Toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 mb-6 gap-3 flex-wrap">
              <div>
                <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                  {selectedCategory 
                    ? storeCategories.find((c) => c.slug === selectedCategory)?.name || selectedCategory
                    : (isFrench ? 'Tous les produits' : 'All Products')}
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  {filteredProducts.length} {isFrench ? 'produits disponibles' : 'products available'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Trigger */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-xs font-bold text-stone-800"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{isFrench ? 'Filtres' : 'Filters'}</span>
                </button>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-stone-200 text-xs font-bold text-stone-800 py-1.5 px-3 rounded-full outline-none focus:border-[#F68B62] cursor-pointer"
                >
                  <option value="popular">{isFrench ? 'Popularité' : 'Popular'}</option>
                  <option value="price_low">{isFrench ? 'Prix: croissant' : 'Price: Low to High'}</option>
                  <option value="price_high">{isFrench ? 'Prix: décroissant' : 'Price: High to Low'}</option>
                  <option value="name_asc">{isFrench ? 'Nom: A - Z' : 'Name: A - Z'}</option>
                </select>

                {/* Grid / List Switch */}
                <div className="hidden sm:flex items-center bg-stone-100 p-0.5 rounded-full border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards Grid / List */}
            {isLoadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-stone-200 animate-pulse space-y-3">
                    <div className="w-full h-36 bg-stone-100 rounded-xl" />
                    <div className="h-4 bg-stone-100 rounded w-3/4" />
                    <div className="h-3 bg-stone-100 rounded w-1/2" />
                    <div className="h-8 bg-stone-100 rounded-full" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto my-8">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  {isFrench ? 'Aucun produit trouvé' : 'No products found'}
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  {isFrench 
                    ? 'Essayez de modifier votre recherche ou de réinitialiser vos filtres.' 
                    : 'Try modifying your search query or resetting your filters.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery('');
                    setPriceRange([0, 150]);
                  }}
                  className="px-4 py-2 rounded-full bg-[#F68B62] text-white text-xs font-bold hover:bg-[#e07750] transition-colors cursor-pointer"
                >
                  {isFrench ? 'Réinitialiser les filtres' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4' 
                : 'space-y-3'
              }>
                {filteredProducts.map((product) => {
                  const qty = getProductQuantity(product.id);
                  const isGrid = viewMode === 'grid';

                  return (
                    <div
                      key={product.id}
                      className={`group bg-white rounded-2xl border border-stone-200/90 hover:border-[#F68B62]/50 hover:shadow-md transition-all duration-300 flex ${
                        isGrid ? 'flex-col p-3' : 'flex-row items-center p-3.5 gap-4'
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`relative shrink-0 overflow-hidden rounded-xl bg-stone-50 ${
                        isGrid ? 'w-full h-36 sm:h-40 mb-2.5' : 'w-24 h-24 sm:w-28 sm:h-28'
                      }`}>
                        <img
                          src={product.image || '/images/default-product.png'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80';
                          }}
                        />

                        {/* Halal Badge */}
                        {product.isHalal && (
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] font-black tracking-wider uppercase">
                            Halal
                          </span>
                        )}

                        {/* Discount Badge */}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-[#F68B62] text-white text-[9px] font-black">
                            PROMO
                          </span>
                        )}
                      </div>

                      {/* Info & Add-to-Cart */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Unit / Weight */}
                          <div className="text-[11px] font-bold text-stone-400">
                            {product.unit}
                          </div>

                          {/* Product Title */}
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#F68B62] transition-colors line-clamp-2 leading-snug">
                            {product.name}
                          </h4>

                          {/* Price */}
                          <div className="flex items-baseline gap-1.5 mt-1.5">
                            <span className="text-sm sm:text-base font-black text-stone-900">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-stone-400 line-through">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Cart Stepper Action */}
                        <div className="mt-3">
                          {qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => addToCart(product)}
                              className="w-full py-2 px-3 rounded-full bg-[#F68B62] hover:bg-[#e07750] active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-[#F68B62]/20"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isFrench ? 'Ajouter' : 'Add to cart'}</span>
                            </button>
                          ) : (
                            <div className="w-full flex items-center justify-between bg-stone-100 rounded-full p-1 border border-stone-200">
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, qty - 1)}
                                className="w-7 h-7 rounded-full bg-white hover:bg-stone-200 active:scale-90 text-stone-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-black text-stone-900 px-2">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, qty + 1)}
                                className="w-7 h-7 rounded-full bg-[#F68B62] hover:bg-[#e07750] active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ─── 4. Store Info Modal ─────────────────────────────────────── */}
      {isStoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsStoreModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl border border-stone-200 p-1.5 shrink-0 bg-white">
                <img
                  src={storeLogo}
                  alt={storeName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900">
                  {storeName}
                </h3>
                <p className="text-xs text-stone-500 font-semibold">
                  {store?.typeLabel || (isButcher ? 'Boucherie Halal' : 'Supermarché Partenaire')}
                </p>
              </div>
            </div>

            {/* Content List */}
            <div className="space-y-4 text-xs font-medium text-stone-700">
              
              {/* Address */}
              <div className="flex items-start justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 gap-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#F68B62] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-900">{isFrench ? 'Adresse' : 'Address'}</div>
                    <div className="text-stone-600">{store?.address || 'Montréal, QC'}, {store?.postalCode || 'QC'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-bold text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedAddress ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAddress ? (isFrench ? 'Copié' : 'Copied') : (isFrench ? 'Copier' : 'Copy')}</span>
                </button>
              </div>

              {/* Operating Hours */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <Clock className="w-4 h-4 text-[#F68B62]" />
                  <span>{isFrench ? 'Horaires d’ouverture' : 'Opening Hours'}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                  <div className="text-stone-500">{isFrench ? 'Lundi - Vendredi :' : 'Monday - Friday:'}</div>
                  <div className="font-bold text-right text-stone-800">09h00 - 21h00</div>
                  <div className="text-stone-500">{isFrench ? 'Samedi - Dimanche :' : 'Saturday - Sunday:'}</div>
                  <div className="font-bold text-right text-stone-800">09h00 - 20h00</div>
                </div>
              </div>

              {/* Delivery & Fees */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <Truck className="w-4 h-4 text-[#F68B62]" />
                  <span>{isFrench ? 'Livraison & Commandes' : 'Delivery & Orders'}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                  <div className="text-stone-500">{isFrench ? 'Commande minimum :' : 'Minimum order:'}</div>
                  <div className="font-bold text-right text-stone-800">${store?.minOrder || 25}.00</div>
                  <div className="text-stone-500">{isFrench ? 'Frais de livraison :' : 'Delivery fee:'}</div>
                  <div className="font-bold text-right text-stone-800">{store?.deliveryFee || (isFrench ? 'Gratuite dès 50$' : 'Free over $50')}</div>
                  <div className="text-stone-500">{isFrench ? 'Délai moyen :' : 'Estimated time:'}</div>
                  <div className="font-bold text-right text-stone-800">{store?.deliveryTime || '30-45 min'}</div>
                </div>
              </div>

              {/* Halal statement if butcher */}
              {isButcher && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-emerald-900 text-[11px] leading-relaxed">
                    <span className="font-bold">{isFrench ? 'Garantie 100% Halal :' : '100% Halal Guarantee:'} </span>
                    {isFrench 
                      ? 'Toutes les viandes sont abattues selon le rite islamique strict et certifiées par les autorités reconnues du Québec.'
                      : 'All meats are strictly slaughtered according to Islamic rites and certified by recognized authorities.'}
                  </div>
                </div>
              )}

            </div>

            <button
              type="button"
              onClick={() => setIsStoreModalOpen(false)}
              className="mt-6 w-full py-3 rounded-full bg-[#F68B62] text-white font-bold text-xs hover:bg-[#e07750] transition-colors cursor-pointer shadow-md shadow-[#F68B62]/20"
            >
              {isFrench ? 'Fermer' : 'Close'}
            </button>

          </div>
        </div>
      )}

      {/* ─── 5. Mobile Filter Drawer ─────────────────────────────────── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 lg:hidden">
          <div className="w-80 max-w-full h-full bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-black text-sm text-stone-900 uppercase tracking-wider">
                  {isFrench ? 'Filtres' : 'Filters'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Department choices */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase mb-2">
                  {isFrench ? 'Rayon' : 'Aisle'}
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold ${
                      selectedCategory === null ? 'bg-orange-50 text-[#F68B62]' : 'text-stone-700'
                    }`}
                  >
                    {isFrench ? 'Tous les produits' : 'All Products'}
                  </button>
                  {storeCategories.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold ${
                        selectedCategory === c.slug ? 'bg-orange-50 text-[#F68B62]' : 'text-stone-700'
                      }`}
                    >
                      {c.name} ({c.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price slider */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase mb-2">
                  {isFrench ? 'Prix max' : 'Max Price'} : ${priceRange[1]}
                </h4>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                  className="w-full accent-[#F68B62]"
                />
              </div>

              {/* Halal / Stock */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={halalOnly}
                    onChange={(e) => setHalalOnly(e.target.checked)}
                    className="accent-[#F68B62]"
                  />
                  <span>100% Halal Certifié</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#F68B62]"
                  />
                  <span>En stock uniquement</span>
                </label>
              </div>

            </div>

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="mt-6 w-full py-3 rounded-full bg-[#F68B62] text-white font-bold text-xs"
            >
              {isFrench ? 'Voir les résultats' : 'Show Results'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

