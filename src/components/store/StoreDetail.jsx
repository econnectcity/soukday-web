'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { LocalizedLink as Link } from '@/utils/localizedNav';
import { useCart } from '@/context/SoukdayCartContext';
import { STORES, PRODUCTS } from '@/data/mockData';
import { Store as StoreType, Product } from '@/types';
import * as api from '@/api/apiRoutes';
import { fetchLiveSellers } from '@/services/soukdayApi';
import { useTranslation } from '@/utils/translation';
import { useSelector } from 'react-redux';
import {
  Menu,
  Search,
  X,
  Zap,
  Info,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  ShoppingCart,
  Store as StoreIcon,
  Check,
  Copy,
  ShieldCheck,
  MapPin,
  Clock,
  Tag,
  RefreshCw,
  FileText,
  User,
  HelpCircle,
  Phone,
  Globe,
  Plus,
  Minus,
  Sparkles,
  Award
} from 'lucide-react';

export default function StoreDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const {
    cart,
    addToCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    selectedAddress,
    setIsAddressModalOpen
  } = useCart();
  const { isFrench } = useTranslation();
  const cityState = useSelector((state) => state.City?.city);

  // Slug resolution
  const slugArray = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const currentSlug = (slugArray[slugArray.length - 1] || '').trim();

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
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);
  const [isStoreInfoModalOpen, setIsStoreInfoModalOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Active navigation tab on the left sidebar
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'buy_again' | 'specials'
  const [activeAisle, setActiveAisle] = useState(null);

  // 2. In-Store Search Query (Strictly scoped to this store only)
  const [inStoreSearchQuery, setInStoreSearchQuery] = useState('');

  // 3. Products state
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Load store details from API or catalog
  useEffect(() => {
    if (!currentSlug) return;
    let isMounted = true;

    async function loadStore() {
      setIsLoadingStore(true);
      try {
        const match = STORES.find(
          (s) =>
            s.slug === currentSlug ||
            slugify(s.name) === currentSlug ||
            String(s.id) === currentSlug
        );

        if (match && isMounted) {
          setStore(match);
        }

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
              badges: liveMatch.badges?.length ? liveMatch.badges : (prev?.badges || ['Frais du jour', 'Prix direct']),
              tags: liveMatch.tags?.length ? liveMatch.tags : (prev?.tags || ['Boucherie Halal', 'Viande Fraîche']),
            }));
          }
        }

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
              latitude: data.latitude ? parseFloat(data.latitude) : prev?.latitude,
              longitude: data.longitude ? parseFloat(data.longitude) : prev?.longitude,
              description: data.translations?.store_description || data.store_description || prev?.description,
            }));
          }
        } catch (e) {}
      } catch (err) {
        console.warn('Store load error:', err);
      } finally {
        if (isMounted) setIsLoadingStore(false);
      }
    }

    loadStore();
    return () => {
      isMounted = false;
    };
  }, [currentSlug]);

  // Load products strictly for this store
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        const storeId = store?.id;
        const res = await api.getProductByFilter({
          latitude: 45.5017,
          longitude: -73.5673,
          filters: {
            seller_slug: currentSlug,
            ...(storeId && { seller_id: storeId }),
            limit: 100,
          },
        });

        if (res?.status === 1 && Array.isArray(res.data) && res.data.length > 0 && isMounted) {
          const mapped = res.data.map((item) => {
            const variant = item.variants?.[0] || {};
            const price = parseFloat(variant.discounted_price || variant.price || item.price || 0);
            const originalPrice =
              variant.discounted_price > 0 && variant.discounted_price < variant.price
                ? parseFloat(variant.price)
                : undefined;
            return {
              id: item.id,
              name: item.translations?.name || item.name,
              categoryName: item.category_name || item.category?.name || 'Fruits et légumes',
              categorySlug: item.category?.slug || slugify(item.category_name || 'fruits-et-legumes'),
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

        // Fallback: strictly assign to this store so no outside products appear
        if (isMounted) {
          const storeNameLower = (store?.name || '').toLowerCase();
          const isButcher = store?.type === 'butcher' || storeNameLower.includes('boucherie');

          let matched = PRODUCTS.filter((p) => {
            if (p.seller_id && storeId && p.seller_id === storeId) return true;
            if (p.storeName && store?.name && p.storeName.toLowerCase() === storeNameLower) return true;
            return false;
          });

          if (matched.length === 0) {
            matched = PRODUCTS.filter((p) => {
              if (isButcher) {
                return (
                  p.categorySlug === 'viande-et-poulet-halal' ||
                  p.categorySlug === 'boucherie-halal' ||
                  (p.tags && p.tags.some((t) => t.toLowerCase().includes('viande') || t.toLowerCase().includes('poulet') || t.toLowerCase().includes('halal'))) ||
                  (p.name && (p.name.toLowerCase().includes('viande') || p.name.toLowerCase().includes('bœuf') || p.name.toLowerCase().includes('agneau') || p.name.toLowerCase().includes('poulet') || p.name.toLowerCase().includes('merguez')))
                );
              } else {
                return (
                  p.categorySlug === 'fruits-et-legumes' ||
                  p.categorySlug === 'epicerie-maghrebine' ||
                  p.categorySlug === 'epices-et-herbes' ||
                  p.categorySlug === 'boulangerie-et-patisserie'
                );
              }
            });
          }

          const baseList = matched.length > 0 ? matched : PRODUCTS.slice(0, 20);
          const localized = baseList.map((p) => ({
            ...p,
            storeId: store?.id || 5,
            storeName: store?.name || 'Boutique Partenaire',
            seller_id: store?.id || 5,
          }));
          setProducts(localized);
        }
      } catch (err) {
        if (isMounted) {
          const localized = PRODUCTS.slice(0, 20).map((p) => ({
            ...p,
            storeId: store?.id || 5,
            storeName: store?.name || 'Boutique Partenaire',
            seller_id: store?.id || 5,
          }));
          setProducts(localized);
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

  // Group products by Aisles (Categories)
  const aisles = useMemo(() => {
    const map = new Map();
    products.forEach((prod) => {
      const catSlug = prod.categorySlug || slugify(prod.categoryName || 'autres');
      const catName = prod.categoryName || (catSlug ? catSlug.replace(/-/g, ' ') : 'Rayon');
      if (!map.has(catSlug)) {
        map.set(catSlug, {
          slug: catSlug,
          name: catName,
          products: [],
        });
      }
      map.get(catSlug).products.push(prod);
    });
    return Array.from(map.values());
  }, [products]);

  // In-Store Search Filter: strictly filters within this store's products only
  const searchResults = useMemo(() => {
    if (!inStoreSearchQuery.trim()) return null;
    const q = inStoreSearchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [inStoreSearchQuery, products]);

  // ─── 5. Delivery Time & Address Calculation (Accurate to Customer & Store) ─
  const customerLat = selectedAddress?.latitude
    ? parseFloat(selectedAddress.latitude)
    : cityState?.latitude
    ? parseFloat(cityState.latitude)
    : 45.5017;
  const customerLng = selectedAddress?.longitude
    ? parseFloat(selectedAddress.longitude)
    : cityState?.longitude
    ? parseFloat(cityState.longitude)
    : -73.5673;

  const storeLat = store?.latitude || 45.5200;
  const storeLng = store?.longitude || -73.5800;

  // Haversine distance
  const calculatedDistanceKm = useMemo(() => {
    const R = 6371;
    const dLat = ((storeLat - customerLat) * Math.PI) / 180;
    const dLon = ((storeLng - customerLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((customerLat * Math.PI) / 180) *
        Math.cos((storeLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return isNaN(dist) || dist < 0.5 ? (store?.distanceKm || 2.4) : Math.round(dist * 10) / 10;
  }, [customerLat, customerLng, storeLat, storeLng, store?.distanceKm]);

  // Delivery Window based on current clock and distance
  const deliveryWindowText = useMemo(() => {
    const now = new Date();
    // Prep time + travel time (approx 2.5 min/km)
    const travelMin = Math.max(25, Math.round(20 + calculatedDistanceKm * 2.5));
    const startMin = travelMin;
    const endMin = travelMin + 30;

    const startTime = new Date(now.getTime() + startMin * 60000);
    const endTime = new Date(now.getTime() + endMin * 60000);

    const pad = (n) => String(n).padStart(2, '0');
    const startStr = `${startTime.getHours()} h ${pad(startTime.getMinutes())}`;
    const endStr = `${endTime.getHours()} h ${pad(endTime.getMinutes())}`;

    return isFrench ? `Livraison d’ici ${startStr} - ${endStr}` : `Delivery by ${startStr} - ${endStr}`;
  }, [calculatedDistanceKm, isFrench]);

  const activeAddressDisplay = useMemo(() => {
    if (selectedAddress?.street) {
      return `${selectedAddress.street}`;
    }
    if (selectedAddress?.city) {
      return `${selectedAddress.city}, QC`;
    }
    return '17682 Rue Alexis-Contant';
  }, [selectedAddress]);

  // ─── 6. Free Delivery Progress ($150 Threshold) ──────────────────────────
  const FREE_SHIPPING_THRESHOLD = 150.0;
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  // Cart item quantity helper
  const getProductQty = (productId) => {
    const item = cart?.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Scroll to aisle helper
  const scrollToAisle = (aisleSlug) => {
    setActiveAisle(aisleSlug);
    const elem = document.getElementById(`aisle-${aisleSlug}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const storeName = store?.name || (isFrench ? 'Boutique Partenaire' : 'Partner Store');
  const isButcher = store?.type === 'butcher' || storeName.toLowerCase().includes('boucherie');
  const storeLogo =
    store?.logo ||
    store?.image ||
    (isButcher ? '/images/butchers/boucherie-zakiya.svg' : '/images/default-store.png');

  // Aisle horizontal scroll container refs
  const aisleScrollRefs = useRef({});

  const scrollShelf = (slug, direction) => {
    const container = aisleScrollRefs.current[slug];
    if (container) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col">

      {/* ═══════════════════════════════════════════════════════════════════════
          TOP HEADER (Instacart Single Store Header)
          1: 3-bars menu button
          2: Logo
          3: Store-specific search bar (stretched since 4 is removed)
          5: Delivery time + address (accurate to store & customer)
          6: Free delivery threshold cart pill ($150 limit)
         ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-[1520px] mx-auto px-3 sm:px-5 lg:px-7 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* LEFT: 1 (Hamburger) + 2 (Logo) */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* 1. 3-bars hamburger menu button */}
            <button
              type="button"
              onClick={() => setIsSidebarMenuOpen(true)}
              className="p-2 -ml-1 rounded-full hover:bg-stone-100 active:scale-95 text-stone-800 transition-colors cursor-pointer"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5 text-stone-800" />
            </button>

            {/* 2. Logo */}
            <Link href="/" className="shrink-0 flex items-center">
              <img
                src="/images/logo.png"
                alt="Soukday"
                className="h-7 sm:h-8 w-auto object-contain hover:opacity-95 transition-opacity"
                onError={(e) => {
                  e.currentTarget.src = '/images/logo.png';
                }}
              />
            </Link>
          </div>

          {/* MIDDLE: 3 & 4. Search inside store (Longer bar) */}
          <div className="flex-1 max-w-3xl relative mx-1 sm:mx-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inStoreSearchQuery}
                onChange={(e) => setInStoreSearchQuery(e.target.value)}
                placeholder={isFrench ? `Rechercher chez ${storeName}...` : `Search inside ${storeName}...`}
                className="w-full pl-10 pr-9 py-2 sm:py-2.5 rounded-full bg-stone-100 hover:bg-stone-150 focus:bg-white border border-transparent focus:border-[#108910] text-xs sm:text-sm font-medium text-stone-900 placeholder-stone-500 outline-none transition-all"
              />
              {inStoreSearchQuery && (
                <button
                  type="button"
                  onClick={() => setInStoreSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: 5 (Delivery Time & Address) + 6 (Cart button with Free Shipping threshold) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* 5. Delivery time & customer address (Accurate with store address to customer address) */}
            <div
              onClick={() => setIsAddressModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer text-left select-none"
              title={isFrench ? "Modifier l'adresse de livraison" : "Change delivery address"}
            >
              <Zap className="w-4 h-4 text-[#108910] fill-[#108910] shrink-0" />
              <div className="flex flex-col">
                <div className="text-[12px] font-extrabold text-[#108910] flex items-center gap-1 leading-tight">
                  <span>{deliveryWindowText}</span>
                  <Info className="w-3 h-3 text-stone-400" />
                </div>
                <div className="text-[11px] font-medium text-stone-600 flex items-center gap-0.5 leading-tight truncate max-w-[170px]">
                  <span className="truncate">{activeAddressDisplay}</span>
                  <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
                </div>
              </div>
            </div>

            {/* 6. Cart Button with Free Delivery indicator ($150 limit) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative overflow-hidden rounded-full bg-[#108910] hover:bg-[#0c740c] active:scale-95 text-white transition-all cursor-pointer shadow-sm flex items-center px-3.5 sm:px-4 py-2 sm:py-2.5 gap-2.5"
            >
              {/* Free delivery text */}
              <div className="hidden sm:block text-left text-[11px] sm:text-xs font-bold leading-tight">
                {cartSubtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span>🎉 {isFrench ? 'Livraison 0 $ débloquée' : 'Free delivery unlocked'}</span>
                ) : (
                  <span>
                    {isFrench 
                      ? `Frais de livraison à 0 $ dès 150 $ (encore ${remainingForFreeShipping.toFixed(0)} $)` 
                      : `Free delivery over $150 ($${remainingForFreeShipping.toFixed(0)} left)`}
                  </span>
                )}
              </div>

              {/* Cart Icon & Count */}
              <div className="flex items-center gap-1.5 pl-1 font-black text-xs sm:text-sm">
                <ShoppingCart className="w-4 h-4 text-white" />
                <span>{cartCount}</span>
              </div>

              {/* Subtle bottom progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </button>

          </div>

        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          1. SLIDE-OUT MENU DRAWER (Triggered by 3-bars hamburger button)
         ═══════════════════════════════════════════════════════════════════════ */}
      {isSidebarMenuOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsSidebarMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between z-10 overflow-y-auto">
            
            {/* Top Brand & Close */}
            <div>
              <div className="flex items-center justify-between p-5 border-b border-stone-100">
                <img src="/images/logo.png" alt="Soukday" className="h-7 w-auto object-contain" />
                <button
                  type="button"
                  onClick={() => setIsSidebarMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Delivery info summary inside drawer */}
              <div
                onClick={() => {
                  setIsSidebarMenuOpen(false);
                  setIsAddressModalOpen(true);
                }}
                className="p-4 mx-4 mt-4 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#108910] mb-1">
                  <Zap className="w-3.5 h-3.5 fill-[#108910]" />
                  <span>{deliveryWindowText}</span>
                </div>
                <div className="text-xs text-stone-600 truncate flex items-center justify-between">
                  <span className="truncate">{activeAddressDisplay}</span>
                  <span className="text-[11px] font-bold text-[#F68B62] shrink-0 ml-1">{isFrench ? 'Changer' : 'Change'}</span>
                </div>
              </div>

              {/* Navigation links */}
              <div className="p-4 space-y-1 text-xs font-bold text-stone-800">
                <Link
                  href="/"
                  onClick={() => setIsSidebarMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <StoreIcon className="w-4 h-4 text-stone-500" />
                  <span>{isFrench ? 'Accueil' : 'Home'}</span>
                </Link>

                <Link
                  href="/sellers"
                  onClick={() => setIsSidebarMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <StoreIcon className="w-4 h-4 text-stone-500" />
                  <span>{isFrench ? 'Tous les commerces & boucheries' : 'All Stores & Butchers'}</span>
                </Link>

                <Link
                  href="/epicerie-soukday"
                  onClick={() => setIsSidebarMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#F68B62]" />
                  <span>{isFrench ? 'Toute l’épicerie Soukday' : 'All Soukday Grocery'}</span>
                </Link>

                <Link
                  href="/categories/all"
                  onClick={() => setIsSidebarMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-500" />
                  <span>{isFrench ? 'Tous les rayons' : 'All Aisles'}</span>
                </Link>

                <div className="pt-3 pb-2 px-3.5 text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
                  {isFrench ? 'Aide & Espace pro' : 'Help & Professional'}
                </div>

                <Link
                  href="/faqs"
                  onClick={() => setIsSidebarMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-stone-500" />
                  <span>{isFrench ? 'Questions fréquentes (FAQs)' : 'FAQs'}</span>
                </Link>

                <Link
                  href="/contact-us"
                  onClick={() => setIsSidebarMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <Phone className="w-4 h-4 text-stone-500" />
                  <span>{isFrench ? 'Nous contacter' : 'Contact Us'}</span>
                </Link>

                <a
                  href="https://admin.soukday.ca/seller/login"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-stone-400" />
                  <span>{isFrench ? 'Portail Vendeur' : 'Seller Portal'}</span>
                </a>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="p-5 border-t border-stone-100 text-[11px] text-stone-400 font-medium">
              © Soukday 2026. {isFrench ? 'Tous droits réservés.' : 'All rights reserved.'}
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN STORE BODY (Two-Column Instacart Architecture from Image 1)
          - Left: Sticky Store Brand, Navigation tabs, and Aisles list
          - Right: Fluid Product Shelves & Aisle Carousels with "+ Ajouter"
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1520px] mx-auto px-3 sm:px-5 lg:px-7 py-6 flex-1 w-full">
        <div className="flex gap-8 items-start">
          
          {/* ─── LEFT SIDEBAR (Sticky, Instacart Image 1 style) ──────── */}
          <aside className="w-60 shrink-0 hidden lg:block sticky top-20 space-y-6">
            
            {/* Store Brand Card */}
            <div className="space-y-3">
              <div className="w-24 h-24 rounded-2xl bg-white border border-stone-200 p-2 shadow-xs flex items-center justify-center overflow-hidden">
                <img
                  src={storeLogo}
                  alt={storeName}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = isButcher ? '/images/butchers/boucherie-zakiya.svg' : '/images/default-store.png';
                  }}
                />
              </div>

              <div>
                <h1 className="text-xl font-black text-stone-900 leading-tight">
                  {storeName}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsStoreInfoModalOpen(true)}
                  className="text-[11px] text-stone-500 font-semibold hover:text-stone-800 transition-colors text-left mt-1 flex items-center gap-1 cursor-pointer"
                >
                  <span>{isFrench ? 'Afficher politique de prix • Min. 25 $' : 'View pricing policy • Min $25'}</span>
                  <ChevronRight className="w-3 h-3 text-stone-400" />
                </button>
              </div>
            </div>

            {/* Store Navigation Tabs (Magasiner / Acheter de nouveau) */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('shop');
                  setInStoreSearchQuery('');
                  setActiveAisle(null);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'shop'
                    ? 'bg-[#2B2B2B] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <StoreIcon className="w-4 h-4" />
                <span>{isFrench ? 'Magasiner' : 'Shop'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('buy_again')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'buy_again'
                    ? 'bg-[#2B2B2B] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isFrench ? 'Acheter de nouveau' : 'Buy again'}</span>
              </button>
            </div>

            {/* Parcourir les allées (Browse Aisles list) */}
            <div className="pt-2 border-t border-stone-200">
              <h2 className="text-sm font-black text-stone-900 mb-3">
                {isFrench ? 'Parcourir les allées' : 'Browse aisles'}
              </h2>
              <div className="space-y-0.5">
                {aisles.map((aisle) => (
                  <button
                    key={aisle.slug}
                    type="button"
                    onClick={() => scrollToAisle(aisle.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer truncate ${
                      activeAisle === aisle.slug
                        ? 'bg-stone-100 text-[#108910] font-bold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    {aisle.name}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* ─── RIGHT FLUID CONTENT (Aisles & Product Rows) ─────────── */}
          <main className="flex-1 min-w-0">
            
            {/* SEARCH RESULTS VIEW (when in-store search is used) */}
            {inStoreSearchQuery.trim() ? (
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
                  <div>
                    <h2 className="text-xl font-black text-stone-900">
                      {isFrench ? 'Résultats pour :' : 'Results for:'} &ldquo;{inStoreSearchQuery}&rdquo;
                    </h2>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      {searchResults?.length || 0} {isFrench ? `produits trouvés chez ${storeName}` : `products found inside ${storeName}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInStoreSearchQuery('')}
                    className="text-xs font-bold text-[#108910] hover:underline cursor-pointer"
                  >
                    {isFrench ? 'Effacer la recherche' : 'Clear search'}
                  </button>
                </div>

                {searchResults?.length === 0 ? (
                  <div className="bg-stone-50 rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto my-12">
                    <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-stone-900 mb-1">
                      {isFrench ? 'Aucun produit trouvé dans ce magasin' : 'No products found inside this store'}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {isFrench 
                        ? 'La recherche est strictement limitée aux articles de ce commerce.' 
                        : 'Search is strictly scoped to this store only.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
                    {searchResults.map((product) => renderProductCard(product))}
                  </div>
                )}
              </div>
            ) : (
              /* REGULAR AISLES BROWSING (Matching Image 1) */
              <div className="space-y-10 sm:space-y-12">
                {isLoadingProducts ? (
                  <div className="space-y-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="h-6 bg-stone-100 rounded w-48 animate-pulse" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <div key={j} className="h-64 bg-stone-100 rounded-2xl animate-pulse" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  aisles.map((aisle) => (
                    <section key={aisle.slug} id={`aisle-${aisle.slug}`} className="scroll-mt-24">
                      
                      {/* Aisle Title Bar */}
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">
                          {aisle.name}
                        </h2>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => scrollToAisle(aisle.slug)}
                            className="text-xs sm:text-sm font-bold text-stone-700 hover:text-stone-900 hover:underline flex items-center gap-1 cursor-pointer mr-1"
                          >
                            <span>{isFrench ? 'Afficher plus' : 'See more'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {/* Carousel scroll arrows */}
                          <div className="hidden sm:flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => scrollShelf(aisle.slug, 'left')}
                              className="w-8 h-8 rounded-full border border-stone-200 hover:bg-stone-100 active:scale-95 text-stone-700 flex items-center justify-center transition-all cursor-pointer"
                              aria-label="Previous"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => scrollShelf(aisle.slug, 'right')}
                              className="w-8 h-8 rounded-full border border-stone-200 hover:bg-stone-100 active:scale-95 text-stone-700 flex items-center justify-center transition-all cursor-pointer"
                              aria-label="Next"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Horizontal Product Shelf (Carousel on Mobile & Desktop, Image 1 style) */}
                      <div
                        ref={(el) => (aisleScrollRefs.current[aisle.slug] = el)}
                        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1 -mx-3 px-3 sm:mx-0 sm:px-0"
                      >
                        {aisle.products.map((product) => (
                          <div key={product.id} className="w-[170px] sm:w-[210px] shrink-0">
                            {renderProductCard(product)}
                          </div>
                        ))}
                      </div>

                    </section>
                  ))
                )}
              </div>
            )}

          </main>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          STORE PRICING & DETAILS MODAL
         ═══════════════════════════════════════════════════════════════════════ */}
      {isStoreInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200">
            <button
              type="button"
              onClick={() => setIsStoreInfoModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl border border-stone-200 p-1.5 shrink-0 bg-white">
                <img src={storeLogo} alt={storeName} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900">{storeName}</h3>
                <p className="text-xs text-stone-500 font-semibold">
                  {store?.typeLabel || (isButcher ? 'Boucherie Halal Partenaire' : 'Supermarché Partenaire')}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs font-medium text-stone-700">
              {/* Address */}
              <div className="flex items-start justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 gap-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#108910] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-900">{isFrench ? 'Adresse' : 'Address'}</div>
                    <div className="text-stone-600">{store?.address || 'Montréal, QC'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(store?.address || 'Montréal, QC');
                    setCopiedAddress(true);
                    setTimeout(() => setCopiedAddress(false), 2000);
                  }}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-bold text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedAddress ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAddress ? (isFrench ? 'Copié' : 'Copied') : (isFrench ? 'Copier' : 'Copy')}</span>
                </button>
              </div>

              {/* Delivery Window & Distance */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <Zap className="w-4 h-4 text-[#108910]" />
                  <span>{isFrench ? 'Détails de livraison' : 'Delivery Details'}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                  <div className="text-stone-500">{isFrench ? 'Distance calculée :' : 'Distance:'}</div>
                  <div className="font-bold text-right text-stone-800">{calculatedDistanceKm} km</div>
                  <div className="text-stone-500">{isFrench ? 'Fenêtre estimée :' : 'Estimated window:'}</div>
                  <div className="font-bold text-right text-stone-800">{deliveryWindowText}</div>
                  <div className="text-stone-500">{isFrench ? 'Commande minimum :' : 'Minimum order:'}</div>
                  <div className="font-bold text-right text-stone-800">${store?.minOrder || 25}.00</div>
                  <div className="text-stone-500">{isFrench ? 'Livraison gratuite :' : 'Free delivery:'}</div>
                  <div className="font-bold text-right text-[#108910]">Dès 150.00 $</div>
                </div>
              </div>

              {/* Halal Guarantee */}
              {isButcher && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-emerald-900 text-[11px] leading-relaxed">
                    <span className="font-bold">{isFrench ? 'Garantie 100% Halal :' : '100% Halal Guarantee:'} </span>
                    {isFrench
                      ? 'Toutes les viandes sont certifiées halal selon le rite strict et inspectées quotidiennement.'
                      : 'All meats are strictly certified halal and freshly inspected.'}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsStoreInfoModalOpen(false)}
              className="mt-6 w-full py-3 rounded-full bg-[#108910] text-white font-bold text-xs hover:bg-[#0c740c] transition-colors cursor-pointer shadow-sm"
            >
              {isFrench ? 'Fermer' : 'Close'}
            </button>
          </div>
        </div>
      )}

    </div>
  );

  /**
   * Helper to render Instacart Product Card (matching Image 1)
   */
  function renderProductCard(product) {
    const qty = getProductQty(product.id);
    const wholePrice = Math.floor(product.price);
    const cents = String(Math.round((product.price - wholePrice) * 100)).padStart(2, '0');

    return (
      <div
        key={product.id}
        className="group relative bg-white rounded-2xl p-3 border border-stone-200/90 hover:border-stone-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full"
      >
        {/* Top Image + Floating Green "+ Ajouter" button */}
        <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-white mb-2.5 flex items-center justify-center">
          <img
            src={product.image || '/images/default-product.png'}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80';
            }}
          />

          {/* Instacart Floating Green "+ Ajouter" button or Stepper */}
          <div className="absolute top-2 right-2">
            {qty === 0 ? (
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#108910] hover:bg-[#0c740c] active:scale-90 text-white text-xs font-bold shadow-md shadow-[#108910]/30 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFrench ? 'Ajouter' : 'Add'}</span>
              </button>
            ) : (
              <div className="inline-flex items-center bg-[#108910] text-white rounded-full p-0.5 shadow-md">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, qty - 1)}
                  className="w-6 h-6 rounded-full hover:bg-black/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                >
                  <Minus className="w-3 h-3 text-white" />
                </button>
                <span className="text-xs font-black px-2">{qty}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, qty + 1)}
                  className="w-6 h-6 rounded-full hover:bg-black/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Seasonal / Fresh Badge */}
          <span className="absolute bottom-1 right-1 text-[10px] font-semibold text-stone-500 bg-white/80 backdrop-blur-2xs px-1.5 py-0.5 rounded">
            {isFrench ? 'De saison' : 'Fresh'}
          </span>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Price (Instacart style with superscript cents: e.g. 12^49 $) */}
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                {wholePrice}
                <sup className="text-xs font-black ml-0.5">{cents}</sup>
                <span className="text-sm font-black ml-1">$</span>
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Discount badge if promo */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold mt-1.5">
                ${(product.originalPrice - product.price).toFixed(2)} {isFrench ? 'de réduction' : 'off'}
              </div>
            )}

            {/* Title & Unit */}
            <h3 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 mt-1.5 group-hover:text-[#108910] transition-colors leading-snug">
              {product.name}
            </h3>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              {product.unit}
            </p>
          </div>

          {/* Stock status (Instacart green triple bar icon style) */}
          <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-bold text-[#108910]">
            <span className="flex flex-col gap-0.5">
              <span className="w-2.5 h-0.5 bg-[#108910] rounded-full"></span>
              <span className="w-2 h-0.5 bg-[#108910] rounded-full"></span>
            </span>
            <span>{isFrench ? 'Plusieurs en stock' : 'Many in stock'}</span>
          </div>

        </div>
      </div>
    );
  }
}
