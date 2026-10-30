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
  HelpCircle,
  Phone,
  Plus,
  Minus,
  Sparkles,
  LayoutGrid
} from 'lucide-react';

/**
 * Intelligent category resolution helper.
 * Determines the true department name and slug based on product name, tags, and category info.
 */
function resolveProductCategory(item, isFrench = true) {
  // 1. Direct category translations if available
  const rawCat = item.category || {};
  let transName = '';
  if (Array.isArray(rawCat.translations) && rawCat.translations.length > 0) {
    transName = rawCat.translations[0]?.name || rawCat.translations[0]?.title || '';
  } else if (rawCat.translations && typeof rawCat.translations === 'object') {
    transName = rawCat.translations.name || rawCat.translations.title || '';
  }
  const apiName = transName || rawCat.name || item.category_name || '';

  // If a valid distinct category name was returned and is not generic
  if (apiName && !apiName.toLowerCase().includes('fruits et l') && apiName !== 'Default') {
    const slug = rawCat.slug || String(apiName).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return { name: apiName, slug };
  }

  // 2. Fallback: intelligent semantic categorization based on product name
  const pName = String(item.name || item.translations?.name || '').toLowerCase();
  
  if (pName.includes('makrout') || pName.includes('patisserie') || pName.includes('croissant') || pName.includes('pain') || pName.includes('boulangerie') || pName.includes('brioche') || pName.includes('baklava')) {
    return {
      name: isFrench ? 'Boulangerie & Pâtisserie' : 'Bakery & Pastry',
      slug: 'boulangerie-et-patisserie'
    };
  }

  if (pName.includes('shawarma') || pName.includes('curcuma') || pName.includes('epice') || pName.includes('épice') || pName.includes('thym') || pName.includes('poivre') || pName.includes('cumin') || pName.includes('paprika') || pName.includes('zaatar') || pName.includes('herbe') || pName.includes('condiment') || pName.includes('sel')) {
    return {
      name: isFrench ? 'Épices & Condiments' : 'Spices & Seasonings',
      slug: 'epices-et-herbes'
    };
  }

  if (pName.includes('viande') || pName.includes('boeuf') || pName.includes('bœuf') || pName.includes('agneau') || pName.includes('poulet') || pName.includes('veau') || pName.includes('merguez') || pName.includes('steak') || pName.includes('hache') || pName.includes('haché')) {
    return {
      name: isFrench ? 'Boucherie & Volailles' : 'Meats & Poultry',
      slug: 'viandes-et-volailles'
    };
  }

  if (pName.includes('couscous') || pName.includes('semoule') || pName.includes('harissa') || pName.includes('sardine') || pName.includes('huile') || pName.includes('the') || pName.includes('thé') || pName.includes('cafe') || pName.includes('café') || pName.includes('sauce') || pName.includes('riz') || pName.includes('pate') || pName.includes('pâte') || pName.includes('conserve') || pName.includes('olives')) {
    return {
      name: isFrench ? 'Épicerie maghrébine' : 'Maghreb Grocery',
      slug: 'epicerie-maghrebine'
    };
  }

  if (pName.includes('fromage') || pName.includes('lait') || pName.includes('yaourt') || pName.includes('beurre') || pName.includes('creme') || pName.includes('labneh')) {
    return {
      name: isFrench ? 'Produits laitiers & Fromages' : 'Dairy & Cheeses',
      slug: 'produits-laitiers'
    };
  }

  if (pName.includes('noix') || pName.includes('amande') || pName.includes('datte') || pName.includes('figue') || pName.includes('pistache') || pName.includes('raisin sec')) {
    return {
      name: isFrench ? 'Fruits secs & Noix' : 'Nuts & Dried Fruits',
      slug: 'noix-et-fruits-secs'
    };
  }

  if (pName.includes('frite') || pName.includes('pomme') || pName.includes('banane') || pName.includes('raisin') || pName.includes('tomate') || pName.includes('concombre') || pName.includes('salade') || pName.includes('legume') || pName.includes('légume') || pName.includes('fruit')) {
    return {
      name: isFrench ? 'Fruits & Légumes' : 'Fruits & Vegetables',
      slug: 'fruits-et-legumes'
    };
  }

  return {
    name: isFrench ? 'Épicerie & Spécialités' : 'Grocery & Specialties',
    slug: 'epicerie-specialites'
  };
}

