import HeroBanner from '../components/HeroBanner';
import CategorySlider from '../components/CategorySlider';
import SoukdayGrocerySection from '../components/SoukdayGrocerySection';
import ButcherSection from '../components/ButcherSection';
import OtherStoresSection from '../components/OtherStoresSection';
import PopularProductsSection from '../components/PopularProductsSection';
import { fetchLiveCategories, fetchLiveSellers } from '../services/api';
import { DEFAULT_USER_ADDRESS } from '../data/mockData';


export default async function Home() {
  const [categories, stores] = await Promise.all([
    fetchLiveCategories(),
    fetchLiveSellers(DEFAULT_USER_ADDRESS.lat || 45.5017, DEFAULT_USER_ADDRESS.lng || -73.5673),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Main Banner + Address Field */}
      <HeroBanner />

      {/* 2. Product Categories (Fetched directly from Admin Panel API) */}
      <CategorySlider categories={categories} />

      {/* 3. Soukday Grocery (Sold directly by Soukday, shipped across Canada & USA) */}
      <SoukdayGrocerySection />

      {/* 4. Butchers Delivering to You (Based on customer address / postal code) */}
      <ButcherSection stores={stores} />

      {/* 5. Other Stores Available (Supermarkets, specialty stores, bakeries, caterers) */}
      <OtherStoresSection stores={stores} />

      {/* 6. Popular Products (Curated, recommended & bestsellers) */}
      <PopularProductsSection />
    </div>
  );
}
