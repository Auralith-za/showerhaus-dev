import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  const isOnSale =
    compareAtPrice &&
    price &&
    parseFloat(compareAtPrice.amount) > 0 &&
    parseFloat(compareAtPrice.amount) !== parseFloat(price.amount);

  return (
    <div className="product-price">
      {isOnSale ? (
        <div className="product-price-on-sale flex items-center gap-2 flex-wrap">
          {price ? <Money data={price} /> : null}
          <s className="text-gray-400 line-through font-normal text-[0.85em] opacity-75">
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}

