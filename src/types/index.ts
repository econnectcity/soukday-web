export interface Store {
  id: number;
  name: string;
  slug: string;
  type: 'butcher' | 'grocery' | 'bakery' | 'specialty';
  typeLabel: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  deliveryFee: string;
  minOrder: number;
  distanceKm: number;
  image: string;
  tags: string[];
  isHalalCertified?: boolean;
  isOpenNow: boolean;
  hours: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  icon: string;
  image: string;
  subcategories?: {
    id: number;
    name: string;
    slug: string;
    subtitle?: string;
  }[];
}

export interface Product {
  id: number;
  variantId?: number;
  variant_id?: number;
  name: string;
  slug: string;
  brand?: string;
  storeId?: number;
  seller_id?: number;
  storeName: string;
  storeType: 'soukday_direct' | 'local_store';
  price: number;
  originalPrice?: number;
  unit: string;
  weightOrVolume?: string;
  image: string;
  categorySlug: string;
  subcategorySlug?: string;
  isPopular?: boolean;
  isHalal?: boolean;
  canShipNationwide?: boolean; // Soukday direct grocery products
  inStock: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserAddress {
  address: string;
  city: string;
  postalCode: string;
  lat?: number;
  lng?: number;
}

export interface LiveWebSettings {
  siteTitle: string;
  websiteUrl: string;
  color: string;
  lightColor: string;
  darkColor: string;
  favicon?: string;
  webLogo?: string;
  webHeaderLogo?: string;
  webFooterLogo?: string;
  placeholderImage?: string;
  loading?: string;

  // Header & Announcement
  headerAnnouncementText: string;
  headerAnnouncementTag: string;
  headerPartnerText: string;
  headerPartnerUrl: string;
  headerSupportText: string;
  headerSupportPhone: string;

  // Hero Section
  heroTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge1: string;
  heroBadge2: string;
  heroBadge3: string;

  // Soukday Direct Grocery (Full Width)
  directGroceryTag: string;
  directGroceryTitle: string;
  directGroceryDescription: string;
  directGroceryFeature1Title: string;
  directGroceryFeature1Subtitle: string;
  directGroceryFeature2Title: string;
  directGroceryFeature2Subtitle: string;

  // Butcher Section
  butcherSectionTag: string;
  butcherSectionTitle: string;
  butcherSectionSubtitle: string;

  // Other Stores Section
  otherStoresSectionTag: string;
  otherStoresSectionTitle: string;
  otherStoresSectionSubtitle: string;

  // Footer & Contact
  footerAboutText: string;
  footerAddress: string;
  footerEmail: string;
  footerPhone: string;
  copyrightDetails: string;

  // Apps
  isAndroidApp?: boolean;
  androidAppUrl?: string;
  isIosApp?: boolean;
  iosAppUrl?: string;

  // SEO
  commonMetaTitle?: string;
  commonMetaDescription?: string;
}

