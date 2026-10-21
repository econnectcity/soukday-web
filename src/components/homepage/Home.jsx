import React from 'react';
import { useSelector } from 'react-redux';
import SoukdayHomepage from '../soukday/SoukdayHomepage';
import HomeOfferModal from '../homepageoffermodal/HomeOfferModal';

const HomePage = () => {
  const setting = useSelector((state) => state.Setting);

  return (
    <div>
      <SoukdayHomepage />
      {setting?.setting && setting?.setting?.popup_enabled === '1' && (
        <HomeOfferModal />
      )}
    </div>
  );
};

export default HomePage;
