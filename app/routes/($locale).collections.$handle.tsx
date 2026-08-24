import { redirect, useLoaderData, Link } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { ProductItem } from '~/components/ProductItem';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { MEGA_MENU_ITEMS } from '~/lib/navigation';
import { useState } from 'react';
import { CollectionFilters } from '~/components/CollectionFilters';

export const meta: Route.MetaFunction = ({ data }: any) => {
  const collectionTitle = data?.collection?.title ?? 'Collection';
  const collectionDescription = 
    data?.collection?.description ?? 
    `Browse our high-quality range of ${collectionTitle.toLowerCase()} at Shower Haus. We supply and install premium shower doors, enclosures, and spares in Durban & KZN.`;
    
  return [
    { title: `${collectionTitle} | Shower Haus Durban` },
    {
      name: 'description',
      content: collectionDescription,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;

  if (!handle) {
    throw redirect('/collections');
  }

  const { storefront } = context;
  const variables = getPaginationVariables(request, {
    pageBy: 48,
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

  const queryVariables: any = { 
    first: variables.first,
    last: variables.last,
    after: variables.endCursor,
    before: variables.startCursor,
    handle, 
    reverse 
  };
  if (sortKey) {
    queryVariables.sortKey = sortKey;
  }
  if (parsedFilters.length > 0) {
    queryVariables.filters = parsedFilters;
  }

  const { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: queryVariables,
  });

  if (!collection) {
    throw new Response(null, { status: 404 });
  }

  if (collection.products?.nodes && collection.products.nodes.length > 0) {
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

  redirectIfHandleIsLocalized(request, { handle, data: collection });

  return {
    collection,
    sort
  };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const { collection, sort } = useLoaderData<typeof loader>();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState(sort || 'Featured');

  const categories = MEGA_MENU_ITEMS;

  return (
    <div className="collection-page bg-white min-h-screen">
      {/* Category Tiles */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categories.map((cat) => (
              <Link
                key={cat.handle}
                to={`/collections/${cat.handle}`}
                className={`group flex flex-col items-center gap-4 text-center max-w-[120px] ${collection.handle === cat.handle ? 'scale-105' : ''}`}
              >
                <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-500 group-hover:scale-110 border-2 ${collection.handle === cat.handle ? 'border-primary' : 'border-transparent group-hover:border-primary/20'}`}>
                  <img
                    src={cat.featuredImage}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 transition-colors ${collection.handle === cat.handle ? 'bg-transparent' : 'bg-black/5 group-hover:bg-transparent'}`} />
                </div>
                <span className={`font-sans text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase transition-colors ${collection.handle === cat.handle ? 'text-secondary' : 'text-primary group-hover:text-secondary'}`}>
                  {cat.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* New Site Shop Beta Banner */}
        <div className="bg-[#f0f7ff] border border-blue-100 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-sm">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#4A89C8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-sans text-xs text-primary font-medium leading-relaxed">
              Our new site is currently in beta. Please be patient. If you experience any issues,{' '}
              <Link to={`/webmaster-feedback?ref=${encodeURIComponent('/collections/' + collection.handle)}`} className="underline hover:text-secondary transition-colors font-semibold" style={{ color: '#4a89c8' }}>click here to provide feedback</Link>.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl text-primary mb-4">{collection.title}</h1>
          {collection.description && (
            <div className="font-sans text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
              {collection.description}
            </div>
          )}
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

        {/* Filter Panel (Disabled for now)
        <div style={{ display: activeFilter === 'filter' ? 'block' : 'none' }}>
          <CollectionFilters filters={collection.products.filters || []} />
        </div>
        */}

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

