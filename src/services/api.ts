import { Store, Category, Product, UserAddress } from '../types';
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
