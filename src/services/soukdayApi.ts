import { Store, Category, Product, UserAddress, LiveWebSettings } from '../types';
import { getTranslatedCategoryName } from '../utils/categoryTranslation';
import { DEFAULT_CATEGORIES, STORES } from '../data/mockData';

export const DEFAULT_LIVE_SETTINGS = {
  siteTitle: 'Soukday - Épiceries orientales & Boucheries Halal',
  websiteUrl: 'https://soukday.ca',
  color: '#F68B62',
  lightColor: '#FCEFEA',
  darkColor: '#1c1917',
  favicon: '',
  webLogo: '/images/logo.png',
  webHeaderLogo: '/images/logo.png',
  webFooterLogo: '/images/logo.png',
  placeholderImage: '',
  loading: '',

  headerAnnouncementText: 'Épicerie Soukday expédiée partout au Canada et vers les États-Unis éligibles !',
  headerAnnouncementTag: 'Nouveau',
  headerPartnerText: 'Devenir vendeur partenaire',
  headerPartnerUrl: 'https://admin.soukday.ca/#/seller/register',
  headerSupportText: 'Support client 7j/7',
  headerSupportPhone: '',

  heroTagline: 'Votre marché oriental & local à portée de clic',
  heroTitle: 'Vos épiceries fines & boucheries locales livrées à votre porte.',
  heroSubtitle: 'Entrez votre code postal pour découvrir les boucheries halal et magasins qui livrent chez vous. Les produits d’épicerie directe Soukday sont expédiés partout au Canada et aux États-Unis !',
  heroBadge1: 'Livraison le jour même',
  heroBadge2: 'Boucheries 100% Halal',
  heroBadge3: 'Épicerie Canada & USA',

  directGroceryTag: 'Expédition Nationale & Internationale',
  directGroceryTitle: 'Épicerie Directe Soukday',
  directGroceryDescription: 'Les produits d’épicerie fine vendus directement par Soukday peuvent être expédiés partout au Canada (10 provinces) et vers les destinations éligibles aux États-Unis. Emballage soigné, arrivages réguliers et marques authentiques.',
  directGroceryFeature1Title: 'Canada & USA',
  directGroceryFeature1Subtitle: 'Postes Canada / UPS',
  directGroceryFeature2Title: 'Fraîcheur 100%',
  directGroceryFeature2Subtitle: 'Garantie Soukday',

  butcherSectionTag: 'Viandes fraîches & artisanales',
  butcherSectionTitle: 'Vos boucheries halal à proximité',
  butcherSectionSubtitle: 'Choisissez parmi les boucheries disponibles dans votre secteur.',

  otherStoresSectionTag: 'Commerces de proximité & Supermarchés',
  otherStoresSectionTitle: 'Autres magasins disponibles',
  otherStoresSectionSubtitle: 'Supermarchés orientaux, pâtisseries fines, épiceries de quartier et traiteurs pour votre adresse',

  appBannerTitle: "Get the full Soukday experience",
  appBannerSubtitle: "Scan the QR code with your camera. First delivery is free.",
  appBannerImage: "/images/soukday-app-experience.png",
  appBannerQrUrl: "https://soukday.ca",

  footerAboutText: 'Soukday est la première plateforme au Québec dédiée aux épiceries orientales, boucheries halal certifiées et commerces de spécialités avec livraison locale et expédition nationale.',
  footerEmail: 'support@soukday.ca',
  footerPhone: '+1 (514) 000-0000',
  copyrightDetails: '© 2026 Soukday Inc. Tous droits réservés. Plateforme de commerce multi-vendeurs.',
};

export const SOUKDAY_OFFICIAL_SELLER_ID = 11;
export const SOUKDAY_OFFICIAL_SELLER_SLUG = 'soukday-epicerie-directe';

/**
 * Strict validator: ensures that only official Soukday products can ever enter
 * the dedicated Soukday grocery section.
 * Absolutely NO other vendor ID, outside store, or third-party product can pass.
 */
