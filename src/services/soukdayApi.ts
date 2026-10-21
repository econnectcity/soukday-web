import { Store, Category, Product, UserAddress, LiveWebSettings } from '../types';

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
  butcherSectionTitle: 'Boucheries livrant chez vous',
  butcherSectionSubtitle: 'Boucheries 100% Halal certifiées avec découpe à la commande, livrées directement à votre porte',

  otherStoresSectionTag: 'Commerces de proximité & Supermarchés',
  otherStoresSectionTitle: 'Autres magasins disponibles',
  otherStoresSectionSubtitle: 'Supermarchés orientaux, pâtisseries fines, épiceries de quartier et traiteurs pour votre adresse',

  footerAboutText: 'Soukday est la première plateforme au Québec dédiée aux épiceries orientales, boucheries halal certifiées et commerces de spécialités avec livraison locale et expédition nationale.',
  footerAddress: 'Montréal, Québec, Canada',
  footerEmail: 'support@soukday.ca',
  footerPhone: '+1 (514) 000-0000',
  copyrightDetails: '© 2026 Soukday Inc. Tous droits réservés. Plateforme de commerce multi-vendeurs.',
};


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
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
    'all': '/images/categories/all-aisles.png',
    'viandes-et-volailles': '/images/categories/halal-meats.png',
    'boucherie-halal': '/images/categories/halal-meats.png',
    'boucherie-halal-fraiche': '/images/categories/halal-meats.png',
    'epicerie-maghrebine': '/images/categories/grocery.png',
    'epicerie-orientale': '/images/categories/grocery.png',
    'boulangerie-et-patisserie': '/images/categories/bakery.png',
    'boulangerie-patisserie': '/images/categories/bakery.png',
    'fruits-et-legumes': '/images/categories/produce.png',
    'fruits-legumes-frais': '/images/categories/produce.png',
    'poissons-et-fruits-de-mer': '/images/categories/seafood.png',
    'epices-et-herbes': '/images/categories/spices.png',
    'epices-fruits-secs': '/images/categories/spices.png',
    'noix-et-fruits-secs': '/images/categories/nuts-dates.png',
    'plats-cuisines': '/images/categories/prepared-dishes.png',
    'surgeles-plats-prepares': '/images/categories/prepared-dishes.png',
    'produits-laitiers-fromages': '/images/categories/grocery.png',
    'thes-cafes-boissons': '/images/categories/grocery.png',
  };
  return map[slug] || '/images/categories/all-aisles.png';
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

export async function fetchLiveCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/categories`, {
      headers: {
        'Accept': 'application/json',
        'x-access-key': ACCESS_KEY,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    if (json.status === 1 && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item: any) => {
        const resolved = resolveImageUrl(item.image_url || item.image || item.web_image);
        // If image in DB is legacy unsplash placeholder, use modern cutout image; if admin uploaded an image, prioritize admin's image!
        const isUnsplash = resolved && resolved.includes('unsplash.com');
        const validImg = resolved && resolved.trim() !== '' && !isUnsplash ? resolved : getCategoryImage(item.slug);
        return {
          id: item.id,
          name: item.translations?.name || item.name || (item.slug ? item.slug.replace(/-/g, ' ') : `Catégorie ${item.id}`),
          slug: item.slug || `cat-${item.id}`,
          subtitle: item.translations?.subtitle || item.subtitle || '',
          icon: getCategoryIcon(item.slug),
          image: validImg,
          subcategories: (item.all_active_childs || []).map((sub: any) => ({
            id: sub.id,
            name: sub.translations?.name || sub.name,
            slug: sub.slug,
            subtitle: sub.translations?.subtitle || '',
          })),
        };
      });
    }
  } catch (err) {
    console.error('Error fetching categories from API:', err);
  }
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
        const storeName = item.translations?.store_name || item.translations?.name || item.store_name || item.name || 'Boutique Partenaire';
        const isButcher = storeName.toLowerCase().includes('boucherie');
        return {
          id: item.id,
          name: storeName,
          slug: item.slug || `store-${item.id}`,
          type: isButcher ? 'butcher' : 'grocery',
          typeLabel: isButcher ? 'Boucherie Halal' : 'Supermarché & Épicerie',
          address: item.street || item.formatted_address || 'Montréal, QC',
          city: item.city?.name || 'Montréal',
          state: item.state || 'QC',
          postalCode: item.pincode?.pincode || '',
          rating: 4.8,
          reviewsCount: 120,
          deliveryTime: '30-50 min',
          deliveryFee: 'Gratuite dès 50$',
          minOrder: 25,
          distanceKm: parseFloat(item.distance || '3.5'),
          image: resolveImageUrl(item.logo_url) || getStoreImage(storeName),
          tags: isButcher ? ['Halal Certifié', 'Viande Fraîche'] : ['Épicerie', 'Frais du jour'],
          isHalalCertified: isButcher,
          isOpenNow: true,
          hours: '09h00 - 21h00',
        };
      });
    }
  } catch (err) {
    console.warn('Live sellers fetch failed:', err);
  }
  return [];
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
        const isSoukday = item.seller_id === 0 || item.seller_id === 11 || item.seller_id === 12 || sellerName?.toLowerCase().includes('soukday');
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

        commonMetaTitle: parseLocalized(ws.common_meta_title) || DEFAULT_LIVE_SETTINGS.commonMetaTitle,
        commonMetaDescription: parseLocalized(ws.common_meta_description) || DEFAULT_LIVE_SETTINGS.commonMetaDescription,
      };
    }
  } catch (err) {
    console.warn('Using local web settings fallback:', err);
  }
  return DEFAULT_LIVE_SETTINGS;
}
