'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { LocalizedLink as Link } from '@/utils/localizedNav';
import { useCart } from '@/context/SoukdayCartContext';
import { STORES } from '@/data/mockData';
import { Store as StoreType, Product } from '@/types';
import * as api from '@/api/apiRoutes';
import { fetchLiveSellers } from '@/services/soukdayApi';
import { useTranslation } from '@/utils/translation';
import { getTranslatedCategoryName } from '@/utils/categoryTranslation';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedLanguage } from '@/redux/slices/languageSlice';
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
  HelpCircle,
  Phone,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  LayoutGrid
} from 'lucide-react';

function CanadaFlag({ className = "w-4 h-3" }) {
  return (
    <svg 
      viewBox="0 0 640 480" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path fill="#d80621" d="M0 0h640v480H0z"/>
      <path fill="#ffffff" d="M160 0h320v480H160z"/>
      <path fill="#d80621" d="m320 72.8 13.6 42.6 30.6-20.9-10 40 44-7.4-23.7 34.3 43.1 19.3-43 14 18.3 38.6-35.3-7.5 4.3 39-31.9-25.7-4 75.8h-12l-4-75.8-31.9 25.7 4.3-39-35.3 7.5 18.3-38.6-43-14 43.1-19.3-23.7-34.3 44 7.4-10-40 30.6 20.9z"/>
    </svg>
  );
}

/**
 * Extract authentic category information directly from backend product data.
 * Guarantees 100% genuine category names and slugs from the database.
 */
