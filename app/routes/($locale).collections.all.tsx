import type { Route } from './+types/collections.all';
import { useLoaderData, Link } from 'react-router';
import { getPaginationVariables, Image, Money } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { ProductItem } from '~/components/ProductItem';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { MEGA_MENU_ITEMS } from '~/lib/navigation';
import { useState, useMemo } from 'react';
import { CollectionFilters } from '~/components/CollectionFilters';

export const meta: Route.MetaFunction = () => {
  return [{ title: `ShowerHaus | Shop All` }];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

import { MOCK_PRODUCTS } from '~/lib/mockData';

async function loadCriticalData({ context, request }: Route.LoaderArgs) {
  const { storefront } = context;
  const variables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const url = new URL(request.url);
  const filtersParam = url.searchParams.getAll('filter');
  const parsedFilters = filtersParam.map(f => {
    try { return JSON.parse(f); } catch (e) { return null; }
  }).filter(Boolean);

  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    const priceFilter: any = {};
    if (minPrice) priceFilter.min = parseFloat(minPrice);
    if (maxPrice) priceFilter.max = parseFloat(maxPrice);
    parsedFilters.push({ price: priceFilter });
  }

  const data = await storefront.query(CATALOG_QUERY, {
    variables: { ...variables, ...(parsedFilters.length > 0 && { filters: parsedFilters }) },
  });

  return {
    products: data.products,
    collections: data.collections?.nodes || [],
  };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

const placeholderImages: Record<string, string> = {
  'showers': 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/Modern_Bathroom_Ideas_We_Know_Will_Inspire_You_To_Create_LARGE.jpg.webp',
  'shower-spares': 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/PH_Andersen_Faci_Leboreiro_15.jpg.webp',
  'spares': 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/PH_Andersen_Faci_Leboreiro_15.jpg.webp',
  'consumables': 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/fjKXavfZcnZSsxLzuWvKQ8.jpg',
  'shower-care': 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/PH_Andersen_Faci_Leboreiro_15.jpg.webp',
  'decorative': 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/hidraulico-decor-2-2.jpg',
};

export default function Collection() {
  const { products, collections } = useLoaderData<typeof loader>();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('Featured');

  const categories = collections.filter(
    (cat) => cat.handle !== 'all' && cat.handle !== 'frontpage'
  );

  return (
    <div className="shop-all-page bg-white min-h-screen">
      {/* Category Tiles */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categories.map((cat) => {
              const imageUrl = cat.image?.url || placeholderImages[cat.handle] || 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/PH_Andersen_Faci_Leboreiro_15.jpg.webp';
              const isSpares = cat.handle === 'shower-spares' || cat.handle === 'spares';

              if (!isSpares) {
                return (
                  <div
                    key={cat.handle}
                    onClick={(e) => { e.preventDefault(); alert('We are currently migrating this collection to our new website. Please check back soon!'); }}
                    className="group flex flex-col items-center gap-4 text-center max-w-[120px] cursor-pointer"
                  >
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-500 group-hover:scale-110 border-2 border-transparent group-hover:border-primary/20">
                      <img
                        src={imageUrl}
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 grayscale"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="bg-white/90 text-primary text-[8px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">Coming Soon</span>
                      </div>
                    </div>
                    <span className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 transition-colors">
                      {cat.title}
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={cat.handle}
                  to={`/collections/${cat.handle}`}
                  className="group flex flex-col items-center gap-4 text-center max-w-[120px]"
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-500 group-hover:scale-110 border-2 border-transparent group-hover:border-primary/20">
                    <img
                      src={imageUrl}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  </div>
                  <span className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-primary transition-colors group-hover:text-secondary">
                    {cat.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Modern Filter Bar */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-y border-gray-100 mb-12 -mx-6 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveFilter(activeFilter === 'filter' ? null : 'filter')}
              className="flex items-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase text-primary hover:text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 4h18M6 12h12m-9 8h6" />
              </svg>
              Filters
            </button>
            <div className="hidden md:flex items-center gap-6">
              <button className="font-sans text-[10px] font-medium tracking-widest uppercase text-gray-400 hover:text-primary transition-colors">Enclosures</button>
              <button className="font-sans text-[10px] font-medium tracking-widest uppercase text-gray-400 hover:text-primary transition-colors">Screens</button>
              <button className="font-sans text-[10px] font-medium tracking-widest uppercase text-gray-400 hover:text-primary transition-colors">Spares</button>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <span className="font-sans text-[10px] text-gray-400 uppercase tracking-widest">
              {products.nodes.length} Products
            </span>
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent font-sans text-[10px] font-bold tracking-widest uppercase text-primary pr-8 focus:outline-none cursor-pointer"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Drawer / Panel */}
        {activeFilter === 'filter' && (
          <CollectionFilters filters={products.filters || []} />
        )}

        {/* Product Grid */}
        <PaginatedResourceSection<ProductItemFragment>
          connection={products}
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
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collections(first: 50) {
      nodes {
        id
        title
        handle
        image {
          url
        }
      }
    }
    products(
      first: $first, 
      last: $last, 
      before: $startCursor, 
      after: $endCursor,
      filters: $filters
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
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

