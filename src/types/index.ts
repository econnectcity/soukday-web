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
  name: string;
  slug: string;
  brand?: string;
  storeId?: number;
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