export function isDedicatedSoukdayProduct(product: any): boolean {
  if (!product) return false;

  // 1. Seller ID check: MUST be 11 (or 0 for admin direct).
  // Any other seller ID (e.g. 12, 13, 1, 2, 4...) is strictly rejected.
  const sellerId = Number(product.seller_id ?? product.storeId ?? product.seller?.id ?? -1);
  if (sellerId !== SOUKDAY_OFFICIAL_SELLER_ID && sellerId !== 0) {
    return false;
  }

  // 2. Store name check: if provided, it must not belong to an outside vendor
  const storeName = String(
    product.storeName ?? 
    product.seller?.translations?.store_name ?? 
    product.seller?.store_name ?? 
    product.seller?.name ?? 
    ''
  ).toLowerCase().trim();

  if (storeName) {
    const isSoukdayName = 
      storeName.includes('soukday') || 
      storeName.includes('épicerie directe') || 
      storeName.includes('epicerie directe');
    if (!isSoukdayName) {
      return false;
    }
  }

  // 3. Seller slug check: if provided, must belong to Soukday
  const sellerSlug = String(product.sellerSlug ?? product.seller?.slug ?? '').toLowerCase().trim();
  if (sellerSlug && sellerSlug !== SOUKDAY_OFFICIAL_SELLER_SLUG && !sellerSlug.includes('soukday')) {
    return false;
  }

  return true;
}

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes('127.0.0.1') && !envUrl.includes('localhost') && envUrl.startsWith('http')) {
    return envUrl;
  }
  return 'https://admin.soukday.ca';
};

const API_BASE_URL = getApiBaseUrl();
const ACCESS_KEY = '903361';

function parseLocalized(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (parsed && typeof parsed === 'object') {
        return parsed.fr || parsed.en || Object.values(parsed)[0] || val;
      }
    } catch {
      return val;
    }
  }
  if (typeof val === 'object') {
    return val.fr || val.en || Object.values(val)[0] || '';
  }
  return String(val);
}

