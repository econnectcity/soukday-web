import { Store, Category, Product, UserAddress, LiveWebSettings } from '../types';
import { STORES, MAIN_CATEGORIES, PRODUCTS } from '../data/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin.soukday.ca';

export async function fetchLiveCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/categories`, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    if (json.status === 1 && Array.isArray(json.data)) {
      return json.data.map((item: any) => ({
        id: item.id,
        name: item.translations?.name || item.name,
        slug: item.slug,
        subtitle: item.translations?.subtitle || item.subtitle || '',
        icon: getCategoryIcon(item.slug),
        image: item.image_url || getCategoryImage(item.slug),
        subcategories: (item.all_active_childs || []).map((sub: any) => ({
          id: sub.id,
          name: sub.translations?.name || sub.name,
          slug: sub.slug,
          subtitle: sub.translations?.subtitle || '',
        })),
      }));
    }
  } catch (err) {
    console.warn('Using local categories fallback:', err);
  }
  return MAIN_CATEGORIES;
}

export async function fetchLiveSellers(lat: number, lng: number): Promise<Store[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/sellers?latitude=${lat}&longitude=${lng}`, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to fetch sellers');
    const json = await res.json();
    if (json.status === 1 && Array.isArray(json.data)) {
      return json.data.map((item: any) => {
        const isButcher = item.store_name?.toLowerCase().includes('boucherie');
        return {
          id: item.id,
          name: item.store_name || item.name,
          slug: item.slug || `store-${item.id}`,
          type: isButcher ? 'butcher' : 'grocery',
          typeLabel: isButcher ? 'Boucherie Halal' : 'Supermarché & Épicerie',
          address: item.street || item.formatted_address || '',
          city: item.city?.name || 'Montréal',
          state: item.state || 'QC',
          postalCode: item.pincode?.pincode || '',
          rating: 4.8,
          reviewsCount: 120,
          deliveryTime: '30-50 min',
          deliveryFee: 'Gratuite dès 50$',
          minOrder: 25,
          distanceKm: parseFloat(item.distance || '3.5'),
          image: item.logo_url || getStoreImage(item.store_name),
          tags: isButcher ? ['Halal Certifié', 'Viande Fraîche'] : ['Épicerie', 'Frais du jour'],
          isHalalCertified: isButcher,
          isOpenNow: true,
          hours: '09h00 - 21h00',
        };
      });
    }
  } catch (err) {
    console.warn('Using local stores fallback:', err);
  }
  return STORES;
}

export async function fetchLiveProducts(lat: number, lng: number): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/products`, {
      method: 'POST',
      next: { revalidate: 60 },
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    if (json.status === 1 && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item: any) => {
        const variant = item.variants?.[0] || {};
        const isSoukday = item.seller_id === 0 || item.seller_name?.toLowerCase().includes('soukday');
        return {
          id: item.id,
          name: item.translations?.name || item.name,
          slug: item.slug || `product-${item.id}`,
          brand: item.brand?.name || 'Soukday',
          storeId: item.seller_id,
          storeName: item.seller_name || (isSoukday ? 'Soukday Épicerie Directe' : 'Boutique Partenaire'),
          storeType: isSoukday ? 'soukday_direct' : 'local_store',
          price: parseFloat(variant.discounted_price || variant.price || '0'),
          originalPrice: variant.discounted_price ? parseFloat(variant.price || '0') : undefined,
          unit: variant.unit || '1 unité',
          weightOrVolume: variant.measurement ? `${variant.measurement} ${variant.unit}` : undefined,
          image: item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
          categorySlug: item.category?.slug || 'epicerie-maghrebine',
          isPopular: true,
          isHalal: true,
          canShipNationwide: isSoukday,
          inStock: (variant.stock || 1) > 0,
          badge: isSoukday ? 'Expédition Canada & USA' : 'Produit Local',
        };
      });
    }
  } catch (err) {
    console.warn('Using local products fallback:', err);
  }
  return PRODUCTS;
}

function getCategoryIcon(slug: string): string {
  if (slug.includes('viande')) return '🥩';
  if (slug.includes('fruit') || slug.includes('legume')) return '🍎';
  if (slug.includes('boulangerie') || slug.includes('patisserie')) return '🥐';
  if (slug.includes('poisson')) return '🐟';
  if (slug.includes('epice')) return '🌿';
  if (slug.includes('noix') || slug.includes('sec')) return '🥜';
  if (slug.includes('plat')) return '🍲';
  return '🛒';
}

function getCategoryImage(slug: string): string {
  const match = MAIN_CATEGORIES.find(c => c.slug === slug);
  return match?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80';
}

function getStoreImage(name: string): string {
  const match = STORES.find(s => s.name.toLowerCase() === name?.toLowerCase());
  return match?.image || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=700&q=80';
}

export function parseLocalized(value: any, lang: string = 'fr'): string {
  if (!value) return '';
  if (typeof value === 'object') {
    return value[lang] || value['en'] || Object.values(value)[0] || '';
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object') {
          return parsed[lang] || parsed['en'] || Object.values(parsed)[0] || '';
        }
      } catch {
        // Fall through
      }
    }
    return value;
  }
  return String(value);
}

export const DEFAULT_LIVE_SETTINGS: LiveWebSettings = {
  siteTitle: 'Soukday - Épiceries orientales & Boucheries Halal',
  websiteUrl: 'https://soukday.ca',
  color: '#F68B62',
  lightColor: '#FCEFEA',
  darkColor: '#1c1917',
  favicon: '',
  webLogo: '',
  webHeaderLogo: '',
  webFooterLogo: '',
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
  copyrightDetails: 'Copyright © 2026 Soukday. Tous droits réservés.',

  isAndroidApp: false,
  androidAppUrl: '',
  isIosApp: false,
  iosAppUrl: '',

  commonMetaTitle: 'Soukday - Épiceries orientales, Boucheries Halal & Marchés locaux',
  commonMetaDescription: 'Commandez en ligne auprès de vos boucheries halal et épiceries locales au Québec. Épicerie directe expédiée partout au Canada et aux États-Unis.',
};

export async function fetchLiveWebSettings(): Promise<LiveWebSettings> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/settings?is_web_setting=1`, {
      next: { revalidate: 5 },
      headers: { 
        'Accept': 'application/json',
        'x-access-key': '903361',
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
        favicon: ws.favicon || DEFAULT_LIVE_SETTINGS.favicon,
        webLogo: ws.web_logo || ws.web_header_logo || DEFAULT_LIVE_SETTINGS.webLogo,
        webHeaderLogo: ws.web_header_logo || ws.web_logo || DEFAULT_LIVE_SETTINGS.webHeaderLogo,
        webFooterLogo: ws.web_footer_logo || ws.web_logo || DEFAULT_LIVE_SETTINGS.webFooterLogo,
        placeholderImage: ws.placeholder_image || DEFAULT_LIVE_SETTINGS.placeholderImage,
        loading: ws.loading || DEFAULT_LIVE_SETTINGS.loading,

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

