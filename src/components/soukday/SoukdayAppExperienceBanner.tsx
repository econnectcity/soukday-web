'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/utils/translation';
import { LiveWebSettings } from '@/types';
import { DEFAULT_LIVE_SETTINGS } from '@/services/soukdayApi';
import SoukdayAppHandIllustration from './SoukdayAppHandIllustration';
import { Sparkles, QrCode, Smartphone, ArrowUpRight } from 'lucide-react';

/**
 * Recommended Image Specifications for Custom Designer Graphics:
 * -------------------------------------------------------------
 * - Canvas Dimensions : 480 × 260 px (or 600 × 325 px for Retina @2x)
 * - Aspect Ratio       : ~ 1.85 : 1 (or 16:9)
 * - File Format        : PNG (24-bit with alpha transparency) or WebP
 * - Target File Path   : /public/images/soukday-app-experience.png
 * - Composition        : Hand entering from the bottom-left corner holding a smartphone
 *                        angled upwards, surrounded by golden sparkles. Transparent background
 *                        so it blends seamlessly with the mint banner.
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
  const { isFrench } = useTranslation();
  const [imageFailed, setImageFailed] = useState(false);

  // App URLs from settings or fallbacks
  const playStoreLink =
    (settings as any)?.playstore_url ||
    (settings as any)?.androidAppUrl ||
    'https://play.google.com/store/apps';
  const appStoreLink =
    (settings as any)?.appstore_url ||
    (settings as any)?.iosAppUrl ||
    'https://www.apple.com/app-store/';
  const targetQrUrl = qrUrl || (settings as any)?.websiteUrl || 'https://soukday.ca';

  // Localized texts matching Instacart copy style
  const bannerTitle =
    title ||
    (settings as any)?.appBannerTitle ||
    (isFrench
      ? "Obtenez l'expérience complète Soukday"
      : 'Get the full Soukday experience');

  const bannerSubtitle =
    subtitle ||
    (settings as any)?.appBannerSubtitle ||
    (isFrench
      ? 'Scannez le code QR avec votre appareil photo. Première livraison offerte.'
      : 'Scan the QR code with your camera. First delivery is free.');

  const scanLabel = isFrench ? 'Scannez avec votre caméra' : 'Scan with your camera';

  return (
    <section className={`w-full py-3 sm:py-4 bg-stone-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Instacart-style Mint Banner Container */}
        <div
          className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#c1ebd7] shadow-xs hover:shadow-md transition-all duration-300"
          style={{
            backgroundColor: '#daf2e9',
          }}
        >
          {/* Subtle background ambient shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/40 via-transparent to-emerald-200/30 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between min-h-[110px] sm:min-h-[120px] md:h-[135px] px-4 sm:px-6 lg:px-8 py-3 md:py-0 gap-3 md:gap-6">
            
            {/* 1. LEFT: Illustration / Image Slot */}
            <div className="w-full md:w-auto flex items-end justify-center md:justify-start shrink-0 h-[105px] sm:h-[120px] md:h-[135px] -mb-1 md:mb-0">
              {!imageFailed && imageSrc ? (
                <img
                  src={imageSrc}
                  alt={bannerTitle}
                  className="h-full w-auto max-w-[220px] sm:max-w-[260px] md:max-w-[280px] object-contain object-bottom select-none transition-transform duration-300 hover:scale-105"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="h-full w-[170px] sm:w-[210px] md:w-[240px] flex items-end">
                  <SoukdayAppHandIllustration
                    className="w-full h-full object-bottom"
                    width="100%"
                    height="100%"
                  />
                </div>
              )}
            </div>

            {/* 2. CENTER: Title & Subtitle */}
            <div className="flex-1 text-center md:text-left min-w-0 py-1 md:py-0">
              <a
                href={targetQrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 focus:outline-hidden"
              >
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[26px] font-bold tracking-tight text-[#103a22] group-hover:text-[#064e3b] underline decoration-[#103a22]/60 hover:decoration-[#103a22] underline-offset-3 decoration-1 transition-colors">
                  {bannerTitle}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-[#103a22] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-block" />
              </a>

              <p className="text-xs sm:text-sm md:text-[15px] font-medium text-[#205737] mt-0.5 sm:mt-1 leading-snug">
                {bannerSubtitle}
              </p>

              {/* Mobile quick-tap buttons (convenience for phone users who can't scan their own screen) */}
              <div className="flex md:hidden items-center justify-center gap-2 mt-2 pt-1 border-t border-[#c1ebd7]/80">
                <a
                  href={appStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 hover:bg-white text-[#103a22] text-[11px] font-semibold rounded-full shadow-2xs border border-[#bce7d3]"
                >
                  <Smartphone className="w-3 h-3 text-emerald-700" />
                  App Store
                </a>
                <a
                  href={playStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 hover:bg-white text-[#103a22] text-[11px] font-semibold rounded-full shadow-2xs border border-[#bce7d3]"
                >
                  <Smartphone className="w-3 h-3 text-emerald-700" />
                  Google Play
                </a>
              </div>
            </div>

            {/* 3. RIGHT: Instacart-Style White QR Code Card */}
            <div className="shrink-0 flex items-center justify-center py-1 md:py-0">
              <a
                href={targetQrUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={scanLabel}
                className="group flex flex-col items-center bg-white p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xs hover:shadow-md border border-[#c1ebd7] transition-all duration-200 active:scale-95"
              >
                {/* QR Code Container with Centered Soukday Logo Badge */}
                <div className="relative w-18 h-18 sm:w-21 sm:h-21 md:w-22 md:h-22 bg-white flex items-center justify-center">
                  <img
                    src="/images/qr-soukday.svg"
                    alt="Code QR Soukday"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback dynamic QR API if local SVG is unavailable
                      if (
                        typeof window !== 'undefined' &&
                        !e.currentTarget.src.includes('qrserver.com')
                      ) {
                        e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          targetQrUrl
                        )}&color=103a22&margin=0`;
                      }
                    }}
                  />

                  {/* Centered Soukday Brand Badge (like the carrot inside Instacart's QR code) */}
                  <div className="absolute inset-0 m-auto w-5.5 h-5.5 sm:w-6 sm:h-6 bg-white rounded-md shadow-xs border border-stone-200/80 flex items-center justify-center p-0.5 pointer-events-none group-hover:scale-110 transition-transform">
                    <img
                      src="/images/favicon.png"
                      alt="Soukday Logo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                <span className="hidden sm:inline-block text-[10px] font-bold text-[#103a22] mt-1 tracking-tight">
                  {scanLabel}
                </span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
