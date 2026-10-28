'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '@/utils/translation';

export default function PreFooterAppBanner() {
  const { isFrench } = useTranslation();
  const settingState = useSelector((state) => state.Setting);
  const setting = settingState?.setting || {};
  const webSettings = setting?.web_settings || {};

  const playStoreLink =
    webSettings?.playstore_url ||
    setting?.playstore_url ||
    'https://play.google.com/store';

  const appStoreLink =
    webSettings?.appstore_url ||
    setting?.appstore_url ||
    'https://apps.apple.com';

  return (
    <section className="w-full bg-white border-t border-stone-200/80 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12">
          
          {/* Left Column: Heading (H3) & Description */}
          <div className="max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {isFrench
                ? "Téléchargez l’application Soukday"
                : "Download the Soukday App"}
            </h3>
            <p className="text-stone-600 text-sm sm:text-[14.5px] leading-relaxed mt-2.5">
              {isFrench
                ? "Faites votre épicerie, commandez votre viande halal et découvrez les commerces qui livrent chez vous. Avec l’application Soukday, magasinez facilement, suivez vos commandes et retrouvez toutes les saveurs du souk au même endroit."
                : "Shop for your groceries, order halal meat, and discover local shops delivering to you. With the Soukday app, shop easily, track your orders, and find all the flavors of the souk in one place."}
            </p>
          </div>

          {/* Right Column: Google Play & App Store Badges */}
          <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 shrink-0">
            {/* Google Play Store Badge */}
            <a
              href={playStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GET IT ON Google Play"
              className="inline-flex items-center gap-3 bg-black hover:bg-stone-900 text-white px-4 py-2 sm:py-2.5 rounded-lg border border-stone-800 shadow-xs transition-all hover:scale-[1.02] active:scale-95"
            >
              <svg
                className="w-6 h-6 shrink-0"
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
                <span className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight leading-tight mt-0.5">
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
              className="inline-flex items-center gap-3 bg-black hover:bg-stone-900 text-white px-4 py-2 sm:py-2.5 rounded-lg border border-stone-800 shadow-xs transition-all hover:scale-[1.02] active:scale-95"
            >
              <svg
                className="w-6 h-6 shrink-0 fill-current text-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.63 1.34-.56.64-1.04 1.7-0.91 2.73.99.08 2.01-.48 2.62-1.22z" />
              </svg>
              <div className="flex flex-col text-left select-none">
                <span className="text-[9px] font-medium text-stone-300 tracking-tight leading-none">
                  Download on the
                </span>
                <span className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight leading-tight mt-0.5">
                  App Store
                </span>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
