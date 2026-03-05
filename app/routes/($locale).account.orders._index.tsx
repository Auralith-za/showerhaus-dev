import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type { Route } from './+types/account.orders._index';
import { useRef } from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import { CUSTOMER_ORDERS_QUERY } from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Orders' }];
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const { customerAccount } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const { data, errors } = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return { customer: data.customer, filters };
}

export default function Orders() {
  const { customer, filters } = useLoaderData<OrdersLoaderData>();
  const { orders } = customer;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gray-100">
        <div>
          <h2 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-primary mb-2">Order History</h2>
          <p className="font-sans text-xs text-gray-400 font-light">View and track your previous architectural project requirements.</p>
        </div>
        <OrderSearchForm currentFilters={filters} />
      </div>

      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="account-orders" aria-live="polite">
      {orders?.nodes.length ? (
        <div className="space-y-6">
          <PaginatedResourceSection connection={orders}>
            {({ node: order }) => <OrderItem key={order.id} order={order} />}
          </PaginatedResourceSection>
        </div>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({ hasFilters = false }: { hasFilters?: boolean }) {
  return (
    <div className="text-center py-20 bg-gray-50/50 border border-dashed border-gray-200">
      {hasFilters ? (
        <>
          <p className="font-sans text-xs tracking-widest uppercase text-gray-400 mb-6">No orders found matching your search.</p>
          <Link
            to="/account/orders"
            className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-all"
          >
            Clear filters
          </Link>
        </>
      ) : (
        <>
          <p className="font-sans text-xs tracking-widest uppercase text-gray-400 mb-8 font-semibold">You haven&apos;t placed any orders yet.</p>
          <Link
            to="/collections"
            className="inline-block bg-primary text-white px-10 py-4 text-[10px] tracking-[0.2em] font-semibold uppercase hover:bg-black transition-all duration-300"
          >
            Start Shopping
          </Link>
        </>
      )}
    </div>
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-end gap-4"
      aria-label="Search orders"
    >
      <div className="flex gap-4 w-full sm:w-auto">
        <div className="flex-1">
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.NAME}
            placeholder="Order #"
            aria-label="Order number"
            defaultValue={currentFilters.name || ''}
            className="w-full border-b border-gray-300 py-2 bg-transparent text-primary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors font-sans text-xs"
          />
        </div>
        <div className="flex-1">
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
            placeholder="Confirm #"
            aria-label="Confirmation number"
            defaultValue={currentFilters.confirmationNumber || ''}
            className="w-full border-b border-gray-300 py-2 bg-transparent text-primary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors font-sans text-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSearching}
          className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-primary hover:text-secondary disabled:opacity-50 transition-colors"
        >
          {isSearching ? '...' : 'Search'}
        </button>
        {hasFilters && (
          <button
            type="button"
            disabled={isSearching}
            onClick={() => {
              setSearchParams(new URLSearchParams());
              formRef.current?.reset();
            }}
            className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 hover:text-red-800 disabled:opacity-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}

function OrderItem({ order }: { order: OrderItemFragment }) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <div className="group border border-gray-100 p-6 md:p-8 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-sans text-lg font-bold text-primary tracking-tight">#{order.number}</span>
            <span className={`px-3 py-1 text-[9px] tracking-widest uppercase font-bold rounded-full ${order.financialStatus === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
              {order.financialStatus}
            </span>
          </div>
          <p className="font-sans text-[11px] text-gray-400 uppercase tracking-widest leading-none">
            {new Date(order.processedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-1">
          <div className="font-sans text-lg font-bold text-primary tracking-tight">
            <Money data={order.totalPrice} />
          </div>
          {fulfillmentStatus && (
            <span className="font-sans text-[10px] tracking-widest uppercase text-secondary font-bold">
              {fulfillmentStatus}
            </span>
          )}
        </div>

        <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
          <Link
            to={`/account/orders/${btoa(order.id)}`}
            className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.3em] uppercase font-bold text-primary group-hover:text-secondary transition-all"
          >
            <span className="w-8 h-[1px] bg-primary group-hover:bg-secondary transition-colors"></span>
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