function resolveImageUrl(url?: string): string {
  if (!url) return '';
  // Fix double prepended storage urls like http://127.0.0.1:8000/storage/https://images.unsplash...
  const doubleUrlMatch = url.match(/(?:https?:\/\/[^\/]+)?\/storage\/(https?:\/\/.+)/i);
  if (doubleUrlMatch) {
    return doubleUrlMatch[1];
  }
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const clean = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE_URL}${clean}`;
}

export function getCategoryIcon(slug: string): string {
  const map: Record<string, string> = {
    'viandes-et-volailles': '🥩',
    'boucherie-halal': '🥩',
    'boucherie-halal-fraiche': '🥩',
    'epicerie-maghrebine': '🫒',
    'epicerie-orientale': '🏺',
    'boulangerie-et-patisserie': '🥐',
    'boulangerie-patisserie': '🥐',
    'fruits-et-legumes': '🥬',
    'fruits-legumes-frais': '🥬',
    'poissons-et-fruits-de-mer': '🐟',
    'epices-et-herbes': '🌶️',
    'epices-fruits-secs': '🌶️',
    'noix-et-fruits-secs': '🥜',
    'plats-cuisines': '🍲',
    'surgeles-plats-prepares': '❄️',
    'produits-laitiers-fromages': '🧀',
    'thes-cafes-boissons': '☕',
  };
  return map[slug] || '🛒';
}

export function getCategoryImage(slug: string): string {
  const map: Record<string, string> = {
    'viandes-et-volailles': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80',
    'boucherie-halal': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=400&q=80',
    'boucherie-halal-fraiche': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=400&q=80',
    'epicerie-maghrebine': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    'epicerie-orientale': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
    'boulangerie-et-patisserie': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    'boulangerie-patisserie': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    'fruits-et-legumes': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
    'fruits-legumes-frais': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
    'poissons-et-fruits-de-mer': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=400&q=80',
    'epices-et-herbes': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
    'noix-et-fruits-secs': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80',
    'epices-fruits-secs': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
    'plats-cuisines': 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&q=80',
    'produits-laitiers-fromages': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80',
    'thes-cafes-boissons': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
    'surgeles-plats-prepares': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
  };
  return map[slug] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
}

export function getStoreImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('boucherie') || n.includes('viande') || n.includes('atlas') || n.includes('berbere')) {
    return 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80';
  }
  if (n.includes('patisserie') || n.includes('boulangerie') || n.includes('al-sham')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
}

export function formatProductUnitAndWeight(name: string, rawUnit?: any, measurement?: any): { unit: string; weightOrVolume?: string } {
  const regex = /(?:^|[\s\-,(])(\d+(?:[.,]\d+)?\s*(?:kg|g|lb|lbs|oz|ml|cl|l|litres?|feuilles?|unités?|pièces?|morceaux?|sachets?|capsules?|canettes?))\b/i;
  const match = name.match(regex);
  if (match) {
    let clean = match[1].trim();
    clean = clean.replace(/^(\d+(?:[.,]\d+)?)([a-zA-Z\u00C0-\u017F]+)$/, '$1 $2');
    return { unit: clean, weightOrVolume: undefined };
  }

  const unitStr = (typeof rawUnit === 'string' ? rawUnit.toLowerCase().trim() : '') || '';
  if (unitStr === 'u' || unitStr === 'unit' || unitStr === 'unite' || unitStr === 'unité' || !unitStr) {
    const qty = parseInt(measurement, 10) || 1;
    return {
      unit: qty > 1 ? `${qty} unités` : '1 unité',
      weightOrVolume: undefined,
    };
  }

  if (unitStr === 'kg' || unitStr === 'g' || unitStr === 'lb' || unitStr === 'ml' || unitStr === 'l') {
    const qty = measurement || 1;
    return {
      unit: `${qty} ${unitStr}`,
      weightOrVolume: undefined,
    };
  }

  return {
    unit: (measurement ? `${measurement} ` : '') + unitStr,
    weightOrVolume: undefined,
  };
}

export async function fetchLiveCategories(lang: string = 'fr'): Promise<Category[]> {
  const isFr = (lang || 'fr').toLowerCase() === 'fr';
  try {
    const res = await fetch(`${API_BASE_URL}/customer/categories?lang=${lang}`, {
      headers: {
        'Accept': 'application/json',
        'x-access-key': ACCESS_KEY,
        'Content-Language': lang,
        'lang': lang,
        'X-Module-Id': '1',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    if (json.status === 1 && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item: any) => {
        const resolved = resolveImageUrl(item.image_url || item.image || item.web_image);
        const validImg = resolved && resolved.trim() !== '' ? resolved : getCategoryImage(item.slug);
        const rawName = item.translations?.name || item.name || (item.slug ? item.slug.replace(/-/g, ' ') : `Catégorie ${item.id}`);
        const categoryName = getTranslatedCategoryName({ ...item, name: rawName }, isFr);
        return {
          id: item.id,
          name: categoryName,
          slug: item.slug || `cat-${item.id}`,
          subtitle: item.translations?.subtitle || item.subtitle || '',
          icon: getCategoryIcon(item.slug),
          image: validImg,
          subcategories: (item.all_active_childs || []).map((sub: any) => ({
            id: sub.id,
            name: getTranslatedCategoryName(sub, isFr),
            slug: sub.slug,
            subtitle: sub.translations?.subtitle || '',
          })),
        };
      });
    }
  } catch (err) {
    console.error('Error fetching categories from API:', err);
  }
  return DEFAULT_CATEGORIES.map((c) => ({
    ...c,
    name: getTranslatedCategoryName(c, isFr),
  }));
}

export async function fetchLiveSellers(lat: number = 45.5017, lng: number = -73.5673): Promise<Store[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/sellers?latitude=${lat}&longitude=${lng}`, {
      headers: {
        'Accept': 'application/json',
        'x-access-key': ACCESS_KEY,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch sellers');
    const json = await res.json();
    if (json.status === 1 && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item: any) => {
        const storeName = typeof item.translations?.store_name === 'string' 
          ? item.translations.store_name 
          : (typeof item.translations?.name === 'string' 
              ? item.translations.name 
              : (typeof item.store_name === 'string' 
                  ? item.store_name 
                  : (typeof item.name === 'string' ? item.name : 'Boutique Partenaire')));
        const isButcher = storeName.toLowerCase().includes('boucherie');
        const logoUrl = resolveImageUrl(item.logo_url || item.logo || item.image);

        // Extract clean string category names from object array
        const rawCategories = Array.isArray(item.categories)
          ? item.categories.map((c: any) => {
              if (typeof c === 'string') return c;
              if (typeof c === 'object' && c !== null) {
                return c.translations?.name || c.name || '';
              }
              return '';
            }).filter(Boolean)
          : [];

        const categories = rawCategories.length > 0
          ? rawCategories.slice(0, 3)
          : (isButcher ? ['Boucherie Halal', 'Volailles', 'Bœuf & Agneau'] : ['Épicerie', 'Frais du jour']);

        const rawTags = Array.isArray(item.tags)
          ? item.tags.map((t: any) => typeof t === 'string' ? t : (t?.name || '')).filter(Boolean)
          : [];
        const tags = rawTags.length > 0 ? rawTags : (isButcher ? ['Halal Certifié', 'Viande Fraîche'] : ['Épicerie', 'Frais du jour']);

        return {
          id: item.id,
          name: storeName,
          slug: item.slug || `store-${item.id}`,
          type: isButcher ? 'butcher' : 'grocery',
          typeLabel: isButcher ? 'Boucherie Halal' : 'Supermarché & Épicerie',
          address: typeof item.street === 'string' ? item.street : (typeof item.formatted_address === 'string' ? item.formatted_address : 'Montréal, QC'),
          city: typeof item.city === 'object' ? (item.city?.name || 'Montréal') : (typeof item.city === 'string' ? item.city : 'Montréal'),
          state: item.state || 'QC',
          postalCode: item.pincode?.pincode || '',
          rating: 4.8,
          reviewsCount: 120,
          deliveryTime: item.delivery_time || '30-50 min',
          deliveryBy: typeof item.delivery_by === 'string' ? item.delivery_by : '12:00pm',
          deliveryFee: item.delivery_fee || 'Gratuite dès 50$',
          minOrder: item.min_order_amount || 25,
          distanceKm: parseFloat(item.distance || '3.5'),
          priceTier: typeof item.price_tier === 'string' ? item.price_tier : '$$',
          pickupReadyBy: typeof item.pickup_ready_by === 'string' ? item.pickup_ready_by : undefined,
          logo: logoUrl || (isButcher ? '/images/butchers/boucherie-zakiya.svg' : undefined),
          image: logoUrl || getStoreImage(storeName),
          categories,
          highlightBadge: isButcher ? '100% Halal' : undefined,
          badges: isButcher ? ['Découpe fraîche', 'Prix direct', 'Frais du jour'] : ['Prix bas', 'Frais du jour'],
          tags,
          isHalalCertified: isButcher,
          isOpenNow: true,
          hours: '09h00 - 21h00',
        };
      });
    }
  } catch (err) {
    console.warn('Live sellers fetch failed:', err);
  }
  return STORES;
}

