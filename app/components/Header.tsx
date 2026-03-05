import { Suspense } from 'react';
import { Await, NavLink, useAsyncValue } from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { HeaderMenuMega } from './HeaderMenuMega';
import { MEGA_MENU_ITEMS } from '~/lib/navigation';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const { shop, menu } = header;
  return (
    <>
      <div className="bg-primary text-white text-xs py-2 px-8 flex justify-between items-center font-sans tracking-widest uppercase">
        <div className="hidden md:block">Welcome to ShowerHaus</div>
        <div className="flex gap-6 ml-auto">
          <a href="#" className="!text-white hover:text-secondary transition-colors">Professionals</a>
          <NavLink to="/contact" className="!text-white hover:text-secondary transition-colors">Contact Us</NavLink>
        </div>
      </div>

      <header className="header bg-white sticky top-0 z-50 border-b border-gray-100 py-6 px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <NavLink prefetch="intent" to="/" end className="flex-shrink-0">
          <img
            src="https://showerhaus.co.za/wp-content/uploads/2019/07/showerhaus-logo.jpg"
            alt={shop.name}
            className="h-12 w-auto object-contain"
          />
        </NavLink>

        {/* Desktop Menu */}
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />

        {/* Utilities */}
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header>
    </>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const { close } = useAside();
  const items = menu ? menu.items : FALLBACK_HEADER_MENU.items;

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col space-y-6" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className="text-xs font-sans tracking-[0.3em] uppercase font-bold text-primary border-b border-gray-100 pb-4"
        >
          Home
        </NavLink>
        {/* Mega Menu Items for Mobile */}
        {MEGA_MENU_ITEMS.map((item) => (
          <div key={item.handle} className="flex flex-col space-y-2">
            <NavLink
              to={`/collections/${item.handle}`}
              className="text-lg font-sans font-light text-gray-800 hover:text-primary transition-colors border-b border-gray-50 pb-2 flex justify-between items-center"
              onClick={close}
            >
              {item.title}
            </NavLink>
            {/* Mobile Submenu (Simplified) */}
            {item.items && (
              <div className="pl-4 border-l border-gray-100 flex flex-col space-y-2">
                {item.items.map(sub => (
                  <NavLink
                    key={sub.handle}
                    to={`/collections/${sub.handle}`}
                    className="text-sm font-sans text-gray-500 hover:text-primary"
                    onClick={close}
                  >
                    {sub.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}

      </nav>
    );
  }

  // Desktop
  if (viewport === 'desktop') {
    return <HeaderMenuMega />;
  }
  return null;
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-4 text-gray-700" role="navigation">
      <HeaderMenuMobileToggle />

      {/* Search Icon */}
      <SearchToggle />

      {/* Account Icon */}
      <NavLink prefetch="intent" to="/account" className="hover:text-primary transition-colors">
        <Suspense fallback={<IconUser />}>
          <Await resolve={isLoggedIn} errorElement={<IconUser />}>
            {(isLoggedIn) => <IconUser loggedIn={isLoggedIn} />}
          </Await>
        </Suspense>
      </NavLink>

      {/* Cart Icon */}
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <button
      className="md:hidden p-2 text-2xl"
      onClick={() => open('mobile')}
    >
      ☰
    </button>
  );
}

function SearchToggle() {
  const { open } = useAside();
  return (
    <button className="reset hover:text-primary transition-colors" onClick={() => open('search')}>
      <IconSearch />
    </button>
  );
}

function CartBadge({ count }: { count: number | null }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <a
      href="/cart"
      className="relative hover:text-primary transition-colors"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <IconBag />
      {count !== null && count > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({ cart }: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

// Icons
function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function IconUser({ loggedIn = false }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={loggedIn ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};
