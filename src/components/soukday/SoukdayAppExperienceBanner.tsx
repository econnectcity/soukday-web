'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '@/utils/translation';
import { LiveWebSettings } from '@/types';
import { DEFAULT_LIVE_SETTINGS } from '@/services/soukdayApi';
import SoukdayAppHandIllustration from './SoukdayAppHandIllustration';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Tag } from 'lucide-react';

/**
 * Recommended Dimensions for Custom User Image:
 * ---------------------------------------------
 * Canvas Dimensions : 500 × 280 px (or 650 × 360 px for Retina @2x)
 * Aspect Ratio       : ~ 1.8 : 1 (or 16:9)
 * File Format        : PNG (24-bit with alpha transparency) or WebP
 * Target File Path   : /public/images/soukday-app-experience.png
 */

interface SoukdayAppExperienceBannerProps {
  settings?: LiveWebSettings;
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  qrUrl?: string;
  className?: string;
}

export default function SoukdayAppExperienceBanner({
  settings = DEFAULT_LIVE_SETTINGS,
  imageSrc = '/images/soukday-app-experience.png',
  title,
  subtitle,
  qrUrl,
  className = '',
}: SoukdayAppExperienceBannerProps) {
  const { isFrench, currentCode } = useTranslation();
  const reduxSetting = useSelector((state: any) => state.Setting?.setting);
  const [imageFailed, setImageFailed] = useState(false);

  // Robust French detection
  const isFr = isFrench || currentCode === 'fr' || !currentCode || currentCode.startsWith('fr');

  // App & QR URLs
  const playStoreLink =
    reduxSetting?.playstore_url ||
    (settings as any)?.playstore_url ||
    (settings as any)?.androidAppUrl ||
    'https://play.google.com/store';
  const appStoreLink =
    reduxSetting?.appstore_url ||
    (settings as any)?.appstore_url ||
    (settings as any)?.iosAppUrl ||
    'https://apps.apple.com';
  
  // Smart app landing / redirect URL for QR code
  const targetQrUrl = qrUrl || '/app';

  // Professional localized copy matching Soukday brand voice
  const bannerTitle =
    title ||
    (isFr
      ? "Vivez pleinement l’expérience Soukday"
      : 'Get the full Soukday experience');

  const bannerSubtitle =
    subtitle ||
    (isFr
      ? 'Scannez le code QR avec votre téléphone pour commander plus rapidement. Première livraison offerte !'
      : 'Scan the QR code with your phone camera for faster ordering. First delivery is free!');

  return (
    <section className={`w-full py-4 sm:py-6 bg-stone-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Soukday Brand Warm Card Container */}
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFF5F1] via-[#FDF1EB] to-[#FFF8F5] border border-[#FCDCD0] shadow-sm hover:shadow-md transition-all duration-300">
          
          {/* Subtle warm decorative background orbs */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#F68B62]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-[#F59E0B]/8 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between min-h-[140px] md:h-[150px] px-4 sm:px-6 lg:px-8 py-4 md:py-0 gap-4 md:gap-6">
            
            {/* ================= 1. LEFT: Illustration / Smartphone Mockup ================= */}
            <div className="w-full md:w-auto flex items-end justify-center md:justify-start shrink-0 h-[120px] sm:h-[135px] md:h-[150px] -mb-1 md:mb-0">
              {!imageFailed && imageSrc ? (
                <img
                  src={imageSrc}
                  alt={bannerTitle}
                  className="h-full w-auto max-w-[240px] sm:max-w-[280px] md:max-w-[320px] object-contain object-bottom select-none transition-transform duration-300 hover:scale-105"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="h-full w-[200px] sm:w-[240px] md:w-[270px] flex items-end">
                  <SoukdayAppHandIllustration
                    className="w-full h-full object-bottom"
                    width="100%"
                    height="100%"
                    isFrench={isFr}
                  />
                </div>
              )}
            </div>

            {/* ================= 2. CENTER: Title, Subtitle & Value Pills ================= */}
            <div className="flex-1 text-center md:text-left min-w-0 py-1 md:py-0 space-y-1.5 sm:space-y-2">
              
              {/* Heading */}
              <div>
                <a
                  href={targetQrUrl}
                  className="group inline-flex items-center gap-2 focus:outline-hidden"
                >
                  <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-[25px] font-black tracking-tight text-stone-900 group-hover:text-[#F68B62] transition-colors leading-tight">
                    {isFr ? (
                      <>
                        Vivez l'expérience{' '}
                        <span className="text-[#F68B62] underline decoration-[#F68B62]/40 group-hover:decoration-[#F68B62] underline-offset-4 decoration-2">
                          Soukday
                        </span>
                      </>
                    ) : (
                      <>
                        Get the full{' '}
                        <span className="text-[#F68B62] underline decoration-[#F68B62]/40 group-hover:decoration-[#F68B62] underline-offset-4 decoration-2">
                          Soukday
                        </span>{' '}
                        experience
                      </>
                    )}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-[#F68B62] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden sm:inline-block" />
                </a>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm md:text-[14.5px] font-medium text-stone-600 mt-1 leading-snug max-w-xl">
                  {bannerSubtitle}
                </p>
              </div>

              {/* Trust & Benefit Pills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 pt-0.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F68B62]/10 text-[#e07750] text-[11px] font-bold">
                  <Tag className="w-3 h-3 text-[#F68B62]" />
                  {isFr ? '1ère livraison offerte' : 'Free 1st delivery'}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {isFr ? 'Boucheries 100% Halal' : '100% Halal Butchers'}
                </span>

                <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold">
                  <Truck className="w-3 h-3 text-stone-600" />
                  {isFr ? 'Délai 24 - 48 h' : '24 - 48h delivery'}
                </span>
              </div>

              {/* Mobile Quick-Tap Store Badges */}
              <div className="flex md:hidden items-center justify-center gap-2 pt-2">
                <a
                  href={appStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-2xs hover:bg-black transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.63 1.34-.56.64-1.04 1.7-0.91 2.73.99.08 2.01-.48 2.62-1.22z"/>
                  </svg>
                  App Store
                </a>
                <a
                  href={playStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-2xs hover:bg-black transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.61-.954V2.768c.15-.37.37-.694.609-.954zm11.236 11.24l2.124 2.123-11.85 6.843 9.726-8.966zm0-2.108L5.119 1.98l11.85 6.844-2.124 2.122zm1.447 1.054l3.527-2.036c.928-.536.928-1.41 0-1.946l-3.527-2.036-2.28 2.28 2.28 2.28z"/>
                  </svg>
                  Google Play
                </a>
              </div>
            </div>

            {/* ================= 3. RIGHT: Transparent QR Code (No white background) ================= */}
            <div className="shrink-0 flex items-center justify-center py-1 md:py-0">
              <a
                href={targetQrUrl}
                title={isFr ? "Scannez avec votre téléphone" : "Scan with your phone"}
                className="group flex flex-col items-center bg-transparent p-1 transition-all duration-200 active:scale-95 w-[120px] sm:w-[135px] shrink-0"
              >
                {/* Strictly sized square QR container without white box */}
                <div className="relative w-[92px] h-[92px] sm:w-[106px] sm:h-[106px] flex items-center justify-center bg-transparent">
                  <img
                    src="/images/qr-soukday.svg"
                    alt="Code QR Soukday"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      if (
                        typeof window !== 'undefined' &&
                        !e.currentTarget.src.includes('qrserver.com')
                      ) {
                        e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fsoukday.ca%2Fapp&color=1c1917&margin=1`;
                      }
                    }}
                  />

                  {/* Centered Brand Circle Badge */}
                  <div className="absolute inset-0 m-auto w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full p-0.5 shadow-xs border border-stone-200 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                    <img
                      src="/images/favicon.png"
                      alt="Soukday"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>

                {/* Subtext under QR */}
                <span className="text-[10.5px] font-bold text-stone-800 mt-1.5 text-center leading-tight">
                  {isFr ? 'Scannez pour installer' : 'Scan to install'}
                </span>
                <span className="text-[9.5px] font-bold text-[#F68B62] text-center tracking-tight">
                  iOS & Android
                </span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