export async function fetchLiveProducts(lat: number = 45.5017, lng: number = -73.5673): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-key': ACCESS_KEY,
      },
      body: JSON.stringify({ latitude: lat, longitude: lng, limit: 100 }),
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    if (json.status === 1 && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item: any) => {
        const variant = item.variants?.[0] || {};
        const sellerName = item.seller?.translations?.store_name || item.seller?.store_name || item.seller?.name || item.seller_name;
        const isSoukday = isDedicatedSoukdayProduct(item);
        const rawUnit = variant.stock_unit_name || (typeof variant.unit === 'object' ? variant.unit?.name : variant.unit) || 'u';
        const productName = item.translations?.name || item.name;
        const formattedUnits = formatProductUnitAndWeight(productName, rawUnit, variant.measurement);

        return {
          id: item.id,
          variantId: variant.id || item.id,
          variant_id: variant.id || item.id,
          name: productName,
          slug: item.slug || `product-${item.id}`,
          brand: item.brand?.name || 'Soukday',
          storeId: item.seller_id,
          seller_id: item.seller_id,
          storeName: sellerName || (isSoukday ? 'Soukday Épicerie Directe' : 'Boutique Partenaire'),
          storeType: isSoukday ? 'soukday_direct' : 'local_store',
          price: parseFloat(variant.discounted_price || variant.price || '0'),
          originalPrice: variant.discounted_price ? parseFloat(variant.price || '0') : undefined,
          unit: formattedUnits.unit,
          weightOrVolume: formattedUnits.weightOrVolume,
          image: resolveImageUrl(item.image_url) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
          categorySlug: item.category?.slug || 'epicerie-maghrebine',
          isPopular: true,
          isHalal: true,
          canShipNationwide: isSoukday,
          inStock: true,
        };
      });
    }
  } catch (err) {
    console.warn('Live products fetch failed:', err);
  }
  return [];
}

