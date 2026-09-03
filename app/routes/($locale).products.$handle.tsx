import { Link, redirect, useLoaderData, useNavigate, isRouteErrorResponse, useRouteError, useParams, useSearchParams } from 'react-router';
import type { Route } from './+types/products.$handle';
import { useState, useEffect } from 'react';
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
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { InspirationSection } from '~/components/InspirationSection';
import { QuantityPicker } from '~/components/QuantityPicker';
import { getProductBadges } from '~/lib/badges';


export const meta: Route.MetaFunction = ({ data }: any) => {
  const origin = 'https://www.showerhaus.co.za';
  const handle = data?.product?.handle;
  const canonicalUrl = handle ? `${origin}/products/${handle}` : origin;

  return [
    { title: `Shower Haus | ${data?.product?.title ?? 'Product'}` },
    { name: 'description', content: data?.product?.description ?? '' },
    { tagName: 'link', rel: 'canonical', href: canonicalUrl },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // Start fetching non-critical data after we have the product ID
  const deferredData = loadDeferredData({ ...args, productId: criticalData.product.id });

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const selectedOptions = getSelectedProductOptions(request);

  let product = null;
  try {
    const data = await storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
      },
    });
    product = data?.product;
  } catch (error) {
    console.error('Failed to fetch product from Shopify:', error);
  }

  if (!product) {
    throw new Response(null, { status: 404 });
  }

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
function loadDeferredData({ context, productId }: any) {
  const relatedProducts = context.storefront.query(RECOMMENDATIONS_QUERY, {
    variables: { productId },
  }).catch((error: Error) => {
    console.error(error);
    return null;
  });

  return {
    relatedProducts,
  };
}

import { ProductCarouselTabs } from '~/components/ProductCarouselTabs';

