'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '@/context/SoukdayCartContext';
import HeroBanner from './HeroBanner';
import CategorySlider from './CategorySlider';
import SoukdayGrocerySection from './SoukdayGrocerySection';
import SoukdayAppExperienceBanner from './SoukdayAppExperienceBanner';
import ButcherSection from './ButcherSection';
import SoukdayHowItWorksSection from './SoukdayHowItWorksSection';
import OtherStoresSection from './OtherStoresSection';
import PopularProductsSection from './PopularProductsSection';
import {
  fetchLiveCategories,
  fetchLiveSellers,
  fetchLiveProducts,
  fetchLiveSoukdayProducts,
  fetchLiveWebSettings,
  isDedicatedSoukdayProduct,
} from '@/services/soukdayApi';
import { DEFAULT_LIVE_SETTINGS, DEFAULT_CATEGORIES } from '@/data/mockData';

export default function SoukdayHomepage() {
  const city = useSelector((state) => state.City?.city);
  const reduxSetting = useSelector((state) => state.Setting?.setting);

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES || []);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [soukdayProducts, setSoukdayProducts] = useState([]);
  const [webSettings, setWebSettings] = useState(DEFAULT_LIVE_SETTINGS || {});
  const [loading, setLoading] = useState(true);

  // Sync Redux settings to webSettings state safely with bulletproof fallbacks
  useEffect(() => {
    if (reduxSetting?.web_settings) {
      const ws = reduxSetting.web_settings;
      setWebSettings((prev) => {
        const base = prev || DEFAULT_LIVE_SETTINGS || {};
        return {
          ...base,
          ...ws,
          siteTitle: ws.site_title || base.siteTitle || 'Soukday',
          webHeaderLogo: ws.web_header_logo || ws.web_logo || base.webHeaderLogo || '/images/logo.png',
          webFooterLogo: ws.web_footer_logo || base.webFooterLogo || '/images/logo.png',
          headerAnnouncementText: ws.header_announcement_text || base.headerAnnouncementText || '',
          headerAnnouncementTag: ws.header_announcement_tag || base.headerAnnouncementTag || '',
          headerPartnerText: ws.header_partner_text || base.headerPartnerText || '',
          headerPartnerUrl: ws.header_partner_url || base.headerPartnerUrl || '',
          headerSupportPhone: ws.header_support_phone || base.headerSupportPhone || '',
          headerSupportText: ws.header_support_text || base.headerSupportText || '',
        };
      });
    }
  }, [reduxSetting]);

  const selectedLanguage = useSelector((state) => state.Language?.selectedLanguage);
  const currentLang = (selectedLanguage?.code || 'fr').toLowerCase();

  // Fetch Live Data from Admin API
  useEffect(() => {
    let isMounted = true;
    const lat = city?.latitude ? parseFloat(city.latitude) : 45.5017;
    const lng = city?.longitude ? parseFloat(city.longitude) : -73.5673;

    async function loadData() {
      try {
        const [liveCats, liveStores, liveProds, liveSoukdayProds, liveSettings] = await Promise.all([
          fetchLiveCategories(currentLang),
          fetchLiveSellers(lat, lng),
          fetchLiveProducts(lat, lng),
          fetchLiveSoukdayProducts(currentLang),
          fetchLiveWebSettings(),
        ]);

        if (isMounted) {
          if (liveCats && liveCats.length > 0) setCategories(liveCats);
          if (liveStores && liveStores.length > 0) setStores(liveStores);
          if (liveProds && liveProds.length > 0) setProducts(liveProds);
          if (liveSoukdayProds && liveSoukdayProds.length > 0) {
            setSoukdayProducts(liveSoukdayProds.filter(isDedicatedSoukdayProduct));
          } else if (liveProds && liveProds.length > 0) {
            const adminOnly = liveProds.filter(isDedicatedSoukdayProduct);
            setSoukdayProducts(adminOnly);
          }
          if (liveSettings) {
            setWebSettings((prev) => ({
              ...(prev || DEFAULT_LIVE_SETTINGS || {}),
              ...liveSettings,
            }));
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading live Soukday data:', err);
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [city?.latitude, city?.longitude, currentLang]);

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* 1. Main Banner + Address Field */}
      <HeroBanner settings={webSettings || DEFAULT_LIVE_SETTINGS} />

      {/* 2. Product Categories (Live from Admin API) */}
      <CategorySlider categories={categories} />

      {/* 3. Dedicated Soukday Grocery (Only products sold by Soukday / Admin) */}
      <SoukdayGrocerySection products={soukdayProducts} settings={webSettings || DEFAULT_LIVE_SETTINGS} />

      {/* 3.5 Instacart-Style Soukday App Experience Banner with QR code and mobile app graphic */}
      <SoukdayAppExperienceBanner settings={webSettings || DEFAULT_LIVE_SETTINGS} />

      {/* 4. Butchers Delivering to You (Based on customer address / postal code) */}
      <ButcherSection stores={stores} settings={webSettings || DEFAULT_LIVE_SETTINGS} />

      {/* 4.5 How It Works / Combined Order Explanation (Instacart 3-card style) */}
      <SoukdayHowItWorksSection />

      {/* 5. Other Stores Available (Supermarkets, specialty stores, bakeries, caterers) */}
      <OtherStoresSection stores={stores} settings={webSettings || DEFAULT_LIVE_SETTINGS} />

      {/* 6. Popular Products (Live from Admin/Seller product inventory) */}
      <PopularProductsSection products={products} />
    </div>
  );
}