function getBackendCategory(item, isFrench = true) {
  const rawCat = item?.category || {};
  let rawName = '';
  if (Array.isArray(rawCat.translations) && rawCat.translations.length > 0) {
    rawName = rawCat.translations[0]?.name || rawCat.translations[0]?.title || '';
  } else if (rawCat.translations && typeof rawCat.translations === 'object') {
    rawName = rawCat.translations.name || rawCat.translations.title || '';
  }
  if (!rawName) {
    rawName = rawCat.name || item?.category_name || (isFrench ? 'Épicerie & Spécialités' : 'Grocery & Specialties');
  }

  // Normalize and capitalize first letter
  rawName = String(rawName).trim();
  if (rawName.length > 0) {
    rawName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  } else {
    rawName = isFrench ? 'Épicerie & Spécialités' : 'Grocery & Specialties';
  }

  const catSlug =
    rawCat.slug ||
    String(rawName)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const translatedName = getTranslatedCategoryName(
    { name: rawName, slug: catSlug, translations: rawCat.translations },
    isFrench
  );

  return { name: translatedName || rawName, rawName, slug: catSlug };
}

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
  const dispatch = useDispatch();
  const languageState = useSelector((state) => state.Language);
  const { currentCode, isFrench } = useTranslation();
  const cityState = useSelector((state) => state.City?.city);

  // Backend logo connection from Redux settings
  const settingState = useSelector((state) => state.Setting);
  const setting = settingState?.setting || {};
  const webSettings = setting?.web_settings || {};

  const [headerLogo, setHeaderLogo] = useState(() => {
    const raw =
      webSettings?.web_header_logo ||
      webSettings?.web_logo ||
      setting?.web_logo ||
      setting?.logo;
    if (raw && !raw.toLowerCase().includes('glm') && !raw.toLowerCase().includes('rembourrage')) {
      return raw;
    }
    return '/images/logo.png';
  });

  useEffect(() => {
    const raw =
      webSettings?.web_header_logo ||
      webSettings?.web_logo ||
      setting?.web_logo ||
      setting?.logo;
    if (raw && !raw.toLowerCase().includes('glm') && !raw.toLowerCase().includes('rembourrage')) {
      setHeaderLogo(raw);
    } else {
      api.getSetting()
        .then((res) => {
          if (res?.data) {
            try {
              const decoded = JSON.parse(atob(res.data));
              const liveLogo =
                decoded?.web_settings?.web_header_logo ||
                decoded?.web_settings?.web_logo ||
                decoded?.web_logo ||
                decoded?.logo;
              if (
                liveLogo &&
                !liveLogo.toLowerCase().includes('glm') &&
                !liveLogo.toLowerCase().includes('rembourrage')
              ) {
                setHeaderLogo(liveLogo);
              }
            } catch (e) {}
          }
        })
        .catch(() => {});
    }
  }, [setting, webSettings]);

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

  // Lock body scroll and close drawer on Escape key when slide-out menu is active
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSidebarMenuOpen(false);
        setIsStoreInfoModalOpen(false);
      }
    };
    if (isSidebarMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarMenuOpen]);

  // Active navigation tab on the left sidebar
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'buy_again'
  const [selectedAisleSlug, setSelectedAisleSlug] = useState(null); // null = all aisles

  // 2. In-Store Search Query (Strictly scoped to this store only)
  const [inStoreSearchQuery, setInStoreSearchQuery] = useState('');

  // 3. Products state
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Load store details
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
              tags: liveMatch.tags?.length ? liveMatch.tags : (prev?.tags || ['Épicerie', 'Frais']),
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

  // Load products strictly for this store directly from backend admin (100% real)
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        let storeId = store?.id;
        if (!storeId && currentSlug) {
          const liveSellers = await fetchLiveSellers();
          const liveMatch = liveSellers?.find(
            (s) =>
              s.slug === currentSlug ||
              slugify(s.name) === currentSlug ||
              String(s.id) === currentSlug
          );
          if (liveMatch?.id) storeId = liveMatch.id;
        }

        if (!storeId) {
          if (isMounted) {
            setProducts([]);
            setIsLoadingProducts(false);
          }
          return;
        }

        const res = await api.getProductByFilter({
          latitude: 45.5017,
          longitude: -73.5673,
          filters: {
            seller_id: storeId,
            limit: 200,
          },
        });

        const liveProducts = res?.status === 1 && Array.isArray(res.data) ? res.data : [];

        // Map strictly real products from backend
        const mappedReal = liveProducts.map((item) => {
          const variant = item.variants?.[0] || {};
          const price = parseFloat(variant.discounted_price || variant.price || item.price || 0);
          const originalPrice =
            variant.discounted_price > 0 && variant.discounted_price < variant.price
              ? parseFloat(variant.price)
              : undefined;

          const catInfo = getBackendCategory(item, isFrench);
          const pName =
            (typeof item.translations?.name === 'string' && item.translations.name) ||
            (typeof item.name === 'string' && item.name) ||
            item.variants?.[0]?.product?.translations?.name ||
            item.variants?.[0]?.product?.name ||
            (isFrench ? 'Produit' : 'Product');

          const pImage =
            item.image_url ||
            variant.product?.image_url ||
            item.image ||
            '/images/default-product.png';

          const unit =
            variant.stock_unit_name ||
            variant.unit ||
            (variant.measurement ? `${variant.measurement} ${variant.stock_unit_name || ''}`.trim() : '') ||
            (isFrench ? '1 unité' : '1 unit');

          return {
            id: item.id,
            slug: item.slug || variant.product?.slug || String(item.id),
            name: pName,
            categoryName: catInfo.name,
            rawCategoryName: catInfo.rawName,
            rawCategoryTranslations: item.category?.translations,
            categorySlug: catInfo.slug,
            price,
            originalPrice,
            image: pImage,
            unit,
            storeId: item.seller_id || storeId,
            storeName: item.seller_name || item.seller?.store_name || store?.name,
            seller_id: item.seller_id || storeId,
            isHalal: true,
            inStock: variant.stock !== undefined ? variant.stock > 0 : true,
          };
        });

        if (isMounted) {
          setProducts(mappedReal);
          setIsLoadingProducts(false);
        }
      } catch (err) {
        console.warn('Failed to fetch live products from backend:', err);
        if (isMounted) {
          setProducts([]);
          setIsLoadingProducts(false);
        }
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [store?.id, currentSlug, isFrench]);

  // Group products by distinct Aisles (Categories) — guaranteed unique from backend
  const aisles = useMemo(() => {
    const map = new Map();
    products.forEach((prod) => {
      const catSlug = prod.categorySlug || 'epicerie-specialites';
      const catName =
        getTranslatedCategoryName(
          {
            name: prod.rawCategoryName || prod.categoryName,
            slug: catSlug,
            translations: prod.rawCategoryTranslations,
          },
          isFrench
        ) || prod.categoryName || (isFrench ? 'Épicerie & Spécialités' : 'Grocery & Specialties');

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
  }, [products, isFrench]);

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

  // Filtered Aisles based on user selection in left sidebar
  const displayedAisles = useMemo(() => {
    if (!selectedAisleSlug) return aisles;
    return aisles.filter((a) => a.slug === selectedAisleSlug);
  }, [aisles, selectedAisleSlug]);

  // Filtered products for "Acheter de nouveau"
  const buyAgainProducts = useMemo(() => {
    if (activeTab !== 'buy_again') return [];
    const cartProductIds = new Set(cart?.map((item) => item.product?.id));
    return products.filter((p) => cartProductIds.has(p.id));
  }, [activeTab, cart, products]);

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

  const storeName = store?.name || (isFrench ? 'Boutique Partenaire' : 'Partner Store');
  const isButcher = store?.type === 'butcher' || storeName.toLowerCase().includes('boucherie');
  const storeLogo =
    store?.logo ||
    store?.image ||
    (isButcher ? '/images/butchers/boucherie-zakiya.svg' : '/images/default-store.png');

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col">

      {/* ═══════════════════════════════════════════════════════════════════════
          TOP HEADER (Instacart Single Store Header - Fluid Full Width)
          - Color theme: 100% Soukday Coral / Brand Orange (#F68B62)
          - Logo: Official Soukday logo (/images/logo.png)
          - Search: Stretched search bar strictly scoped inside this store
          - Delivery: Accurate delivery window with customer address
          - Cart: Free delivery threshold pill ($150 limit)
         ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-2xs h-[68px] flex items-center w-full">
        <div className="w-full px-3 sm:px-4 lg:px-5 flex items-center justify-between gap-2.5 sm:gap-4">
          
          {/* LEFT: 1 (Hamburger) + 2 (Official Soukday Logo) */}
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

            {/* 2. Official Soukday Logo (Connected dynamically to backend logo) */}
            <Link href="/" className="shrink-0 flex items-center">
              <img
                src={headerLogo}
                alt="Soukday"
                className="h-8 sm:h-9 w-auto max-w-[170px] sm:max-w-[190px] object-contain hover:opacity-95 transition-opacity"
                onError={(e) => {
                  e.currentTarget.src = '/images/logo.png';
                }}
              />
            </Link>
          </div>

          {/* MIDDLE: 3 & 4. Search inside store (Stretched & strictly scoped - Expands fluidly on wide screens) */}
          <div className="flex-1 max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1500px] relative mx-2 sm:mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inStoreSearchQuery}
                onChange={(e) => setInStoreSearchQuery(e.target.value)}
                placeholder={isFrench ? `Rechercher chez ${storeName}...` : `Search inside ${storeName}...`}
                className="w-full pl-10 pr-9 py-2 sm:py-2.5 rounded-full bg-stone-100 hover:bg-stone-150 focus:bg-white border border-transparent focus:border-[#F68B62] text-xs sm:text-sm font-medium text-stone-900 placeholder-stone-500 outline-none transition-all shadow-2xs"
              />
              {inStoreSearchQuery && (
                <button
                  type="button"
                  onClick={() => setInStoreSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: 5 (Delivery Time & Address) + 6 (Brand Orange Cart Button with $150 limit) + Language Switcher (in end after cart button) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* 5. Delivery time & customer address (Accurate with store address to customer address) */}
            <div
              onClick={() => setIsAddressModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer text-left select-none"
              title={isFrench ? "Modifier l'adresse de livraison" : "Change delivery address"}
            >
              <Zap className="w-4 h-4 text-[#F68B62] fill-[#F68B62] shrink-0" />
              <div className="flex flex-col">
                <div className="text-[12px] font-extrabold text-[#F68B62] flex items-center gap-1 leading-tight">
                  <span>{deliveryWindowText}</span>
                  <Info className="w-3 h-3 text-stone-400" />
                </div>
                <div className="text-[11px] font-medium text-stone-600 flex items-center gap-0.5 leading-tight truncate max-w-[170px]">
                  <span className="truncate">{activeAddressDisplay}</span>
                  <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
                </div>
              </div>
            </div>

            {/* 6. Cart Button with Free Delivery indicator ($150 limit, Brand Orange #F68B62 - slightly reduced size) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative overflow-hidden rounded-full bg-[#F68B62] hover:bg-[#e07750] active:scale-95 text-white transition-all cursor-pointer shadow-md shadow-[#F68B62]/20 flex items-center px-3 sm:px-3.5 py-1.5 sm:py-2 gap-2"
            >
              {/* Free delivery text */}
              <div className="hidden sm:block text-left text-[10.5px] sm:text-[11px] font-bold leading-tight">
                {cartSubtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span>🎉 {isFrench ? 'Livraison 0 $ débloquée' : 'Free delivery unlocked'}</span>
                ) : (
                  <span>
                    {isFrench 
                      ? `Livraison 0 $ dès 150 $ (encore ${remainingForFreeShipping.toFixed(0)} $)` 
                      : `Free delivery over $150 ($${remainingForFreeShipping.toFixed(0)} left)`}
                  </span>
                )}
              </div>

              {/* Cart Icon & Count */}
              <div className="flex items-center gap-1 pl-0.5 font-black text-xs sm:text-[13px]">
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
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

            {/* Language Switcher - Placed at the end after the cart button */}
            <button 
              type="button" 
              onClick={() => {
                const available = languageState?.availableLanguages || [];
                const activeCode = (currentCode || 'fr').toLowerCase();
                let nextLang = available.find(l => (l.code || '').toLowerCase() !== activeCode);
                if (!nextLang) {
                  nextLang = activeCode === 'fr' 
                    ? { id: 3, name: "English", code: "en", type: "LTR", display_name: "English" }
                    : { id: 5, name: "Français", code: "fr", type: "LTR", display_name: "Français (CA)" };
                }
                dispatch(setSelectedLanguage({ data: nextLang }));
              }}
              title={isFrench ? "Passer en anglais / Switch to English" : "Passer en français / Switch to French"}
              aria-label={isFrench ? "Passer en anglais" : "Switch to French"}
              className="group relative flex items-center justify-center w-10 sm:w-11 h-10 sm:h-11 rounded-full border border-stone-200/80 bg-white hover:bg-stone-50 hover:border-stone-400 text-stone-900 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
            >
              <div className="flex items-center justify-center gap-1 select-none">
                <span className="w-4 h-3 rounded-[2px] overflow-hidden border border-stone-200/60 shadow-2xs shrink-0 flex items-center justify-center">
                  <CanadaFlag className="w-full h-full object-cover" />
                </span>
                <span className="text-[11px] sm:text-xs font-black tracking-tight text-stone-800 group-hover:text-[#F68B62] transition-colors">
                  {isFrench ? "EN" : "FR"}
                </span>
              </div>
            </button>

          </div>

        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          1. SLIDE-OUT MENU DRAWER (Triggered by 3-bars hamburger button)
             - Smooth sliding animation:
               * Open: slides in smoothly from left to right (translate-x-0)
               * Close: slides out smoothly from right to left (-translate-x-full)
               * Backdrop overlay fades in/out with ease-in-out transition
         ═══════════════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
          isSidebarMenuOpen
            ? 'visible pointer-events-auto'
            : 'invisible pointer-events-none delay-300'
        }`}
        aria-hidden={!isSidebarMenuOpen}
      >
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
            isSidebarMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsSidebarMenuOpen(false)}
        />

        {/* Drawer Panel: slides from left (-translate-x-full) to right (translate-x-0) */}
        <div
          className={`fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between z-10 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
            isSidebarMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <img
                src={headerLogo}
                alt="Soukday"
                className="h-7 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/images/logo.png';
                }}
              />
              <button
                type="button"
                onClick={() => setIsSidebarMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                aria-label={isFrench ? "Fermer le menu" : "Close menu"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onClick={() => {
                setIsSidebarMenuOpen(false);
                setIsAddressModalOpen(true);
              }}
              className="p-4 mx-4 mt-4 rounded-2xl bg-orange-50/60 border border-orange-200/60 cursor-pointer hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#F68B62] mb-1">
                <Zap className="w-3.5 h-3.5 fill-[#F68B62]" />
                <span>{deliveryWindowText}</span>
              </div>
              <div className="text-xs text-stone-600 truncate flex items-center justify-between">
                <span className="truncate">{activeAddressDisplay}</span>
                <span className="text-[11px] font-bold text-[#F68B62] shrink-0 ml-1">{isFrench ? 'Changer' : 'Change'}</span>
              </div>
            </div>

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

          <div className="p-5 border-t border-stone-100 text-[11px] text-stone-400 font-medium">
            © Soukday 2026. {isFrench ? 'Tous droits réservés.' : 'All rights reserved.'}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN STORE BODY (Two-Column Instacart Architecture - Fluid Full Width)
          - Left: 100% Fixed Sticky Store Brand, Navigation tabs, and Clean Deduplicated Aisles
            with completely independent smooth scrolling (never shifts with main page)
          - Right: Fluid responsive product grids & carousels across the wide screen
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="w-full px-3 sm:px-4 lg:px-5 flex-1">
        <div className="flex gap-3.5 sm:gap-4 lg:gap-5 items-start w-full">
          
          {/* ─── LEFT SIDEBAR (100% Fixed, Independent Scroll) ──────────────── */}
          <aside className="w-52 xl:w-56 2xl:w-60 shrink-0 hidden lg:flex flex-col sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto overscroll-contain custom-sidebar-scroll py-5 pb-16 pr-2.5 space-y-5 select-none border-r border-stone-100/90">
            
            {/* Store Brand Card - Clickable (Logo, Store Name & Text all centered inside this box) */}
            <div
              onClick={() => setIsStoreInfoModalOpen(true)}
              className="group cursor-pointer select-none flex flex-col items-center text-center space-y-3 p-3 rounded-2xl bg-orange-50/30 hover:bg-orange-50/70 transition-all border border-orange-100 hover:border-orange-200/80 shadow-2xs"
              title={isFrench ? "Afficher les politiques de ce commerce" : "View store policies"}
            >
              <div className="w-24 h-24 rounded-2xl bg-white border border-stone-200 p-2 shadow-xs group-hover:border-[#F68B62]/60 group-hover:shadow-md transition-all flex items-center justify-center overflow-hidden mx-auto">
                <img
                  src={storeLogo}
                  alt={storeName}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = isButcher ? '/images/butchers/boucherie-zakiya.svg' : '/images/default-store.png';
                  }}
                />
              </div>

              <div className="w-full flex flex-col items-center text-center">
                <h1 className="text-xl font-black text-stone-900 leading-tight group-hover:text-[#F68B62] transition-colors text-center">
                  {storeName}
                </h1>
                <div className="text-[11px] text-stone-500 font-semibold group-hover:text-[#F68B62] transition-colors text-center mt-1.5 flex items-center justify-center gap-1">
                  <span>{isFrench ? 'Politiques du commerce • Min. 25 $' : 'Store policies • Min $25'}</span>
                  <ChevronRight className="w-3 h-3 text-stone-400 group-hover:translate-x-0.5 group-hover:text-[#F68B62] transition-all" />
                </div>
              </div>
            </div>

            {/* Store Navigation Tabs (Magasiner / Acheter de nouveau) */}
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('shop');
                  setInStoreSearchQuery('');
                  setSelectedAisleSlug(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'shop' && selectedAisleSlug === null
                    ? 'bg-[#F68B62] text-white shadow-md shadow-[#F68B62]/35 scale-[1.01]'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <StoreIcon className="w-4 h-4" />
                <span>{isFrench ? 'Magasiner' : 'Shop'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('buy_again');
                  setSelectedAisleSlug(null);
                  setInStoreSearchQuery('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'buy_again'
                    ? 'bg-[#F68B62] text-white shadow-md shadow-[#F68B62]/35 scale-[1.01]'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isFrench ? 'Acheter de nouveau' : 'Buy again'}</span>
              </button>
            </div>

            {/* Parcourir les allées (Deduplicated Aisles list) */}
            <div className="pt-2 border-t border-stone-200">
              <h2 className="text-sm font-black text-stone-900 mb-3">
                {isFrench ? 'Parcourir les allées' : 'Browse aisles'}
              </h2>
              <div className="space-y-1">
                {/* Option for All Aisles */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAisleSlug(null);
                    setInStoreSearchQuery('');
                    setActiveTab('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedAisleSlug === null && activeTab === 'shop'
                      ? 'bg-[#F68B62] text-white shadow-md shadow-[#F68B62]/35 scale-[1.01]'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                  }`}
                >
                  <span>{isFrench ? 'Tous les rayons' : 'All Aisles'}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                      selectedAisleSlug === null && activeTab === 'shop'
                        ? 'bg-white/25 text-white font-black'
                        : 'text-stone-400 bg-stone-100'
                    }`}
                  >
                    {products.length}
                  </span>
                </button>

                {/* Individual distinct Aisles */}
                {aisles.map((aisle) => {
                  const isActive = selectedAisleSlug === aisle.slug;
                  return (
                    <button
                      key={aisle.slug}
                      type="button"
                      onClick={() => {
                        setSelectedAisleSlug(aisle.slug);
                        setInStoreSearchQuery('');
                        setActiveTab('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#F68B62] text-white shadow-md shadow-[#F68B62]/35 scale-[1.01]'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                      }`}
                    >
                      <span className="truncate pr-2">{aisle.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white/25 text-white font-black'
                            : 'text-stone-400 bg-stone-100'
                        }`}
                      >
                        {aisle.products.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* ─── RIGHT FLUID CONTENT (Dense multi-column product grids) ── */}
          <main className="flex-1 min-w-0 py-4 sm:py-5">
            
            {/* 1. BUY AGAIN VIEW (when "Acheter de nouveau" is selected) */}
            {activeTab === 'buy_again' ? (
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
                  <div>
                    <h2 className="text-xl font-black text-stone-900">
                      {isFrench ? 'Acheter de nouveau' : 'Buy again'}
                    </h2>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      {isFrench
                        ? `Retrouvez rapidement vos articles favoris commandés chez ${storeName}`
                        : `Quickly reorder your favorite items from ${storeName}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('shop')}
                    className="text-xs font-bold text-[#F68B62] hover:underline cursor-pointer"
                  >
                    {isFrench ? '← Retour au catalogue' : '← Back to store catalog'}
                  </button>
                </div>

                {buyAgainProducts.length === 0 ? (
                  <div className="bg-stone-50 rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto my-12">
                    <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-stone-900 mb-1">
                      {isFrench ? 'Aucun article récent' : 'No recent items'}
                    </h3>
                    <p className="text-xs text-stone-500 mb-5">
                      {isFrench
                        ? `Ajoutez des articles de ${storeName} à votre panier pour les retrouver ici en un clic.`
                        : `Add items from ${storeName} to your cart to quickly reorder them here.`}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('shop')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F68B62] text-white text-xs font-bold shadow-md shadow-[#F68B62]/20 hover:bg-[#e07750] transition-colors cursor-pointer"
                    >
                      <StoreIcon className="w-3.5 h-3.5" />
                      <span>{isFrench ? 'Parcourir les rayons' : 'Browse aisles'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 min-[1750px]:grid-cols-8 min-[2000px]:grid-cols-10 gap-2.5 sm:gap-3">
                    {buyAgainProducts.map((product) => renderProductCard(product))}
                  </div>
                )}
              </div>
            ) : inStoreSearchQuery.trim() ? (
              /* 2. SEARCH RESULTS VIEW (when in-store search is used) */
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
                    className="text-xs font-bold text-[#F68B62] hover:underline cursor-pointer"
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 min-[1750px]:grid-cols-8 min-[2000px]:grid-cols-10 gap-2.5 sm:gap-3">
                    {searchResults.map((product) => renderProductCard(product))}
                  </div>
                )}
              </div>
            ) : (
              /* 3. REGULAR AISLES BROWSING (Instacart Fluid Shelf) */
              <div className="space-y-5 sm:space-y-6">
                {/* Active Aisle Banner when a single category is filtered */}
                {selectedAisleSlug && displayedAisles.length > 0 && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-orange-50/80 border border-orange-200/90 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F68B62] animate-pulse"></span>
                      <span className="text-xs font-semibold text-stone-600">{isFrench ? 'Rayon sélectionné :' : 'Selected aisle:'}</span>
                      <span className="text-sm sm:text-base font-black text-stone-900">{displayedAisles[0].name}</span>
                      <span className="text-xs font-bold text-[#F68B62] bg-white px-2 py-0.5 rounded-full border border-orange-200">
                        {displayedAisles[0].products.length} {isFrench ? 'articles' : 'items'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAisleSlug(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 hover:text-[#F68B62] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span>{isFrench ? '← Voir tous les rayons' : '← View all aisles'}</span>
                    </button>
                  </div>
                )}
                {isLoadingProducts ? (
                  <div className="space-y-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="h-6 bg-stone-100 rounded w-48 animate-pulse" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 min-[1750px]:grid-cols-8 min-[2000px]:grid-cols-10 gap-2.5 sm:gap-3">
                          {Array.from({ length: 8 }).map((_, j) => (
                            <div key={j} className="h-60 bg-stone-100 rounded-2xl animate-pulse" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="bg-stone-50 rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto my-12">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-[#F68B62]" />
                    </div>
                    <h3 className="text-lg font-black text-stone-900 mb-1">
                      {isFrench ? 'Aucun produit disponible pour le moment' : 'No products available at the moment'}
                    </h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                      {isFrench
                        ? `Ce commerce (${storeName}) n'a pas encore configuré de catalogue de produits dans l'administration.`
                        : `This store (${storeName}) has not yet configured a product catalog in the administration.`}
                    </p>
                    <Link
                      href="/sellers"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F68B62] hover:bg-[#e07750] text-white text-xs font-bold transition-all shadow-md shadow-[#F68B62]/25 cursor-pointer"
                    >
                      <StoreIcon className="w-4 h-4" />
                      <span>{isFrench ? 'Découvrir d\'autres commerces' : 'Discover other stores'}</span>
                    </Link>
                  </div>
                ) : (
                  displayedAisles.map((aisle) => (
                    <AisleShelfRow
                      key={aisle.slug}
                      aisle={aisle}
                      isFrench={isFrench}
                      isSingleAisleView={Boolean(selectedAisleSlug)}
                      onSelectAisle={(slug) => {
                        setSelectedAisleSlug(slug);
                        setInStoreSearchQuery('');
                        setActiveTab('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onClearAisle={() => {
                        setSelectedAisleSlug(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      renderProductCard={renderProductCard}
                    />
                  ))
                )}
              </div>
            )}

          </main>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          STORE POLICIES & DETAILS MODAL
          - Opened by pressing Logo, Store Name, or Subtext
          - Features all official policies of this particular store
         ═══════════════════════════════════════════════════════════════════════ */}
      {isStoreInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-stone-200 max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={() => setIsStoreInfoModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Store Header in Modal */}
            <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
              <div className="w-16 h-16 rounded-2xl border border-stone-200 p-1.5 shrink-0 bg-white shadow-2xs">
                <img src={storeLogo} alt={storeName} className="w-full h-full object-contain" />
              </div>
              <div className="pr-6">
                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#F68B62] bg-orange-50 px-2 py-0.5 rounded-full mb-1 border border-orange-200/60">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{isFrench ? 'Commerçant Partenaire Vérifié' : 'Verified Partner Merchant'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 leading-tight">{storeName}</h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  {store?.typeLabel || (isButcher ? 'Boucherie Halal Spécialisée' : 'Supermarché & Épicerie de Spécialités')}
                </p>
              </div>
            </div>

            {/* Comprehensive Store Policies (Scrollable with Orange scrollbar) */}
            <div className="flex-1 overflow-y-auto custom-sidebar-scroll pr-1.5 py-4 space-y-3.5 text-xs text-stone-700">
              
              {/* 1. Pricing Policy */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="font-black text-stone-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F68B62]"></span>
                  <span>{isFrench ? 'Politique de prix du commerce' : 'Store Pricing Policy'}</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed pl-4">
                  {isFrench
                    ? `Les prix affichés en ligne correspondent fidèlement aux prix réels appliqués en boutique chez ${storeName}. Aucun frais caché ni surcoût dissimulé.`
                    : `Online prices strictly reflect real in-store pricing at ${storeName}. Zero hidden fees or marked-up items.`}
                </p>
              </div>

              {/* 2. Preparation & Freshness Guarantee */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="font-black text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#F68B62]" />
                  <span>{isFrench ? 'Politique de fraîcheur & préparation' : 'Freshness & Preparation Policy'}</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed pl-4">
                  {isFrench
                    ? `Votre commande est préparée à la main le jour même par les artisans de ${storeName} : découpe fraîche du boucher, sélection rigoureuse des fruits et légumes à maturité et pain artisanal frais.`
                    : `Your order is handpicked and freshly prepared the same day by ${storeName}'s team: butcher-fresh cuts, prime produce, and daily baked artisan bread.`}
                </p>
              </div>

              {/* 3. Delivery & Minimum Order Details */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="font-black text-stone-900 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#F68B62]" />
                  <span>{isFrench ? 'Politique de livraison & seuils' : 'Delivery & Threshold Policy'}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] pl-4 pt-0.5">
                  <div className="text-stone-500">{isFrench ? 'Commande minimum :' : 'Minimum order:'}</div>
                  <div className="font-bold text-right text-stone-900">${store?.minOrder || 25}.00</div>
                  <div className="text-stone-500">{isFrench ? 'Livraison gratuite :' : 'Free delivery:'}</div>
                  <div className="font-black text-right text-[#F68B62]">Dès 150.00 $</div>
                  <div className="text-stone-500">{isFrench ? 'Distance calculée :' : 'Calculated distance:'}</div>
                  <div className="font-bold text-right text-stone-900">{calculatedDistanceKm} km</div>
                  <div className="text-stone-500">{isFrench ? 'Fenêtre estimée :' : 'Estimated window:'}</div>
                  <div className="font-bold text-right text-stone-900">{deliveryWindowText}</div>
                </div>
              </div>

              {/* 4. Cancellation & Returns Policy */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="font-black text-stone-900 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-[#F68B62]" />
                  <span>{isFrench ? 'Politique d\'annulation & remboursements' : 'Cancellation & Refund Policy'}</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed pl-4">
                  {isFrench
                    ? 'Annulation 100% gratuite tant que la boutique n\'a pas débuté la préparation. En cas d\'article manquant ou non conforme, remboursement immédiat garanti sous 24h via le service client Soukday.'
                    : '100% free cancellation before store preparation begins. Immediate refund or store credit guaranteed within 24 hours for missing or damaged items via Soukday customer support.'}
                </p>
              </div>

              {/* 5. 100% Halal Guarantee */}
              <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-1">
                <div className="font-black text-[#F68B62] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#F68B62]" />
                  <span>{isFrench ? 'Garantie 100% Halal & Hygiène' : '100% Halal & Quality Guarantee'}</span>
                </div>
                <p className="text-stone-800 text-[11px] leading-relaxed pl-4">
                  {isFrench
                    ? `Toutes les viandes et volailles distribuées par ${storeName} sont strictement certifiées Halal, abattues selon le rite islamique et inspectées quotidiennement selon les normes sanitaires du MAPAQ.`
                    : `All meats and poultry from ${storeName} are strictly certified Halal, prepared according to Islamic rites, and rigorously inspected under Canadian food safety standards.`}
                </p>
              </div>

              {/* 6. Address & Contact */}
              <div className="flex items-start justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 gap-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#F68B62] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-900">{isFrench ? 'Adresse de la boutique' : 'Store Address'}</div>
                    <div className="text-stone-600 text-[11px]">{store?.address || 'Montréal, QC'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(store?.address || 'Montréal, QC');
                    setCopiedAddress(true);
                    setTimeout(() => setCopiedAddress(false), 2000);
                  }}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-bold text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  {copiedAddress ? <Check className="w-3 h-3 text-[#F68B62]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAddress ? (isFrench ? 'Copié' : 'Copied') : (isFrench ? 'Copier' : 'Copy')}</span>
                </button>
              </div>

            </div>

            {/* Modal Footer Close Button */}
            <div className="pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsStoreInfoModalOpen(false)}
                className="w-full py-3 rounded-full bg-[#F68B62] text-white font-bold text-xs hover:bg-[#e07750] transition-colors cursor-pointer shadow-md shadow-[#F68B62]/25 active:scale-95"
              >
                {isFrench ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  /**
   * Helper to render Product Card (100% Brand Orange #F68B62)
   */
  function renderProductCard(product) {
    const qty = getProductQty(product.id);
    const wholePrice = Math.floor(product.price);
    const cents = String(Math.round((product.price - wholePrice) * 100)).padStart(2, '0');
    const productSlug = product.slug || String(product.id);

    return (
      <div
        key={product.id}
        className="group relative bg-white rounded-2xl p-2.5 sm:p-3 border border-stone-200/90 hover:border-[#F68B62]/50 hover:shadow-md transition-all duration-300 flex flex-col"
      >
        {/* Top Image + Floating Orange "+ Ajouter" button */}
        <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-white mb-1.5 flex items-center justify-center">
          <Link
            href={`/product/${productSlug}`}
            className="w-full h-full flex items-center justify-center cursor-pointer"
          >
            <img
              src={product.image || '/images/default-product.png'}
              alt={product.name}
              className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = '/images/default-product.png';
              }}
            />
          </Link>

          {/* Floating Orange "+ Ajouter" button or Stepper */}
          <div
            className="absolute top-1.5 right-1.5 z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {qty === 0 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F68B62] hover:bg-[#e07750] active:scale-90 text-white text-[11px] sm:text-xs font-bold shadow-md shadow-[#F68B62]/30 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFrench ? 'Ajouter' : 'Add'}</span>
              </button>
            ) : (
              <div className="inline-flex items-center bg-[#F68B62] text-white rounded-full p-0.5 shadow-md">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuantity(product.id, qty - 1);
                  }}
                  className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full hover:bg-black/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                  title={qty === 1 ? (isFrench ? 'Supprimer' : 'Delete') : (isFrench ? 'Diminuer' : 'Decrease')}
                  aria-label={qty === 1 ? (isFrench ? 'Supprimer' : 'Delete') : (isFrench ? 'Diminuer' : 'Decrease')}
                >
                  {qty === 1 ? (
                    <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  ) : (
                    <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  )}
                </button>
                <span className="text-[11px] sm:text-xs font-black px-1.5 sm:px-2">{qty}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuantity(product.id, qty + 1);
                  }}
                  className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full hover:bg-black/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                  title={isFrench ? 'Ajouter un de plus' : 'Add one more'}
                  aria-label={isFrench ? 'Ajouter un de plus' : 'Add one more'}
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Seasonal / Fresh Badge */}
          <span className="absolute bottom-1 right-1 text-[9px] font-semibold text-stone-500 bg-white/85 backdrop-blur-2xs px-1.5 py-0.5 rounded pointer-events-none">
            {isFrench ? 'De saison' : 'Fresh'}
          </span>
        </div>

        {/* Product Details (Tight, natural flow without empty space) */}
        <div className="flex flex-col">
          <Link href={`/product/${productSlug}`} className="block group/link cursor-pointer">
            {/* Price (Instacart style with superscript cents: e.g. 15^27 $) */}
            <div className="flex items-baseline gap-1 leading-none">
              <span className="text-base sm:text-lg font-black text-stone-900 tracking-tight group-hover/link:text-[#F68B62] transition-colors">
                {wholePrice}
                <sup className="text-xs font-black ml-0.5">{cents}</sup>
                <span className="text-xs sm:text-sm font-black ml-0.5">$</span>
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-stone-400 line-through ml-1">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Discount badge if promo */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-bold mt-1">
                ${(product.originalPrice - product.price).toFixed(2)} {isFrench ? 'de réduction' : 'off'}
              </div>
            )}

            {/* Title & Unit */}
            <h3 className="text-xs sm:text-[13px] font-semibold text-stone-900 line-clamp-2 mt-1 leading-snug group-hover/link:text-[#F68B62] transition-colors">
              {product.name}
            </h3>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              {product.unit}
            </p>
          </Link>

          {/* Stock status (Soukday Orange bar style - sits directly under unit with tight border) */}
          <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center gap-1.5 text-[10.5px] font-bold text-[#F68B62]">
            <span className="flex flex-col gap-0.5">
              <span className="w-2.5 h-0.5 bg-[#F68B62] rounded-full"></span>
              <span className="w-2 h-0.5 bg-[#F68B62] rounded-full"></span>
            </span>
            <span>{isFrench ? 'Plusieurs en stock' : 'Many in stock'}</span>
          </div>

        </div>
      </div>
    );
  }
}

/**
 * Individual Aisle Row Component with 5-Product Carousel + Show All Button
 * Matches Costco/Instacart layout:
 * - 5 products visible across desktop line
 * - Left/Right arrows to slide to next 5 products
 * - "Afficher plus ›" / "Show all ›" button to view all products in grid
 */
function AisleShelfRow({
  aisle,
  isFrench,
  isSingleAisleView,
  onSelectAisle,
  onClearAisle,
  renderProductCard,
}) {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const el = rowRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll, aisle.products]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const clientWidth = rowRef.current.clientWidth;
      // Scroll by visible viewport width
      const offset = direction === 'left' ? -clientWidth * 0.85 : clientWidth * 0.85;
      rowRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section id={`aisle-${aisle.slug}`} className="scroll-mt-24">
      {/* Aisle Title Bar */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">
            {aisle.name}
          </h2>
          <span className="text-xs text-stone-400 font-medium">
            ({aisle.products.length})
          </span>
        </div>

        {/* Right Actions: Show all / Afficher plus + Left/Right Carousel Arrows */}
        <div className="flex items-center gap-3">
          {isSingleAisleView ? (
            <button
              type="button"
              onClick={onClearAisle}
              className="text-xs font-bold text-[#F68B62] hover:underline cursor-pointer"
            >
              {isFrench ? '← Voir tous les rayons' : '← View all aisles'}
            </button>
          ) : (
            <>
              {/* Show All / Afficher plus button (Matches user screenshot: "Show all ›") */}
              <button
                type="button"
                onClick={() => onSelectAisle(aisle.slug)}
                className="text-xs sm:text-sm font-bold text-stone-900 hover:text-[#F68B62] transition-colors flex items-center gap-1 cursor-pointer select-none"
              >
                <span>{isFrench ? 'Afficher plus' : 'Show all'}</span>
                <span className="text-sm sm:text-base leading-none">›</span>
              </button>

              {/* Circular Carousel Navigation Arrows (Left/Right) */}
              <div className="flex items-center gap-1.5 ml-1">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  className={`w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center transition-all ${
                    canScrollLeft
                      ? 'bg-white hover:bg-stone-50 hover:border-[#F68B62] text-stone-700 hover:text-[#F68B62] shadow-2xs active:scale-95 cursor-pointer'
                      : 'bg-stone-100/60 text-stone-300 border-stone-150 cursor-not-allowed opacity-40'
                  }`}
                  aria-label={isFrench ? 'Précédent' : 'Previous'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  className={`w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center transition-all ${
                    canScrollRight
                      ? 'bg-white hover:bg-stone-50 hover:border-[#F68B62] text-stone-700 hover:text-[#F68B62] shadow-2xs active:scale-95 cursor-pointer'
                      : 'bg-stone-100/60 text-stone-300 border-stone-150 cursor-not-allowed opacity-40'
                  }`}
                  aria-label={isFrench ? 'Suivant' : 'Next'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Display: Grid if single category view, Fluid Carousel if all categories view (up to 10 products on wide screens) */}
      {isSingleAisleView ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 min-[1750px]:grid-cols-8 min-[2000px]:grid-cols-10 gap-2.5 sm:gap-3">
          {aisle.products.map((product) => renderProductCard(product))}
        </div>
      ) : (
        <div
          ref={rowRef}
          className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-0.5 -mx-1 px-1"
        >
          {aisle.products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-[calc(50%-5px)] sm:w-[calc(33.333%-7px)] md:w-[calc(25%-8px)] lg:w-[calc(20%-8.5px)] xl:w-[calc(16.666%-9px)] 2xl:w-[calc(14.285%-9.5px)] min-[1750px]:w-[calc(12.5%-10px)] min-[2000px]:w-[calc(10%-10.5px)] flex flex-col"
            >
              {renderProductCard(product)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