export default function Product() {
  const { product, relatedProducts } = useLoaderData<typeof loader>();
  const { open } = useAside();
  const navigate = useNavigate();

  // ... (existing state and logic)
  const [searchParams] = useSearchParams();

  // Use Shopify's resolved variant from the loader directly
  const matchedVariant = product.selectedOrFirstAvailableVariant;

  const selectedVariant = useOptimisticVariant(
    matchedVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml } = product;
  const [quantity, setQuantity] = useState(1);

  const currentVariant =
    product?.variants?.nodes?.find((v: any) => {
      if (v.id === selectedVariant?.id) return true;
      if (v.selectedOptions && selectedVariant?.selectedOptions) {
        return v.selectedOptions.every((opt: any) =>
          selectedVariant.selectedOptions.some(
            (selOpt: any) => selOpt.name === opt.name && selOpt.value === opt.value
          )
        );
      }
      return false;
    }) || selectedVariant;

  const rawQuantityAvailable = (currentVariant as any)?.quantityAvailable;
  const isCurrentlyNotInStock = (currentVariant as any)?.currentlyNotInStock;
  const isAvailableForSale = currentVariant?.availableForSale;

  // If item is out of stock (quantity <= 0 or currentlyNotInStock) BUT availableForSale is true,
  // "Sell when out of stock" is ON -> Allow unlimited ordering (maxQuantity = null).
  const isSellWhenOutOfStockOn =
    (isCurrentlyNotInStock || (typeof rawQuantityAvailable === 'number' && rawQuantityAvailable <= 0)) &&
    isAvailableForSale;

  const maxQuantity =
    isSellWhenOutOfStockOn || rawQuantityAvailable == null
      ? null
      : Math.max(0, rawQuantityAvailable);

  useEffect(() => {
    if (maxQuantity !== null && maxQuantity > 0 && quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  }, [selectedVariant?.id, maxQuantity]);

  useEffect(() => {
    if (product && typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      try {
        const variantId = selectedVariant?.id ? String(selectedVariant.id).split('/').pop() : undefined;
        const productId = product?.id ? String(product.id).split('/').pop() : undefined;
        const contentIds = [variantId, productId, selectedVariant?.id, product?.id].filter(Boolean) as string[];

        (window as any).fbq('track', 'ViewContent', {
          content_name: product.title,
          content_category: (product as any).productType || 'Showers',
          content_ids: contentIds,
          content_type: 'product',
          value: selectedVariant?.price?.amount ? parseFloat(selectedVariant.price.amount) : 0,
          currency: selectedVariant?.price?.currencyCode || 'ZAR',
        });
      } catch (err) {
        console.error('Meta Pixel ViewContent error:', err);
      }
    }
  }, [product?.id, selectedVariant?.id]);

  const effectiveQuantity =
    maxQuantity !== null && maxQuantity > 0
      ? Math.min(quantity, maxQuantity)
      : quantity;

  // Find the mock product to get the collection handle for related items


  return (
    <div className="product-page bg-white">
      <div className="container mx-auto px-6 py-12">
        {/* New Site Shop Beta Banner */}
        <div className="bg-[#f0f7ff] border border-blue-100 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-sm">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#4A89C8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-sans text-xs text-primary font-medium leading-relaxed">
              Our new site is currently in beta. Please be patient. If you experience any issues,{' '}
              <Link to={`/webmaster-feedback?ref=${encodeURIComponent('/products/' + product.handle)}`} className="underline hover:text-secondary transition-colors font-semibold" style={{ color: '#4a89c8' }}>click here to provide feedback</Link>.
            </p>
          </div>
        </div>

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
            {(() => {
              const pdpBadges = getProductBadges({
                ...product,
                compareAtPrice: selectedVariant?.compareAtPrice || currentVariant?.compareAtPrice,
                price: selectedVariant?.price || currentVariant?.price,
              });
              if (pdpBadges.length === 0) return null;
              return (
                <div className="flex flex-wrap gap-2 mb-3">
                  {pdpBadges.map((badge) => (
                    <span
                      key={badge}
                      className="bg-red-600 text-white font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs shadow-xs"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              );
            })()}
            <h1 className="font-display text-4xl lg:text-5xl text-primary mb-4 leading-tight">{title}</h1>

            <div className="font-sans text-xl text-gray-500 font-light mb-8">
              <ProductPrice
                price={selectedVariant?.price || currentVariant?.price || product?.priceRange?.minVariantPrice}
                compareAtPrice={selectedVariant?.compareAtPrice || currentVariant?.compareAtPrice || product?.compareAtPriceRange?.minVariantPrice}
              />
            </div>

            <div className="border-t border-b border-gray-100 py-6 mb-8 mt-2 space-y-6">
              
              {productOptions
                .filter((option) => !(option.name === 'Title' && option.optionValues.length === 1 && option.optionValues[0].name === 'Default Title'))
                .map((option) => {
                const isColorOrFinish = option.name.toLowerCase() === 'finish' || option.name.toLowerCase() === 'color';
                
                return (
                  <div key={option.name} className="flex items-center gap-8">
                    <span className="text-sm text-gray-700 w-24">{option.name}:</span>
                    
                    {isColorOrFinish ? (
                      <div className="flex gap-2">
                        {option.optionValues.filter(val => val.exists).map((val) => {
                          const colorMap: Record<string, string> = {
                            'chrome': '#e5e7eb',
                            'polished stainless steel': '#E5E7EB',
                            'brushed stainless steel': '#9CA3AF',
                            'satin gold': '#D4AF37',
                            'antique brass': '#B5A642',
                            'black': '#1F2937',
                          };
                          const swatchColor = val.swatch?.color || colorMap[val.name.toLowerCase()] || '#cccccc';
                          
                          return (
                            <Link
                              key={val.name}
                              to={`?${val.variantUriQuery}`}
                              replace
                              preventScrollReset
                              title={val.name}
                              className={`w-8 h-8 rounded-full border-2 focus:outline-none transition-all ${val.selected ? 'border-gray-900 scale-105 shadow-sm' : 'border-transparent hover:border-gray-300'}`}
                              style={{ padding: '2px' }}
                            >
                              <div className="w-full h-full rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: swatchColor }} />
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <select 
                        value={option.optionValues.find(v => v.selected)?.name || ''}
                        onChange={(e) => {
                          const selectedVal = option.optionValues.find(v => v.name === e.target.value);
                          if (selectedVal && selectedVal.variantUriQuery !== undefined) {
                            navigate(`?${selectedVal.variantUriQuery}`, { replace: true, preventScrollReset: true });
                          }
                        }}
                        className="flex-1 max-w-[280px] p-2.5 text-sm border border-gray-200 bg-gray-50/50 focus:border-gray-900 focus:ring-0 outline-none"
                      >
                        {option.optionValues.filter(val => val.exists).map(val => (
                          <option key={val.name} value={val.name}>
                            {val.name} {val.available ? '' : '(Sold Out)'}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}

              {/* Add to Cart Line */}
              <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-6">
                  <span className="text-sm text-gray-700 w-24 flex-shrink-0">Qty:</span>
                  <QuantityPicker
                    value={effectiveQuantity}
                    onChange={(val) => setQuantity(val)}
                    min={1}
                    max={maxQuantity}
                    disabled={!selectedVariant || !selectedVariant.availableForSale || maxQuantity === 0}
                  />

                  <div className="flex-1 max-w-[240px]">
                    <AddToCartButton
                      disabled={!selectedVariant || !selectedVariant.availableForSale || maxQuantity === 0}
                      onClick={() => {
                        try {
                          open('cart');
                        } catch (e) {}
                        window.location.hash = 'cart-added';
                      }}
                      lines={
                        selectedVariant
                          ? [
                              {
                                merchandiseId: selectedVariant.id,
                                quantity: effectiveQuantity,
                                selectedVariant: selectedVariant,
                              },
                            ]
                          : []
                      }
                      className="w-full bg-primary text-white py-3.5 text-xs tracking-widest uppercase hover:bg-secondary transition-colors font-bold shadow-sm"
                    >
                      {selectedVariant?.availableForSale && maxQuantity !== 0 ? 'ADD TO BASKET' : 'SOLD OUT'}
                    </AddToCartButton>
                  </div>
                </div>
              </div>
            </div>

            <ProductTabs description={descriptionHtml} />

            {/* Custom Shower Banner */}
            {product.handle.includes('shower') && (
                <Link 
                    to="/pages/custom-made-showers"
                    className="mt-8 bg-sky-blue/10 border border-sky-blue/20 p-6 flex items-center justify-between group hover:bg-sky-blue/20 transition-all rounded-sm"
                >
                    <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
                        Looking for a custom shower? <span className="text-secondary ml-2 group-hover:underline">Click here.</span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-sky-blue">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                </Link>
            )}

            {/* Trust/Delivery Badges (Static for now) */}
            <div className="flex gap-4 mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-full text-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="text-xs font-sans text-gray-500 uppercase tracking-wider">In Stock</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modern Tabbed Carousel Section */}
      <ProductCarouselTabs currentProduct={product} relatedProducts={relatedProducts} />

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
    quantityAvailable
    currentlyNotInStock
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    tags
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
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
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
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

const RECOMMENDATIONS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query ProductRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...RecommendedProduct
    }
  }
` as const;

export function ErrorBoundary() {
  const error = useRouteError();
  const { handle } = useParams();

  if (isRouteErrorResponse(error) && error.status === 404) {
    const formattedHandle = handle 
      ? handle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : 'This Product';

    return (
      <div className="bg-[#FDFCFB] min-h-screen">
        {/* Dynamic Hero Section */}
        <section className="py-24 bg-white border-b border-gray-100 text-center px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="block font-sans text-[11px] font-bold tracking-[0.4em] uppercase text-[#4A89C8]">
              Welcome to Shower Haus
            </span>
            <h1 className="font-display text-5xl md:text-6xl text-primary tracking-tight">
              Are you looking for {formattedHandle}?
            </h1>
            <p className="font-sans text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              As South Africa's premier shower enclosure specialists, our expert team focuses on premium custom builds and can design exactly what you need to create your perfect bathroom sanctuary.
            </p>
            <div className="pt-8">
              <Link
                to="/pages/design-your-shower"
                className="bg-primary text-white px-10 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-secondary transition-all duration-300 shadow-xl inline-block"
              >
                Design Your Custom {formattedHandle}
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery / Inspiration Section */}
        <InspirationSection />

        {/* Contact Section */}
        <section className="py-24 bg-white border-t border-gray-100 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-display text-4xl text-primary">Need this specific item?</h2>
            <p className="font-sans text-gray-500 max-w-xl mx-auto leading-relaxed">
              Our sales consultants can check our offline inventory or order it directly for you. Get in touch with us today.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-8">
              <a href="tel:0313129095" className="flex flex-col items-center justify-center p-8 border border-gray-100 bg-gray-50 hover:bg-[#4A89C8]/5 hover:border-[#4A89C8] transition-all group">
                <svg className="w-8 h-8 text-[#4A89C8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-sans text-sm font-bold tracking-widest text-primary">031 312 9095</span>
              </a>
              <Link to="/contact" className="flex flex-col items-center justify-center p-8 border border-gray-100 bg-gray-50 hover:bg-[#4A89C8]/5 hover:border-[#4A89C8] transition-all group">
                <svg className="w-8 h-8 text-[#4A89C8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="font-sans text-sm font-bold tracking-widest text-primary uppercase">Contact Form</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-4xl text-primary mb-6">Something went wrong</h1>
      <p className="font-sans text-gray-500">We're sorry, an error occurred while loading this product.</p>
    </div>
  );
}
