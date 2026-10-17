'use client';

import React from 'react';
import Link from 'next/link';
import { LiveWebSettings } from '../types';
import { DEFAULT_LIVE_SETTINGS } from '../services/api';
import { 
  Store, 
  Truck, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Globe2
} from 'lucide-react';

interface FooterProps {
  settings?: LiveWebSettings;
}

export default function Footer({ settings = DEFAULT_LIVE_SETTINGS }: FooterProps) {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-stone-800 text-xs">
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

        {/* Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              {settings?.webFooterLogo ? (
                <img 
                  src={settings.webFooterLogo} 
                  alt={settings.siteTitle || 'Soukday'} 
                  className="h-9 sm:h-10 w-auto max-w-[190px] object-contain" 
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
              {settings?.footerAboutText || 'Soukday est la première plateforme d’épiceries orientales, boucheries halal et spécialités du monde au Canada. Faites votre marché en toute confiance et recevez vos produits favoris chez vous.'}
            </p>
            <div className="text-stone-400 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F68B62]" />
                <span>{settings?.footerAddress || 'Montréal, Québec, Canada'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F68B62]" />
                <span>{settings?.footerEmail || 'contact@soukday.ca'}</span>
              </div>
              {settings?.footerPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#F68B62]" />
                  <span>{settings.footerPhone}</span>
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
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            {settings?.copyrightDetails || '© 2026 Soukday Inc. Tous droits réservés. Plateforme de commerce multi-vendeurs.'}
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Conditions d’utilisation</span>
            <span>•</span>
            <span className="hover:text-stone-300 cursor-pointer">Politique de confidentialité</span>
            <span>•</span>
            <span className="hover:text-stone-300 cursor-pointer">Frais de livraison</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
