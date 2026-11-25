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
import {
  getImageOptionAssociation,
  findGalleryImageForOptions,
  findExactVariant,
  type ImageLike,
} from '~/lib/variantGallerySync';
import {
  SITE_URL,
  SITE_NAME,
  PRODUCT_SEO_ENHANCEMENTS,
  buildSeoMeta,
  buildBreadcrumbJsonLd,
  stripHtml,
  truncateText,
} from '~/lib/seo';

function isShowerProductNode(product: any): boolean {
  if (!product) return false;
  const pType = (product.productType || '').toLowerCase();
  const handle = (product.handle || '').toLowerCase();
  return (
    pType === 'showers' ||
    handle.startsWith('semi-frameless-') ||
    Boolean(PRODUCT_SEO_ENHANCEMENTS[handle]?.categoryLabel?.toLowerCase().includes('shower'))
  );
}

export const meta: Route.MetaFunction = ({ data }: any) => {
  const product = data?.product;
  const handle = product?.handle;
  const canonicalUrl = handle ? `${SITE_URL}/products/${handle}` : SITE_URL;
  const enhancement = handle ? PRODUCT_SEO_ENHANCEMENTS[handle] : undefined;
  const isShower = isShowerProductNode(product);

  const rawTitle =
    enhancement?.seoTitle ||
    product?.seo?.title ||
    (product?.title
      ? isShower
        ? `${product.title} | Buy Online in South Africa | ${SITE_NAME} Durban`
        : `${product.title} | Shower Spares South Africa | ${SITE_NAME}`
      : `${SITE_NAME} | Shower Doors, Enclosures & Spares`);

  const rawDescription =
    enhancement?.seoDescription ||
    product?.seo?.description ||
    (product?.description
      ? `${truncateText(product.description, 125)} In stock at Shower Haus Durban with nationwide delivery across South Africa.`
      : `Buy ${product?.title || 'premium shower enclosures and spares'} online at Shower Haus. SABS-approved quality with nationwide South African delivery.`);

  const selectedVariant = product?.selectedOrFirstAvailableVariant;
  const minPrice =
    selectedVariant?.price?.amount ||
    product?.priceRange?.minVariantPrice?.amount ||
    '0';
  const maxPrice =
    product?.priceRange?.maxVariantPrice?.amount || minPrice;
  const currencyCode =
    selectedVariant?.price?.currencyCode ||
    product?.priceRange?.minVariantPrice?.currencyCode ||
    'ZAR';
  const isAvailable =
    selectedVariant?.availableForSale ??
    product?.variants?.nodes?.some((v: any) => v.availableForSale) ??
    true;

  const images: string[] = [];
  if (selectedVariant?.image?.url) images.push(selectedVariant.image.url);
  if (product?.media?.nodes) {
    for (const m of product.media.nodes) {
      if (m?.image?.url && !images.includes(m.image.url)) {
        images.push(m.image.url);
      }
    }
  }

  const categoryPath = isShower ? '/collections/showers' : '/collections/shower-spares';
  const categoryName = isShower ? 'Showers' : 'Shower Spares';

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: categoryName, path: categoryPath },
    { name: product?.title || 'Product', path: `/products/${handle || ''}` },
  ]);

  const variants = product?.variants?.nodes || [];
  const priceValidUntil = '2027-12-31';

  const shippingDetails = {
    '@type': 'OfferShippingDetails',
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'ZA',
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: 1,
        maxValue: 2,
        unitCode: 'DAY',
      },
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: 2,
        maxValue: 5,
        unitCode: 'DAY',
      },
    },
  };

  const returnPolicy = {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'ZA',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
    returnMethod: 'https://schema.org/ReturnByMail',
  };

  const productLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${canonicalUrl}#product`,
        name: product.title,
        description: stripHtml(product.description || rawDescription),
        url: canonicalUrl,
        image: images.length > 0 ? images : [`${SITE_URL}/images/hero-1.png`],
        sku: selectedVariant?.sku || product.handle,
        mpn: selectedVariant?.sku || product.handle,
        category:
          enhancement?.categoryLabel ||
          product.productType ||
          (isShower ? 'Shower Enclosures & Doors' : 'Shower Spares & Hardware'),
        ...(isShower
          ? {
              material: '6mm SABS-Approved Toughened Safety Glass & Polished Aluminium',
              countryOfOrigin: {
                '@type': 'Country',
                name: 'South Africa',
              },
            }
          : {}),
        brand: {
          '@type': 'Brand',
          name: product.vendor || SITE_NAME,
        },
        offers:
          variants.length > 1
            ? {
                '@type': 'AggregateOffer',
                url: canonicalUrl,
                priceCurrency: currencyCode,
                lowPrice: minPrice,
                highPrice: maxPrice,
                offerCount: variants.length,
                availability: isAvailable
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
                itemCondition: 'https://schema.org/NewCondition',
                seller: {
                  '@type': 'Organization',
                  name: SITE_NAME,
                  url: SITE_URL,
                },
                offers: variants.map((v: any) => ({
                  '@type': 'Offer',
                  name: `${product.title}${v.title && v.title !== 'Default Title' ? ` - ${v.title}` : ''}`,
                  sku: v.sku || product.handle,
                  url: canonicalUrl,
                  price: v.price?.amount || minPrice,
                  priceCurrency: v.price?.currencyCode || currencyCode,
                  priceValidUntil,
                  availability: v.availableForSale
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                  itemCondition: 'https://schema.org/NewCondition',
                  shippingDetails,
                  hasMerchantReturnPolicy: returnPolicy,
                })),
              }
            : {
                '@type': 'Offer',
                url: canonicalUrl,
                priceCurrency: currencyCode,
                price: minPrice,
                priceValidUntil,
                availability: isAvailable
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
                itemCondition: 'https://schema.org/NewCondition',
                seller: {
                  '@type': 'Organization',
                  name: SITE_NAME,
                  url: SITE_URL,
                },
                shippingDetails,
                hasMerchantReturnPolicy: returnPolicy,
              },
      }
    : null;

  const keywords = enhancement?.keywords || [
    product?.title,
    product?.productType,
    isShower ? 'shower enclosure south africa' : 'shower spares south africa',
    isShower ? 'shower doors durban' : 'replacement shower parts durban',
    'Shower Haus',
  ].filter(Boolean);

  return buildSeoMeta({
    title: rawTitle,
    description: rawDescription,
    canonicalUrl,
    image: images[0],
    type: 'product',
    priceAmount: minPrice,
    priceCurrency: currencyCode,
    availability: isAvailable ? 'in stock' : 'out of stock',
    keywords,
    jsonLd: [breadcrumbLd, ...(productLd ? [productLd] : [])],
  });
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

  // Build initial option map from Shopify's resolved variant (or first variant)
  const buildInitialOptionsMap = (prod: any): Record<string, string> => {
    const map: Record<string, string> = {};
    const baseVariant =
      prod?.selectedOrFirstAvailableVariant || prod?.variants?.nodes?.[0];
    for (const opt of baseVariant?.selectedOptions || []) {
      if (opt?.name && opt?.value && opt.name !== 'Title') {
        map[opt.name] = opt.value;
      }
    }
    return map;
  };

  const [selectedOptionsMap, setSelectedOptionsMap] = useState<
    Record<string, string>
  >(() => buildInitialOptionsMap(product));

  const [activeGalleryImage, setActiveGalleryImage] =
    useState<ImageLike | null>(
      () => product?.selectedOrFirstAvailableVariant?.image || null,
    );

  // Reset when navigating to a different product
  useEffect(() => {
    const initMap = buildInitialOptionsMap(product);
    setSelectedOptionsMap(initMap);
    setActiveGalleryImage(
      product?.selectedOrFirstAvailableVariant?.image || null,
    );
  }, [product?.id]);

  const allVariants: any[] = product?.variants?.nodes || [];
  const hasRealOptions = (product?.options || []).some(
    (o: any) =>
      !(
        o.name === 'Title' &&
        o.optionValues?.length === 1 &&
        o.optionValues[0]?.name === 'Default Title'
      ),
  );

  const exactMatchedVariant = hasRealOptions
    ? findExactVariant(allVariants, selectedOptionsMap)
    : product?.selectedOrFirstAvailableVariant || allVariants[0] || null;

  const isInvalidCombination = hasRealOptions && exactMatchedVariant === null;
  const selectedVariant = exactMatchedVariant;
  const currentVariant = exactMatchedVariant;

  // Fallback variant for price/badge display when an invalid combination is selected
  const displayFallbackVariant =
    selectedVariant ||
    product?.selectedOrFirstAvailableVariant ||
    allVariants[0] ||
    null;

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant:
      selectedVariant || product.selectedOrFirstAvailableVariant,
  });

  const syncUrlWithOptions = (nextOptionsMap: Record<string, string>) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(nextOptionsMap)) {
      if (k && v && k !== 'Title') {
        params.set(k, v);
      }
    }
    const queryStr = params.toString();
    if (queryStr) {
      navigate(`?${queryStr}`, { replace: true, preventScrollReset: true });
    }
  };

  const handleSelectOption = (optionName: string, optionValue: string) => {
    const nextOptionsMap = {
      ...selectedOptionsMap,
      [optionName]: optionValue,
    };
    setSelectedOptionsMap(nextOptionsMap);

    const targetImg = findGalleryImageForOptions(
      product,
      nextOptionsMap,
      optionName,
    );
    if (targetImg) {
      setActiveGalleryImage(targetImg);
    }

    syncUrlWithOptions(nextOptionsMap);
  };

  const handleGalleryImageSelect = (clickedImg: ImageLike) => {
    setActiveGalleryImage(clickedImg);

    const associatedOptions = getImageOptionAssociation(clickedImg, product);
    // Shared images (lifestyle scenes, diagrams, dimensions) return null and do not alter selection
    if (!associatedOptions) {
      return;
    }

    let didChange = false;
    const nextOptionsMap = { ...selectedOptionsMap };
    for (const [optName, optVal] of Object.entries(associatedOptions)) {
      // Match option name case-insensitively to product's canonical option name
      const canonicalOpt = (product?.options || []).find(
        (o: any) => o.name.toLowerCase() === optName.toLowerCase(),
      );
      const keyName = canonicalOpt ? canonicalOpt.name : optName;
      if (nextOptionsMap[keyName] !== optVal) {
        nextOptionsMap[keyName] = optVal;
        didChange = true;
      }
    }

    if (didChange) {
      setSelectedOptionsMap(nextOptionsMap);
      syncUrlWithOptions(nextOptionsMap);
    }
  };

  const { title, descriptionHtml } = product;
  const [quantity, setQuantity] = useState(1);

  const rawQuantityAvailable = (currentVariant as any)?.quantityAvailable;
  const isCurrentlyNotInStock = (currentVariant as any)?.currentlyNotInStock;
  const isAvailableForSale = Boolean(currentVariant?.availableForSale);

  // If item is out of stock (quantity <= 0 or currentlyNotInStock) BUT availableForSale is true,
  // "Sell when out of stock" is ON -> Allow unlimited ordering (maxQuantity = null).
  const isSellWhenOutOfStockOn =
    (isCurrentlyNotInStock ||
      (typeof rawQuantityAvailable === 'number' && rawQuantityAvailable <= 0)) &&
    isAvailableForSale;

  const maxQuantity = !currentVariant
    ? 0
    : isSellWhenOutOfStockOn || rawQuantityAvailable == null
      ? null
      : Math.max(0, rawQuantityAvailable);

  const isVariantAvailable =
    Boolean(selectedVariant) &&
    Boolean(selectedVariant.availableForSale) &&
    maxQuantity !== 0;

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


  const isShower = isShowerProductNode(product);
  const seoEnhancement = PRODUCT_SEO_ENHANCEMENTS[product.handle];

  return (
    <div className="product-page bg-white">
      {/* Visible SEO Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-gray-100 bg-gray-50/60"
      >
        <div className="container mx-auto px-6 py-3 flex flex-wrap items-center gap-2 font-sans text-[11px] tracking-wider uppercase text-gray-500">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to={isShower ? '/collections/showers' : '/collections/shower-spares'}
            className="hover:text-primary transition-colors"
          >
            {isShower ? 'Showers' : 'Shower Spares'}
          </Link>
          {!isShower && (product as any).productType && (
            <>
              <span>/</span>
              <Link
                to={`/collections/shower-spares?filter=${encodeURIComponent(JSON.stringify({ productType: (product as any).productType }))}`}
                className="hover:text-primary transition-colors"
              >
                {(product as any).productType}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-primary font-semibold truncate max-w-[260px] sm:max-w-md">
            {title}
          </span>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">

          {/* Product Image Column */}
          <div className="product-image h-fit md:sticky md:top-24">
            <ProductImage
              image={activeGalleryImage || displayFallbackVariant?.image}
              media={product?.media?.nodes}
              onImageSelect={handleGalleryImageSelect}
              className="w-full h-full rounded-sm"
            />
          </div>

          {/* Product Info Column */}
          <div className="product-main flex flex-col justify-center">
            {(() => {
              const pdpBadges = getProductBadges({
                ...product,
                compareAtPrice:
                  selectedVariant?.compareAtPrice ||
                  displayFallbackVariant?.compareAtPrice,
                price:
                  selectedVariant?.price || displayFallbackVariant?.price,
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
                price={
                  selectedVariant?.price ||
                  displayFallbackVariant?.price ||
                  product?.priceRange?.minVariantPrice
                }
                compareAtPrice={
                  selectedVariant?.compareAtPrice ||
                  displayFallbackVariant?.compareAtPrice ||
                  product?.compareAtPriceRange?.minVariantPrice
                }
              />
            </div>

            <div className="border-t border-b border-gray-100 py-6 mb-8 mt-2 space-y-6">
              
              {(() => {
                // Build dynamic swatch lookup from this Shopify product's own Metaobject references (e.g. custom.finish, shopify.color-pattern)
                const metaobjectSwatchMap: Record<
                  string,
                  { color?: string; imageUrl?: string; label?: string }
                > = {};

                const productMetafields = ((product as any)?.metafields || []).filter(Boolean);
                for (const mf of productMetafields) {
                  const refNodes = mf?.references?.nodes || [];
                  for (const node of refNodes) {
                    if (!node || !Array.isArray(node.fields)) continue;
                    let label = '';
                    let color = '';
                    let imageUrl = '';
                    for (const field of node.fields) {
                      const fKey = (field?.key || '').toLowerCase();
                      if (fKey === 'label' || fKey === 'name' || fKey === 'title') {
                        label = field?.value || '';
                      } else if (fKey === 'swatch' || fKey === 'color' || fKey === 'colour' || fKey === 'hex') {
                        if (field?.value && field.value.startsWith('#')) {
                          color = field.value;
                        }
                        if (field?.reference?.image?.url) {
                          imageUrl = field.reference.image.url;
                        }
                      } else if (fKey === 'image' && field?.reference?.image?.url) {
                        imageUrl = field.reference.image.url;
                      }
                    }
                    const entry = {
                      color: color || undefined,
                      imageUrl: imageUrl || undefined,
                      label: label || undefined,
                    };
                    if (label) {
                      metaobjectSwatchMap[label.trim().toLowerCase()] = entry;
                    }
                    if (node.handle) {
                      metaobjectSwatchMap[node.handle.trim().toLowerCase()] = entry;
                      metaobjectSwatchMap[node.handle.replace(/-/g, ' ').trim().toLowerCase()] = entry;
                    }
                  }
                }

                const fallbackColorMap: Record<string, string> = {
                  'polished aluminium': '#C9CDD1',
                  'polished aluminum': '#C9CDD1',
                  'matt black': '#2B2B2B',
                  'matte black': '#2B2B2B',
                  'chrome': '#ADADAD',
                  'silver': '#D3D3D3',
                  'polished stainless steel': '#E5E7EB',
                  'brushed stainless steel': '#9CA3AF',
                  'satin gold': '#D49A06',
                  'antique brass': '#BEB150',
                  'black': '#000000',
                  'white': '#FFFFFF',
                  'clear': '#FFFFFF',
                  'grey': '#808080',
                  'gray': '#808080',
                };

                return productOptions
                  .filter(
                    (option) =>
                      option.optionValues &&
                      option.optionValues.length > 0 &&
                      !(
                        option.name === 'Title' &&
                        option.optionValues.length === 1 &&
                        option.optionValues[0].name === 'Default Title'
                      ),
                  )
                  .map((option) => {
                    const optNameLower = option.name.toLowerCase().trim();
                    const isColorOrFinish =
                      optNameLower === 'finish' ||
                      optNameLower === 'color' ||
                      optNameLower === 'colour';
                    const activeValueName =
                      selectedOptionsMap[option.name] ||
                      option.optionValues.find((v) => v.selected)?.name ||
                      '';

                    // Check if a given option value exists & is available with the other currently selected options
                    const getOptionValueStatus = (valName: string) => {
                      const candidateMap = {
                        ...selectedOptionsMap,
                        [option.name]: valName,
                      };
                      const exactVar = findExactVariant(allVariants, candidateMap);
                      const existsInProduct = allVariants.some((v) =>
                        (v.selectedOptions || []).some(
                          (so: any) =>
                            so.name.toLowerCase() === optNameLower &&
                            so.value.toLowerCase() === valName.toLowerCase(),
                        ),
                      );
                      return {
                        existsInProduct,
                        combinationExists: Boolean(exactVar),
                        available: Boolean(exactVar?.availableForSale),
                      };
                    };

                    return (
                      <div key={option.name} className="flex items-center gap-8">
                        <span className="text-sm text-gray-700 w-24">{option.name}:</span>

                        {isColorOrFinish ? (
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex gap-2">
                              {option.optionValues
                                .filter((val) => getOptionValueStatus(val.name).existsInProduct)
                                .map((val) => {
                                  const valKey = val.name.trim().toLowerCase();
                                  const isSelected =
                                    activeValueName.toLowerCase() === valKey;
                                  const status = getOptionValueStatus(val.name);
                                  const metaSwatch = metaobjectSwatchMap[valKey];
                                  const swatchImage =
                                    metaSwatch?.imageUrl ||
                                    val.swatch?.image?.previewImage?.url;
                                  const swatchColor =
                                    metaSwatch?.color ||
                                    val.swatch?.color ||
                                    fallbackColorMap[valKey] ||
                                    '#cccccc';

                                  return (
                                    <button
                                      key={val.name}
                                      type="button"
                                      onClick={() =>
                                        handleSelectOption(option.name, val.name)
                                      }
                                      title={
                                        status.combinationExists
                                          ? status.available
                                            ? val.name
                                            : `${val.name} (Sold Out)`
                                          : `${val.name} (Select a valid size/option)`
                                      }
                                      aria-label={`${option.name}: ${val.name}`}
                                      aria-pressed={isSelected}
                                      className={`w-8 h-8 rounded-full border-2 focus:outline-none transition-all cursor-pointer ${
                                        isSelected
                                          ? 'border-gray-900 scale-105 shadow-sm'
                                          : 'border-transparent hover:border-gray-300'
                                      } ${!status.available ? 'opacity-60' : ''}`}
                                      style={{ padding: '2px' }}
                                    >
                                      <div
                                        className="w-full h-full rounded-full border border-black/15 shadow-sm bg-cover bg-center"
                                        style={
                                          swatchImage
                                            ? {
                                                backgroundImage: `url(${swatchImage})`,
                                                backgroundColor: swatchColor,
                                              }
                                            : { backgroundColor: swatchColor }
                                        }
                                      />
                                    </button>
                                  );
                                })}
                            </div>
                            {activeValueName && (
                              <span className="font-sans text-xs text-gray-600 font-medium">
                                {activeValueName}
                              </span>
                            )}
                          </div>
                        ) : (
                          <select
                            value={activeValueName}
                            onChange={(e) => {
                              handleSelectOption(option.name, e.target.value);
                            }}
                            className="flex-1 max-w-[280px] p-2.5 text-sm border border-gray-200 bg-gray-50/50 focus:border-gray-900 focus:ring-0 outline-none"
                          >
                            {option.optionValues
                              .filter((val) => getOptionValueStatus(val.name).existsInProduct)
                              .map((val) => {
                                const status = getOptionValueStatus(val.name);
                                return (
                                  <option key={val.name} value={val.name}>
                                    {val.name}{' '}
                                    {!status.combinationExists
                                      ? '(Unavailable in selected finish)'
                                      : !status.available
                                        ? '(Sold Out)'
                                        : ''}
                                  </option>
                                );
                              })}
                          </select>
                        )}
                      </div>
                    );
                  });
              })()}

              {/* Invalid Combination or Unavailable Variant Prompt */}
              {isInvalidCombination && (
                <div
                  role="alert"
                  className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-xs font-sans rounded-sm"
                >
                  The selected combination (
                  <strong>
                    {Object.values(selectedOptionsMap).filter(Boolean).join(' / ')}
                  </strong>
                  ) is not available. Please select a valid option combination above.
                </div>
              )}
              {!isInvalidCombination && selectedVariant && !isVariantAvailable && (
                <div
                  role="status"
                  className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-3 text-xs font-sans rounded-sm"
                >
                  <strong>
                    {Object.values(selectedOptionsMap).filter(Boolean).join(' / ') ||
                      selectedVariant.title}
                  </strong>{' '}
                  is currently out of stock and unavailable for purchase.
                </div>
              )}

              {/* Add to Cart Line */}
              <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-6">
                  <span className="text-sm text-gray-700 w-24 flex-shrink-0">Qty:</span>
                  <QuantityPicker
                    value={effectiveQuantity}
                    onChange={(val) => setQuantity(val)}
                    min={1}
                    max={maxQuantity}
                    disabled={isInvalidCombination || !isVariantAvailable}
                  />

                  <div className="flex-1 max-w-[240px]">
                    <AddToCartButton
                      disabled={isInvalidCombination || !isVariantAvailable}
                      onClick={() => {
                        try {
                          open('cart');
                        } catch (e) {}
                        window.location.hash = 'cart-added';
                      }}
                      lines={
                        selectedVariant && isVariantAvailable
                          ? [
                              {
                                merchandiseId: selectedVariant.id,
                                quantity: effectiveQuantity,
                                selectedVariant: selectedVariant,
                              },
                            ]
                          : []
                      }
                      className="w-full bg-primary text-white py-3.5 text-xs tracking-widest uppercase hover:bg-secondary transition-colors font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isInvalidCombination
                        ? 'SELECT VALID OPTIONS'
                        : isVariantAvailable
                          ? 'ADD TO BASKET'
                          : 'SOLD OUT'}
                    </AddToCartButton>
                  </div>
                </div>
              </div>
            </div>

            <ProductTabs description={descriptionHtml} />

            {/* SEO & GEO Highlights for Showers Products */}
            {isShower && (
              <div className="mt-8 border border-gray-100 bg-gray-50/70 p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
                    {seoEnhancement?.categoryLabel || 'Semi-Frameless Shower Specification'}
                  </h2>
                  <span className="font-sans text-[10px] font-semibold tracking-wider uppercase text-secondary">
                    SABS Safety Glass
                  </span>
                </div>
                {seoEnhancement?.highlights && seoEnhancement.highlights.length > 0 && (
                  <ul className="space-y-2 font-sans text-xs text-gray-600 leading-relaxed">
                    {seoEnhancement.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-secondary font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="font-sans text-xs text-gray-500 leading-relaxed pt-2 border-t border-gray-200/70">
                  <strong>Delivery &amp; Installation (South Africa):</strong> Available in stock for nationwide courier delivery to Durban, Johannesburg, Pretoria, Cape Town, and across South Africa, or collection from our Springfield, Durban showroom (90A Intersite Ave). Professional installation available across Durban, Umhlanga, Ballito, Hillcrest &amp; KwaZulu-Natal.
                </p>
              </div>
            )}

            {/* Custom Shower Banner */}
            {(isShower || product.handle.includes('shower')) && (
                <Link 
                    to="/pages/custom-made-showers"
                    className="mt-6 bg-sky-blue/10 border border-sky-blue/20 p-6 flex items-center justify-between group hover:bg-sky-blue/20 transition-all rounded-sm"
                >
                    <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
                        Need custom dimensions or frameless installation in Durban &amp; KZN? <span className="text-secondary ml-2 group-hover:underline">Explore Custom Showers →</span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-sky-blue flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                </Link>
            )}

            {/* Trust/Delivery Badges */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 bg-gray-50 rounded-full ${
                    isVariantAvailable ? 'text-secondary' : 'text-red-500'
                  }`}
                >
                  {isVariantAvailable ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  )}
                </div>
                <span className="text-xs font-sans text-gray-500 uppercase tracking-wider">
                  {isInvalidCombination
                    ? 'Select Valid Combination'
                    : isVariantAvailable
                      ? 'In Stock'
                      : 'Out of Stock'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-full text-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                </div>
                <span className="text-xs font-sans text-gray-500 uppercase tracking-wider">Durban Showroom &amp; Nationwide SA Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modern Tabbed Carousel Section */}
      <ProductCarouselTabs currentProduct={product} relatedProducts={relatedProducts} />

      {/* Internal Linking & GEO SEO Footer for Showers Products */}
      {isShower && (
        <section className="bg-gray-50 border-t border-gray-100 py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <span className="block font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-secondary">
                  Standard &amp; Semi-Frameless Showers South Africa
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-primary">
                  Engineered for South African Bathrooms
                </h2>
                <p className="font-sans text-sm text-gray-600 leading-relaxed font-light">
                  Every Shower Haus standard semi-frameless shower enclosure, pivot door, sliding door, walk-in screen, and bath screen is manufactured with 6mm SABS-certified toughened safety glass and corrosion-resistant anodised aluminium profiles. All standard showers are stocked at our Springfield, Durban warehouse (90A Intersite Avenue, Umgeni Business Park) for immediate collection, professional installation across Durban, Umhlanga, Ballito, Hillcrest, Kloof &amp; KwaZulu-Natal, or insured courier delivery nationwide to Johannesburg, Pretoria, Cape Town, and across South Africa.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-primary border-b border-gray-200 pb-3">
                  Explore Our Complete Showers Range
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans text-xs">
                  <Link to="/collections/showers" className="text-primary font-semibold hover:text-secondary transition-colors">
                    → All Standard Showers
                  </Link>
                  <Link to="/pages/frameless-showers" className="text-primary font-semibold hover:text-secondary transition-colors">
                    → Frameless Showers (Durban &amp; KZN)
                  </Link>
                  <Link to="/pages/custom-made-showers" className="text-primary font-semibold hover:text-secondary transition-colors">
                    → Custom-Made Showers
                  </Link>
                  <Link to="/pages/design-your-shower" className="text-primary font-semibold hover:text-secondary transition-colors">
                    → Design Your Shower Online
                  </Link>
                  <Link to="/products/semi-frameless-corner-entry-shower" className="text-gray-600 hover:text-primary transition-colors">
                    • Semi-Frameless Corner-Entry Shower
                  </Link>
                  <Link to="/products/semi-frameless-round-sliding-door-shower" className="text-gray-600 hover:text-primary transition-colors">
                    • Semi-Frameless Round Sliding Shower
                  </Link>
                  <Link to="/products/semi-frameless-pivot-door" className="text-gray-600 hover:text-primary transition-colors">
                    • Semi-Frameless Pivot Shower Door
                  </Link>
                  <Link to="/products/semi-frameless-extendable-pivot-door" className="text-gray-600 hover:text-primary transition-colors">
                    • Extendable Pivot Shower Door
                  </Link>
                  <Link to="/products/semi-frameless-single-slider-shower-door" className="text-gray-600 hover:text-primary transition-colors">
                    • Single Slider Shower Door
                  </Link>
                  <Link to="/products/semi-frameless-pivot-shower-door-with-return-panel" className="text-gray-600 hover:text-primary transition-colors">
                    • Pivot Door with Return Panel
                  </Link>
                  <Link to="/products/semi-frameless-return-panel" className="text-gray-600 hover:text-primary transition-colors">
                    • Semi-Frameless Return Panel
                  </Link>
                  <Link to="/products/semi-frameless-shower-screen" className="text-gray-600 hover:text-primary transition-colors">
                    • Walk-In Shower Screen
                  </Link>
                  <Link to="/products/semi-frameless-single-bath-screen" className="text-gray-600 hover:text-primary transition-colors">
                    • Single Hinged Bath Screen
                  </Link>
                  <Link to="/products/semi-frameless-double-bath-screen" className="text-gray-600 hover:text-primary transition-colors">
                    • Double Folding Bath Screen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price:
                selectedVariant?.price?.amount ||
                displayFallbackVariant?.price?.amount ||
                '0',
              vendor: product.vendor,
              variantId:
                selectedVariant?.id || displayFallbackVariant?.id || '',
              variantTitle:
                selectedVariant?.title || displayFallbackVariant?.title || '',
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
    productType
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
    metafields(
      identifiers: [
        {namespace: "custom", key: "finish"}
        {namespace: "shopify", key: "color-pattern"}
        {namespace: "shopify", key: "finish"}
        {namespace: "custom", key: "color"}
        {namespace: "custom", key: "colour"}
      ]
    ) {
      namespace
      key
      type
      value
      references(first: 25) {
        nodes {
          __typename
          ... on Metaobject {
            id
            handle
            type
            fields {
              key
              value
              reference {
                __typename
                ... on MediaImage {
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
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
