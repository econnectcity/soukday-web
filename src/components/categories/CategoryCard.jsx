import React from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";

const PASTEL_COLORS = ['#EFE9F8', '#FEEAE1', '#EBF1E9', '#FEEBF0', '#E8F0F8', '#FEF5E7', '#F3E8FF', '#E6F4EA'];

const CategoryCard = ({ category, bgColor }) => {
  const catId = category?.id || 0;
  const pastelBg = bgColor || PASTEL_COLORS[catId % PASTEL_COLORS.length];

  return (
    <div className="flex flex-col items-center cursor-pointer w-full max-w-[130px] md:max-w-[150px] group">
      {/* Cream Card Container */}
      <div className="w-full aspect-square rounded-2xl md:rounded-3xl bg-[#FAF7F2] p-3 md:p-4 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-md border border-stone-200/60">
        {/* Pastel Organic Blob */}
        <div
          className="absolute inset-2 rounded-full pointer-events-none opacity-90 transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundColor: pastelBg,
            borderRadius: '50% 60% 40% 70% / 60% 40% 60% 40%',
          }}
        />

        {/* Accent Dot */}
        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#FF7A45] shadow-xs" />

        {/* Product / Category Image */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-1">
          <ImageWithPlaceholder
            src={category.image_url || category.image}
            width={300}
            height={300}
            alt={category?.translations?.name ?? category?.name ?? "Category Image"}
            className="w-full h-full object-contain max-h-[85px] md:max-h-[105px] group-hover:scale-110 transition-transform duration-300 ease-out drop-shadow-sm select-none"
          />
        </div>
      </div>

      {/* Centered Title Underneath */}
      <div className="text-center font-bold text-xs md:text-sm text-stone-900 group-hover:text-[#FF7A45] transition-colors mt-2.5 md:mt-3 line-clamp-2 leading-tight px-1">
        {category?.translations?.name ?? category?.name}
      </div>
    </div>
  );
};

export default CategoryCard;
