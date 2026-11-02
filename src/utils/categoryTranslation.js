/**
 * Comprehensive bilingual category & subcategory dictionary for Soukday.
 * Ensures that category titles translate seamlessly between French and English,
 * even when the backend API returns raw French text.
 */

export const CATEGORY_SLUG_MAP = {
  // Main Categories
  'boulangerie-et-patisserie': {
    fr: 'Boulangerie et pâtisserie',
    en: 'Bakery & Pastry',
  },
  'boulangerie-patisserie': {
    fr: 'Boulangerie et pâtisserie',
    en: 'Bakery & Pastry',
  },
  'epicerie-maghrebine': {
    fr: 'Épicerie maghrébine',
    en: 'Maghreb Grocery',
  },
  'epicerie-orientale': {
    fr: 'Épicerie orientale',
    en: 'Oriental Grocery',
  },
  'epices-et-herbes': {
    fr: 'Épices et herbes',
    en: 'Spices & Herbs',
  },
  'epices-herbes': {
    fr: 'Épices et herbes',
    en: 'Spices & Herbs',
  },
  'epices-fruits-secs': {
    fr: 'Épices & fruits secs',
    en: 'Spices & Dried Fruits',
  },
  'fruits-et-legumes': {
    fr: 'Fruits et légumes',
    en: 'Fruits & Vegetables',
  },
  'fruits-legumes': {
    fr: 'Fruits et légumes',
    en: 'Fruits & Vegetables',
  },
  'fruits-legumes-frais': {
    fr: 'Fruits et légumes frais',
    en: 'Fresh Fruits & Vegetables',
  },
  'fruits': {
    fr: 'Fruits',
    en: 'Fruits',
  },
  'legumes': {
    fr: 'Légumes',
    en: 'Vegetables',
  },
  'noix-et-fruits-secs': {
    fr: 'Noix et fruits secs',
    en: 'Nuts & Dried Fruits',
  },
  'noix-fruits-secs': {
    fr: 'Noix et fruits secs',
    en: 'Nuts & Dried Fruits',
  },
  'plats-cuisines': {
    fr: 'Plats cuisinés',
    en: 'Ready Meals',
  },
  'poissons-et-fruits-de-mer': {
    fr: 'Poissons et fruits de mer',
    en: 'Fish & Seafood',
  },
  'poissons-fruits-de-mer': {
    fr: 'Poissons et fruits de mer',
    en: 'Fish & Seafood',
  },
  'viandes-et-volailles': {
    fr: 'Viandes et volailles',
    en: 'Meats & Poultry',
  },
  'viandes-volailles': {
    fr: 'Viandes et volailles',
    en: 'Meats & Poultry',
  },
  'poulet-et-dinde': {
    fr: 'Poulet et dinde',
    en: 'Chicken & Turkey',
  },
  'poulet-dinde': {
    fr: 'Poulet et dinde',
    en: 'Chicken & Turkey',
  },
  'charcuterie': {
    fr: 'Charcuterie',
    en: 'Deli & Charcuterie',
  },
  'boeuf-et-veau': {
    fr: 'Bœuf et veau',
    en: 'Beef & Veal',
  },
  'boeuf-veau': {
    fr: 'Bœuf et veau',
    en: 'Beef & Veal',
  },
  'agneau-et-autres': {
    fr: 'Agneau et autres',
    en: 'Lamb & Others',
  },
  'agneau-autres': {
    fr: 'Agneau et autres',
    en: 'Lamb & Others',
  },
  'boucherie-halal': {
    fr: 'Boucherie halal',
    en: 'Halal Butchery',
  },
  'boucherie-halal-fraiche': {
    fr: 'Boucherie halal fraîche',
    en: 'Fresh Halal Butchery',
  },
  'produits-laitiers': {
    fr: 'Produits laitiers',
    en: 'Dairy Products',
  },
  'produits-laitiers-fromages': {
    fr: 'Produits laitiers & fromages',
    en: 'Dairy & Cheeses',
  },
  'produits-de-patisserie': {
    fr: 'Produits de pâtisserie',
    en: 'Baking & Pastry Supplies',
  },
  'thes-cafes-boissons': {
    fr: 'Thés, cafés & boissons',
    en: 'Teas, Coffees & Beverages',
  },
  'thes-cafes-et-tisanes': {
    fr: 'Thés, cafés et tisanes',
    en: 'Teas, Coffees & Herbal Teas',
  },
  'thes-cafes-tisanes': {
    fr: 'Thés, cafés et tisanes',
    en: 'Teas, Coffees & Herbal Teas',
  },
  'jus-et-boissons': {
    fr: 'Jus et boissons',
    en: 'Juices & Beverages',
  },
  'jus-boissons': {
    fr: 'Jus et boissons',
    en: 'Juices & Beverages',
  },
  'surgeles-plats-prepares': {
    fr: 'Surgelés & plats préparés',
    en: 'Frozen & Prepared Dishes',
  },
  'aliments-surgeles': {
    fr: 'Aliments surgelés',
    en: 'Frozen Foods',
  },
  'conserves-et-sauces': {
    fr: 'Conserves et sauces',
    en: 'Canned Goods & Sauces',
  },
  'conserves-sauces': {
    fr: 'Conserves et sauces',
    en: 'Canned Goods & Sauces',
  },
  'huiles-et-vinaigres': {
    fr: 'Huiles et vinaigres',
    en: 'Oils & Vinegars',
  },
  'huiles-vinaigres': {
    fr: 'Huiles et vinaigres',
    en: 'Oils & Vinegars',
  },
  'cuissons': {
    fr: 'Cuissons',
    en: 'Cooking & Pantry',
  },
  'couscous-semoules-et-farine': {
    fr: 'Couscous, semoules et farine',
    en: 'Couscous, Semolina & Flour',
  },
  'couscous-semoule': {
    fr: 'Couscous & Semoule',
    en: 'Couscous & Semolina',
  },
  'conserves-haricots-et-legumineuses': {
    fr: 'Conserves - Haricots et légumineuses',
    en: 'Canned Beans & Legumes',
  },
  'conserves-legumineuses': {
    fr: 'Conserves & Légumineuses',
    en: 'Canned Beans & Legumes',
  },
  'conserves-poissons-et-harissa': {
    fr: 'Conserves - Poissons et harissa',
    en: 'Canned Fish & Harissa',
  },
  'pates-riz-et-feves': {
    fr: 'Pâtes, riz et fèves',
    en: 'Pasta, Rice & Fava Beans',
  },
  'tartinades-sauces-et-autres': {
    fr: 'Tartinades, sauces et autres',
    en: 'Spreads, Sauces & Condiments',
  },
  'tartinades-sauces': {
    fr: 'Tartinades & Sauces',
    en: 'Spreads & Sauces',
  },
  'pains-et-viennoiseries': {
    fr: 'Pains et viennoiseries',
    en: 'Breads & Pastries',
  },
  'pains-viennoiseries': {
    fr: 'Pains et viennoiseries',
    en: 'Breads & Pastries',
  },
  'gourmandises-salees': {
    fr: 'Gourmandises salées',
    en: 'Savory Snacks',
  },
  'gateaux-d-ici-et-d-ailleurs': {
    fr: "Gâteaux d'ici et d'ailleurs",
    en: 'Cakes & Pastries',
  },
};

