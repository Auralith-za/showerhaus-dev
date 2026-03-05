import { redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import { ProductPrice } from '~/components/ProductPrice';
import { ProductImage } from '~/components/ProductImage';
import { ProductForm } from '~/components/ProductForm';
import { ProductTabs } from '~/components/ProductTabs';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';

import { MOCK_PRODUCTS } from '~/lib/mockData';

export const meta: Route.MetaFunction = ({ data }: any) => {
  return [
    { title: `ShowerHaus | ${data?.product?.title ?? 'Product'}` },
    {
      rel: 'canonical',
      href: `/products/${data?.product?.handle}`,
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

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const mockProduct = MOCK_PRODUCTS.find((p) => p.handle === handle);

  if (!mockProduct) {
    throw new Response(null, { status: 404 });
  }

  const product = {
    id: mockProduct.id,
    title: mockProduct.title,
    vendor: 'ShowerHaus',
    handle: mockProduct.handle,
    descriptionHtml: `<p>${mockProduct.description}</p>`,
    description: mockProduct.description,
    encodedVariantExistence: 'dummy',
    encodedVariantAvailability: 'dummy',
    options: [],
    selectedOrFirstAvailableVariant: {
      id: `${mockProduct.id}-variant`,
      availableForSale: true,
      image: {
        __typename: 'Image',
        id: `${mockProduct.id}-image`,
        url: mockProduct.image,
        altText: mockProduct.title,
        width: 1000,
        height: 1000,
      },
      price: { amount: mockProduct.price, currencyCode: mockProduct.currency },
      compareAtPrice: null,
      product: { title: mockProduct.title, handle: mockProduct.handle },
      selectedOptions: [],
      sku: mockProduct.id,
      title: 'Default Title',
      unitPrice: null,
    },
    adjacentVariants: [],
    seo: { title: mockProduct.title, description: mockProduct.description },
    media: {
      nodes: [
        {
          __typename: 'MediaImage',
          id: `${mockProduct.id}-media`,
          image: {
            id: `${mockProduct.id}-image`,
            url: mockProduct.image,
            altText: mockProduct.title,
            width: 1000,
            height: 1000,
          },
        },
      ],
    },
  } as any;

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: product });

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context, params }: Route.LoaderArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const { product } = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml } = product;

  return (
    <div className="product-page bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">

          {/* Product Image Column */}
          <div className="product-image h-fit md:sticky md:top-24">
            <ProductImage
              image={selectedVariant?.image}
              media={product?.media?.nodes}
              className="w-full h-full rounded-sm"
            />
          </div>

          {/* Product Info Column */}
          <div className="product-main flex flex-col justify-center">
            <h1 className="font-display text-4xl lg:text-5xl text-primary mb-4 leading-tight">{title}</h1>

            <div className="font-sans text-xl text-gray-500 font-light mb-8">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>

            <div className="border-t border-b border-gray-100 py-8 mb-8">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />
            </div>

            <ProductTabs description={descriptionHtml} />

            {/* Trust/Delivery Badges (Static for now) */}
            <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-full text-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="text-xs font-sans text-gray-500 uppercase tracking-wider">In Stock</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-full text-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <span className="text-xs font-sans text-gray-500 uppercase tracking-wider">Free Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    media(first: 10) {
      nodes {
        ... on MediaImage {
          id
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
