'use client';

import React, { useRef } from 'react';
import { useCart } from '@/context/SoukdayCartContext';
import { Category } from '@/types';
import { useTranslation } from '@/utils/translation';
import { ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface CategorySliderProps {
  categories?: Category[];
}

// Pastel palettes & organic blob styling matching the reference design
const PASTEL_PALETTE = [
  { bg: '#EFE9F8', dot: '#FF7A45', blobRadius: '60% 40% 70% 30% / 50% 60% 40% 50%' }, // Soft Lavender
  { bg: '#FEEAE1', dot: '#FF7A45', blobRadius: '50% 60% 40% 70% / 60% 40% 60% 40%' }, // Soft Peach
  { bg: '#EBF1E9', dot: '#FF7A45', blobRadius: '70% 30% 60% 40% / 40% 60% 40% 60%' }, // Soft Sage
  { bg: '#FEEBF0', dot: '#FF7A45', blobRadius: '40% 60% 50% 50% / 50% 40% 60% 50%' }, // Soft Rose
  { bg: '#E8F0F8', dot: '#FF7A45', blobRadius: '60% 40% 40% 60% / 50% 50% 50% 50%' }, // Soft Sky
  { bg: '#FEF5E7', dot: '#FF7A45', blobRadius: '50% 50% 60% 40% / 60% 40% 50% 50%' }, // Soft Amber
  { bg: '#F3E8FF', dot: '#FF7A45', blobRadius: '45% 55% 65% 35% / 45% 55% 45% 55%' }, // Soft Violet
  { bg: '#E6F4EA', dot: '#FF7A45', blobRadius: '55% 45% 45% 55% / 55% 45% 55% 45%' }, // Soft Mint
];

export default function CategorySlider({ categories = [] }: CategorySliderProps) {
  const { selectedCategory, setSelectedCategory } = useCart();
  const { isFrench } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayCategories = categories || [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
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
    <section className="py-8 sm:py-12 border-b border-stone-200/60 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#FCEFEA] border border-[#F68B62]/30 flex items-center justify-center text-[#F68B62] shadow-xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-tight">
                {isFrench ? "Tout un souk à découvrir" : "A whole souk to discover"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium truncate sm:whitespace-normal">
                {isFrench ? "Épicerie, viandes halal, pâtisseries et bien plus." : "Groceries, halal meats, pastries and much more."}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:text-[#FF7A45] hover:bg-[#FCEFEA] hover:border-[#FF7A45]/40 shadow-xs transition-all cursor-pointer active:scale-95"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:text-[#FF7A45] hover:bg-[#FCEFEA] hover:border-[#FF7A45]/40 shadow-xs transition-all cursor-pointer active:scale-95"
              aria-label="Suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Category Cards Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-start gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {/* Card 1: 'All' / 'Tous les rayons' */}
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className="w-[124px] sm:w-[142px] md:w-[154px] shrink-0 flex flex-col items-center group cursor-pointer text-center outline-none"
          >
            {/* The Rounded Square Card */}
            <div
              className={`w-full aspect-square rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 ${
                selectedCategory === null
                  ? 'bg-[#FFF8F4] shadow-md -translate-y-1 border border-stone-300/80'
                  : 'bg-[#FAF7F2] hover:bg-[#F6F2EC] hover:shadow-md border border-stone-200/60'
              }`}
            >
              {/* Organic Pastel Blob */}
              <div
                className="absolute inset-2.5 rounded-full pointer-events-none opacity-90 transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundColor: '#EDE9F6',
                  borderRadius: '50% 60% 40% 70% / 60% 40% 60% 40%',
                }}
              />

              {/* Accent Dot */}
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#FF7A45] shadow-xs" />

              {/* Packshot Image */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-1 sm:p-2">
                <img
                  src="/images/categories/all-aisles.jpg"
                  alt={isFrench ? "Tous les rayons" : "All Aisles"}
                  className="w-full h-full object-contain max-h-[82px] sm:max-h-[102px] mix-blend-multiply group-hover:scale-110 transition-transform duration-300 ease-out drop-shadow-sm pointer-events-none select-none"
                />
              </div>
            </div>

            {/* Title Underneath Card */}
            <div
              className={`mt-2.5 sm:mt-3 text-xs sm:text-sm font-bold tracking-tight transition-colors line-clamp-2 px-1 ${
                selectedCategory === null ? 'text-[#FF7A45] font-extrabold' : 'text-stone-900 group-hover:text-[#FF7A45]'
              }`}
            >
              {isFrench ? "Tous les rayons" : "All Aisles"}
            </div>
          </button>

          {/* Dynamic Categories From Live Admin API */}
          {displayCategories.map((cat, index) => {
            const isSelected = selectedCategory === cat.slug;
            const palette = PASTEL_PALETTE[index % PASTEL_PALETTE.length];

            return (
              <button
                key={cat.id || index}
                type="button"
                onClick={() => handleSelect(cat.slug)}
                className="w-[124px] sm:w-[142px] md:w-[154px] shrink-0 flex flex-col items-center group cursor-pointer text-center outline-none"
              >
                {/* The Rounded Square Card */}
                <div
                  className={`w-full aspect-square rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 ${
                    isSelected
                      ? 'bg-[#FFF8F4] shadow-md -translate-y-1 border border-stone-300/80'
                      : 'bg-[#FAF7F2] hover:bg-[#F6F2EC] hover:shadow-md border border-stone-200/60'
                  }`}
                >
                  {/* Organic Pastel Blob */}
                  <div
                    className="absolute inset-2.5 rounded-full pointer-events-none opacity-90 transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundColor: palette.bg,
                      borderRadius: palette.blobRadius,
                    }}
                  />

                  {/* Accent Dot */}
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#FF7A45] shadow-xs" />

                  {/* Category Image From Admin Panel or Default Packshot */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-1 sm:p-2">
                    <img
                      src={cat.image || '/images/categories/all-aisles.jpg'}
                      alt={cat.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/categories/all-aisles.jpg';
                      }}
                      className="w-full h-full object-contain max-h-[82px] sm:max-h-[102px] mix-blend-multiply group-hover:scale-110 transition-transform duration-300 ease-out drop-shadow-sm pointer-events-none select-none"
                    />
                  </div>
                </div>

                {/* Title Underneath Card */}
                <div
                  className={`mt-2.5 sm:mt-3 text-xs sm:text-sm font-bold tracking-tight transition-colors line-clamp-2 px-1 ${
                    isSelected ? 'text-[#FF7A45] font-extrabold' : 'text-stone-900 group-hover:text-[#FF7A45]'
                  }`}
                >
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