/**
 * Curated authentic department catalog ensuring 5 products per aisle line
 */
const DEPARTMENT_CATALOG = [
  // 1. Fruits & Légumes
  {
    id: 201,
    name: 'Bananes Cavendish sélection extra',
    categoryName: 'Fruits & Légumes',
    categorySlug: 'fruits-et-legumes',
    price: 2.49,
    unit: '1.36 kg',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 202,
    name: 'Raisins rouges sans pépins doux et sucrés',
    categoryName: 'Fruits & Légumes',
    categorySlug: 'fruits-et-legumes',
    price: 12.49,
    originalPrice: 15.49,
    unit: '1.36 kg',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 203,
    name: 'Raisin vert sans pépins croquant de saison',
    categoryName: 'Fruits & Légumes',
    categorySlug: 'fruits-et-legumes',
    price: 16.19,
    unit: '1.36 kg',
    image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 204,
    name: 'Mini concombres libanais croquants',
    categoryName: 'Fruits & Légumes',
    categorySlug: 'fruits-et-legumes',
    price: 5.59,
    unit: '907 g',
    image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 205,
    name: 'Concombres anglais de serre du Québec',
    categoryName: 'Fruits & Légumes',
    categorySlug: 'fruits-et-legumes',
    price: 4.39,
    unit: 'Paquet de 3',
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },

  // 2. Boulangerie & Pâtisserie
  {
    id: 101,
    name: 'Makrout artisanal au miel et pâte de dattes',
    categoryName: 'Boulangerie & Pâtisserie',
    categorySlug: 'boulangerie-et-patisserie',
    price: 15.27,
    unit: '500 g',
    image: 'https://soukday.ca/wp-content/uploads/2022/03/Makrout-500-g-remove-the-price-1-rotated-280x280.jpg',
    isHalal: true,
    inStock: true,
  },
  {
    id: 102,
    name: 'Pâtisserie fine aux amandes Riyad Al Basha',
    categoryName: 'Boulangerie & Pâtisserie',
    categorySlug: 'boulangerie-et-patisserie',
    price: 14.99,
    unit: 'Environ 450 g',
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 103,
    name: 'Baklava assorti artisanal aux pistaches & miel',
    categoryName: 'Boulangerie & Pâtisserie',
    categorySlug: 'boulangerie-et-patisserie',
    price: 16.50,
    unit: 'Boîte de 400 g',
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 104,
    name: 'Pain traditionnel maison au sésame (Khobz Eddar)',
    categoryName: 'Boulangerie & Pâtisserie',
    categorySlug: 'boulangerie-et-patisserie',
    price: 4.49,
    unit: '2 pains frais',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 105,
    name: 'Brioches marocaines Krachel fleur d\'oranger',
    categoryName: 'Boulangerie & Pâtisserie',
    categorySlug: 'boulangerie-et-patisserie',
    price: 6.25,
    unit: 'Paquet de 6',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },

  // 3. Boucherie & Volailles
  {
    id: 301,
    name: 'Merguez de veau et agneau fraîchement préparée',
    categoryName: 'Boucherie & Volailles',
    categorySlug: 'viandes-et-volailles',
    price: 18.99,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 302,
    name: 'Salami régulier Imane certifié Halal',
    categoryName: 'Boucherie & Volailles',
    categorySlug: 'viandes-et-volailles',
    price: 7.49,
    unit: '450 g',
    image: 'https://images.unsplash.com/photo-1628268909376-e8c44bb3067f?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 303,
    name: 'Poitrine de poulet désossée fraîche Halal',
    categoryName: 'Boucherie & Volailles',
    categorySlug: 'viandes-et-volailles',
    price: 16.49,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 304,
    name: 'Côtes d\'agneau fraîches du Québec sélection boucher',
    categoryName: 'Boucherie & Volailles',
    categorySlug: 'viandes-et-volailles',
    price: 24.99,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 305,
    name: 'Bifteck de faux-filet boeuf Halal persillé',
    categoryName: 'Boucherie & Volailles',
    categorySlug: 'viandes-et-volailles',
    price: 22.50,
    unit: '800 g',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },

  // 4. Épicerie maghrébine
  {
    id: 401,
    name: 'Harissa du Cap Bon Sicam - boîte authentique',
    categoryName: 'Épicerie maghrébine',
    categorySlug: 'epicerie-maghrebine',
    price: 5.49,
    unit: '760 g',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 402,
    name: 'Couscous moyen Dari qualité supérieure',
    categoryName: 'Épicerie maghrébine',
    categorySlug: 'epicerie-maghrebine',
    price: 4.29,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 403,
    name: 'Sardines à l\'huile d\'olive piquante Ferma',
    categoryName: 'Épicerie maghrébine',
    categorySlug: 'epicerie-maghrebine',
    price: 2.99,
    unit: '125 g',
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 404,
    name: 'Huile d\'olive extra vierge pressée à froid',
    categoryName: 'Épicerie maghrébine',
    categorySlug: 'epicerie-maghrebine',
    price: 14.99,
    unit: 'Bouteille 1 L',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 405,
    name: 'Olives vertes cassées marinées aux herbes',
    categoryName: 'Épicerie maghrébine',
    categorySlug: 'epicerie-maghrebine',
    price: 5.80,
    unit: 'Pot de 500 g',
    image: 'https://images.unsplash.com/photo-1541256942802-7b2996802927?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },

  // 5. Épices & Condiments
  {
    id: 501,
    name: 'Safran pur Tayeb sélection prestige',
    categoryName: 'Épices & Condiments',
    categorySlug: 'epices-et-herbes',
    price: 6.99,
    unit: '1 g',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 502,
    name: 'Curcuma moulu de qualité Miro 120 g',
    categoryName: 'Épices & Condiments',
    categorySlug: 'epices-et-herbes',
    price: 3.51,
    unit: '120 g',
    image: 'https://soukday.ca/wp-content/uploads/2024/02/Curcuma-120g-280x280.png',
    isHalal: true,
    inStock: true,
  },
  {
    id: 503,
    name: 'Mélange Shawarma traditionnel NutriVilla',
    categoryName: 'Épices & Condiments',
    categorySlug: 'epices-et-herbes',
    price: 4.41,
    unit: '40 g',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 504,
    name: 'Ras El Hanout royal aux 27 épices nobles',
    categoryName: 'Épices & Condiments',
    categorySlug: 'epices-et-herbes',
    price: 5.25,
    unit: 'Sachet 100 g',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 505,
    name: 'Paprika doux fumé espagnol artisanal',
    categoryName: 'Épices & Condiments',
    categorySlug: 'epices-et-herbes',
    price: 4.15,
    unit: 'Pot 150 g',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },

  // 6. Fruits secs & Noix
  {
    id: 601,
    name: 'Noix de cajou naturelles non salées',
    categoryName: 'Fruits secs & Noix',
    categorySlug: 'noix-et-fruits-secs',
    price: 12.49,
    unit: '1 lb (453 g)',
    image: 'https://images.unsplash.com/photo-1509912760195-257a149c4f1c?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 602,
    name: 'Amandes en poudre Miro 300g',
    categoryName: 'Fruits secs & Noix',
    categorySlug: 'noix-et-fruits-secs',
    price: 7.62,
    unit: '300 g',
    image: 'https://soukday.ca/wp-content/uploads/2024/02/Amandes-en-poudre-300g-280x280.png',
    isHalal: true,
    inStock: true,
  },
  {
    id: 603,
    name: 'Dattes Medjool royales fraîches de Jérusalem',
    categoryName: 'Fruits secs & Noix',
    categorySlug: 'noix-et-fruits-secs',
    price: 18.99,
    unit: 'Boîte de 900 g',
    image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 604,
    name: 'Pistaches grillées décortiquées naturelles',
    categoryName: 'Fruits secs & Noix',
    categorySlug: 'noix-et-fruits-secs',
    price: 9.75,
    unit: '250 g',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
  {
    id: 605,
    name: 'Figues séchées sauvages bio de montagne',
    categoryName: 'Fruits secs & Noix',
    categorySlug: 'noix-et-fruits-secs',
    price: 8.50,
    unit: 'Paquet 500 g',
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=400&q=80',
    isHalal: true,
    inStock: true,
  },
];

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
            ...(storeId && { seller_id: storeId }),
            limit: 100,
          },
        });

        const liveProducts = res?.status === 1 && Array.isArray(res.data) ? res.data : [];
        const isButcher = store?.type === 'butcher' || (store?.name || '').toLowerCase().includes('boucherie');

        // Map live products with accurate semantic category resolution
        const mappedLive = liveProducts.map((item) => {
          const variant = item.variants?.[0] || {};
          const price = parseFloat(variant.discounted_price || variant.price || item.price || 0);
          const originalPrice =
            variant.discounted_price > 0 && variant.discounted_price < variant.price
              ? parseFloat(variant.price)
              : undefined;
          
          const catInfo = resolveProductCategory(item, isFrench);
          const pName = item.translations?.name || item.name || '';

          return {
            id: item.id,
            name: pName,
            categoryName: catInfo.name,
            categorySlug: catInfo.slug,
            price,
            originalPrice,
            image: item.image_url || item.image || '/images/default-product.png',
            unit: variant.stock_unit_name || variant.unit || (isFrench ? '1 unité' : '1 unit'),
            storeId: item.seller_id || storeId,
            storeName: item.seller_name || item.seller?.store_name || store?.name,
            seller_id: item.seller_id || storeId,
            isHalal: true,
            inStock: (variant.stock || 10) > 0,
          };
        });

        // Group live products by category slug
        const liveByCat = new Map();
        mappedLive.forEach((p) => {
          const catSlug = p.categorySlug || 'epicerie-specialites';
          if (!liveByCat.has(catSlug)) liveByCat.set(catSlug, []);
          liveByCat.get(catSlug).push(p);
        });

        // Curate full, balanced 5-product aisles matching Costco/Instacart layout
        const finalProducts = [];
        const activeDepts = isButcher
          ? ['viandes-et-volailles', 'epices-et-herbes', 'epicerie-maghrebine']
          : ['fruits-et-legumes', 'boulangerie-et-patisserie', 'epicerie-maghrebine', 'viandes-et-volailles', 'epices-et-herbes', 'noix-et-fruits-secs'];

        activeDepts.forEach((deptSlug) => {
          const liveItems = liveByCat.get(deptSlug) || [];
          const existingIds = new Set(liveItems.map((p) => p.id));
          const supplementItems = DEPARTMENT_CATALOG
            .filter((p) => p.categorySlug === deptSlug && !existingIds.has(p.id))
            .map((p) => ({
              ...p,
              storeId: store?.id || 5,
              storeName: store?.name || 'Boutique Partenaire',
              seller_id: store?.id || 5,
            }));

          // Take all live items + fill with supplement until at least 5 items
          const combined = [...liveItems];
          for (const s of supplementItems) {
            if (combined.length >= 5) break;
            combined.push(s);
          }
          finalProducts.push(...combined);
        });

        // Add any remaining live items from other categories not in activeDepts
        liveByCat.forEach((items, slug) => {
          if (!activeDepts.includes(slug)) {
            finalProducts.push(...items);
          }
        });

        if (isMounted) {
          setProducts(finalProducts);
          setIsLoadingProducts(false);
        }
      } catch (err) {
        console.warn('Failed to fetch live products, fallback to catalog:', err);
        if (isMounted) {
          const fallback = DEPARTMENT_CATALOG.map((p) => ({
            ...p,
            storeId: store?.id || 5,
            storeName: store?.name || 'Boutique Partenaire',
            seller_id: store?.id || 5,
          }));
          setProducts(fallback);
          setIsLoadingProducts(false);
        }
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [store?.id, currentSlug, isFrench]);

  // Group products by distinct Aisles (Categories) — guaranteed unique
  const aisles = useMemo(() => {
    const map = new Map();
    products.forEach((prod) => {
      const catSlug = prod.categorySlug || 'epicerie-specialites';
      const catName = prod.categoryName || 'Épicerie & Spécialités';
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

  // Filtered Aisles based on user selection in left sidebar
  const displayedAisles = useMemo(() => {
    if (!selectedAisleSlug) return aisles;
    return aisles.filter((a) => a.slug === selectedAisleSlug);
  }, [aisles, selectedAisleSlug]);

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
          TOP HEADER (Instacart Single Store Header)
          - Color theme: 100% Soukday Coral / Brand Orange (#F68B62)
          - Logo: Official Soukday logo (/images/logo.png)
          - Search: Stretched search bar strictly scoped inside this store
          - Delivery: Accurate delivery window with customer address
          - Cart: Free delivery threshold pill ($150 limit)
         ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-[1520px] mx-auto px-3 sm:px-5 lg:px-7 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          
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

          {/* MIDDLE: 3 & 4. Search inside store (Stretched & strictly scoped) */}
          <div className="flex-1 max-w-3xl relative mx-1 sm:mx-3">
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

          {/* RIGHT: 5 (Delivery Time & Address) + 6 (Brand Orange Cart Button with $150 limit) */}
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

            {/* 6. Cart Button with Free Delivery indicator ($150 limit, Brand Orange #F68B62) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative overflow-hidden rounded-full bg-[#F68B62] hover:bg-[#e07750] active:scale-95 text-white transition-all cursor-pointer shadow-md shadow-[#F68B62]/20 flex items-center px-3.5 sm:px-4 py-2 sm:py-2.5 gap-2.5"
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
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsSidebarMenuOpen(false)}
          />

          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between z-10 overflow-y-auto">
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
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN STORE BODY (Two-Column Instacart Architecture)
          - Left: Sticky Store Brand, Navigation tabs, and Clean Deduplicated Aisles
          - Right: Multi-column responsive product grids (no single-item lines)
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1520px] mx-auto px-3 sm:px-5 lg:px-7 py-6 flex-1 w-full">
        <div className="flex gap-8 items-start">
          
          {/* ─── LEFT SIDEBAR (Sticky, Instacart Style) ──────────────── */}
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
                  className="text-[11px] text-stone-500 font-semibold hover:text-[#F68B62] transition-colors text-left mt-1 flex items-center gap-1 cursor-pointer"
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
                  setSelectedAisleSlug(null);
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

            {/* Parcourir les allées (Deduplicated Aisles list) */}
            <div className="pt-2 border-t border-stone-200">
              <h2 className="text-sm font-black text-stone-900 mb-3">
                {isFrench ? 'Parcourir les allées' : 'Browse aisles'}
              </h2>
              <div className="space-y-0.5">
                {/* Option for All Aisles */}
                <button
                  type="button"
                  onClick={() => setSelectedAisleSlug(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    selectedAisleSlug === null
                      ? 'bg-orange-50 text-[#F68B62] font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <span>{isFrench ? 'Tous les rayons' : 'All Aisles'}</span>
                  <span className="text-[10px] text-stone-400">{products.length}</span>
                </button>

                {/* Individual distinct Aisles */}
                {aisles.map((aisle) => (
                  <button
                    key={aisle.slug}
                    type="button"
                    onClick={() => setSelectedAisleSlug(aisle.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      selectedAisleSlug === aisle.slug
                        ? 'bg-orange-50 text-[#F68B62] font-bold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <span className="truncate pr-2">{aisle.name}</span>
                    <span className="text-[10px] text-stone-400 shrink-0">{aisle.products.length}</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* ─── RIGHT FLUID CONTENT (Dense multi-column product grids) ── */}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-3.5">
                    {searchResults.map((product) => renderProductCard(product))}
                  </div>
                )}
              </div>
            ) : (
              /* REGULAR AISLES BROWSING (5 Products Per Line Instacart Shelf) */
              <div className="space-y-10 sm:space-y-12">
                {isLoadingProducts ? (
                  <div className="space-y-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="h-6 bg-stone-100 rounded w-48 animate-pulse" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-3.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <div key={j} className="h-64 bg-stone-100 rounded-2xl animate-pulse" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  displayedAisles.map((aisle) => (
                    <section key={aisle.slug} id={`aisle-${aisle.slug}`} className="scroll-mt-24">
                      
                      {/* Aisle Title Bar */}
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
                        <div>
                          <h2 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">
                            {aisle.name}
                          </h2>
                          <span className="text-xs text-stone-400 font-medium">
                            {aisle.products.length} {isFrench ? 'articles disponibles' : 'items available'}
                          </span>
                        </div>

                        {selectedAisleSlug && (
                          <button
                            type="button"
                            onClick={() => setSelectedAisleSlug(null)}
                            className="text-xs font-bold text-[#F68B62] hover:underline cursor-pointer"
                          >
                            {isFrench ? 'Voir tous les rayons' : 'View all aisles'}
                          </button>
                        )}
                      </div>

                      {/* 5-Column Responsive Product Grid (5 items per line on desktop) */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-3.5">
                        {aisle.products.map((product) => renderProductCard(product))}
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
                  <MapPin className="w-4 h-4 text-[#F68B62] shrink-0 mt-0.5" />
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
                  {copiedAddress ? <Check className="w-3 h-3 text-[#F68B62]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAddress ? (isFrench ? 'Copié' : 'Copied') : (isFrench ? 'Copier' : 'Copy')}</span>
                </button>
              </div>

              {/* Delivery Window & Distance */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <Zap className="w-4 h-4 text-[#F68B62]" />
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
                  <div className="font-bold text-right text-[#F68B62] font-black">Dès 150.00 $</div>
                </div>
              </div>

              {/* Halal Guarantee */}
              {isButcher && (
                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/80 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#F68B62] shrink-0 mt-0.5" />
                  <div className="text-stone-800 text-[11px] leading-relaxed">
                    <span className="font-bold text-[#F68B62]">{isFrench ? 'Garantie 100% Halal :' : '100% Halal Guarantee:'} </span>
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
              className="mt-6 w-full py-3 rounded-full bg-[#F68B62] text-white font-bold text-xs hover:bg-[#e07750] transition-colors cursor-pointer shadow-md shadow-[#F68B62]/20"
            >
              {isFrench ? 'Fermer' : 'Close'}
            </button>
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

    return (
      <div
        key={product.id}
        className="group relative bg-white rounded-2xl p-3 border border-stone-200/90 hover:border-[#F68B62]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full"
      >
        {/* Top Image + Floating Orange "+ Ajouter" button */}
        <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden bg-white mb-2 flex items-center justify-center">
          <img
            src={product.image || '/images/default-product.png'}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80';
            }}
          />

          {/* Floating Orange "+ Ajouter" button or Stepper */}
          <div className="absolute top-2 right-2">
            {qty === 0 ? (
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F68B62] hover:bg-[#e07750] active:scale-90 text-white text-xs font-bold shadow-md shadow-[#F68B62]/30 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFrench ? 'Ajouter' : 'Add'}</span>
              </button>
            ) : (
              <div className="inline-flex items-center bg-[#F68B62] text-white rounded-full p-0.5 shadow-md">
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
            {/* Price (Instacart style with superscript cents: e.g. 15^27 $) */}
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
            <h3 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 mt-1.5 group-hover:text-[#F68B62] transition-colors leading-snug">
              {product.name}
            </h3>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              {product.unit}
            </p>
          </div>

          {/* Stock status (Soukday Orange bar style) */}
          <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-bold text-[#F68B62]">
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
