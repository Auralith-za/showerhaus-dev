import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';

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

  return (
    <Link
      className="group block"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative overflow-hidden bg-gray-50 aspect-[4/5] mb-4 shadow-sm group-hover:shadow-xl transition-all duration-700">
        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="4/5"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="object-cover w-full h-full transition-transform duration-[1500ms] ease-out group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
      </div>

      <div className="text-center px-2">
        <h4 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2">
          {product.title}
        </h4>
        <div className="font-sans text-sm text-gray-500 font-light">
          <Money data={product.priceRange.minVariantPrice} />
        </div>
      </div>
    </Link>
  );
}
