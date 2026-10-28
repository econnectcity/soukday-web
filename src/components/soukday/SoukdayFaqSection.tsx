'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/utils/translation';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: number;
  questionFr: string;
  questionEn: string;
  answerFr: React.ReactNode;
  answerEn: React.ReactNode;
}

export default function SoukdayFaqSection() {
  const { isFrench, currentCode } = useTranslation();
  const isFr = isFrench || currentCode === 'fr' || !currentCode || currentCode.startsWith('fr');

  // Keep first question open by default for immediate preview
  const [openIds, setOpenIds] = useState<number[]>([1]);

  const toggleItem = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const faqs: FAQItem[] = [
    {
      id: 1,
      questionFr: '1. Comment fonctionne Soukday ?',
      questionEn: '1. How does Soukday work?',
      answerFr: (
        <p>
          Entrez votre adresse ou votre code postal pour commencer. Soukday vous présente automatiquement les produits et les commerces qui peuvent livrer chez vous. Vous pouvez ensuite faire votre épicerie, choisir votre boucherie halal ou commander auprès des autres commerces disponibles dans votre secteur.
        </p>
      ),
      answerEn: (
        <p>
          Enter your address or postal code to get started. Soukday automatically displays products and stores that deliver to your location. You can then shop for your groceries, pick your favorite halal butcher shop, or order from other local merchants available in your area.
        </p>
      ),
    },
    {
      id: 2,
      questionFr: '2. Puis-je récupérer ma commande en magasin ?',
      questionEn: '2. Can I pick up my order in-store?',
      answerFr: (
        <div className="space-y-2">
          <p>
            Les produits d’épicerie vendus directement par Soukday sont offerts en livraison seulement, puisque Soukday n’est actuellement pas ouvert au public.
          </p>
          <p>
            Pour les commandes provenant de nos commerces partenaires, le ramassage peut être offert lorsque cette option est disponible chez le marchand.
          </p>
        </div>
      ),
      answerEn: (
        <div className="space-y-2">
          <p>
            Grocery products sold directly by Soukday are available for delivery only, as Soukday is currently not open to the public for walk-ins.
          </p>
          <p>
            For orders from our partner stores, in-store pickup may be offered whenever available at the respective merchant.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      questionFr: '3. Puis-je commander mon épicerie et ma viande en même temps ?',
      questionEn: '3. Can I order my groceries and meat at the same time?',
      answerFr: (
        <div className="space-y-2">
          <p>
            Oui. Les produits d’épicerie sont vendus directement par Soukday, tandis que votre viande peut être commandée auprès de l’une des boucheries halal partenaires disponibles dans votre secteur.
          </p>
          <p>
            Vous pouvez ainsi réunir votre épicerie et votre viande dans une même commande.
          </p>
        </div>
      ),
      answerEn: (
        <div className="space-y-2">
          <p>
            Yes. Grocery essentials are fulfilled directly by Soukday, while your meat cuts can be ordered from one of the partner halal butcher shops serving your area.
          </p>
          <p>
            You can combine both your groceries and meat seamlessly in a single order and delivery.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      questionFr: '4. Comment savoir quels commerces livrent chez moi ?',
      questionEn: '4. How do I know which stores deliver to my address?',
      answerFr: (
        <p>
          Entrez simplement votre adresse ou votre code postal. Soukday affichera automatiquement les commerces et les produits disponibles pour votre secteur.
        </p>
      ),
      answerEn: (
        <p>
          Simply enter your street address or postal code. Soukday will automatically filter and display the stores and products eligible for delivery in your neighborhood.
        </p>
      ),
    },
    {
      id: 5,
      questionFr: '5. Comment fonctionne la livraison ?',
      questionEn: '5. How does delivery work?',
      answerFr: (
        <div className="space-y-2.5">
          <p>
            Selon votre adresse et les produits commandés, trois types de livraison peuvent être proposés :
          </p>
          <ul className="space-y-1.5 pl-2">
            <li className="flex items-start gap-2">
              <span className="text-[#F68B62] font-black text-sm leading-none mt-0.5">•</span>
              <span>
                <strong className="text-stone-900 font-bold">Livraison locale</strong> — Livraison effectuée par Soukday ou par un commerce partenaire dans les secteurs desservis.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F68B62] font-black text-sm leading-none mt-0.5">•</span>
              <span>
                <strong className="text-stone-900 font-bold">Livraison régionale</strong> — Livraison vers certaines villes et régions du Québec situées à l’extérieur de notre zone locale.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F68B62] font-black text-sm leading-none mt-0.5">•</span>
              <span>
                <strong className="text-stone-900 font-bold">Expédition</strong> — Certains produits admissibles peuvent être expédiés au Québec, ailleurs au Canada ou aux États-Unis.
              </span>
            </li>
          </ul>
          <p className="text-xs text-stone-500 italic pt-1">
            Les options disponibles sont automatiquement déterminées selon votre adresse et votre panier.
          </p>
        </div>
      ),
      answerEn: (
        <div className="space-y-2.5">
          <p>
            Depending on your address and ordered items, three delivery tiers are available:
          </p>
          <ul className="space-y-1.5 pl-2">
            <li className="flex items-start gap-2">
              <span className="text-[#F68B62] font-black text-sm leading-none mt-0.5">•</span>
              <span>
                <strong className="text-stone-900 font-bold">Local delivery</strong> — Handled by Soukday or a local partner store within supported local zones.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F68B62] font-black text-sm leading-none mt-0.5">•</span>
              <span>
                <strong className="text-stone-900 font-bold">Regional delivery</strong> — Delivery to selected cities and regions across Quebec outside the local perimeter.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F68B62] font-black text-sm leading-none mt-0.5">•</span>
              <span>
                <strong className="text-stone-900 font-bold">Shipping</strong> — Eligible ambient products can be shipped anywhere in Quebec, Canada, or the United States.
              </span>
            </li>
          </ul>
          <p className="text-xs text-stone-500 italic pt-1">
            Available delivery options are determined automatically based on your address and cart content.
          </p>
        </div>
      ),
    },
    {
      id: 6,
      questionFr: '6. Combien coûte la livraison ?',
      questionEn: '6. How much does delivery cost?',
      answerFr: (
        <div className="space-y-2">
          <p>
            La livraison locale standard pour vos commandes d’épicerie, de boucherie et auprès des autres commerces est de <strong className="text-stone-900 font-bold">9 $</strong>.
          </p>
          <p>
            Pour les régions qui ne sont pas desservies directement par notre service de livraison, les frais sont calculés en fonction de la destination et affichés au moment du paiement.
          </p>
        </div>
      ),
      answerEn: (
        <div className="space-y-2">
          <p>
            Standard local delivery for your grocery, halal meat, and partner merchant orders is <strong className="text-stone-900 font-bold">$9</strong>.
          </p>
          <p>
            For regions outside our direct delivery zone, carrier rates are dynamically calculated based on destination and displayed clearly at checkout.
          </p>
        </div>
      ),
    },
    {
      id: 7,
      questionFr: '7. Que se passe-t-il si un produit n’est plus disponible ?',
      questionEn: '7. What happens if a product is out of stock?',
      answerFr: (
        <div className="space-y-2">
          <p>
            Nous nous efforçons de maintenir l’inventaire Soukday à jour. Toutefois, la disponibilité des produits vendus par nos commerces partenaires peut varier.
          </p>
          <p>
            Si un produit commandé chez un partenaire n’est plus disponible, le commerce pourra communiquer avec vous afin de vous proposer un produit similaire ou une autre solution.
          </p>
        </div>
      ),
      answerEn: (
        <div className="space-y-2">
          <p>
            We work continuously to ensure Soukday direct inventory is accurate and in stock. However, real-time availability at partner stores may fluctuate.
          </p>
          <p>
            If an item ordered from a partner merchant is out of stock, the store will contact you directly to propose a high-quality substitute or adjustment.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-t border-stone-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight">
            {isFr ? 'Des questions ? On vous répond !' : 'Have questions? We have answers!'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            {isFr
              ? 'Tout ce qu’il faut savoir pour commander facilement avec Soukday.'
              : 'Everything you need to know to easily order with Soukday.'}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 sm:space-y-3.5">
          {faqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            const questionTitle = isFr ? faq.questionFr : faq.questionEn;
            const answerContent = isFr ? faq.answerFr : faq.answerEn;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#F68B62]/40 bg-white shadow-xs'
                    : 'border-stone-200/80 bg-stone-50/60 hover:bg-stone-50 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer focus:outline-hidden group"
                >
                  <h3
                    className={`font-bold text-sm sm:text-base leading-snug transition-colors duration-200 ${
                      isOpen ? 'text-[#D9531E]' : 'text-stone-900 group-hover:text-[#F68B62]'
                    }`}
                  >
                    {questionTitle}
                  </h3>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isOpen
                        ? 'bg-[#F68B62] text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-600 group-hover:border-[#F68B62]/40 group-hover:text-[#F68B62]'
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100/90 pt-3.5">
                    {answerContent}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

