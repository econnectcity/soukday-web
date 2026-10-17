import type { MetadataRoute } from 'next';
import { MAIN_CATEGORIES, STORES } from '../data/mockData';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://soukday.ca';

  // 1. Static Core Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // 2. Category Pages
  const categoryPages: MetadataRoute.Sitemap = MAIN_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Store Pages (Butchers & Supermarkets)
  const storePages: MetadataRoute.Sitemap = STORES.map((store) => ({
    url: `${baseUrl}/store/${store.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...storePages];
}
