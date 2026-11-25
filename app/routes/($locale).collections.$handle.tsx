import { redirect, useLoaderData, Link } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { ProductItem } from '~/components/ProductItem';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { useState } from 'react';
import {
  SITE_URL,
  SITE_NAME,
  buildSeoMeta,
  buildBreadcrumbJsonLd,
} from '~/lib/seo';

const VIRTUAL_COLLECTION_CONFIG: Record<
  string,
  {
    sourceCollectionHandle: 'semi-frameless-showers' | 'shower-spares';
    title: string;
    seoTitle: string;
    description: string;
    seoDescription: string;
    filterKeyword?: string;
    keywords: string[];
  }
> = {
  showers: {
    sourceCollectionHandle: 'semi-frameless-showers',
    title: 'Standard & Semi-Frameless Showers',
    seoTitle:
      'Standard & Semi-Frameless Showers | Shower Doors, Enclosures & Bath Screens | Shower Haus South Africa',
    description:
      'Shop ready-to-install standard semi-frameless shower enclosures, pivot shower doors, extendable pivot doors, sliding shower doors, corner-entry showers, quadrant round showers, walk-in shower screens, return panels, and over-bath glass screens. Engineered with 6mm SABS-certified toughened safety glass — in stock in Durban with nationwide delivery across South Africa.',
    seoDescription:
      'Buy standard & semi-frameless shower enclosures, pivot doors, sliding doors, corner showers, walk-in screens & bath screens online at Shower Haus. 6mm SABS safety glass, in stock in Durban with nationwide SA delivery.',
    keywords: [
      'showers south africa',
      'standard showers durban',
      'semi-frameless shower enclosures',
      'buy shower doors online south africa',
      'pivot shower door',
      'sliding shower door',
      'corner entry shower',
      'walk in shower screen',
      'glass bath screen south africa',
    ],
  },
  'semi-frameless-showers': {
    sourceCollectionHandle: 'semi-frameless-showers',
    title: 'Semi-Frameless Showers',
    seoTitle:
      'Semi-Frameless Showers & Enclosures | Pivot, Sliding, Corner & Bath Screens | Shower Haus SA',
    description:
      'Explore our full range of semi-frameless shower doors, corner enclosures, quadrant sliding showers, walk-in screens, and bath screens in 6mm SABS toughened safety glass and polished aluminium. In stock in Durban with nationwide delivery across South Africa.',
    seoDescription:
      'Shop semi-frameless shower doors, corner entry showers, round sliding showers, walk-in screens & bath screens at Shower Haus. SABS safety glass, nationwide delivery across South Africa.',
    keywords: [
      'semi-frameless showers south africa',
      'semi-frameless shower doors durban',
      'semi-frameless corner shower',
      'semi-frameless pivot door',
      'semi-frameless bath screen',
    ],
  },
  'shower-spares': {
    sourceCollectionHandle: 'shower-spares',
    title: 'Shower Spares & Replacement Parts',
    seoTitle:
      'Shower Spares South Africa | Replacement Shower Door Seals, Wheels, Rollers & Hinges | Shower Haus',
    description:
      'South Africa’s most comprehensive range of genuine replacement shower spares: PVC drip seals, magnetic shower door seals, bubble seals, top and bottom shower door wheels and rollers, pivot blocks, glass hinges, clamps, stabiliser arms, knobs, and towel rails. Shipped nationwide from Durban.',
    seoDescription:
      'Shop replacement shower spares online in South Africa: shower door seals, magnetic seals, drip seals, wheels, rollers, pivot blocks, hinges & handles. In stock at Shower Haus Durban with nationwide delivery.',
    keywords: [
      'shower spares south africa',
      'shower door seals durban',
      'shower door wheels and rollers',
      'magnetic shower seal',
      'pivot block replacement',
      'shower door hinges and handles',
    ],
  },
  'shower-seals': {
    sourceCollectionHandle: 'shower-spares',
    title: 'Shower Door Seals',
    seoTitle: 'Replacement Shower Door Seals | Drip, Magnetic & Lip Seals | Shower Haus SA',
    description:
      'Clear and black PVC replacement shower door seals including 90°, 135°, and 180° magnetic seals, hard-lip and soft-lip seals, bubble seals, and bottom drip seals for 5–12mm glass.',
    seoDescription:
      'Buy replacement shower door seals online in South Africa. Drip seals, magnetic seals, bubble seals & lip seals for frameless and semi-frameless showers. Nationwide delivery.',
    filterKeyword: 'seal',
    keywords: ['shower door seals south africa', 'frameless shower drip seal', 'magnetic shower seal'],
  },
  'shower-seals-and-cill-plate': {
    sourceCollectionHandle: 'shower-spares',
    title: 'Shower Door Seals & Profiles',
    seoTitle: 'Shower Door Seals & Threshold Profiles | Shower Haus South Africa',
    description:
      'Replacement PVC shower door drip seals, magnetic seals, bubble seals, and wall-to-glass channel seals for frameless and semi-frameless showers.',
    seoDescription:
      'Shop replacement shower door seals, magnetic seals, drip seals, and threshold profiles at Shower Haus South Africa. Nationwide courier delivery.',
    filterKeyword: 'seal',
    keywords: ['shower seals south africa', 'shower door drip seal'],
  },
  'wheels-brackets': {
    sourceCollectionHandle: 'shower-spares',
    title: 'Shower Door Wheels, Rollers & Brackets',
    seoTitle: 'Replacement Shower Door Wheels, Rollers & Brackets | Shower Haus South Africa',
    description:
      'Replacement single and double top and bottom shower door wheels, rollers, tri-door wheel brackets, and floor guides for sliding and corner-entry showers.',
    seoDescription:
      'Buy replacement shower door wheels, rollers, and brackets online in South Africa. Chrome, zinc, nylon & stainless steel shower rollers delivered nationwide from Shower Haus Durban.',
    filterKeyword: 'wheel',
    keywords: ['shower door wheels south africa', 'shower door rollers durban', 'sliding shower wheel replacement'],
  },
  'brackets-wheels': {
    sourceCollectionHandle: 'shower-spares',
    title: 'Shower Door Wheels & Brackets',
    seoTitle: 'Shower Door Wheels, Rollers & Brackets | Shower Haus South Africa',
    description:
      'Genuine replacement shower door wheels, rollers, and brackets for sliding, quadrant, and tri-door shower enclosures.',
    seoDescription:
      'Shop replacement shower door wheels, rollers, and brackets at Shower Haus. In stock in Durban with nationwide delivery across South Africa.',
    filterKeyword: 'wheel',
    keywords: ['shower door wheels', 'shower rollers south africa'],
  },
  'pivot-blocks': {
    sourceCollectionHandle: 'shower-spares',
    title: 'Shower Door Pivot Blocks & Pins',
    seoTitle: 'Shower Door Pivot Blocks, Pins & Connectors | Shower Haus South Africa',
    description:
      'Replacement S-type and P-type pivot blocks, pins, spigots, and corner-entry connectors for framed and semi-frameless pivot shower doors.',
    seoDescription:
      'Buy replacement shower door pivot blocks, pins, and frame spigots online at Shower Haus. Fast nationwide delivery across South Africa.',
    filterKeyword: 'pivot',
    keywords: ['shower pivot block', 's-type pivot block', 'pivot block and pin south africa'],
  },
  'handles-towel-rails': {
    sourceCollectionHandle: 'shower-spares',
    title: 'Shower Door Handles, Knobs & Towel Rails',
    seoTitle: 'Shower Door Handles, Back-to-Back Knobs & Towel Rails | Shower Haus SA',
    description:
      'Stainless steel, chrome, matt black, and antique brass back-to-back shower door knobs, handles, and towel rails.',
    seoDescription:
      'Shop shower door knobs, handles, and towel rails in stainless steel, chrome, matt black, and antique brass at Shower Haus South Africa.',
    filterKeyword: 'handle',
    keywords: ['shower door handles south africa', 'shower door knobs', 'shower towel rail'],
  },
  'hinges-and-clamps': {
    sourceCollectionHandle: 'shower-spares',
    title: 'Shower Glass Hinges, Clamps & Stabilisers',
    seoTitle: 'Frameless Shower Hinges, Glass Clamps & Stabiliser Arms | Shower Haus SA',
    description:
      'Architectural glass stabiliser arms, wall-to-glass mounting brackets, hinges, and clamps for frameless and semi-frameless shower enclosures.',
    seoDescription:
      'Buy shower glass stabiliser arms, hinges, and clamps online at Shower Haus. In stock in Durban with nationwide South African delivery.',
    filterKeyword: 'stabiliser',
    keywords: ['shower hinges and clamps', 'shower glass stabiliser arm south africa'],
  },
};

