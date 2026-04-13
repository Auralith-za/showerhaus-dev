import { useLoaderData, data, type HeadersFunction } from 'react-router';
import type { Route } from './+types/cart';
import type { CartQueryDataReturn } from '@shopify/hydrogen';
import { CartForm } from '@shopify/hydrogen';
import { CartMain } from '~/components/CartMain';

export const meta: Route.MetaFunction = () => {
  return [{ title: `Hydrogen | Cart` }];
};

export const headers: HeadersFunction = ({ actionHeaders }) => actionHeaders;

export async function action({ request, context }: Route.ActionArgs) {
  const { cart } = context;

  const formData = await request.formData();

  const { action, inputs } = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;

      // User inputted gift card code
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      // Combine gift card codes already applied on cart
      giftCardCodes.push(...inputs.giftCardCodes);

      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  
  // Force commit the session so our mockCart persists!
  if (context.session?.isPending) {
    headers.append('Set-Cookie', await context.session.commit());
  }

  const { cart: cartResult, errors, warnings } = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    { status, headers },
  );
}

export async function loader({ context }: Route.LoaderArgs) {
  const { cart } = context;
  return await cart.get();
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();

  return (
    <div className="cart-page bg-[#f7f7f7] min-h-screen pb-20 font-sans">
      {/* Top Navigation Bar / Breadcrumbs */}
      <div className="border-b border-gray-200 bg-[#f7f7f7] py-6">
          <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
              <div className="hidden"></div>
              
              <div className="hidden md:flex items-center gap-4 text-[10px] tracking-[0.1em] text-gray-400 uppercase">
                  <span className="text-primary font-semibold cursor-pointer">Cart</span>
                  <span>›</span>
                  <span>Address Details</span>
                  <span>›</span>
                  <span>Delivery & Collection</span>
                  <span>›</span>
                  <span>Payment</span>
              </div>

              <div className="text-[10px] text-primary tracking-wider hidden lg:block">
                  Need Help? <a href="/contact" className="underline hover:text-primary transition-colors">Contact Us</a>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl pt-16">
        <h1 className="font-display text-4xl lg:text-[40px] tracking-widest text-primary mb-12 uppercase font-light">My Cart</h1>
        <CartMain layout="page" cart={cart || null} />
      </div>
    </div>
  );
}
