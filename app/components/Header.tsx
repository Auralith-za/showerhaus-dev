import { Suspense } from 'react';
import { Await, Link, NavLink, useAsyncValue } from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { HeaderMenuMega } from './HeaderMenuMega';
import { MEGA_MENU_ITEMS, PRIMARY_MENU_ITEMS } from '~/lib/navigation';

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
  const { shop } = header;
  return (
    <>
      {/* Announcement bar */}
      <div style={{ background: 'var(--color-primary, #003E7E)', color: '#fff', fontSize: '11px', padding: '8px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif' }}>
        <span>Welcome to ShowerHaus</span>
        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Professionals</a>
      </div>

      {/* TOP NAV ROW: Logo + Primary Items + Utilities */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '16px 48px',
          boxSizing: 'border-box',
          background: '#fff',
          borderBottom: '1px solid #f3f4f6',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <NavLink prefetch="intent" to="/" end style={{ flexShrink: 0, marginRight: '48px' }}>
          <img src="/logo.png" alt={shop.name} style={{ height: '90px', width: 'auto', objectFit: 'contain', display: 'block' }} />
        </NavLink>

        {/* Primary Nav — ONLY: Bespoke Showers, Our Work, About Us, Contact */}
        <nav style={{ 
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex', 
          alignItems: 'center', 
          gap: '40px',
          whiteSpace: 'nowrap',
          height: '100%',
          padding: 0,
          margin: 0
        }}>
          {PRIMARY_MENU_ITEMS.map((item) => (
            <div key={item.handle} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }} className="group">
              <NavLink
                to={
                  item.handle === 'about' ? '/pages/about' :
                  item.handle === 'contact' ? '/pages/contact' :
                  item.items ? '#' :
                  `/pages/${item.handle}`
                }
                style={{ fontFamily: 'var(--font-primary)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', color: '#111', textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                {item.title}
                {item.items && (
                  <svg style={{ width: '10px', height: '10px', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </NavLink>
              {item.items && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" style={{ zIndex: 100 }}>
                  <div style={{ background: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #f3f4f6', minWidth: '220px', padding: '24px 0' }}>
                    {item.items.map((sub) => (
                      <Link
                        key={sub.handle}
                        to={sub.handle === 'projects' ? '/pages/projects' : `/pages/${sub.handle}`}
                        style={{ display: 'block', padding: '12px 32px', fontFamily: 'var(--font-primary)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', textDecoration: 'none' }}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Utilities: Search, Account, Cart */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', minWidth: '120px' }}>
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>

      {/* CATEGORY ROW: Showers | Shower Spares | Consumables | Shower Care | Decorative */}
      <div
        style={{ display: 'flex', width: '100%', borderBottom: '1px solid #f3f4f6', alignItems: 'center', justifyContent: 'center', height: '48px', background: '#fff', position: 'sticky', top: '122px', zIndex: 49, boxSizing: 'border-box' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px', height: '100%' }}>
          {MEGA_MENU_ITEMS.map((item) => (
            <div key={item.handle} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }} className="group">
              <NavLink
                to={`/collections/${item.handle}`}
                style={{ fontFamily: 'var(--font-primary)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#666', textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                {item.title}
              </NavLink>
            {item.categories && item.categories.length > 0 && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300" style={{ zIndex: 100 }}>
                <div style={{ background: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #f3f4f6', minWidth: '600px', padding: '40px', display: 'flex', gap: '48px' }}>
                  <div style={{ flex: 1 }}>
                    {item.categories.map((cat) => (
                      <div key={cat.handle} style={{ marginBottom: '24px' }}>
                        <Link
                          to={`/collections/${cat.handle}`}
                          style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-primary, #004082)', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px', marginBottom: '12px', textDecoration: 'none' }}
                        >
                          {cat.title}
                        </Link>
                        {cat.items && (
                          <div style={{ 
                            display: cat.items.length > 5 ? 'grid' : 'flex', 
                            gridTemplateColumns: cat.items.length > 5 ? 'repeat(2, 1fr)' : 'none',
                            flexDirection: 'column', 
                            gap: '8px',
                            columnGap: '32px' 
                          }}>
                            {cat.items.map((sub) => (
                              <Link
                                key={sub.handle}
                                to={`/collections/${sub.handle}`}
                                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#888', textDecoration: 'none', whiteSpace: 'nowrap' }}
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {item.featuredImage && (
                    <div className="w-[300px] flex-shrink-0">
                      <Link to={`/collections/${item.handle}`} className="block no-underline">
                        <div className="relative overflow-hidden aspect-[4/5] group/image">
                          <img 
                            src={item.featuredImage} 
                            alt={item.featuredTitle} 
                            className="w-full h-full object-cover block transition-transform duration-700 group-hover/image:scale-110" 
                          />
                          <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8">
                            <span className="text-white font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-2 opacity-80">Featured</span>
                            <h3 className="text-white font-sans text-2xl font-black uppercase tracking-tight leading-tight m-0">{item.featuredTitle}</h3>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
          ))}
        </div>
      </div>
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
        {/* Mobile Primary Links */}
        {PRIMARY_MENU_ITEMS.map((item) => (
          <div key={item.handle} className="flex flex-col">
            <NavLink
              to={item.handle === 'all' ? '/collections/all' : item.handle === 'about' ? '/pages/about' : item.items ? '#' : `/pages/${item.handle}`}
              className="text-lg font-sans font-medium text-gray-900 hover:text-primary transition-colors border-b border-gray-50 pb-2 flex justify-between items-center"
              onClick={item.items ? undefined : close}
            >
              {item.title}
            </NavLink>
            {item.items && (
              <div className="pl-4 mt-2 flex flex-col space-y-3">
                {item.items.map((sub) => (
                  <NavLink
                    key={sub.handle}
                    to={sub.handle === 'projects' ? '/pages/projects' : `/pages/${sub.handle}`}
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

        {/* Mega Menu Categories for Mobile */}
        <div className="pt-4">
          <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-gray-400 mb-6">Collections</p>
          <div className="flex flex-col space-y-6">
            {MEGA_MENU_ITEMS.map((item) => (
              <div key={item.handle} className="flex flex-col space-y-2">
                <NavLink
                  to={`/collections/${item.handle}`}
                  className="text-md font-sans font-light text-gray-800 hover:text-primary transition-colors flex justify-between items-center"
                  onClick={close}
                >
                  {item.title}
                </NavLink>
                {/* Mobile Submenu (Simplified) */}
                {item.categories && (
                  <div className="pl-4 border-l border-gray-100 flex flex-col space-y-2">
                    {item.categories.map(cat => (
                      <NavLink
                        key={cat.handle}
                        to={`/collections/${cat.handle}`}
                        className="text-sm font-sans text-gray-500 hover:text-primary"
                        onClick={close}
                      >
                        {cat.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
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
