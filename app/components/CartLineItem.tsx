import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Image, type OptimisticCartLine } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';
import { Link } from 'react-router';
import { ProductPrice } from './ProductPrice';
import { useAside } from './Aside';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const { close } = useAside();

  if (layout === 'page') {
      return (
          <li key={id} className="grid grid-cols-[100px_1fr_120px] gap-8 py-6 group">
            {/* Product Image */}
            <div className="bg-[#f0f0f0] flex-shrink-0 aspect-square">
              {image && (
                <Image
                  alt={title}
                  aspectRatio="1/1"
                  data={image}
                  loading="lazy"
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col pt-1">
              <Link
                prefetch="intent"
                to={lineItemUrl}
                className="text-[#333] hover:text-[#000] transition-colors mb-2 text-sm"
              >
                {product.title}
              </Link>
              <div className="text-[10px] text-[#666] tracking-widest uppercase">
                SKU: {line.id.substring(line.id.length - 8).toUpperCase()}
              </div>
              <div className="text-[10px] text-[#666] tracking-widest uppercase mt-1">
                {selectedOptions.map(o => `${o.name}: ${o.value}`).join(' | ')}
              </div>
            </div>

            {/* Price & Quantity */}
            <div className="flex flex-col items-end pt-1">
              <div className="text-sm text-[#333] mb-8">
                <ProductPrice price={line?.cost?.totalAmount} />
              </div>
              <div className="flex items-center gap-4">
                  <CartLineRemoveButton lineIds={[line.id]} disabled={!!line.isOptimistic} />
                  <CartLineQuantity line={line} />
              </div>
            </div>
          </li>
      );
  }

  // Aside Layout
  return (
    <li key={id} className="flex gap-6 group py-4 border-b border-[#eee] last:border-0 relative">
      <div className="absolute top-4 right-0 leading-none">
          <CartLineRemoveCrossButton lineIds={[line.id]} disabled={!!line.isOptimistic} />
      </div>
      
      <div className="flex-shrink-0 w-24 h-28 bg-[#f0f0f0] overflow-hidden mix-blend-multiply">
        {image && (
          <Image
            alt={title}
            aspectRatio="3/4"
            data={image}
            loading="lazy"
            className="w-full h-full object-cover mix-blend-multiply"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center pr-8">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => close()}
              className="block mb-2 text-[#333] sm:text-lg hover:text-black transition-colors"
            >
              {product.title}
            </Link>

            <div className="text-[#666] text-sm mb-6">
              <ProductPrice price={line?.cost?.totalAmount} />
            </div>
            
            <div className="flex items-center gap-4">
               <CartLineRemoveButton lineIds={[line.id]} disabled={!!line.isOptimistic} />
               <CartLineQuantity line={line} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function CartLineQuantity({ line }: { line: CartLine }) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity, isOptimistic, merchandise } = line;
  const rawMax = (merchandise as any)?.quantityAvailable;
  const maxQty = typeof rawMax === 'number' && rawMax > 0 ? rawMax : null;
  const isMaxReached = maxQty !== null && quantity >= maxQty;

  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-4">
      <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
        <button
          aria-label="Decrease quantity"
          name="decrease-quantity"
          value={prevQuantity}
          disabled={!!isOptimistic || quantity <= 1}
          className="w-6 h-6 border border-[#ccc] flex items-center justify-center text-[#666] hover:border-[#333] hover:text-[#333] transition-colors bg-transparent disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="text-xl font-light leading-none relative -top-[1px]">-</span>
        </button>
      </CartLineUpdateButton>
      <span className="font-sans text-sm text-[#333] leading-none">{quantity}</span>

      <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic || isMaxReached}
          className="w-6 h-6 border border-[#ccc] flex items-center justify-center text-[#666] hover:border-[#333] hover:text-[#333] transition-colors bg-transparent disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="text-xl font-light leading-none relative -top-[1px]">+</span>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <button
        disabled={disabled}
        type="submit"
        className="text-[#999] hover:text-[#333] transition-colors group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </CartForm>
  );
}

function CartLineRemoveCrossButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <button
        disabled={disabled}
        type="submit"
        className="text-[#999] hover:text-[#333] transition-colors p-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