export const CATEGORY_NAME_MAP = {
  'boulangerie et patisserie': 'Bakery & Pastry',
  'boulangerie patisserie': 'Bakery & Pastry',
  'epicerie maghrebine': 'Maghreb Grocery',
  'epicerie orientale': 'Oriental Grocery',
  'epices et herbes': 'Spices & Herbs',
  'epices herbes': 'Spices & Herbs',
  'epices fruits secs': 'Spices & Dried Fruits',
  'fruits et legumes': 'Fruits & Vegetables',
  'fruits legumes': 'Fruits & Vegetables',
  'fruits et legumes frais': 'Fresh Fruits & Vegetables',
  'fruits': 'Fruits',
  'legumes': 'Vegetables',
  'noix et fruits secs': 'Nuts & Dried Fruits',
  'noix fruits secs': 'Nuts & Dried Fruits',
  'plats cuisines': 'Prepared Dishes',
  'poissons et fruits de mer': 'Fish & Seafood',
  'poissons fruits de mer': 'Fish & Seafood',
  'viandes et volailles': 'Meats & Poultry',
  'viandes volailles': 'Meats & Poultry',
  'poulet et dinde': 'Chicken & Turkey',
  'poulet dinde': 'Chicken & Turkey',
  'charcuterie': 'Deli & Charcuterie',
  'boeuf et veau': 'Beef & Veal',
  'boeuf veau': 'Beef & Veal',
  'agneau et autres': 'Lamb & Others',
  'agneau autres': 'Lamb & Others',
  'boucherie halal': 'Halal Butchery',
  'boucherie halal fraiche': 'Fresh Halal Butchery',
  'produits laitiers': 'Dairy Products',
  'produits laitiers et fromages': 'Dairy & Cheeses',
  'produits laitiers fromages': 'Dairy & Cheeses',
  'produits de patisserie': 'Baking & Pastry Supplies',
  'thes cafes et tisanes': 'Teas, Coffees & Herbal Teas',
  'thes cafes tisanes': 'Teas, Coffees & Herbal Teas',
  'thes cafes et boissons': 'Teas, Coffees & Beverages',
  'thes cafes boissons': 'Teas, Coffees & Beverages',
  'jus et boissons': 'Juices & Beverages',
  'jus boissons': 'Juices & Beverages',
  'surgeles et plats prepares': 'Frozen & Prepared Dishes',
  'surgeles plats prepares': 'Frozen & Prepared Dishes',
  'aliments surgeles': 'Frozen Foods',
  'conserves et sauces': 'Canned Goods & Sauces',
  'huiles et vinaigres': 'Oils & Vinegars',
  'huiles vinaigres': 'Oils & Vinegars',
  'cuissons': 'Cooking & Pantry',
  'couscous et semoule': 'Couscous & Semolina',
  'couscous semoule': 'Couscous & Semolina',
  'couscous semoules et farine': 'Couscous, Semolina & Flour',
  'conserves haricots et legumineuses': 'Canned Beans & Legumes',
  'conserves et legumineuses': 'Canned Beans & Legumes',
  'conserves legumineuses': 'Canned Beans & Legumes',
  'conserves poissons et harissa': 'Canned Fish & Harissa',
  'poissons en boite et harissa': 'Canned Fish & Harissa',
  'poissons en boite harissa': 'Canned Fish & Harissa',
  'pates riz et feves': 'Pasta, Rice & Fava Beans',
  'pates et riz': 'Pasta & Rice',
  'tartinades et sauces': 'Spreads, Sauces & Condiments',
  'tartinades sauces': 'Spreads & Sauces',
  'tartinades sauces et autres': 'Spreads, Sauces & Condiments',
  'pains et viennoiseries': 'Breads & Pastries',
  'pains viennoiseries': 'Breads & Pastries',
  'gourmandises salees': 'Savory Snacks',
  'gateaux d ici et d ailleurs': 'Cakes & Pastries',
  'epicerie specialites': 'Grocery & Specialties',
  'epicerie et specialites': 'Grocery & Specialties',
};

