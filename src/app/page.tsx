import HeroBanner from '../components/HeroBanner';
import CategorySlider from '../components/CategorySlider';
import SoukdayGrocerySection from '../components/SoukdayGrocerySection';
import ButcherSection from '../components/ButcherSection';
import OtherStoresSection from '../components/OtherStoresSection';
import PopularProductsSection from '../components/PopularProductsSection';
import { fetchLiveCategories, fetchLiveSellers, fetchLiveProducts, fetchLiveWebSettings } from '../services/api';
import { DEFAULT_USER_ADDRESS } from '../data/mockData';

export default async function Home() {
  const [categories, stores, products, webSettings] = await Promise.all([
    fetchLiveCategories(),
    fetchLiveSellers(DEFAULT_USER_ADDRESS.lat || 45.5017, DEFAULT_USER_ADDRESS.lng || -73.5673),
    fetchLiveProducts(DEFAULT_USER_ADDRESS.lat || 45.5017, DEFAULT_USER_ADDRESS.lng || -73.5673),
    fetchLiveWebSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Main Banner + Address Field */}
      <HeroBanner settings={webSettings} />

      {/* 2. Product Categories (Live from Admin API) */}
      <CategorySlider categories={categories} />

      {/* 3. Soukday Grocery (Sold directly by Soukday, shipped across Canada & USA) */}
      <SoukdayGrocerySection products={products} settings={webSettings} />

      {/* 4. Butchers Delivering to You (Based on customer address / postal code) */}
      <ButcherSection stores={stores} settings={webSettings} />

      {/* 5. Other Stores Available (Supermarkets, specialty stores, bakeries, caterers) */}
      <OtherStoresSection stores={stores} settings={webSettings} />

      {/* 6. Popular Products (Live from Admin/Seller product inventory) */}
      <PopularProductsSection products={products} />
    </div>
  );
}
