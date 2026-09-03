import { type FetcherWithComponents } from 'react-router';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?: string;
}) {
  const handleAddToCart = () => {
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      try {
        const line = lines[0];
        const selectedVariant = (line as any)?.selectedVariant;
        const price = selectedVariant?.price?.amount ? parseFloat(selectedVariant.price.amount) : undefined;
        const currency = selectedVariant?.price?.currencyCode || 'ZAR';
        const title = selectedVariant?.product?.title || selectedVariant?.title || 'Product';

        const numericVariantId = selectedVariant?.id ? String(selectedVariant.id).split('/').pop() : undefined;
        const contentIds = [numericVariantId, selectedVariant?.id].filter(Boolean) as string[];

        (window as any).fbq('track', 'AddToCart', {
          content_ids: contentIds,
          content_name: title,
          content_type: 'product',
          value: price,
          currency: currency,
        });
      } catch (err) {
        console.error('Meta Pixel AddToCart error:', err);
      }
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={handleAddToCart}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={className || "w-full bg-primary text-white font-display uppercase tracking-widest text-sm py-4 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
