'use client';

import React, { useRef } from 'react';
import { useCart } from '@/context/SoukdayCartContext';
import { Category } from '@/types';
import { useTranslation } from '@/utils/translation';
import { getTranslatedCategoryName } from '@/utils/categoryTranslation';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface CategorySliderProps {
  categories?: Category[];
}

export default function CategorySlider({ categories = [] }: CategorySliderProps) {
  const { selectedCategory, setSelectedCategory } = useCart();
  const { isFrench } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayCategories = categories || [];

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
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight leading-tight">
              {isFrench ? "Tout un souk à découvrir" : "A whole souk to discover"}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium truncate sm:whitespace-normal mt-0.5">
              {isFrench 
                ? "Épicerie, viandes halal, pâtisseries et bien plus." 
                : "Groceries, halal meats, pastries and much more."}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-[#F68B62] bg-[#F68B62] hover:bg-[#e07750] hover:border-[#e07750] flex items-center justify-center text-white shadow-xs hover:shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label={isFrench ? "Précédent" : "Previous"}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-[#F68B62] bg-[#F68B62] hover:bg-[#e07750] hover:border-[#e07750] flex items-center justify-center text-white shadow-xs hover:shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label={isFrench ? "Suivant" : "Next"}
            >
              <ChevronRight className="w-4 h-4 text-white" />
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
                ? 'bg-[#F68B62] text-white border-[#F68B62] shadow-md shadow-[#F68B62]/30'
                : 'bg-[#FFF8F5] text-stone-800 border-[#F68B62]/40 shadow-md shadow-[#F68B62]/20 hover:shadow-lg hover:shadow-[#F68B62]/35 hover:border-[#F68B62]/70 hover:-translate-y-0.5'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 flex items-center justify-center transition-all ${
              selectedCategory === null
                ? 'bg-white/20 text-white'
                : 'bg-[#FCEFEA] text-[#F68B62] group-hover:bg-[#F68B62] group-hover:text-white'
            }`}>
              <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <div className={`text-xs font-bold leading-tight transition-colors ${
                selectedCategory === null ? 'text-white' : 'text-black'
              }`}>
                {isFrench ? "Tous les rayons" : "All aisles"}
              </div>
            </div>
          </button>

          {/* Categories List */}
          {displayCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const categoryTitle = getTranslatedCategoryName(cat, isFrench);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat.slug)}
                className={`category-chip group shrink-0 flex items-center gap-3 p-1.5 pr-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#F68B62] text-white border-[#F68B62] shadow-md shadow-[#F68B62]/30'
                    : 'bg-[#FFF8F5] text-stone-800 border-[#F68B62]/40 shadow-md shadow-[#F68B62]/20 hover:shadow-lg hover:shadow-[#F68B62]/35 hover:border-[#F68B62]/70 hover:-translate-y-0.5'
                }`}
              >
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-200 shrink-0 relative">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                    alt={categoryTitle}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500 ease-out"
                  />
                  <span className="absolute bottom-0.5 right-0.5 text-xs drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight transition-colors ${isSelected ? 'text-white' : 'text-black'}`}>
                    {categoryTitle}
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
