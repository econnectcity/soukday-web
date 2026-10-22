import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout/Layout';
import MetaData from '@/components/metadata-component/MetaData';

const SoukdayDedicatedGroceryPage = dynamic(
  () => import('@/components/soukday/SoukdayDedicatedGroceryPage'),
  { ssr: false }
);

const EpicerieSoukdayPage = () => {
  const metaTitle = `Toute l’épicerie Soukday - ${process.env.NEXT_PUBLIC_META_TITLE || 'Soukday'}`;
  const metaDesc = "Découvrez tous les produits d’épicerie maghrébine et orientale vendus et expédiés directement par Soukday. Livraison partout au Canada et aux USA.";

  return (
    <>
      <MetaData
        pageName="/epicerie-soukday"
        title={metaTitle}
        description={metaDesc}
      />
      <Layout>
        <SoukdayDedicatedGroceryPage />
      </Layout>
    </>
  );
};

export default EpicerieSoukdayPage;
