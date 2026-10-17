'use client';

import React, { useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Category } from '../types';
import { MAIN_CATEGORIES } from '../data/mockData';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface CategorySliderProps {
  categories?: Category[];
}

export default function CategorySlider({ categories = MAIN_CATEGORIES }: CategorySliderProps) {
  const { selectedCategory, setSelectedCategory } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayCategories = categories && categories.length > 0 ? categories : MAIN_CATEGORIES;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleSelect = (slug: string) => {
    if (selectedCategory === slug) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(slug);
    }
  };

  return (
    <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-b border-stone-200/60 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FCEFEA] border border-[#F68B62]/20 flex items-center justify-center text-[#F68B62]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                Rayons & Catégories
              </h2>
              <p className="text-xs text-stone-500">
                Parcourez tous les rayons frais, épiceries et spécialités
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:text-[#F68B62] hover:bg-[#FCEFEA] hover:border-[#F68B62]/40 transition-colors cursor-pointer"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:text-[#F68B62] hover:bg-[#FCEFEA] hover:border-[#F68B62]/40 transition-colors cursor-pointer"
              aria-label="Suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Swipeable Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {/* 'All' button */}
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-[#F68B62] text-white border-[#F68B62] shadow-md shadow-[#F68B62]/20 scale-[1.02]'
                : 'bg-stone-50 hover:bg-[#FCEFEA]/70 hover:border-[#F68B62]/40 text-stone-700 border-stone-200/80'
            }`}
          >
            <span className="text-base">✨</span>
            <span>Tous les rayons</span>
          </button>

          {/* Categories List */}
          {displayCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat.slug)}
                className={`group shrink-0 flex items-center gap-3 p-1.5 pr-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F68B62] text-white border-[#F68B62] shadow-md shadow-[#F68B62]/20 scale-[1.02]'
                    : 'bg-stone-50 hover:bg-[#FCEFEA]/60 hover:border-[#F68B62]/40 text-stone-800 border-stone-200/80'
                }`}
              >
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-200 shrink-0 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="absolute bottom-0.5 right-0.5 text-xs drop-shadow-sm">
                    {cat.icon}
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {cat.name}
                  </div>
                  <div className={`text-[10px] leading-snug truncate max-w-[120px] ${isSelected ? 'text-white/80' : 'text-stone-400'}`}>
                    {cat.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
