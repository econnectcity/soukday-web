'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '@/utils/translation';
import { Tag, ShieldCheck, Truck } from 'lucide-react';
import SoukdayAppHandIllustration from '@/components/soukday/SoukdayAppHandIllustration';

export default function PreFooterAppBanner() {
  const { isFrench, currentCode } = useTranslation();
  const settingState = useSelector((state) => state.Setting);
  const setting = settingState?.setting || {};
  const webSettings = setting?.web_settings || {};
  const [imageFailed, setImageFailed] = useState(false);

  const isFr = isFrench || currentCode === 'fr' || !currentCode || currentCode.startsWith('fr');

  const playStoreLink =
    webSettings?.playstore_url ||
    setting?.playstore_url ||
    'https://play.google.com/store';

  const appStoreLink =
    webSettings?.appstore_url ||
    setting?.appstore_url ||
    'https://apps.apple.com';

  return (
    <section className="w-full bg-white pt-10 sm:pt-14 pb-10 sm:pb-14 border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Soukday Brand Warm Peach Card Container */}
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFF5F1] via-[#FDF1EB] to-[#FFF8F5] border border-[#FCDCD0] shadow-xs hover:shadow-md transition-shadow">
          
          {/* Subtle warm decorative background orbs */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#F68B62]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-[#F59E0B]/8 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between px-6 sm:px-8 lg:px-10 py-7 sm:py-8 gap-6 md:gap-8">
            
            {/* ================= 1. LEFT: Text & Download Badges (Left Aligned) ================= */}
            <div className="flex-1 text-left min-w-0 space-y-3 sm:space-y-3.5">
              
              {/* Heading */}
              <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-[26px] font-black tracking-tight text-stone-900 leading-tight">
                {isFr ? (
                  <>
                    Vivez l'expérience{' '}
                    <span className="text-[#F68B62]">Soukday</span>
                  </>
                ) : (
                  <>
                    Get the{' '}
                    <span className="text-[#F68B62]">Soukday</span>{' '}
                    experience
                  </>
                )}
              </h3>

              {/* Subtitle / Description */}
              <p className="text-xs sm:text-sm md:text-[14.5px] font-medium text-stone-600 leading-relaxed max-w-xl">
                {isFr
                  ? "Faites votre épicerie, commandez votre viande halal et découvrez les commerces qui livrent chez vous. Première livraison offerte !"
                  : "Shop for your groceries, order halal meat, and discover local shops delivering to you. First delivery is free!"}
              </p>

              {/* Trust & Benefit Pills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F68B62]/10 text-[#e07750] text-xs font-bold">
                  <Tag className="w-3.5 h-3.5 text-[#F68B62]" />
                  {isFr ? '1ère livraison offerte' : 'Free 1st delivery'}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCEFEA] text-[#F68B62] text-xs font-bold border border-[#F68B62]/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F68B62]" />
                  {isFr ? 'Boucheries 100% Halal' : '100% Halal Butchers'}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold">
                  <Truck className="w-3.5 h-3.5 text-stone-600" />
                  {isFr ? 'Délai 24 - 48 h' : '24 - 48h delivery'}
                </span>
              </div>

              {/* Store Download Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Google Play Store Badge */}
                <a
                  href={playStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GET IT ON Google Play"
                  className="inline-flex items-center gap-3 bg-black hover:bg-stone-900 text-white px-4 py-2 sm:py-2.5 rounded-xl border border-stone-800 shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.61-.954V2.768c.15-.37.37-.694.609-.954z"
                      fill="#00D2FF"
                    />
                    <path
                      d="M14.845 13.054l2.124 2.123-11.85 6.843 9.726-8.966z"
                      fill="#FF3A44"
                    />
                    <path
                      d="M14.845 10.946L5.119 1.98l11.85 6.844-2.124 2.122z"
                      fill="#00E676"
                    />
                    <path
                      d="M16.292 12l3.527-2.036c.928-.536.928-1.41 0-1.946l-3.527-2.036-2.28 2.28 2.28 2.28z"
                      fill="#FFC800"
                    />
                  </svg>
                  <div className="flex flex-col text-left select-none">
                    <span className="text-[9px] font-semibold text-stone-300 tracking-wider uppercase leading-none">
                      GET IT ON
                    </span>
                    <span className="text-[14px] sm:text-[15px] font-bold text-white tracking-tight leading-tight mt-0.5">
                      Google Play
                    </span>
                  </div>
                </a>

                {/* Apple App Store Badge */}
                <a
                  href={appStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on the App Store"
                  className="inline-flex items-center gap-3 bg-black hover:bg-stone-900 text-white px-4 py-2 sm:py-2.5 rounded-xl border border-stone-800 shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 fill-current text-white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.63 1.34-.56.64-1.04 1.7-0.91 2.73.99.08 2.01-.48 2.62-1.22z" />
                  </svg>
                  <div className="flex flex-col text-left select-none">
                    <span className="text-[9px] font-medium text-stone-300 tracking-tight leading-none">
                      Download on the
                    </span>
                    <span className="text-[14px] sm:text-[15px] font-bold text-white tracking-tight leading-tight mt-0.5">
                      App Store
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* ================= 2. RIGHT: High-Res Smartphone & Hand Mockup ================= */}
            <div className="relative w-full md:w-auto flex items-center justify-center shrink-0 h-[160px] sm:h-[185px] md:h-[200px]">
              {!imageFailed ? (
                <div className="relative h-full flex items-center">
                  <img
                    src="/images/soukday-app-experience.png"
                    alt="Soukday App"
                    className="h-full w-auto max-w-[260px] sm:max-w-[300px] md:max-w-[340px] object-contain select-none transition-transform duration-300 hover:scale-105 drop-shadow-md"
                    onError={() => setImageFailed(true)}
                  />
                  {/* Floating App Rating Pill */}
                  <div className="absolute top-2 right-1 translate-x-1 sm:translate-x-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-[#FCDCD0] flex items-center gap-1.5 pointer-events-none">
                    <span className="text-[10px]">⭐</span>
                    <span className="text-[10px] font-bold text-stone-800">4.9</span>
                    <span className="text-[9.5px] font-semibold text-[#F68B62]">
                      {isFr ? '• App Soukday' : '• Soukday App'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-full w-[200px] sm:w-[240px] md:w-[270px] flex items-center">
                  <SoukdayAppHandIllustration
                    className="w-full h-full object-contain"
                    width="100%"
                    height="100%"
                    isFrench={isFr}
                  />
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
