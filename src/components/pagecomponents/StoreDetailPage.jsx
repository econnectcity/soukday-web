import React from 'react';
import Layout from '@/components/layout/Layout';
import StoreDetail from '@/components/store/StoreDetail';

const StoreDetailPage = () => {
  return (
    <Layout hideHeader={true}>
      <StoreDetail />
    </Layout>
  );
};

export default StoreDetailPage;
