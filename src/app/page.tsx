import HeroBanner from '../components/HeroBanner';
import CategorySlider from '../components/CategorySlider';
import SoukdayGrocerySection from '../components/SoukdayGrocerySection';
import ButcherSection from '../components/ButcherSection';
import OtherStoresSection from '../components/OtherStoresSection';
import PopularProductsSection from '../components/PopularProductsSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Main Banner + Address Field */}
      <HeroBanner />

      {/* 2. Product Categories */}
      <CategorySlider />

      {/* 3. Soukday Grocery (Sold directly by Soukday, shipped across Canada & USA) */}
      <SoukdayGrocerySection />

      {/* 4. Butchers Delivering to You (Based on customer address / postal code) */}
      <ButcherSection />

      {/* 5. Other Stores Available (Supermarkets, specialty stores, bakeries, caterers) */}
      <OtherStoresSection />

      {/* 6. Popular Products (Curated, recommended & bestsellers) */}
      <PopularProductsSection />
    </div>
  );
}
