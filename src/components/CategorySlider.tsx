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
    <section className="py-8 sm:py-10 border-b border-stone-200/60 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FCEFEA] border border-[#F68B62]/30 flex items-center justify-center text-[#F68B62] shadow-xs shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight leading-tight">
                Rayons &amp; Catégories
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium truncate sm:whitespace-normal">
                Parcourez tous les rayons frais, épiceries et spécialités
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:text-[#F68B62] hover:bg-[#FCEFEA] hover:border-[#F68B62]/40 shadow-xs transition-colors cursor-pointer"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:text-[#F68B62] hover:bg-[#FCEFEA] hover:border-[#F68B62]/40 shadow-xs transition-colors cursor-pointer"
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
          {/* 'All' button - styled with identical height & layout as category cards */}
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`category-chip group shrink-0 flex items-center gap-3 p-1.5 pr-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-[#F68B62] text-white border-[#F68B62] shadow-md shadow-[#F68B62]/25'
                : 'bg-stone-50 hover:bg-[#FCEFEA]/70 hover:border-[#F68B62]/50 text-stone-800 border-stone-200/80'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 flex items-center justify-center transition-all ${
              selectedCategory === null
                ? 'bg-white/20 text-white'
                : 'bg-[#FCEFEA] text-[#F68B62] group-hover:bg-[#F68B62] group-hover:text-white'
            }`}>
              <Layers className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <div className={`text-xs font-bold leading-tight transition-colors ${
                selectedCategory === null ? 'text-white' : 'text-stone-900 group-hover:text-[#F68B62]'
              }`}>
                Tous les rayons
              </div>
              <div className={`text-[10px] leading-snug transition-colors ${
                selectedCategory === null ? 'text-white/80' : 'text-stone-400 group-hover:text-stone-600'
              }`}>
                Tout le catalogue
              </div>
            </div>
          </button>

          {/* Categories List */}
          {displayCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat.slug)}
                className={`category-chip group shrink-0 flex items-center gap-3 p-1.5 pr-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#F68B62] text-white border-[#F68B62] shadow-md shadow-[#F68B62]/25'
                    : 'bg-stone-50 hover:bg-[#FCEFEA]/70 hover:border-[#F68B62]/50 text-stone-800 border-stone-200/80'
                }`}
              >
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-200 shrink-0 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500 ease-out"
                  />
                  <span className="absolute bottom-0.5 right-0.5 text-xs drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight transition-colors ${isSelected ? 'text-white' : 'text-stone-900 group-hover:text-[#F68B62]'}`}>
                    {cat.name}
                  </div>
                  <div className={`text-[10px] leading-snug truncate max-w-[120px] transition-colors ${isSelected ? 'text-white/80' : 'text-stone-400 group-hover:text-stone-600'}`}>
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