export async function fetchLiveSoukdayProducts(lang: string = 'fr'): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-key': ACCESS_KEY,
        'Content-Language': lang,
        'lang': lang,
        'X-Module-Id': '1',
      },
      body: JSON.stringify({ seller_id: SOUKDAY_OFFICIAL_SELLER_ID, sort: 'popular', limit: 100 }),
    });
    if (!res.ok) throw new Error('Failed to fetch Soukday direct products');
    const json = await res.json();
    if (json.status === 1 && Array.isArray(json.data) && json.data.length > 0) {
      return json.data
        .filter(isDedicatedSoukdayProduct)
        .map((item: any) => {
          const variant = item.variants?.[0] || {};
          const sellerName = 'Soukday Épicerie Directe';
          const rawUnit = variant.stock_unit_name || (typeof variant.unit === 'object' ? variant.unit?.name : variant.unit) || 'u';
          const productName = item.translations?.name || item.name;
          const formattedUnits = formatProductUnitAndWeight(productName, rawUnit, variant.measurement);
          const orderCount = parseInt(item.order_counter || '0', 10);

          return {
            id: item.id,
            variantId: variant.id || item.id,
            variant_id: variant.id || item.id,
            name: productName,
            slug: item.slug || `product-${item.id}`,
            brand: item.brand?.name || 'Soukday',
            storeId: SOUKDAY_OFFICIAL_SELLER_ID,
            seller_id: SOUKDAY_OFFICIAL_SELLER_ID,
            storeName: sellerName,
            storeType: 'soukday_direct' as const,
          price: parseFloat(variant.discounted_price || variant.price || '0'),
          originalPrice: variant.discounted_price ? parseFloat(variant.price || '0') : undefined,
          unit: formattedUnits.unit,
          weightOrVolume: formattedUnits.weightOrVolume,
          image: resolveImageUrl(item.image_url) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
          categorySlug: item.category?.slug || 'epicerie-maghrebine',
          subcategorySlug: item.category?.parent_id ? item.category?.slug : undefined,
          isPopular: true,
          isHalal: true,
          canShipNationwide: true,
          inStock: true,
          salesCount: orderCount,
          orderCounter: orderCount,
          rowOrder: item.row_order !== undefined && item.row_order !== null ? parseInt(item.row_order, 10) : undefined,
        };
      })
      .filter(isDedicatedSoukdayProduct);
    }
  } catch (err) {
    console.warn('Live Soukday direct products fetch failed:', err);
  }
  return [];
}

