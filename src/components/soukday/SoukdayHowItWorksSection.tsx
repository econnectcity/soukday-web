import React from 'react';
import { useTranslation } from '@/utils/translation';

interface SoukdayHowItWorksSectionProps {
  className?: string;
}

export default function SoukdayHowItWorksSection({
  className = '',
}: SoukdayHowItWorksSectionProps) {
  const { isFrench, currentCode } = useTranslation();

  // Robust French language check
  const isFr = isFrench || currentCode === 'fr' || !currentCode || currentCode.startsWith('fr');

  const steps = [
    {
      id: 1,
      image: '/images/how-it-works/soukday-epicerie.jpg',
      title: isFr
        ? '1. Votre épicerie chez Soukday'
        : '1. Your groceries at Soukday',
      description: isFr
        ? 'Choisissez vos produits d’épicerie maghrébine vendus directement par Soukday.'
        : 'Choose your North African & Maghreb grocery essentials sold directly by Soukday.',
    },
    {
      id: 2,
      image: '/images/how-it-works/soukday-boucherie.jpg',
      title: isFr
        ? '2. Votre viande chez votre boucherie halal'
        : '2. Your meat from your halal butcher',
      description: isFr
        ? 'Choisissez une boucherie disponible dans votre secteur et ajoutez votre viande au panier.'
        : 'Choose an available butcher in your area and add your custom meat cuts to your cart.',
    },
    {
      id: 3,
      image: '/images/how-it-works/soukday-livraison.jpg',
      title: isFr
        ? '3. Une seule livraison à votre porte'
        : '3. A single delivery to your door',
      description: isFr
        ? 'Soukday rassemble vos achats et vous livre le tout directement chez vous.'
        : 'Soukday bundles all your purchases and delivers everything straight to your door.',
    },
  ];

  return (
    <section className={`w-full py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {isFr
              ? 'Vous commandez épicerie et boucherie?'
              : 'Ordering grocery & halal meat?'}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-medium mt-2">
            {isFr
              ? 'Soukday simplifie tout et réunit vos achats dans une même commande.'
              : 'Soukday simplifies everything and combines your orders into a single delivery.'}
          </p>
        </div>

        {/* 3 Step Cards Grid (Instacart-style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col bg-stone-50/80 hover:bg-stone-50 rounded-3xl p-4 sm:p-5 border border-stone-200/60 shadow-xs hover:shadow-md transition-all duration-300 group"
            >
              {/* Card Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white border border-stone-200/40">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Card Content */}
              <div className="pt-5 pb-2 px-1 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-stone-600 font-normal leading-relaxed mt-2 flex-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
