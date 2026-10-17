import React from 'react';
import { STORES } from '../data/mockData';

export default function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Soukday',
    url: 'https://soukday.ca',
    logo: 'https://soukday.ca/images/logo.png',
    description: 'Plateforme en ligne de référence pour les épiceries orientales, boucheries 100% halal et spécialités artisanales au Canada.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Montréal',
      addressRegion: 'QC',
      addressCountry: 'CA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@soukday.ca',
      availableLanguage: ['French', 'English'],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Soukday',
    url: 'https://soukday.ca',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://soukday.ca/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  // Structured data for all partner stores (LocalBusiness / ButcherShop / GroceryStore)
  const storesSchema = STORES.map((store) => ({
    '@context': 'https://schema.org',
    '@type': store.type === 'butcher' ? 'ButcherShop' : 'GroceryStore',
    name: store.name,
    image: store.image,
    telephone: '+1-514-000-0000',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address,
      addressLocality: store.city,
      addressRegion: store.state,
      postalCode: store.postalCode,
      addressCountry: 'CA',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: store.rating.toString(),
      reviewCount: store.reviewsCount.toString(),
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {storesSchema.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
