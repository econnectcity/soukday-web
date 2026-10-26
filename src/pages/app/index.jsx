'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { useTranslation } from '@/utils/translation';
import { Smartphone, Download, ArrowRight, ExternalLink } from 'lucide-react';

export default function AppRedirectPage() {
  const { isFrench } = useTranslation();
  const settings = useSelector((state) => state.Setting?.setting);
  const [redirecting, setRedirecting] = useState(true);

  const androidUrl =
    settings?.playstore_url ||
    'https://play.google.com/store';
  const iosUrl =
    settings?.appstore_url ||
    'https://apps.apple.com';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /android/i.test(ua);

    if (isIOS && iosUrl) {
      window.location.href = iosUrl;
    } else if (isAndroid && androidUrl) {
      window.location.href = androidUrl;
    } else {
      setRedirecting(false);
    }
  }, [androidUrl, iosUrl]);

  return (
    <>
      <Head>
        <title>{isFrench ? "Télécharger l'application Soukday" : "Download Soukday Mobile App"}</title>
      </Head>

      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-stone-100 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#F68B62]/10 p-3 flex items-center justify-center">
            <img
              src="/images/favicon.png"
              alt="Soukday"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              {isFrench ? "Application Mobile Soukday" : "Soukday Mobile App"}
            </h1>
            <p className="text-sm text-stone-600 mt-2">
              {isFrench
                ? "Vos épiceries orientales et boucheries halal à portée de main avec livraison rapide."
                : "Your Oriental groceries and Halal butcher shops at your fingertips with fast delivery."}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={iosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-black text-white font-bold hover:bg-stone-800 transition-colors shadow-sm"
            >
              <Smartphone className="w-5 h-5 text-white" />
              <span>{isFrench ? "Télécharger sur l'App Store" : "Download on the App Store"}</span>
            </a>

            <a
              href={androidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-[#F68B62] text-white font-bold hover:bg-[#e07750] transition-colors shadow-sm shadow-[#F68B62]/20"
            >
              <Download className="w-5 h-5 text-white" />
              <span>{isFrench ? "Disponible sur Google Play" : "Get it on Google Play"}</span>
            </a>
          </div>

          <p className="text-xs text-stone-400">
            {isFrench
              ? "© 2026 Soukday Inc. Tous droits réservés."
              : "© 2026 Soukday Inc. All rights reserved."}
          </p>
        </div>
      </div>
    </>
  );
}
