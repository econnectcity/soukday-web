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

        {/* Links Columns */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 text-xs">
            
            {/* Column 1: Logo in white (1) & Tagline (2) */}
            <div className="col-span-2 md:col-span-1 lg:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                {footerLogo ? (
                  <img 
                    src={footerLogo} 
                    alt={siteTitle} 
                    className="h-9 sm:h-10 w-auto max-w-[190px] object-contain brightness-0 invert" 
                    onError={(e) => {
                      if (typeof window !== 'undefined' && e.currentTarget.src !== window.location.origin + '/images/logo.png') {
                        e.currentTarget.src = '/images/logo.png';
                      }
                    }}
                  />
                ) : (
                  <span className="text-2xl font-black text-white tracking-tight">
                    Soukday
                  </span>
                )}
              </div>
              <p className="text-stone-200 text-sm sm:text-[15px] font-bold tracking-tight leading-snug">
                Le souk à votre porte
              </p>
              <p className="text-stone-400 text-xs leading-relaxed max-w-xs pt-1">
                {webSettings?.footer_about_text || 'Faites votre marché en toute confiance et recevez vos viandes halal et produits d’épicerie partout chez vous.'}
              </p>
              <div className="text-stone-400 text-xs space-y-1.5 pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#F68B62] shrink-0" />
                  <span>{webSettings?.footer_address || 'Montréal, Québec, Canada'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#F68B62] shrink-0" />
                  <span>{webSettings?.footer_email || 'support@soukday.ca'}</span>
                </div>
                {webSettings?.footer_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#F68B62] shrink-0" />
                    <span>{webSettings.footer_phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2 (3): Nos départements */}
            <div className="space-y-3">
              <div className="font-bold text-white text-[13px] tracking-tight">
                Nos départements
              </div>
              <ul className="space-y-2 text-stone-400">
                <li>
                  <Link href="/products?category=epicerie-maghrebine" className="hover:text-white transition-colors">
                    Épicerie maghrébine
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=viande-et-poulet-halal" className="hover:text-white transition-colors">
                    Viande et poulet Halal
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=boulangerie-et-patisseries" className="hover:text-white transition-colors">
                    Boulangerie et pâtisseries
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=services-traiteurs" className="hover:text-white transition-colors">
                    Services traiteurs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 (4): Notre épicerie */}
            <div className="space-y-3">
              <div className="font-bold text-white text-[13px] tracking-tight">
                Notre épicerie
              </div>
              <ul className="space-y-2 text-stone-400">
                <li>
                  <Link href="/epicerie-soukday" className="hover:text-white transition-colors text-[#F68B62] font-semibold">
                    Épicerie directe Soukday
                  </Link>
                </li>
                <li>
                  <Link href="/epicerie-soukday" className="hover:text-white transition-colors">
                    Expédition Canada & USA
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Tous nos produits
                  </Link>
                </li>
                <li>
                  <Link href="/sellers" className="hover:text-white transition-colors">
                    Tous nos commerces
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 (5): Villes desservies */}
            <div className="space-y-3">
              <div className="font-bold text-white text-[13px] tracking-tight">
                Villes desservies
              </div>
              <ul className="space-y-2 text-stone-400">
                <li>Montréal & Côte-des-Neiges</li>
                <li>Saint-Laurent</li>
                <li>Saint-Léonard</li>
                <li>Laval & Chomedey</li>
                <li>Brossard (Rive-Sud)</li>
                <li>Terrebonne</li>
                <li>Saint-Jérôme</li>
                <li className="text-[#F68B62] font-semibold">
                  Toutes les provinces du Canada (Épicerie)
                </li>
              </ul>
            </div>

            {/* Column 5 (6): Espace Professionnel */}
            <div className="space-y-3">
              <div className="font-bold text-white text-[13px] tracking-tight">
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

          {/* Bottom Bar: Signature */}
          <div className="pt-8 mt-10 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <div>
              © Soukday, 2026. Tous droits réservés. Site web conçu par l’Agence Web{' '}
              <a 
                href="https://econnectcity.ca/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-stone-200 hover:text-[#F68B62] underline underline-offset-2 transition-colors font-medium"
              >
                eConnect City
              </a>
            </div>
            <div className="flex items-center gap-4 text-stone-500">
              <Link href="/terms-and-conditions" className="hover:text-stone-300 transition-colors">
                Conditions d’utilisation
              </Link>
              <span>•</span>
              <Link href="/privacy-policy" className="hover:text-stone-300 transition-colors">
                Politique de confidentialité
              </Link>
              <span>•</span>
              <Link href="/shipping-policy" className="hover:text-stone-300 transition-colors">
                Frais de livraison
              </Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
