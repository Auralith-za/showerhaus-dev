import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Money, type OptimisticCart } from '@shopify/hydrogen';
import { useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import type { FetcherWithComponents } from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({ cart, layout }: CartSummaryProps) {
  const subtotal = cart?.cost?.subtotalAmount;
  
  if (layout === 'page') {
      return (
          <div className="bg-white p-8 lg:p-10 sticky top-24 w-full h-fit">
              <h2 className="text-xs uppercase tracking-wider text-primary font-bold mb-6">Order Summary</h2>
              <hr className="border-gray-200 mb-6" />
              
              <div className="space-y-4 text-xs tracking-wider uppercase text-primary mb-6">
                 <div className="flex justify-between items-center">
                     <span>Subtotal</span>
                     <span className="text-primary font-bold">{subtotal ? <Money data={subtotal} /> : 'R 0.00'}</span>
                 </div>
                 <div className="flex justify-between items-center">
                     <span>Estimated Tax</span>
                     <span className="text-primary font-bold">Calculated at checkout</span>
                 </div>
                 <div className="flex justify-between items-center">
                     <span>Delivery/Collection Fee</span>
                     <span className="text-primary font-bold">TBC</span>
                 </div>

              </div>

              <hr className="border-gray-200 mb-6" />

              <div className="mb-6">
                  <span className="block text-xs uppercase tracking-wider text-primary mb-3">Discount Code</span>
                  <div className="flex w-full h-[46px] border border-gray-200 focus-within:border-primary items-stretch bg-white">
                      <input type="text" placeholder="Enter Discount Code" className="w-full flex-1 bg-transparent !border-transparent !border-none px-4 text-xs !outline-none focus:!outline-none focus:!border-transparent focus:!ring-0 !rounded-none appearance-none m-0 !shadow-none" />
                      <button className="bg-primary hover:bg-secondary border-none !text-white px-6 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors whitespace-nowrap flex items-center justify-center !rounded-none appearance-none m-0 h-full">Apply Code</button>
                  </div>
              </div>

              <hr className="border-gray-200 mb-6" />

              <div className="flex justify-between items-center mb-10 text-xs uppercase tracking-wider text-primary font-bold">
                  <span>Total</span>
                  <span>{subtotal ? <Money data={subtotal} /> : 'TBC'}</span>
              </div>

              <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} layout={layout} />
          </div>
      );
  }

  // Aside Layout
  return (
    <div aria-labelledby="cart-summary" className="space-y-6 bg-white px-2">
      <div className="flex items-center justify-between py-6">
        <span className="font-sans text-sm text-primary font-medium">Subtotal:</span>
        <span className="font-sans text-sm text-primary font-bold tracking-wide">
          {subtotal?.amount ? <Money data={subtotal} /> : '-'}
        </span>
      </div>

      <div className="flex gap-4">
          <a href="/cart" className="flex-1 border border-primary text-primary text-[10px] tracking-[0.2em] font-bold uppercase py-4 flex items-center justify-center hover:bg-gray-50 transition-colors">
              View Cart
          </a>
          <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} layout={layout} />
      </div>
    </div>
  );
}

function CartCheckoutActions({ checkoutUrl, layout }: { checkoutUrl?: string; layout?: CartLayout }) {
  if (!checkoutUrl) return null;

  if (layout === 'page') {
      return (
          <a
            href={checkoutUrl}
            target="_self"
            className="block w-full bg-primary !text-white text-[10px] font-bold tracking-[0.2em] uppercase text-center py-5 hover:bg-secondary transition-colors"
          >
            Secure Checkout
          </a>
      );
  }

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className="flex-1 bg-primary !text-white text-[10px] font-bold tracking-[0.2em] uppercase py-5 flex items-center justify-center hover:bg-secondary transition-colors"
    >
      Checkout
    </a>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({ key: 'gift-card-add' });

  // Clear the gift card code input after the gift card is added
  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current!.value = '';
    }
  }, [giftCardAddFetcher.data]);

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
  }

  return (
    <div>
      {/* Display applied gift cards with individual remove buttons */}
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="cart-discount">
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
                &nbsp;
                <button type="submit">Remove</button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}

      {/* Show an input to apply a gift card */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
        fetcherKey="gift-card-add"
      >
        <div>
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button type="submit" disabled={giftCardAddFetcher.state !== 'idle'}>
            Apply
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  fetcherKey,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}