export const meta: Route.MetaFunction = ({ data, params }: any) => {
  const handle = params?.handle || data?.collection?.handle || 'showers';
  const vConfig = VIRTUAL_COLLECTION_CONFIG[handle];
  const collectionTitle =
    vConfig?.title || data?.collection?.title || 'Shower Collection';
  const seoTitle =
    vConfig?.seoTitle ||
    data?.collection?.seo?.title ||
    `${collectionTitle} | Shower Doors, Enclosures & Spares | ${SITE_NAME} Durban & SA`;
  const seoDescription =
    vConfig?.seoDescription ||
    data?.collection?.seo?.description ||
    data?.collection?.description ||
    `Browse our range of ${collectionTitle.toLowerCase()} at Shower Haus. Premium shower doors, enclosures, and spares in Durban, KZN, and delivered nationwide across South Africa.`;

  const canonicalUrl = `${SITE_URL}/collections/${handle}`;
  const products = data?.collection?.products?.nodes || [];

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections/all' },
    { name: collectionTitle, path: `/collections/${handle}` },
  ]);

  const collectionPageLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#collection`,
    name: collectionTitle,
    description: seoDescription,
    url: canonicalUrl,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 30).map((p: any, idx: number) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/products/${p.handle}`,
        name: p.title,
      })),
    },
  };

  return buildSeoMeta({
    title: seoTitle,
    description: seoDescription,
    canonicalUrl,
    image: products[0]?.featuredImage?.url,
    keywords: vConfig?.keywords || [
      collectionTitle,
      'Shower Haus',
      'showers south africa',
      'shower enclosures durban',
    ],
    jsonLd: [breadcrumbLd, collectionPageLd],
  });
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;

  if (!handle) {
    throw redirect('/collections/all');
  }

  const { storefront } = context;
  const variables = getPaginationVariables(request, {
    pageBy: 48,
  });

  const url = new URL(request.url);
  const filtersParam = url.searchParams.getAll('filter');
  const parsedFilters = filtersParam
    .map((f) => {
      try {
        return JSON.parse(f);
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

  const selectedProductTypes: string[] = [];
  filtersParam.forEach((f) => {
    try {
      const parsed = JSON.parse(f);
      if (parsed.productType) {
        selectedProductTypes.push(parsed.productType);
      }
    } catch (e) {
      // ignore invalid JSON
    }
  });

  const oldProductTypeFilter = url.searchParams.get('filter.p.product_type');
  if (oldProductTypeFilter) {
    selectedProductTypes.push(oldProductTypeFilter);
  }

  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    const priceFilter: any = {};
    if (minPrice) priceFilter.min = parseFloat(minPrice);
    if (maxPrice) priceFilter.max = parseFloat(maxPrice);
    parsedFilters.push({ price: priceFilter });
  }

  const sort = url.searchParams.get('sort') || 'Featured';
  let sortKey: string | undefined = undefined;
  let reverse = false;

  switch (sort) {
    case 'Price: Low to High':
      sortKey = 'PRICE';
      reverse = false;
      break;
    case 'Price: High to Low':
      sortKey = 'PRICE';
      reverse = true;
      break;
    case 'Newest':
      sortKey = 'CREATED';
      reverse = true;
      break;
    default:
      sortKey = undefined;
      reverse = false;
  }

  const vConfig = VIRTUAL_COLLECTION_CONFIG[handle];
  const queryHandle = vConfig ? vConfig.sourceCollectionHandle : handle;

  const queryVariables: any = {
    first: variables.first,
    last: variables.last,
    after: variables.endCursor,
    before: variables.startCursor,
    handle: queryHandle,
    reverse,
  };
  if (sortKey) {
    queryVariables.sortKey = sortKey;
  }
  if (parsedFilters.length > 0 && !vConfig) {
    queryVariables.filters = parsedFilters;
  }

  let { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: queryVariables,
  });

  if (!collection) {
    throw new Response(null, { status: 404 });
  }

  // Clone so we can safely customize title/description/handle for virtual collections like 'showers'
  collection = {
    ...collection,
    handle,
    title: vConfig?.title || collection.title,
    description: vConfig?.description || collection.description,
    products: {
      ...collection.products,
      nodes: [...(collection.products?.nodes || [])],
    },
  };

  if (vConfig?.filterKeyword && collection.products.nodes.length > 0) {
    const kw = vConfig.filterKeyword.toLowerCase();
    const subFiltered = collection.products.nodes.filter((p: any) => {
      const hay = `${p.title} ${p.productType || ''} ${p.category?.name || ''}`.toLowerCase();
      if (kw === 'handle') {
        return hay.includes('knob') || hay.includes('rail') || hay.includes('handle');
      }
      if (kw === 'stabiliser') {
        return hay.includes('stabiliser') || hay.includes('hinge') || hay.includes('clamp') || hay.includes('finial') || hay.includes('finnial');
      }
      return hay.includes(kw);
    });
    if (subFiltered.length > 0) {
      collection.products.nodes = subFiltered;
    }
  }

  if (collection.products?.nodes && collection.products.nodes.length > 0) {
    if (selectedProductTypes.length > 0) {
      const filtered = collection.products.nodes.filter((p: any) => {
        const pType = (p.productType || p.category?.name || '').toLowerCase();
        return selectedProductTypes.some((st) => {
          const stLower = st.toLowerCase();
          return (
            pType.includes(stLower) ||
            stLower.includes(pType) ||
            (stLower.includes('wheel') && pType.includes('wheel')) ||
            (stLower.includes('pivot') && pType.includes('pivot'))
          );
        });
      });
      if (filtered.length > 0) {
        collection.products.nodes = filtered;
      }
    }

    if (sort === 'Price: Low to High') {
      collection.products.nodes = [...collection.products.nodes].sort((a: any, b: any) => {
        const pA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
        const pB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
        return pA - pB;
      });
    } else if (sort === 'Price: High to Low') {
      collection.products.nodes = [...collection.products.nodes].sort((a: any, b: any) => {
        const pA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
        const pB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
        return pB - pA;
      });
    }
  }

  if (!vConfig) {
    redirectIfHandleIsLocalized(request, { handle, data: collection });
  }

  return {
    collection,
    sort,
  };
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const { collection, sort } = useLoaderData<typeof loader>();
  const [sortBy, setSortBy] = useState(sort || 'Featured');
  const isShowersCollection =
    collection.handle === 'showers' || collection.handle === 'semi-frameless-showers';

  return (
    <div className="collection-page bg-white min-h-screen">
      {/* Visible SEO Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b border-gray-100 bg-gray-50/60">
        <div className="container mx-auto px-6 py-3 flex items-center gap-2 font-sans text-[11px] tracking-wider uppercase text-gray-500">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/collections/all" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-primary font-semibold">{collection.title}</span>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="block font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-secondary mb-3">
            {isShowersCollection
              ? '6mm SABS Toughened Safety Glass · Nationwide SA Delivery'
              : 'Genuine Architectural Hardware & Spares'}
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-4">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="font-sans text-gray-500 max-w-3xl mx-auto font-light leading-relaxed text-sm md:text-base">
              {collection.description}
            </p>
          )}
          {isShowersCollection && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link
                to="/pages/frameless-showers"
                className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 border border-gray-200 text-primary hover:border-primary transition-colors"
              >
                Custom Frameless Showers →
              </Link>
              <Link
                to="/pages/custom-made-showers"
                className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 border border-gray-200 text-primary hover:border-primary transition-colors"
              >
                Custom-Made Showers →
              </Link>
              <Link
                to="/pages/design-your-shower"
                className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 bg-primary text-white hover:bg-secondary transition-colors"
              >
                Design Your Custom Shower →
              </Link>
            </div>
          )}
        </div>

        {/* Modern Filter Bar */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-y border-gray-100 mb-12 -mx-6 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/collections/black-friday"
              className={`font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-xs transition-colors ${
                collection.handle === 'black-friday'
                  ? 'bg-red-600 text-white'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              Black Friday
            </Link>
            <Link
              to="/collections/showers"
              className={`font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-xs transition-colors ${
                isShowersCollection
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              Showers
            </Link>
            <Link
              to="/collections/shower-spares"
              className={`font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-xs transition-colors ${
                collection.handle === 'shower-spares'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              Shower Spares
            </Link>
            <Link
              to="/collections/all"
              className="font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 text-gray-500 hover:text-primary transition-colors"
            >
              All Products
            </Link>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <span className="font-sans text-[10px] text-gray-400 uppercase tracking-widest">
              {collection.products.nodes.length} Products
            </span>
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const url = new URL(window.location.href);
                  url.searchParams.set('sort', e.target.value);
                  window.location.href = url.toString();
                }}
                className="appearance-none bg-transparent font-sans text-[10px] font-bold tracking-widest uppercase text-primary pr-8 focus:outline-none cursor-pointer"
              >
                <option value="Featured">Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Newest">Newest</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <PaginatedResourceSection<ProductItemFragment>
          connection={collection.products}
          resourcesClassName="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
        >
          {({ node: product, index }) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          )}
        </PaginatedResourceSection>

        {/* On-Page SEO & GEO Buyer's Guide Section */}
        {isShowersCollection ? (
          <section className="mt-24 pt-16 border-t border-gray-100 max-w-5xl mx-auto space-y-8">
            <div className="space-y-3">
              <span className="block font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-secondary">
                South Africa’s Shower Specialists Since 2004
              </span>
              <h2 className="font-display text-3xl text-primary">
                Buy Ready-to-Install Standard &amp; Semi-Frameless Showers Online
              </h2>
              <p className="font-sans text-sm text-gray-600 leading-relaxed font-light">
                Shower Haus supplies a complete range of ready-to-install standard semi-frameless shower doors, corner shower enclosures, walk-in shower screens, and over-bath glass screens across South Africa. Every standard shower is built using 6mm SABS-approved toughened safety glass and bright polished or matt black aluminium profiles with generous wall-channel adjustment to accommodate out-of-plumb bathroom walls.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans text-xs text-gray-600 leading-relaxed">
              <div className="bg-gray-50 p-6 rounded-sm space-y-2">
                <h3 className="font-bold text-primary uppercase tracking-wider">
                  Corner &amp; Quadrant Showers
                </h3>
                <p>
                  Ideal for compact and en-suite bathrooms. Choose between our{' '}
                  <Link to="/products/semi-frameless-corner-entry-shower" className="text-secondary underline">
                    Semi-Frameless Corner-Entry Shower
                  </Link>{' '}
                  (900×900mm or 1000×1000mm), curved{' '}
                  <Link to="/products/semi-frameless-round-sliding-door-shower" className="text-secondary underline">
                    Round Sliding-Door Quadrant Shower
                  </Link>
                  , or{' '}
                  <Link to="/products/semi-frameless-pivot-shower-door-with-return-panel" className="text-secondary underline">
                    Pivot Shower Door with Return Panel
                  </Link>
                  .
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-sm space-y-2">
                <h3 className="font-bold text-primary uppercase tracking-wider">
                  Alcove Pivot &amp; Sliding Doors
                </h3>
                <p>
                  Fitting a shower between two walls? Explore our low-maintenance{' '}
                  <Link to="/products/semi-frameless-pivot-door" className="text-secondary underline">
                    Semi-Frameless Pivot Door
                  </Link>{' '}
                  (900mm &amp; 1000mm), telescopic{' '}
                  <Link to="/products/semi-frameless-extendable-pivot-door" className="text-secondary underline">
                    Extendable Pivot Door
                  </Link>{' '}
                  (780–1100mm), or wide{' '}
                  <Link to="/products/semi-frameless-single-slider-shower-door" className="text-secondary underline">
                    Single Slider Shower Door
                  </Link>{' '}
                  (1200–1400mm), plus matching{' '}
                  <Link to="/products/semi-frameless-return-panel" className="text-secondary underline">
                    Fixed Return Panels
                  </Link>
                  .
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-sm space-y-2">
                <h3 className="font-bold text-primary uppercase tracking-wider">
                  Walk-In &amp; Over-Bath Screens
                </h3>
                <p>
                  Create an open wet-room look with our{' '}
                  <Link to="/products/semi-frameless-shower-screen" className="text-secondary underline">
                    Walk-In Shower Screen
                  </Link>{' '}
                  (1100mm &amp; 1200mm in Chrome or Matt Black), or convert your bath into a leak-free shower with our{' '}
                  <Link to="/products/semi-frameless-single-bath-screen" className="text-secondary underline">
                    Single Bath Screen
                  </Link>{' '}
                  and{' '}
                  <Link to="/products/semi-frameless-double-bath-screen" className="text-secondary underline">
                    Double Bath Screen
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-24 pt-16 border-t border-gray-100 max-w-4xl mx-auto text-center space-y-4">
            <h2 className="font-display text-2xl text-primary">
              Genuine Shower Spares Delivered Nationwide in South Africa
            </h2>
            <p className="font-sans text-sm text-gray-600 leading-relaxed font-light">
              Need help identifying the right replacement shower seal, wheel roller, pivot block, or hinge for your shower door? Visit our showroom at 90A Intersite Avenue, Umgeni Business Park, Springfield, Durban, call us on{' '}
              <a href="tel:0313129095" className="text-secondary font-medium">
                031 312 9095
              </a>
              , or order online for fast courier delivery across South Africa.
            </p>
          </section>
        )}

        <Analytics.CollectionView
          data={{
            collection: {
              id: collection.id,
              handle: collection.handle,
            },
          }}
        />
      </div>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    tags
    productType
    category {
      name
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        title
        description
      }
      products(
        first: $first,
        last: $last,
        before: $before,
        after: $after,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
