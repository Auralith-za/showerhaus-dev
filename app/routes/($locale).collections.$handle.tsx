import { redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { ProductItem } from '~/components/ProductItem';
import type { ProductItemFragment } from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({ data }: any) => {
  return [{ title: `ShowerHaus | ${data?.collection?.title ?? 'Collection'}` }];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

import { MOCK_PRODUCTS } from '~/lib/mockData';

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;

  if (!handle) {
    throw redirect('/collections');
  }

  // Filter mock products by collection handle
  const collectionProducts = MOCK_PRODUCTS.filter((p) => p.collection === handle);
  const title = handle.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const collection = {
    id: `mock-collection-${handle}`,
    handle,
    title,
    description: `Discover our premium range of ${title.toLowerCase()}, curated for modern architectural spaces.`,
    products: {
      nodes: collectionProducts.map((p) => ({
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
    },
  };

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: collection });

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const { collection } = useLoaderData<typeof loader>();

  return (
    <div className="collection-page py-12 bg-white">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl text-primary mb-4">{collection.title}</h1>
          {collection.description && (
            <div className="font-sans text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
              {collection.description}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-32">
              <h3 className="font-display text-lg text-primary border-b border-gray-200 pb-2 mb-6">Categories</h3>
              <ul className="space-y-3 font-sans text-sm text-gray-600 font-light">
                {/* Mock Categories matching Header */}
                <li><a href="/collections/baths" className="hover:text-primary transition-colors">Baths</a></li>
                <li><a href="/collections/showers" className="hover:text-primary transition-colors">Showers</a></li>
                <li><a href="/collections/basins" className="hover:text-primary transition-colors">Basins</a></li>
                <li><a href="/collections/toilets" className="hover:text-primary transition-colors">Toilets</a></li>
                <li><a href="/collections/taps" className="hover:text-primary transition-colors">Taps & Mixers</a></li>
                <li><a href="/collections/accessories" className="hover:text-primary transition-colors">Accessories</a></li>
              </ul>

              <h3 className="font-display text-lg text-primary border-b border-gray-200 pb-2 mb-6 mt-10">Filter By</h3>
              {/* Mock Filters */}
              <div className="space-y-4 font-sans text-sm text-gray-600 font-light">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  In Stock
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  On Sale
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <PaginatedResourceSection<ProductItemFragment>
              connection={collection.products}
              resourcesClassName="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
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

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
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
