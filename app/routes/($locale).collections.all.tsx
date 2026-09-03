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
  return [{ title: `Shower Haus | Shop All` }];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}



async function loadCriticalData({ context, request }: Route.LoaderArgs) {
  const { storefront } = context;
  const variables = getPaginationVariables(request, {
    pageBy: 48,
  });

  const url = new URL(request.url);
  let queryParts: string[] = [];

  const selectedProductTypes: string[] = [];
  const filtersParam = url.searchParams.getAll('filter');
  filtersParam.forEach(f => {
    try {
      const parsed = JSON.parse(f);
      if (parsed.productType) {
        selectedProductTypes.push(parsed.productType);
        queryParts.push(`product_type:"${parsed.productType}"`);
      }
    } catch (e) {
      // ignore invalid JSON
    }
  });

  // Backwards compatibility for old links in browser cache
  const oldProductTypeFilter = url.searchParams.get('filter.p.product_type');
  if (oldProductTypeFilter) {
    selectedProductTypes.push(oldProductTypeFilter);
    queryParts.push(`product_type:"${oldProductTypeFilter}"`);
  }

  const maxPrice = url.searchParams.get('maxPrice');
  if (maxPrice) {
    queryParts.push(`variants.price:<=${parseFloat(maxPrice)}`);
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
      sortKey = 'CREATED_AT';
      reverse = true;
      break;
    default:
      sortKey = undefined;
      reverse = false;
  }

  const queryVariables: any = { 
    first: variables.first,
    last: variables.last,
    after: variables.endCursor,
    before: variables.startCursor,
    reverse 
  };
  if (sortKey) {
    queryVariables.sortKey = sortKey;
  }
  if (queryParts.length > 0) {
    queryVariables.query = queryParts.join(' AND ');
  }

  const data = await storefront.query(CATALOG_QUERY, {
    variables: queryVariables,
  });

  const products = data.products || { nodes: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: '', endCursor: '' } };

  if (products.nodes && products.nodes.length > 0) {
    if (selectedProductTypes.length > 0) {
      const filtered = products.nodes.filter((p: any) => {
        const pType = (p.productType || p.category?.name || '').toLowerCase();
        return selectedProductTypes.some(st => {
          const stLower = st.toLowerCase();
          return pType.includes(stLower) || stLower.includes(pType) || 
                 (stLower.includes('wheel') && pType.includes('wheel')) ||
                 (stLower.includes('pivot') && pType.includes('pivot'));
        });
      });
      if (filtered.length > 0) {
        products.nodes = filtered;
      }
    }

    if (sort === 'Price: Low to High') {
      products.nodes = [...products.nodes].sort((a: any, b: any) => {
        const pA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
        const pB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
        return pA - pB;
      });
    } else if (sort === 'Price: High to Low') {
      products.nodes = [...products.nodes].sort((a: any, b: any) => {
        const pA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
        const pB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
        return pB - pA;
      });
    }
  }

  return {
    products,
    collections: data.collections?.nodes || [],
    sort
  };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

const placeholderImages: Record<string, string> = {
  'shower-spares': 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/PH_Andersen_Faci_Leboreiro_15.jpg.webp',
  'showers': 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/Modern_Bathroom_Ideas_We_Know_Will_Inspire_You_To_Create_LARGE.jpg.webp',
  'consumables': 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/fjKXavfZcnZSsxLzuWvKQ8.jpg',
  'shower-care': 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/PH_Andersen_Faci_Leboreiro_15.jpg.webp',
};

export default function ShopAll() {
  const { products, collections, sort } = useLoaderData<typeof loader>();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState(sort || 'Featured');

  const categories = collections.filter(
    (cat) => cat.handle !== 'all' && cat.handle !== 'frontpage'
  );

  return (
    <div className="shop-all-page bg-white min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* New Site Shop Beta Banner */}
        <div className="bg-[#f0f7ff] border border-blue-100 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-sm">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#4A89C8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-sans text-xs text-primary font-medium leading-relaxed">
              Our new site is currently in beta. Please be patient. If you experience any issues,{' '}
              <Link to="/webmaster-feedback?ref=%2Fcollections%2Fall" className="underline hover:text-secondary transition-colors font-semibold" style={{ color: '#4a89c8' }}>click here to provide feedback</Link>.
            </p>
          </div>
        </div>

        {/* Modern Filter Bar */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-y border-gray-100 mb-12 -mx-6 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-8">
            {/* 
            <button
              onClick={() => setActiveFilter(activeFilter === 'filter' ? null : 'filter')}
              className="flex items-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase text-primary hover:text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 4h18M6 12h12m-9 8h6" />
              </svg>
              Filters
            </button>
            */}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <span className="font-sans text-[10px] text-gray-400 uppercase tracking-widest">
              {products.nodes.length} Products
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

        {/* Filter Drawer / Panel (Disabled for now)
        <div style={{ display: activeFilter === 'filter' ? 'block' : 'none' }}>
          <CollectionFilters filters={products.filters || []} />
        </div>
        */}

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
    tags
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

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $before: String
    $after: String
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
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
      before: $before, 
      after: $after
      query: $query
      sortKey: $sortKey
      reverse: $reverse
    ) {
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

