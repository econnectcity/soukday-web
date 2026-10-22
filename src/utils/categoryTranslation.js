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
  'epices-fruits-secs': {
    fr: 'Épices & fruits secs',
    en: 'Spices & Dried Fruits',
  },
  'fruits-et-legumes': {
    fr: 'Fruits et légumes',
    en: 'Fruits & Vegetables',
  },
  'fruits-legumes-frais': {
    fr: 'Fruits et légumes frais',
    en: 'Fresh Fruits & Vegetables',
  },
  'noix-et-fruits-secs': {
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
  'viandes-et-volailles': {
    fr: 'Viandes et volailles',
    en: 'Meats & Poultry',
  },
  'boucherie-halal': {
    fr: 'Boucherie halal',
    en: 'Halal Butchery',
  },
  'boucherie-halal-fraiche': {
    fr: 'Boucherie halal fraîche',
    en: 'Fresh Halal Butchery',
  },
  'produits-laitiers-fromages': {
    fr: 'Produits laitiers & fromages',
    en: 'Dairy & Cheeses',
  },
  'thes-cafes-boissons': {
    fr: 'Thés, cafés & boissons',
    en: 'Teas, Coffees & Beverages',
  },
  'thes-cafes-et-tisanes': {
    fr: 'Thés, cafés et tisanes',
    en: 'Teas, Coffees & Herbal Teas',
  },
  'surgeles-plats-prepares': {
    fr: 'Surgelés & plats préparés',
    en: 'Frozen & Prepared Dishes',
  },
  'conserves-et-sauces': {
    fr: 'Conserves et sauces',
    en: 'Canned Goods & Sauces',
  },
  'huiles-et-vinaigres': {
    fr: 'Huiles et vinaigres',
    en: 'Oils & Vinegars',
  },

  // Grocery Subcategories
  'couscous-semoules-et-farine': {
    fr: 'Couscous & Semoule',
    en: 'Couscous & Semolina',
  },
  'conserves-haricots-et-legumineuses': {
    fr: 'Conserves & Légumineuses',
    en: 'Canned Goods & Legumes',
  },
  'conserves-poissons-et-harissa': {
    fr: 'Poissons en boîte & Harissa',
    en: 'Canned Fish & Harissa',
  },
  'pates-riz-et-feves': {
    fr: 'Pâtes, Riz & Fèves',
    en: 'Pasta, Rice & Fava Beans',
  },
  'tartinades-sauces-et-autres': {
    fr: 'Tartinades & Sauces',
    en: 'Spreads & Sauces',
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
  'noix et fruits secs': 'Nuts & Dried Fruits',
  'noix fruits secs': 'Nuts & Dried Fruits',
  'plats cuisines': 'Ready Meals',
  'poissons et fruits de mer': 'Fish & Seafood',
  'poissons fruits de mer': 'Fish & Seafood',
  'viandes et volailles': 'Meats & Poultry',
  'viandes volailles': 'Meats & Poultry',
  'boucherie halal': 'Halal Butchery',
  'boucherie halal fraiche': 'Fresh Halal Butchery',
  'produits laitiers et fromages': 'Dairy & Cheeses',
  'produits laitiers fromages': 'Dairy & Cheeses',
  'thes cafes et tisanes': 'Teas, Coffees & Herbal Teas',
  'thes cafes et boissons': 'Teas, Coffees & Beverages',
  'thes cafes boissons': 'Teas, Coffees & Beverages',
  'surgeles et plats prepares': 'Frozen & Prepared Dishes',
  'surgeles plats prepares': 'Frozen & Prepared Dishes',
  'conserves et sauces': 'Canned Goods & Sauces',
  'huiles et vinaigres': 'Oils & Vinegars',
  'couscous et semoule': 'Couscous & Semolina',
  'couscous semoule': 'Couscous & Semolina',
  'conserves et legumineuses': 'Canned Goods & Legumes',
  'conserves legumineuses': 'Canned Goods & Legumes',
  'poissons en boite et harissa': 'Canned Fish & Harissa',
  'poissons en boite harissa': 'Canned Fish & Harissa',
  'pates riz et feves': 'Pasta, Rice & Fava Beans',
  'pates et riz': 'Pasta & Rice',
  'tartinades et sauces': 'Spreads & Sauces',
  'tartinades sauces': 'Spreads & Sauces',
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
  const rawName = (rawObj.translations?.name || rawObj.name || '').trim();
  const slug = (rawObj.slug || '').toLowerCase().trim();

  // If active language is French
  if (isFrench) {
    if (CATEGORY_SLUG_MAP[slug]?.fr) {
      return CATEGORY_SLUG_MAP[slug].fr;
    }
    return rawName || (slug ? slug.replace(/-/g, ' ') : '');
  }

  // Active language is English (!isFrench)
  // 1. Check slug dictionary
  if (CATEGORY_SLUG_MAP[slug]?.en) {
    return CATEGORY_SLUG_MAP[slug].en;
  }

  // 2. Check normalized French name dictionary
  const normalized = normalizeText(rawName);
  if (CATEGORY_NAME_MAP[normalized]) {
    return CATEGORY_NAME_MAP[normalized];
  }

  // 3. Check if translations has an English name distinct from default French
  if (
    rawObj.translations?.lang === 'en' &&
    rawObj.translations?.name &&
    rawObj.translations.name !== rawObj.name
  ) {
    return rawObj.translations.name;
  }

  // 4. Fallback to rawName or humanized slug
  return rawName || (slug ? slug.replace(/-/g, ' ') : '');
}

export default getTranslatedCategoryName;
