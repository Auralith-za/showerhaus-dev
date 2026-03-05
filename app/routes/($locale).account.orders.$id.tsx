import { redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/account.orders.$id';
import { Money, Image } from '@shopify/hydrogen';
import type {
  OrderLineItemFullFragment,
  OrderQuery,
} from 'customer-accountapi.generated';
import { CUSTOMER_ORDER_QUERY } from '~/graphql/customer-account/CustomerOrderQuery';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `Order ${data?.order?.name}` }];
};

export async function loader({ params, context }: Route.LoaderArgs) {
  const { customerAccount } = context;
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const { data, errors }: { data: OrderQuery; errors?: Array<{ message: string }> } =
    await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const { order } = data;

  // Extract line items directly from nodes array
  const lineItems = order.lineItems.nodes;

  // Extract discount applications directly from nodes array
  const discountApplications = order.discountApplications.nodes;

  // Get fulfillment status from first fulfillment node
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';

  // Get first discount value with proper type checking
  const firstDiscount = discountApplications[0]?.value;

  // Type guard for MoneyV2 discount
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2'
      ? (firstDiscount as Extract<
        typeof firstDiscount,
        { __typename: 'MoneyV2' }
      >)
      : null;

  // Type guard for percentage discount
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? (
        firstDiscount as Extract<
          typeof firstDiscount,
          { __typename: 'PricingPercentageValue' }
        >
      ).percentage
      : null;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h2 className="font-sans text-2xl font-bold text-primary tracking-tight leading-none">Order #{order.name}</h2>
            <span className={`px-3 py-1 text-[10px] tracking-[0.15em] uppercase font-bold rounded-full ${order.financialStatus === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
              {order.financialStatus}
            </span>
          </div>
          <p className="font-sans text-xs text-gray-400 font-light uppercase tracking-widest">
            Placed on {new Date(order.processedAt!).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-2">
          <span className="font-sans text-[10px] tracking-[0.15em] uppercase font-bold text-gray-400">Shipment Status</span>
          <span className="font-sans text-xs tracking-widest uppercase font-bold text-primary border border-primary/20 px-4 py-1.5 rounded-full">
            {fulfillmentStatus}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Line Items */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-100 pb-4 mb-8">Selected Products</h3>
          <div className="divide-y divide-gray-50">
            {lineItems.map((lineItem, index) => (
              <OrderLineItem key={index} lineItem={lineItem} />
            ))}
          </div>

          <div className="pt-10">
            <a
              target="_blank"
              href={order.statusPageUrl || '#'}
              rel="noreferrer"
              className="inline-flex items-center gap-4 group"
            >
              <span className="bg-primary text-white p-4 group-hover:bg-black transition-all duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </span>
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase font-bold text-primary group-hover:text-black transition-colors">
                View full order tracking
              </span>
            </a>
          </div>
        </div>

        {/* Summary & Address */}
        <aside className="space-y-12">
          {/* Totals */}
          <div className="bg-[#FAF9F7] p-8 space-y-6">
            <h3 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-200 pb-4 mb-2">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-sans tracking-wider uppercase text-gray-500">
                <span>Subtotal</span>
                <Money data={order.subtotal!} className="text-primary font-bold" />
              </div>
              {((discountValue && discountValue.amount) || discountPercentage) && (
                <div className="flex justify-between text-[11px] font-sans tracking-wider uppercase text-green-600">
                  <span>Discounts</span>
                  {discountPercentage ? (
                    <span>-{discountPercentage}%</span>
                  ) : (
                    discountValue && <Money data={discountValue!} />
                  )}
                </div>
              )}
              <div className="flex justify-between text-[11px] font-sans tracking-wider uppercase text-gray-500">
                <span>Tax</span>
                <Money data={order.totalTax!} className="text-primary font-bold" />
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold text-primary">Total</span>
                <Money data={order.totalPrice!} className="font-sans text-xl font-bold text-primary tracking-tight" />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="px-8 space-y-6">
            <h3 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-100 pb-4 mb-2">Delivery Address</h3>
            {order?.shippingAddress ? (
              <address className="not-italic font-sans text-xs text-gray-500 leading-relaxed uppercase tracking-widest space-y-1">
                <p className="font-bold text-primary mb-2">{order.shippingAddress.name}</p>
                {order.shippingAddress.formatted ? (
                  <p>{order.shippingAddress.formatted}</p>
                ) : (
                  <>
                    <p>{order.shippingAddress.address1}</p>
                    {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                    <p>{order.shippingAddress.territoryCode}</p>
                  </>
                )}
              </address>
            ) : (
              <p className="font-sans text-xs text-gray-400 italic">No shipping address defined</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function OrderLineItem({ lineItem }: { lineItem: OrderLineItemFullFragment }) {
  return (
    <div className="flex gap-8 py-8 first:pt-0">
      {/* Product Image */}
      <div className="flex-shrink-0 w-24 h-24 bg-gray-50 border border-gray-100 overflow-hidden relative">
        {lineItem?.image && (
          <Image
            data={lineItem.image}
            aspectRatio="1/1"
            width={100}
            height={100}
            className="w-full h-full object-cover grayscale(20%)"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h4 className="font-sans text-xs tracking-[0.15em] uppercase font-bold text-primary mb-1">
            {lineItem.title}
          </h4>
          <p className="font-sans text-[10px] tracking-widest text-gray-400 uppercase">
            {lineItem.variantTitle} &bull; Qty: {lineItem.quantity}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="font-sans text-sm font-bold text-primary tracking-tight">
            <Money data={lineItem.price!} />
          </div>
        </div>
      </div>
    </div>
  );
}
