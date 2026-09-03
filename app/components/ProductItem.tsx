import { Link } from 'react-router';
import { Image } from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';
import { ProductPrice } from '~/components/ProductPrice';
import { getProductBadges } from '~/lib/badges';

export function ProductItem({
  product,
  loading,
}: {
  product:
  | CollectionItemFragment
  | ProductItemFragment
  | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const compareAtPrice = (product as any).compareAtPriceRange?.minVariantPrice;
  const badges = getProductBadges(product);

  return (
    <Link
      className="group block"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative overflow-hidden bg-gray-50 aspect-square mb-4 shadow-sm group-hover:shadow-xl transition-all duration-300">
        {badges.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start pointer-events-none">
            {badges.map((badge) => (
              <span
                key={badge}
                className="bg-red-600 text-white font-sans text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-sm rounded-xs"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="object-cover w-full h-full transition-transform duration-[300ms] ease-out group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
      </div>

      <div className="text-left px-2">
        <h4 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2">
          {product.title}
        </h4>
        <div className="font-sans text-sm text-gray-500 font-light">
          <ProductPrice
            price={product.priceRange.minVariantPrice}
            compareAtPrice={compareAtPrice}
          />
        </div>
      </div>
    </Link>
  );
}
