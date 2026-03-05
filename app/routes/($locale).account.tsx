import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type { Route } from './+types/account';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({ context }: Route.LoaderArgs) {
  const { customerAccount } = context;
  const { data, errors } = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    { customer: data.customer },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const { customer } = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `${customer.firstName}'s Account`
      : `Account Dashboard`
    : 'Account Details';

  return (
    <div className="bg-[#FAF9F7] min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-16 text-center lg:text-left">
          <h1 className="font-sans text-xs tracking-[0.3em] uppercase font-semibold text-primary mb-2">My Account</h1>
          <p className="font-sans text-3xl font-bold text-primary tracking-tight">{heading}</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <AccountMenu />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white p-8 md:p-12 shadow-sm border border-gray-100 min-h-[500px]">
            <Outlet context={{ customer }} />
          </main>
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  const navItems = [
    { label: 'Orders', to: '/account/orders' },
    { label: 'Profile', to: '/account/profile' },
    { label: 'Addresses', to: '/account/addresses' },
  ];

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `font-sans text-[10px] tracking-[0.2em] uppercase font-bold py-4 px-6 border-l-2 transition-all duration-300 ${isActive
              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
              : 'text-gray-400 border-transparent hover:bg-gray-50 hover:text-primary'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}

      <div className="mt-8 pt-8 border-t border-gray-100 px-6">
        <Logout />
      </div>
    </nav>
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      <button
        type="submit"
        className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 hover:text-red-800 transition-colors flex items-center gap-2 group"
      >
        <span className="w-4 h-[1px] bg-gray-300 group-hover:bg-red-800 transition-colors"></span>
        Sign out
      </button>
    </Form>
  );
}
