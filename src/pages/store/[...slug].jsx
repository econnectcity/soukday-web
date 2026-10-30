import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import MetaData from '@/components/metadata-component/MetaData';

const StoreDetailPage = dynamic(
  () => import('@/components/pagecomponents/StoreDetailPage'),
  { ssr: false }
);

export default function StorePage() {
  const router = useRouter();
  const { slug } = router.query;
  const slugArr = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const currentSlug = slugArr[slugArr.length - 1] || '';
  const formattedTitle = currentSlug
    ? currentSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Boutique Partenaire';

  const metaTitle = `${formattedTitle} - ${process.env.NEXT_PUBLIC_META_TITLE || 'Soukday'}`;
  const metaDesc = `Commandez vos viandes halal et produits d'épicerie en direct de ${formattedTitle} avec livraison rapide sur Soukday.`;

  return (
    <>
      <MetaData
        pageName="/store"
        title={metaTitle}
        description={metaDesc}
      />
      <StoreDetailPage />
    </>
  );
}

