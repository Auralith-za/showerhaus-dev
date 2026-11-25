export const SITE_URL = 'https://www.showerhaus.co.za';
export const SITE_NAME = 'Shower Haus';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero-1.png`;

export const BUSINESS_INFO = {
  name: 'Shower Haus',
  legalName: 'Shower Haus (Pty) Ltd',
  slogan: 'The Right Fit',
  foundingDate: '2004',
  telephone: '+27-31-312-9095',
  telephoneDisplay: '031 312 9095',
  email: 'hello@showerhaus.co.za',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: DEFAULT_OG_IMAGE,
  priceRange: 'R50 - R25000',
  currenciesAccepted: 'ZAR',
  paymentAccepted: 'Credit Card, Debit Card, EFT, PayFast, Shop Pay',
  address: {
    streetAddress: '90A Intersite Avenue, Umgeni Business Park, Springfield',
    addressLocality: 'Durban',
    addressRegion: 'KwaZulu-Natal',
    postalCode: '4091',
    addressCountry: 'ZA',
  },
  geo: {
    latitude: -29.8118,
    longitude: 30.9964,
  },
  socialLinks: [
    'https://www.instagram.com/showerhaussa/',
    'https://www.facebook.com/ShowerHaus',
  ],
  serviceAreasKZN: [
    'Durban',
    'Umhlanga',
    'Ballito',
    'Hillcrest',
    'Kloof',
    'Westville',
    'Durban North',
    'La Lucia',
    'Morningside',
    'Berea',
    'Gillitts',
    'Salt Rock',
    'Zimbali',
    'Amanzimtoti',
    'Pietermaritzburg',
    'KwaZulu-Natal',
  ],
  deliveryAreasSA: [
    'South Africa',
    'Durban',
    'Johannesburg',
    'Pretoria',
    'Cape Town',
    'Gqeberha',
    'Bloemfontein',
    'East London',
    'Nelspruit',
    'Polokwane',
  ],
};

export interface SeoConfig {
  title: string;
  description: string;
  path?: string;
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  keywords?: string[];
  priceAmount?: string;
  priceCurrency?: string;
  availability?: 'in stock' | 'out of stock';
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncateText(text: string, maxLength = 160): string {
  const clean = stripHtml(text);
  if (clean.length <= maxLength) return clean;
  const sliced = clean.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

/**
 * Generates standard React Router v7 / Hydrogen meta descriptors including:
 * - Title & Description
 * - Canonical Link
 * - GEO location meta tags (South Africa / Durban / KZN)
 * - Open Graph & Twitter Card tags
 * - Optional Product price tags
 * - Optional JSON-LD script descriptors (`script:ld+json`)
 */
export function buildSeoMeta(config: SeoConfig) {
  const canonical =
    config.canonicalUrl ||
    (config.path
      ? `${SITE_URL}${config.path.startsWith('/') ? config.path : `/${config.path}`}`
      : SITE_URL);
  const image = config.image
    ? config.image.startsWith('http')
      ? config.image
      : `${SITE_URL}${config.image.startsWith('/') ? config.image : `/${config.image}`}`
    : DEFAULT_OG_IMAGE;
  const description = truncateText(config.description, 165);
  const robots = config.noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const meta: Array<Record<string, any>> = [
    { title: config.title },
    { name: 'description', content: description },
    { name: 'robots', content: robots },
    { name: 'googlebot', content: robots },
    { tagName: 'link', rel: 'canonical', href: canonical },

    // GEO Meta Tags (Durban, KwaZulu-Natal, South Africa)
    { name: 'geo.region', content: 'ZA-KZN' },
    { name: 'geo.placename', content: 'Durban, KwaZulu-Natal, South Africa' },
    {
      name: 'geo.position',
      content: `${BUSINESS_INFO.geo.latitude};${BUSINESS_INFO.geo.longitude}`,
    },
    {
      name: 'ICBM',
      content: `${BUSINESS_INFO.geo.latitude}, ${BUSINESS_INFO.geo.longitude}`,
    },

    // Open Graph
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'en_ZA' },
    { property: 'og:type', content: config.type || 'website' },
    { property: 'og:title', content: config.title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: config.title },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: config.title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ];

  if (config.keywords && config.keywords.length > 0) {
    meta.push({ name: 'keywords', content: config.keywords.join(', ') });
  }

  if (config.type === 'product' && config.priceAmount) {
    meta.push(
      { property: 'product:price:amount', content: config.priceAmount },
      { property: 'product:price:currency', content: config.priceCurrency || 'ZAR' },
      {
        property: 'product:availability',
        content: config.availability || 'in stock',
      },
      { property: 'product:brand', content: SITE_NAME },
    );
  }

  if (config.jsonLd) {
    const blocks = Array.isArray(config.jsonLd) ? config.jsonLd : [config.jsonLd];
    for (const block of blocks) {
      if (block) {
        meta.push({ 'script:ld+json': block });
      }
    }
  }

  return meta;
}

/**
 * Global Organization, LocalBusiness (HomeAndConstructionBusiness), and WebSite schema
 */
export function getGlobalJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'HomeAndConstructionBusiness', 'Store'],
        '@id': `${SITE_URL}/#organization`,
        name: BUSINESS_INFO.name,
        legalName: BUSINESS_INFO.legalName,
        alternateName: ['ShowerHaus', 'Shower Haus Durban', 'Shower Haus South Africa'],
        slogan: BUSINESS_INFO.slogan,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: BUSINESS_INFO.logo,
        },
        image: BUSINESS_INFO.image,
        description:
          'South Africa’s specialist in custom-made frameless shower enclosures, ready-to-install semi-frameless shower doors, walk-in shower screens, bath screens, and shower spares. Based in Springfield, Durban with custom installations across KwaZulu-Natal and nationwide online delivery.',
        foundingDate: BUSINESS_INFO.foundingDate,
        telephone: BUSINESS_INFO.telephone,
        email: BUSINESS_INFO.email,
        priceRange: BUSINESS_INFO.priceRange,
        currenciesAccepted: BUSINESS_INFO.currenciesAccepted,
        paymentAccepted: BUSINESS_INFO.paymentAccepted,
        address: {
          '@type': 'PostalAddress',
          ...BUSINESS_INFO.address,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: BUSINESS_INFO.geo.latitude,
          longitude: BUSINESS_INFO.geo.longitude,
        },
        hasMap:
          'https://maps.google.com/?q=90A+Intersite+Avenue+Umgeni+Business+Park+Springfield+Durban',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '07:00',
            closes: '16:15',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Friday'],
            opens: '07:00',
            closes: '16:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday'],
            opens: '09:00',
            closes: '13:00',
          },
        ],
        areaServed: [
          {
            '@type': 'Country',
            name: 'South Africa',
          },
          {
            '@type': 'AdministrativeArea',
            name: 'KwaZulu-Natal',
          },
          ...BUSINESS_INFO.serviceAreasKZN.slice(0, 10).map((city) => ({
            '@type': 'City',
            name: city,
          })),
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.3',
          reviewCount: '120',
          bestRating: '5',
          worstRating: '1',
        },
        sameAs: BUSINESS_INFO.socialLinks,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description:
          'Custom-made frameless showers, standard semi-frameless shower enclosures, bath screens, and shower spares in Durban, KZN, and nationwide across South Africa.',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'en-ZA',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.path.startsWith('http')
        ? item.path
        : `${SITE_URL}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  };
}

/**
 * Curated SEO & GEO metadata overrides/fallbacks for Shower products and spares
 * missing custom Shopify SEO fields or needing enhanced South African search visibility.
 */
export const PRODUCT_SEO_ENHANCEMENTS: Record<
  string,
  {
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    categoryLabel: string;
    highlights?: string[];
  }
> = {
  'semi-frameless-corner-entry-shower': {
    seoTitle:
      'Semi-Frameless Corner-Entry Shower Enclosure (900x900 & 1000x1000mm) | Shower Haus South Africa',
    seoDescription:
      'Buy the Semi-Frameless Corner-Entry Shower Enclosure online at Shower Haus. Polished aluminium frame, 6mm SABS toughened safety glass, 900x900mm or 1000x1000mm sliding corner doors. In stock in Durban with nationwide delivery across South Africa.',
    keywords: [
      'semi-frameless corner entry shower',
      'corner entry shower enclosure south africa',
      '900x900 corner shower door',
      '1000x1000 corner shower enclosure',
      'sliding corner shower durban',
      'buy shower enclosure online south africa',
    ],
    categoryLabel: 'Corner-Entry Shower Enclosure',
    highlights: [
      'Space-saving dual sliding doors opening from the corner',
      'Available in 900 × 900 × 1900mm and 1000 × 1000 × 1900mm standard sizes',
      '6mm SABS-certified toughened safety glass with polished aluminium profiles',
      'Quick-release bottom rollers for effortless cleaning & maintenance',
    ],
  },
  'semi-frameless-round-sliding-door-shower': {
    seoTitle:
      'Semi-Frameless Round Sliding-Door Quadrant Shower (900x900 & 1000x1000mm) | Shower Haus SA',
    seoDescription:
      'Shop the Semi-Frameless Round Sliding-Door Quadrant Shower at Shower Haus. Curved 6mm toughened glass corner shower in polished aluminium (900x900mm or 1000x1000mm). In stock in Durban with nationwide delivery across South Africa.',
    keywords: [
      'round sliding door shower',
      'quadrant shower enclosure south africa',
      'curved corner shower door',
      'semi-frameless round shower 900x900',
      'curved glass shower durban',
    ],
    categoryLabel: 'Curved Quadrant Sliding Shower Enclosure',
    highlights: [
      'Curved quadrant front maximizes bathroom floor space around basins and toilets',
      'Available in 900 × 900 × 1900mm and 1000 × 1000 × 1900mm sizes',
      'Smooth twin-wheel sliding doors with magnetic closing seals',
      '6mm SABS toughened safety glass and bright polished aluminium profiles',
    ],
  },
  'semi-frameless-pivot-door': {
    seoTitle:
      'Semi-Frameless Pivot Shower Door (900mm & 1000mm) | Alcove & Enclosure Door | Shower Haus SA',
    seoDescription:
      'Buy our Semi-Frameless Pivot Shower Door in 900mm or 1000mm width. Engineered with 6mm SABS toughened safety glass, polished aluminium profiles, and minimal moving parts for long-term reliability. Nationwide delivery in South Africa.',
    keywords: [
      'semi-frameless pivot shower door',
      'pivot shower door 900mm',
      'pivot shower door 1000mm',
      'alcove shower door south africa',
      'glass pivot shower door durban',
    ],
    categoryLabel: 'Semi-Frameless Pivot Shower Door',
    highlights: [
      'Fits between two alcove walls or pairs with a semi-frameless return panel',
      'Available in 900 × 1900mm and 1000 × 1900mm standard widths',
      'Heavy-duty pivot mechanism with only two moving parts and two replaceable seals',
      '6mm SABS-approved clear toughened safety glass in polished aluminium',
    ],
  },
  'semi-frameless-return-panel': {
    seoTitle:
      'Semi-Frameless Shower Return Panel (900mm & 1000mm Fixed Side Glass) | Shower Haus South Africa',
    seoDescription:
      'Complete your corner shower enclosure with the Semi-Frameless Return Panel (900mm or 1000mm). 6mm SABS toughened safety glass in polished aluminium, designed to pair with Shower Haus pivot and sliding shower doors. Delivered nationwide.',
    keywords: [
      'semi-frameless return panel',
      'shower return panel 900mm',
      'shower side panel 1000mm',
      'fixed glass shower return panel south africa',
      'corner shower return panel durban',
    ],
    categoryLabel: 'Fixed Shower Return Panel',
    highlights: [
      'Fixed 90° side return panel to turn an alcove shower door into a 2-sided corner shower',
      'Available in 900 × 1900mm and 1000 × 1900mm dimensions',
      'Compatible with Shower Haus Semi-Frameless Pivot, Extendable Pivot, and Single Slider doors',
      '6mm SABS toughened safety glass with adjustable wall channel for out-of-plumb walls',
    ],
  },
  'semi-frameless-pivot-shower-door-with-return-panel': {
    seoTitle:
      'Semi-Frameless Pivot Shower Door with Return Panel (Complete Corner Shower) | Shower Haus SA',
    seoDescription:
      'Shop the complete Semi-Frameless Pivot Shower Door with Return Panel corner enclosure (900x900mm or 1000x1000mm). 6mm toughened safety glass, polished aluminium frame, low-maintenance pivot hardware. In stock with nationwide SA delivery.',
    keywords: [
      'pivot shower door with return panel',
      'complete corner shower enclosure south africa',
      'semi-frameless corner pivot shower',
      '900x900 pivot shower enclosure',
      '1000x1000 shower enclosure durban',
    ],
    categoryLabel: 'Complete Corner Pivot Shower Enclosure',
    highlights: [
      'Complete 2-sided corner shower enclosure including pivot door and fixed 90° return panel',
      'Available in 900 × 900 × 1900mm and 1000 × 1000 × 1900mm configurations',
      'Reversible left-hand or right-hand installation',
      '6mm SABS toughened safety glass with full magnetic and drip seal protection',
    ],
  },
  'semi-frameless-single-slider-shower-door': {
    seoTitle:
      'Semi-Frameless Single Slider Shower Door (1200mm, 1300mm & 1400mm) | Shower Haus South Africa',
    seoDescription:
      'Buy the Semi-Frameless Single Slider Shower Door for wide alcoves or corner enclosures (1200mm, 1300mm, or 1400mm). Smooth sliding 6mm toughened safety glass door in polished aluminium with zero swing clearance needed. Nationwide delivery.',
    keywords: [
      'single slider shower door',
      'sliding shower door 1200mm',
      'sliding shower door 1400mm',
      'semi-frameless sliding shower door south africa',
      'alcove sliding shower door durban',
    ],
    categoryLabel: 'Sliding Alcove / Corner Shower Door',
    highlights: [
      'Effortless sliding door requiring zero outward swing space in compact bathrooms',
      'Available in 1200mm, 1300mm, and 1400mm widths × 1900mm height',
      'Can be installed between two alcove walls or combined with a return panel',
      '15mm wall channel adjustment per side for out-of-square walls',
    ],
  },
  'semi-frameless-extendable-pivot-door': {
    seoTitle:
      'Semi-Frameless Extendable Pivot Shower Door (Adjustable 780mm–1100mm) | Shower Haus SA',
    seoDescription:
      'Adjustable Semi-Frameless Extendable Pivot Shower Door fitting openings from 780mm to 1100mm wide. Ideal for non-standard alcove widths in South African bathrooms. 6mm SABS toughened glass in polished aluminium. Delivered nationwide.',
    keywords: [
      'extendable pivot shower door',
      'adjustable shower door south africa',
      'non-standard width shower door',
      'semi-frameless extendable pivot door',
      'alcove shower door 800mm 900mm 1000mm 1100mm',
    ],
    categoryLabel: 'Adjustable Extendable Pivot Shower Door',
    highlights: [
      'Telescopic adjustable profile spans non-standard openings between 780mm and 1100mm',
      'Ideal cost-effective alternative to custom glass for unusual alcove widths',
      '6mm SABS toughened safety glass with full-height magnetic latch seal',
      'Installs between two walls or pairs with a semi-frameless return panel',
    ],
  },
  'semi-frameless-single-bath-screen': {
    seoTitle:
      'Semi-Frameless Single Bath Screen (900x1400mm Hinged Over-Bath Glass Screen) | Shower Haus SA',
    seoDescription:
      'Upgrade your bath-shower with the Semi-Frameless Single Bath Screen (900 × 1400mm). 6mm toughened safety glass hinged panel swings 90° both ways with rise-and-fall self-centering hinge and bottom drip seal. Delivered nationwide in SA.',
    keywords: [
      'bath screen south africa',
      'glass bath shower screen',
      'hinged bath screen 900x1400',
      'over bath shower glass screen durban',
      'semi-frameless single bath screen',
    ],
    categoryLabel: 'Hinged Over-Bath Shower Screen',
    highlights: [
      'Replaces messy shower curtains with a clean 900 × 1400mm toughened glass bath screen',
      '180° swing (90° inward and 90° outward) with self-centering rise-and-fall hinge',
      'Reversible for left-hand or right-hand bath installations',
      'Includes specialized bath screen bottom drip seal to keep bathroom floors dry',
    ],
  },
  'semi-frameless-double-bath-screen': {
    seoTitle:
      'Semi-Frameless Double Bath Screen (1200x1400mm Fixed & Hinged Over-Bath Screen) | Shower Haus SA',
    seoDescription:
      'Buy the Semi-Frameless Double Bath Screen (1200 × 1400mm) for maximum over-bath splash protection. Combines a fixed glass panel with a 90° swinging hinged panel in 6mm SABS toughened safety glass. In stock with nationwide SA delivery.',
    keywords: [
      'double bath screen south africa',
      'folding bath shower screen 1200mm',
      'over bath glass screen double panel',
      'semi-frameless double bath screen durban',
    ],
    categoryLabel: 'Double-Panel Over-Bath Shower Screen',
    highlights: [
      'Extended 1200 × 1400mm coverage with fixed splash panel plus hinged deflecting panel',
      'Hinged panel swings 90° inward and outward for easy bath entry and tap access',
      '6mm SABS-certified toughened safety glass with polished aluminium wall profile',
      'Reversible left or right mounting with integrated water-deflecting drip seals',
    ],
  },
  'semi-frameless-shower-screen': {
    seoTitle:
      'Semi-Frameless Walk-In Shower Screen (1100mm & 1200mm, Chrome or Matt Black) | Shower Haus SA',
    seoDescription:
      'Shop our Semi-Frameless Walk-In Shower Screen in 1100mm or 1200mm width, available in Polished Aluminium or Matt Black frame. Frameless floor-to-glass look with toughened safety glass and stabiliser arm. Delivered nationwide across SA.',
    keywords: [
      'walk in shower screen south africa',
      'semi-frameless shower screen',
      'black frame walk in shower screen',
      '1200mm walk in shower glass panel',
      '1100mm shower screen durban',
    ],
    categoryLabel: 'Walk-In Fixed Glass Shower Screen',
    highlights: [
      'Open walk-in wet-room aesthetic with no step or bottom plinth required',
      'Available in 1100 × 2000mm and 1200 × 2000mm in Polished Aluminium or Matt Black',
      'Toughened safety glass supplied complete with wall channel and rigid stabiliser bar',
      'Reversible left or right walk-in entry for modern bathroom renovations',
    ],
  },
  'single-grey-bottom-shower-door-wheel': {
    seoTitle:
      'Single Grey Bottom Shower Door Wheel (Spring-Loaded Replacement Roller) | Shower Haus',
    seoDescription:
      'Replacement single grey spring-loaded bottom shower door wheel for sliding and quadrant shower enclosures. Push-button quick release for easy track fitting. Shipped nationwide across South Africa from Shower Haus Durban.',
    keywords: [
      'single grey bottom shower door wheel',
      'replacement shower door roller south africa',
      'spring loaded shower wheel durban',
    ],
    categoryLabel: 'Shower Door Wheel & Roller Spare',
  },
  'single-grey-top-shower-door-wheel': {
    seoTitle:
      'Single Grey Top Shower Door Wheel (Height-Adjustable Replacement Roller) | Shower Haus',
    seoDescription:
      'Replacement single grey height-adjustable top shower door wheel for sliding and corner-entry shower doors. Smooth bearing action, fits standard drilled glass holes. Delivered nationwide across South Africa.',
    keywords: [
      'single grey top shower door wheel',
      'adjustable shower door roller south africa',
      'shower wheel spares durban',
    ],
    categoryLabel: 'Shower Door Wheel & Roller Spare',
  },
  's-type-pivot-block': {
    seoTitle:
      'S-Type Pivot Block Replacement Part for Pivot Shower Doors | Shower Haus South Africa',
    seoDescription:
      'Genuine replacement S-Type Pivot Block for framed and semi-frameless pivot shower doors. Restores smooth door swing and alignment. Available online with nationwide delivery across South Africa or in-store in Springfield, Durban.',
    keywords: [
      's-type pivot block',
      'shower door pivot block replacement',
      'pivot shower hinge block south africa',
    ],
    categoryLabel: 'Shower Pivot Block Spare',
  },
};