function normalizeText(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns the localized category name based on language.
 * @param {object|string} category - Category object or string name/slug
 * @param {boolean} isFrench - Whether the active language is French
 * @returns {string} Localized category title
 */
export function getTranslatedCategoryName(category, isFrench = true) {
  if (!category) return '';

  const rawObj = typeof category === 'string' ? { name: category, slug: category } : category;
  const rawName = (rawObj.name || rawObj.translations?.name || rawObj.title || rawObj.rawName || '').trim();
  const slug = (rawObj.slug || '').toLowerCase().trim();
  const derivedSlug = slug ||
    String(rawName)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  // If active language is French
  if (isFrench) {
    if (CATEGORY_SLUG_MAP[derivedSlug]?.fr) {
      return CATEGORY_SLUG_MAP[derivedSlug].fr;
    }
    return rawName || (derivedSlug ? derivedSlug.replace(/-/g, ' ') : '');
  }

  // Active language is English (!isFrench)
  // 1. Check slug dictionary
  if (CATEGORY_SLUG_MAP[derivedSlug]?.en) {
    return CATEGORY_SLUG_MAP[derivedSlug].en;
  }

  // 2. Check normalized French name dictionary
  const normalized = normalizeText(rawName);
  if (CATEGORY_NAME_MAP[normalized]) {
    return CATEGORY_NAME_MAP[normalized];
  }

  // 3. Check if translations has an English name distinct from default French
  if (Array.isArray(rawObj.translations)) {
    const enTrans = rawObj.translations.find(
      (t) => t.language_id === 3 || t.lang === 'en' || t.code === 'en' || t.locale === 'en'
    );
    if (enTrans?.name && normalizeText(enTrans.name) !== normalized) {
      return enTrans.name;
    }
  } else if (
    rawObj.translations?.lang === 'en' &&
    rawObj.translations?.name &&
    rawObj.translations.name !== rawObj.name
  ) {
    return rawObj.translations.name;
  }

  // 4. Fallback to rawName or humanized slug
  return rawName || (derivedSlug ? derivedSlug.replace(/-/g, ' ') : '');
}

export default getTranslatedCategoryName;
