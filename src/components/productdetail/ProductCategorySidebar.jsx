'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { LocalizedLink } from '@/utils/localizedNav';
import * as api from '@/api/apiRoutes';
import { getTranslatedCategoryName } from '@/utils/categoryTranslation';
import { getCategoryIcon } from '@/services/soukdayApi';
import { ChevronRight, ChevronDown, Layers, ArrowRight } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '@/data/mockData';

export default function ProductCategorySidebar({ activeCategorySlug, activeCategoryId }) {
  const language = useSelector((state) => state.Language?.selectedLanguage);
  const activeModuleId = useSelector((state) => state.Module?.activeModuleId || 1);
  const isFrench = (language?.code || 'fr').toLowerCase() === 'fr';

  const [expandedCats, setExpandedCats] = useState(() => {
    return activeCategoryId ? [activeCategoryId] : [];
  });

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['sidebar-categories', language?.id, activeModuleId],
    queryFn: async () => {
      try {
        const res = await api.getCategories();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          return res.data;
        }
      } catch (e) {
        console.warn('Sidebar categories fetch fallback:', e);
      }
      return DEFAULT_CATEGORIES;
    },
    staleTime: 1000 * 60 * 10,
  });

  const categories = (categoriesData && categoriesData.length > 0) ? categoriesData : DEFAULT_CATEGORIES;

  const toggleExpand = (catId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCats((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  return (
    <aside className="w-full bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden sticky top-24">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-stone-50 via-white to-stone-50 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F68B62]/10 text-[#F68B62] flex items-center justify-center font-bold">
            <Layers className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-extrabold text-stone-900 text-sm tracking-tight">
              {isFrench ? 'Rayons & Catégories' : 'Aisles & Categories'}
            </h3>
            <p className="text-[11px] text-stone-400 font-medium">
              {isFrench ? 'Parcourir nos produits' : 'Browse our departments'}
            </p>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="p-2 divide-y divide-stone-100 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
        {isLoading && !categories?.length ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-9 bg-stone-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          categories.map((cat) => {
            const catName = getTranslatedCategoryName(cat, isFrench);
            const icon = getCategoryIcon(cat.slug);
            const isActive = cat.slug === activeCategorySlug || String(cat.id) === String(activeCategoryId);
            const hasChildren = cat.cat_active_childs?.length > 0 || cat.all_active_childs?.length > 0;
            const children = cat.cat_active_childs || cat.all_active_childs || [];
            const isExpanded = expandedCats.includes(cat.id) || isActive;

            return (
              <div key={cat.id} className="py-1">
                <div
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-[#FCEFEA] text-[#F68B62] font-extrabold shadow-2xs'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-semibold'
                  }`}
                >
                  <LocalizedLink
                    href={`/categories/${cat.slug}`}
                    className="flex items-center gap-2.5 flex-1 min-w-0"
                  >
                    <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                      {icon}
                    </span>
                    <span className="truncate">{catName}</span>
                  </LocalizedLink>

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(cat.id, e)}
                      className="p-1 rounded-md hover:bg-black/5 text-stone-400 hover:text-stone-700 transition-colors"
                      title={isExpanded ? 'Réduire' : 'Développer'}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subcategories (if expanded) */}
                {hasChildren && isExpanded && (
                  <div className="ml-7 mr-2 mt-1 mb-1.5 space-y-0.5 border-l-2 border-[#F68B62]/20 pl-2">
                    {children.map((sub) => {
                      const subName = getTranslatedCategoryName(sub, isFrench);
                      const isSubActive = sub.slug === activeCategorySlug;

                      return (
                        <LocalizedLink
                          key={sub.id}
                          href={`/categories/${sub.slug}`}
                          className={`block py-1 px-2 rounded-lg text-xs transition-colors ${
                            isSubActive
                              ? 'text-[#F68B62] font-extrabold bg-[#FCEFEA]/60'
                              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50 font-medium'
                          }`}
                        >
                          {subName}
                        </LocalizedLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer link to full shop */}
      <div className="p-3 bg-stone-50/80 border-t border-stone-100">
        <LocalizedLink
          href="/products"
          className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-bold text-xs shadow-2xs transition-all"
        >
          <span>{isFrench ? 'Voir tous les produits' : 'View all products'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </LocalizedLink>
      </div>
    </aside>
  );
}
