import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';


export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({ layout, cart: originalCart }: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `h-full flex flex-col ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className={`flex-1 ${layout === 'page' ? 'lg:grid lg:grid-cols-[1fr_420px] lg:gap-16' : 'flex flex-col'}`}>
        
        <div aria-labelledby="cart-lines" className={`flex-1 overflow-y-auto ${layout === 'page' ? '' : '-mx-6 px-6'}`}>
          {layout === 'page' && cartHasItems && (
              <div className="hidden lg:grid grid-cols-[100px_1fr_120px] gap-8 pb-4 border-b border-[#eee] mb-0 text-[10px] tracking-widest text-[#333] font-medium leading-none">
                  <span>Item</span>
                  <span>Product Details</span>
                  <span className="text-right">Price</span>
              </div>
          )}
          <ul className="divide-y divide-[#eee]">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        
        {cartHasItems && (
          <div className={`${layout === 'page' ? 'lg:pl-0 pt-0' : 'pt-6 border-t border-[#eee] mt-auto'}`}>
            <CartSummary cart={cart} layout={layout} />
          </div>
        )}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const { close } = useAside();
  return (
    <div hidden={hidden} className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6" style={{ width: '64px', height: '64px', margin: '0 auto 24px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" style={{ width: '32px', height: '32px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      </div>
      <p className="font-sans text-xs tracking-[0.3em] uppercase font-semibold text-primary mb-6">Your Cart is Empty</p>
      <p className="font-sans text-xs text-gray-400 font-light mb-8 max-w-xs leading-relaxed">
        Discover our latest collections and bespoke shower solutions.
      </p>
      <div style={{ paddingTop: '24px' }}>
        <Link
          to="/collections/all"
          onClick={close}
          prefetch="viewport"
          className="inline-block border px-10 py-4 text-[10px] tracking-[0.2em] font-semibold uppercase transition-all duration-300 min-w-[200px]"
          style={{
            color: '#14294f',
            borderColor: '#14294f',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#14294f';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#14294f';
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