export async function fetchLiveWebSettings(): Promise<LiveWebSettings> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/settings?is_web_setting=1`, {
      headers: {
        'Accept': 'application/json',
        'x-access-key': ACCESS_KEY,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch web settings');
    const json = await res.json();
    if (json.status === 1 && json.data) {
      const decodedRaw = typeof atob === 'function'
        ? atob(json.data)
        : Buffer.from(json.data, 'base64').toString('utf8');
      const decoded = JSON.parse(decodedRaw);
      const ws = decoded.web_settings || {};

      return {
        siteTitle: parseLocalized(ws.site_title) || DEFAULT_LIVE_SETTINGS.siteTitle,
        websiteUrl: ws.website_url || DEFAULT_LIVE_SETTINGS.websiteUrl,
        color: ws.color || DEFAULT_LIVE_SETTINGS.color,
        lightColor: ws.light_color || DEFAULT_LIVE_SETTINGS.lightColor,
        darkColor: ws.dark_color || DEFAULT_LIVE_SETTINGS.darkColor,
        favicon: resolveImageUrl(ws.favicon) || DEFAULT_LIVE_SETTINGS.favicon,
        webLogo: resolveImageUrl(ws.web_logo || ws.web_header_logo || decoded.web_logo || decoded.logo) || DEFAULT_LIVE_SETTINGS.webLogo,
        webHeaderLogo: resolveImageUrl(ws.web_header_logo || ws.web_logo || decoded.web_logo || decoded.logo) || DEFAULT_LIVE_SETTINGS.webHeaderLogo,
        webFooterLogo: resolveImageUrl(ws.web_footer_logo || ws.web_logo || ws.web_header_logo || decoded.web_logo || decoded.logo) || DEFAULT_LIVE_SETTINGS.webFooterLogo,
        placeholderImage: resolveImageUrl(ws.placeholder_image) || DEFAULT_LIVE_SETTINGS.placeholderImage,
        loading: resolveImageUrl(ws.loading) || DEFAULT_LIVE_SETTINGS.loading,

        headerAnnouncementText: parseLocalized(ws.header_announcement_text) || DEFAULT_LIVE_SETTINGS.headerAnnouncementText,
        headerAnnouncementTag: parseLocalized(ws.header_announcement_tag) || DEFAULT_LIVE_SETTINGS.headerAnnouncementTag,
        headerPartnerText: parseLocalized(ws.header_partner_text) || DEFAULT_LIVE_SETTINGS.headerPartnerText,
        headerPartnerUrl: ws.header_partner_url || DEFAULT_LIVE_SETTINGS.headerPartnerUrl,
        headerSupportText: parseLocalized(ws.header_support_text) || DEFAULT_LIVE_SETTINGS.headerSupportText,
        headerSupportPhone: ws.header_support_phone || DEFAULT_LIVE_SETTINGS.headerSupportPhone,

        heroTagline: parseLocalized(ws.hero_tagline) || DEFAULT_LIVE_SETTINGS.heroTagline,
        heroTitle: parseLocalized(ws.hero_title) || DEFAULT_LIVE_SETTINGS.heroTitle,
        heroSubtitle: parseLocalized(ws.hero_subtitle) || DEFAULT_LIVE_SETTINGS.heroSubtitle,
        heroBadge1: parseLocalized(ws.hero_badge_1) || DEFAULT_LIVE_SETTINGS.heroBadge1,
        heroBadge2: parseLocalized(ws.hero_badge_2) || DEFAULT_LIVE_SETTINGS.heroBadge2,
        heroBadge3: parseLocalized(ws.hero_badge_3) || DEFAULT_LIVE_SETTINGS.heroBadge3,

        directGroceryTag: parseLocalized(ws.direct_grocery_tag) || DEFAULT_LIVE_SETTINGS.directGroceryTag,
        directGroceryTitle: parseLocalized(ws.direct_grocery_title) || DEFAULT_LIVE_SETTINGS.directGroceryTitle,
        directGroceryDescription: parseLocalized(ws.direct_grocery_description) || DEFAULT_LIVE_SETTINGS.directGroceryDescription,
        directGroceryFeature1Title: parseLocalized(ws.direct_grocery_feature_1_title) || DEFAULT_LIVE_SETTINGS.directGroceryFeature1Title,
        directGroceryFeature1Subtitle: parseLocalized(ws.direct_grocery_feature_1_subtitle) || DEFAULT_LIVE_SETTINGS.directGroceryFeature1Subtitle,
        directGroceryFeature2Title: parseLocalized(ws.direct_grocery_feature_2_title) || DEFAULT_LIVE_SETTINGS.directGroceryFeature2Title,
        directGroceryFeature2Subtitle: parseLocalized(ws.direct_grocery_feature_2_subtitle) || DEFAULT_LIVE_SETTINGS.directGroceryFeature2Subtitle,

        butcherSectionTag: parseLocalized(ws.butcher_section_tag) || DEFAULT_LIVE_SETTINGS.butcherSectionTag,
        butcherSectionTitle: parseLocalized(ws.butcher_section_title) || DEFAULT_LIVE_SETTINGS.butcherSectionTitle,
        butcherSectionSubtitle: parseLocalized(ws.butcher_section_subtitle) || DEFAULT_LIVE_SETTINGS.butcherSectionSubtitle,

        otherStoresSectionTag: parseLocalized(ws.other_stores_section_tag) || DEFAULT_LIVE_SETTINGS.otherStoresSectionTag,
        otherStoresSectionTitle: parseLocalized(ws.other_stores_section_title) || DEFAULT_LIVE_SETTINGS.otherStoresSectionTitle,
        otherStoresSectionSubtitle: parseLocalized(ws.other_stores_section_subtitle) || DEFAULT_LIVE_SETTINGS.otherStoresSectionSubtitle,

        footerAboutText: parseLocalized(ws.footer_about_text) || DEFAULT_LIVE_SETTINGS.footerAboutText,
        footerAddress: ws.footer_address || DEFAULT_LIVE_SETTINGS.footerAddress,
        footerEmail: ws.footer_email || DEFAULT_LIVE_SETTINGS.footerEmail,
        footerPhone: ws.footer_phone || DEFAULT_LIVE_SETTINGS.footerPhone,
        copyrightDetails: parseLocalized(ws.copyright_details) || DEFAULT_LIVE_SETTINGS.copyrightDetails,

        isAndroidApp: ws.is_android_app === '1' || ws.is_android_app === 1,
        androidAppUrl: ws.android_app_url || '',
        isIosApp: ws.is_ios_app === '1' || ws.is_ios_app === 1,
        iosAppUrl: ws.ios_app_url || '',

        appBannerTitle: parseLocalized(ws.app_banner_title) || DEFAULT_LIVE_SETTINGS.appBannerTitle,
        appBannerSubtitle: parseLocalized(ws.app_banner_subtitle) || DEFAULT_LIVE_SETTINGS.appBannerSubtitle,
        appBannerImage: resolveImageUrl(ws.app_banner_image) || DEFAULT_LIVE_SETTINGS.appBannerImage,
        appBannerQrUrl: ws.app_banner_qr_url || DEFAULT_LIVE_SETTINGS.appBannerQrUrl,

        commonMetaTitle: parseLocalized(ws.common_meta_title) || DEFAULT_LIVE_SETTINGS.commonMetaTitle,
        commonMetaDescription: parseLocalized(ws.common_meta_description) || DEFAULT_LIVE_SETTINGS.commonMetaDescription,
      };
    }
  } catch (err) {
    console.warn('Using local web settings fallback:', err);
  }
  return DEFAULT_LIVE_SETTINGS;
}
