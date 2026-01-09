import { Link, useNavigate } from 'react-router';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';
import type { ProductFragment } from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const { open } = useAside();
  return (
    <div className="product-form space-y-6">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h5 className="font-sans text-sm font-medium text-gray-900 uppercase tracking-wide mb-3">
              {option.name}
            </h5>
            <div className="flex flex-wrap gap-3">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                // Base style for all options
                const baseClasses = `
                   relative flex items-center justify-center px-4 py-2 text-sm font-sans transition-all duration-200 border
                   ${selected
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900'
                  }
                   ${!available && exists ? 'opacity-50 cursor-not-allowed line-through' : ''}
                   ${!exists ? 'opacity-20 cursor-not-allowed hidden' : ''}
                `;

                // Handle Different Product (SEO Link)
                if (isDifferentProduct) {
                  return (
                    <Link
                      className={baseClasses}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} selected={selected} />
                    </Link>
                  );
                }

                // Handle Same Product (Button)
                return (
                  <button
                    type="button"
                    className={baseClasses}
                    key={option.name + name}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected && exists) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} selected={selected} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="pt-4">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            // Logic typically handled inside AddToCartButton, but opening cart drawer here if needed
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
  selected
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
  selected: boolean;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div className="flex items-center gap-2">
      <div
        aria-label={name}
        className={`w-6 h-6 rounded-full border ${selected && (color === '#ffffff' || color === 'white') ? 'border-gray-300' : 'border-transparent'}`}
        style={{
          backgroundColor: color || 'transparent',
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: 'cover',
        }}
      />
      <span>{name}</span>
    </div>
  );
}
