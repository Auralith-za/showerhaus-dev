import type { Route } from './+types/collections.all';
import { useLoaderData, Link } from 'react-router';
import { getPaginationVariables, Image, Money } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { ProductItem } from '~/components/ProductItem';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { MEGA_MENU_ITEMS } from '~/lib/navigation';
import { useState, useMemo } from 'react';

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
  // In a real app, we'd use storefront.query. Here we use mock data for better control over the "Modern" feel.
  const products = {
    nodes: MOCK_PRODUCTS.map((p) => ({
      id: p.id,
      handle: p.handle,
      title: p.title,
      featuredImage: {
        id: `${p.id}-image`,
        url: p.image,
        altText: p.title,
        width: 1000,
        height: 1000,
      },
      priceRange: {
        minVariantPrice: {
          amount: p.price,
          currencyCode: p.currency,
        },
        maxVariantPrice: {
          amount: p.price,
          currencyCode: p.currency,
        },
      },
    })) as any,
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
      endCursor: null,
      startCursor: null,
    },
  };

  return { products };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const { products } = useLoaderData<typeof loader>();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('Featured');

  const categories = MEGA_MENU_ITEMS;

  return (
    <div className="shop-all-page bg-white min-h-screen">
      {/* Category Tiles */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categories.map((cat) => (
              <Link
                key={cat.handle}
                to={`/collections/${cat.handle}`}
                className="group flex flex-col items-center gap-4 text-center max-w-[120px]"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-500 group-hover:scale-110 border-2 border-transparent group-hover:border-primary/20">
                  <img
                    src={cat.featuredImage}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <span className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-primary transition-colors group-hover:text-secondary">
                  {cat.title}
                </span>
              </Link>
            ))}
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

        {/* Filter Drawer / Panel (Simplified) */}
        {activeFilter === 'filter' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 p-8 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div>
              <h4 className="font-display text-sm text-primary mb-4 border-b border-gray-200 pb-2">Price Range</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-sans text-xs text-gray-600 cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  R0 - R1,000
                </label>
                <label className="flex items-center gap-2 font-sans text-xs text-gray-600 cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  R1,000 - R5,000
                </label>
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm text-primary mb-4 border-b border-gray-200 pb-2">Finish</h4>
              <div className="flex flex-wrap gap-2">
                <button className="w-6 h-6 rounded-full bg-gray-200 border border-gray-300 title='Chrome'"></button>
                <button className="w-6 h-6 rounded-full bg-black border border-gray-800 title='Matte Black'"></button>
                <button className="w-6 h-6 rounded-full bg-[#D4AF37] border border-yellow-700 title='Brushed Gold'"></button>
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm text-primary mb-4 border-b border-gray-200 pb-2">Material</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-sans text-xs text-gray-600 cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  8mm Glass
                </label>
                <label className="flex items-center gap-2 font-sans text-xs text-gray-600 cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  10mm Glass
                </label>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setActiveFilter(null)}
                className="w-full py-3 bg-primary text-white font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-secondary transition-all rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
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
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
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

