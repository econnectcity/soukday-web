'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { POPULAR_LOCATIONS } from '../data/mockData';
import { X, MapPin, Check, ArrowRight } from 'lucide-react';

export default function AddressModal() {
  const { isAddressModalOpen, setIsAddressModalOpen, selectedAddress, setSelectedAddress } = useCart();
  const [postalInput, setPostalInput] = useState(selectedAddress.postalCode || '');

  if (!isAddressModalOpen) return null;

  const handleCustomPostal = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = postalInput.trim().toUpperCase();
    if (!clean) return;

    const matched = POPULAR_LOCATIONS.find(
      (loc) => loc.postalCode.replace(/\s+/g, '') === clean.replace(/\s+/g, '') ||
               loc.city.toLowerCase() === clean.toLowerCase()
    );

    if (matched) {
      setSelectedAddress({
        address: `${matched.city}, QC`,
        city: matched.city,
        postalCode: matched.postalCode,
      });
    } else {
      setSelectedAddress({
        address: `${clean}, QC`,
        city: 'Montréal & Environs',
        postalCode: clean,
      });
    }

    setIsAddressModalOpen(false);
  };

  const handleSelectLocation = (loc: typeof POPULAR_LOCATIONS[0]) => {
    setSelectedAddress({
      address: `${loc.city}, QC`,
      city: loc.city,
      postalCode: loc.postalCode,
    });
    setIsAddressModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAddressModalOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-5 animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F68B62]/10 text-[#F68B62] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900">Adresse de livraison</h3>
                <p className="text-xs text-stone-500">Pour afficher les magasins et boucheries qui vous livrent</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Postal code input form */}
          <form onSubmit={handleCustomPostal} className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">
              Entrez votre code postal ou ville :
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={postalInput}
                onChange={(e) => setPostalInput(e.target.value)}
                placeholder="Ex: H4L 3M8, Laval, Montréal"
                className="flex-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#F68B62] focus:bg-white text-sm font-semibold text-stone-900 uppercase focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#F68B62] hover:bg-[#e07750] text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <span>Valider</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Preset Quebec Locations */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Ou sélectionnez une zone du Québec :
            </div>
            <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {POPULAR_LOCATIONS.map((loc) => {
                const isSelected = selectedAddress.postalCode === loc.postalCode;
                return (
                  <button
                    key={loc.postalCode}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F68B62]/10 text-[#F68B62] border border-[#F68B62]/30'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F68B62]' : 'text-stone-400'}`} />
                      <span>{loc.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px]">
                      <span>{loc.postalCode}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#F68B62]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
