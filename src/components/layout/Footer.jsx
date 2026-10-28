'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { 
  Truck, 
  ShieldCheck, 
  Globe2, 
  Store, 
  MapPin, 
  Mail, 
  Phone 
} from 'lucide-react';
import PreFooterAppBanner from './PreFooterAppBanner';

export default function Footer() {
  const settingState = useSelector((state) => state.Setting);
  const setting = settingState?.setting || {};
  const webSettings = setting?.web_settings || {};

  const footerLogo =
    webSettings?.web_footer_logo ||
    webSettings?.web_header_logo ||
    webSettings?.web_logo ||
    setting?.web_logo ||
    setting?.logo ||
    '/images/logo.png';

  const siteTitle = webSettings?.site_title || setting?.app_name || 'Soukday';

  return (
    <>
      <PreFooterAppBanner />
      <footer className="w-full bg-[#141a1f] text-stone-300 text-xs border-t border-stone-800">
        
        {/* 4 Value Props / Trust Badges Bar */}
      <div className="border-b border-stone-800/80 bg-stone-900/60 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F68B62] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Livraison express</div>
              <div className="text-stone-400 mt-0.5">Livraison locale le jour même pour viandes et frais.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F68B62] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Boucheries 100% Halal</div>
              <div className="text-stone-400 mt-0.5">Certifiées avec découpe sur mesure à la commande.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F68B62] shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Épicerie Canada & USA</div>
              <div className="text-stone-400 mt-0.5">Expédition garantie d’épicerie sèche dans 10 provinces.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F68B62] shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Commerçants locaux</div>
              <div className="text-stone-400 mt-0.5">Soutenez vos épiciers et bouchers de quartier.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              {footerLogo ? (
                <img 
                  src={footerLogo} 
                  alt={siteTitle} 
                  className="h-9 sm:h-10 w-auto max-w-[190px] object-contain" 
                  onError={(e) => {
                    if (typeof window !== 'undefined' && e.currentTarget.src !== window.location.origin + '/images/logo.png') {
                      e.currentTarget.src = '/images/logo.png';
                    }
                  }}
                />
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F68B62] to-[#ff9e7a] flex items-center justify-center text-white font-black text-lg">
                    S
                  </div>
                  <span className="text-2xl font-black text-white tracking-tight">
                    Souk<span className="text-[#F68B62]">day</span>
                  </span>
                </>
              )}
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              {webSettings?.footer_about_text || 'Soukday est la première plateforme d’épiceries orientales, boucheries halal et spécialités du monde au Canada. Faites votre marché en toute confiance et recevez vos produits favoris chez vous.'}
            </p>
            <div className="text-stone-400 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F68B62]" />
                <span>{webSettings?.footer_address || 'Montréal, Québec, Canada'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F68B62]" />
                <span>{webSettings?.footer_email || 'contact@soukday.ca'}</span>
              </div>
              {webSettings?.footer_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#F68B62]" />
                  <span>{webSettings.footer_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Magasins */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              Boucheries & Magasins
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>Marché Yasmine Montréal</li>
              <li>Marché Yasmine Brossard</li>
              <li>Marché Yasmine Terrebonne</li>
              <li>Boucherie Zakiya Montréal</li>
              <li>Boucherie Zakiya Saint-Léonard</li>
              <li>Boucherie Koutoubia</li>
              <li>Marché Daata Laval</li>
              <li>Marché Zerda Saint-Léonard</li>
              <li>Boucherie Mamounia</li>
              <li>Boucherie Melia Halal</li>
            </ul>
          </div>

          {/* Zones desservies */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              Villes Desservies
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>Montréal & Côte-des-Neiges</li>
              <li>Saint-Laurent</li>
              <li>Saint-Léonard</li>
              <li>Laval & Chomedey</li>
              <li>Brossard (Rive-Sud)</li>
              <li>Terrebonne</li>
              <li>Saint-Jérôme</li>
              <li className="text-[#F68B62] font-semibold">Toutes les provinces du Canada (Épicerie)</li>
            </ul>
          </div>

          {/* Partenaires & Liens */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              Espace Professionnel
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>
                <a 
                  href="https://admin.soukday.ca/#/seller/register"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Devenir vendeur partenaire
                </a>
              </li>
              <li>
                <a 
                  href="https://admin.soukday.ca/#/seller/login"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Connexion portail vendeur
                </a>
              </li>
              <li>
                <a 
                  href="https://admin.soukday.ca/#/delivery_boy/login"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Espace Livreur
                </a>
              </li>
              <li>
                <a 
                  href="https://admin.soukday.ca/#/login"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Portail Administration
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            {webSettings?.copyright_details || '© 2026 Soukday Inc. Tous droits réservés. Plateforme de commerce multi-vendeurs.'}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms-and-conditions" className="hover:text-stone-300">Conditions d’utilisation</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-stone-300">Politique de confidentialité</Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:text-stone-300">Frais de livraison</Link>
          </div>
        </div>

      </div>
    </footer>
    </>
  );
}
