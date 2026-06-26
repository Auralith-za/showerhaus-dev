import { Suspense, useState } from 'react';
import { Await, Link, NavLink, useAsyncValue, useLocation } from 'react-router';
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
  customer?: Promise<any | null>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  customer,
  publicStoreDomain,
}: HeaderProps) {
  const { shop } = header;
  const shopifyCollections = header.collections?.nodes || [];
  const products = header.products?.nodes || [];

  // Group products by category.name or productType
  const sparesByType = products.reduce<Record<string, typeof products>>((acc, product) => {
    const type = product.category?.name || product.productType || 'Shower Seals';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(product);
    return acc;
  }, {});

  const sparesTypes = Object.keys(sparesByType);
  
  const location = useLocation();
  const isShopPage = location.pathname.startsWith('/collections') || location.pathname.startsWith('/products');

  return (
    <>
      {isShopPage && (
        <div className="bg-primary text-white text-center py-2 px-4 font-sans text-[10px] tracking-widest uppercase relative z-50">
          Our new site is currently in beta. Please be patient. If you experience any issues,{' '}
          <Link to="/contact" className="text-white underline hover:text-secondary">click here to provide feedback</Link>.
        </div>
      )}
      {/* Top Banner (White) */}
      <div className="hidden md:flex" style={{ background: '#fff', color: '#111', fontSize: '12px', padding: '12px 48px', justifyContent: 'space-between', alignItems: 'center', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link to="/pages/bespoke-showers" className="text-[#111] hover:text-gray-500 hover:underline hover:underline-offset-4 transition-all" style={{ fontWeight: 400 }}>Bespoke Showers</Link>
          
          <div className="relative group flex items-center h-[30px] cursor-pointer">
            <Link to="/pages/about-us" className="text-[#111] hover:text-gray-500 hover:underline hover:underline-offset-4 transition-all" style={{ fontWeight: 400 }}>About us</Link>
            <div className="absolute top-[30px] left-0 pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-300 z-[150]">
              <div className="bg-white border border-gray-100 shadow-xl p-6 flex flex-col gap-4 min-w-[220px]">
                {/* <Link to="/pages/our-story" className="font-sans text-[12px] font-normal uppercase tracking-[0.2em] text-[#111] hover:text-gray-500 hover:underline hover:underline-offset-4 transition-all">Our Story</Link> */}
                {/* <Link to="/pages/projects" className="font-sans text-[12px] font-normal uppercase tracking-[0.2em] text-[#111] hover:text-gray-500 hover:underline hover:underline-offset-4 transition-all">Projects</Link> */}
                <Link to="/pages/customer-stories" className="font-sans text-[12px] font-normal uppercase tracking-[0.2em] text-[#111] hover:text-gray-500 hover:underline hover:underline-offset-4 transition-all">Customer Stories</Link>
                {/* <Link to="/pages/accreditation" className="font-sans text-[12px] font-normal uppercase tracking-[0.2em] text-[#111] hover:text-gray-500 hover:underline hover:underline-offset-4 transition-all">Accreditation</Link> */}
                <Link to="/blogs" className="font-sans text-[12px] font-normal uppercase tracking-[0.2em] text-[#111] hover:text-gray-500 hover:underline hover:underline-offset-4 transition-all">Blog</Link>
              </div>
            </div>
          </div>

          <Link to="/contact" className="text-[#111] hover:text-gray-500 hover:underline hover:underline-offset-4 transition-all" style={{ fontWeight: 400 }}>Contact</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: '120px', justifyContent: 'flex-end' }}>
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} customer={customer} />
        </div>
      </div>

      {/* TOP NAV ROW: Logo + Main Categories */}
      <div className="flex flex-row items-center justify-between md:justify-start w-full px-6 py-4 md:px-12 bg-white border-b border-gray-100 sticky top-0 z-50 gap-4">
        
        {/* Mobile Hamburger (Left) */}
        <div className="flex md:hidden items-center">
          <HeaderMenuMobileToggle />
        </div>

        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-center md:justify-start flex-1 md:flex-none">
          <NavLink prefetch="intent" to="/" end className="block">
            <img src="/logo.png" alt={shop.name} className="h-8 md:h-[45px] w-auto object-contain block mx-auto md:mx-0" />
          </NavLink>
        </div>

        {/* Primary Nav (Categories) */}
        <nav className="hidden md:flex items-center gap-10 whitespace-nowrap h-full ml-auto">
          {MEGA_MENU_ITEMS.map((item, index, array) => {
            const isSpares = item.handle === 'shower-spares';
            const shopifyCol = shopifyCollections.find(col => 
              col.handle === item.handle || 
              (item.handle === 'shower-spares' && (col.handle === 'spares' || col.handle === 'shower-spares'))
            );
            const isCollectionActive = isSpares ? (products.length > 0) : (shopifyCol && shopifyCol.products?.nodes?.length > 0);
            const path = isSpares ? '/collections/all' : (shopifyCol ? `/collections/${shopifyCol.handle}` : '/collections/all');
            
            return (
              <div key={item.handle} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }} className="group">
                <NavLink
                  to={path}
                  onClick={(e) => {
                    if (!isCollectionActive) {
                      e.preventDefault();
                      alert('We are currently migrating this collection to our new website. Please check back soon!');
                    }
                  }}
                  className="font-display text-[12px] font-normal tracking-[0.3em] uppercase text-[#111] no-underline whitespace-nowrap hover:text-gray-500 hover:underline hover:underline-offset-8 transition-all duration-300"
                >
                  {item.title}
                </NavLink>

                {/* Mega Menu Dropdown */}
                {isCollectionActive ? (
                  <div className={`absolute top-full pt-4 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-300 ${index >= array.length - 2 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`} style={{ zIndex: 100 }}>
                    <div style={{ background: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #f3f4f6', minWidth: '600px', padding: '40px', display: 'flex', gap: '48px', flexDirection: 'row' }}>
                      <div style={{ flex: 1, textAlign: 'left', display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                        {(() => {
                          if (isSpares) {
                            const sparesProducts = shopifyCol?.products?.nodes || products || [];
                            const uniqueTypes = Array.from(new Set(sparesProducts.map(p => p.productType || p.category?.name).filter(Boolean)));
                            const filteredTypes = uniqueTypes.filter(t => (t as string).toLowerCase() !== 'parts' && (t as string).toLowerCase() !== 'spares' && (t as string).toLowerCase() !== 'shower parts');
                            const displayTypes = filteredTypes.length > 0 ? filteredTypes : ['Shower Seals', 'Channels', 'Hinges & Clamps', 'Handles & Towel Rails', 'Profiles & Channels'];

                            return (
                              <div style={{ minWidth: '200px', marginBottom: '16px' }}>
                                <span
                                  className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-primary border-b border-gray-100 pb-3 mb-3 block"
                                >
                                  Spares
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  {displayTypes.map((type) => {
                                    const typeStr = type as string;
                                    const filterPath = `/collections/all?filter.p.product_type=${encodeURIComponent(typeStr)}`;
                                    return (
                                      <Link
                                        key={typeStr}
                                        to={filterPath}
                                        className="font-sans text-[11px] text-gray-500 hover:text-primary transition-colors font-light whitespace-nowrap no-underline"
                                      >
                                        {typeStr}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }

                          const colProducts = shopifyCol?.products?.nodes || [];
                          const colProductsByType = colProducts.reduce<Record<string, typeof colProducts>>((acc, p) => {
                            const type = p.category?.name || p.productType || 'Other';
                            if (!acc[type]) acc[type] = [];
                            acc[type].push(p);
                            return acc;
                          }, {});
                          const colProductTypes = Object.keys(colProductsByType);

                          return colProductTypes.map((type) => (
                            <div key={type} style={{ minWidth: '200px', marginBottom: '16px' }}>
                              <Link
                                to={`/collections/${shopifyCol?.handle}`}
                                className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-primary border-b border-gray-100 pb-3 mb-3 hover:text-secondary transition-colors block no-underline"
                              >
                                {type}
                              </Link>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {colProductsByType[type].map((p) => (
                                    <Link
                                      key={p.handle}
                                      to={`/products/${p.handle}`}
                                      className="font-sans text-[11px] text-gray-500 hover:text-primary transition-colors font-light whitespace-nowrap no-underline"
                                    >
                                      {p.title}
                                    </Link>
                                  ))}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                      <div className="w-[350px] flex-shrink-0">
                        <div className={`relative overflow-hidden group/image ${isSpares ? 'aspect-[4/3] bg-gray-50 flex items-center justify-center p-4' : 'aspect-[4/5]'}`}>
                          <img 
                            src={isSpares ? "/spares-menu.png" : (shopifyCol?.image?.url || item.featuredImage || "https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/PH_Andersen_Faci_Leboreiro_15.jpg.webp")} 
                            alt={shopifyCol?.title || item.title} 
                            className={`w-full h-full block transition-transform duration-700 group-hover/image:scale-110 ${isSpares ? 'object-contain' : 'object-cover'}`} 
                          />
                          {!isSpares && (
                            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-6">
                              <span className="text-white font-sans text-[9px] font-bold tracking-[0.2em] uppercase mb-1 opacity-80">
                                Store
                              </span>
                              <h3 className="text-white font-sans text-lg font-bold uppercase tracking-tight leading-tight m-0">
                                {shopifyCol?.title || item.title}
                              </h3>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Coming Soon Dropdown for Showers, Consumables, Shower Care, Decorative */
                  <div className={`absolute top-full pt-4 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-300 ${index >= array.length - 2 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`} style={{ zIndex: 100 }}>
                    <div style={{ background: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #f3f4f6', minWidth: '400px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a39081' }}>Architectural Collections</span>
                      <h4 className="font-display" style={{ fontSize: '18px', color: '#111', margin: 0 }}>{item.title} Range</h4>
                      <p style={{ fontSize: '11px', color: '#999', margin: 0, lineHeight: '1.6', fontFamily: 'sans-serif' }}>
                        Our curated range of {item.title.toLowerCase()} is currently being loaded. Check back soon.
                      </p>
                      <div style={{ paddingTop: '8px' }}>
                        <span style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: '2px' }}>
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Right Icons (Search & Cart only) */}
        <div className="flex md:hidden items-center gap-4">
          <SearchToggle />
          <CartToggle cart={cart} />
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
  collections,
  products,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  collections?: any[];
  products?: any[];
}) {
  const { close } = useAside();
  const items = menu ? menu.items : FALLBACK_HEADER_MENU.items;
  const shopifyCollections = collections || [];

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col space-y-4 pb-12" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className="text-sm font-sans tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-100 pb-4"
        >
          Home
        </NavLink>
        {/* Mobile Primary Links */}
        {PRIMARY_MENU_ITEMS.map((item) => {
          if (!item.items) {
            return (
              <div key={item.handle} className="flex flex-col">
                <NavLink
                  to={item.handle === 'all' ? '/collections/all' : `/pages/${item.handle}`}
                  className="text-lg font-sans font-medium text-gray-900 hover:text-primary transition-colors border-b border-gray-50 pb-2 flex justify-between items-center"
                  onClick={close}
                >
                  {item.title}
                </NavLink>
              </div>
            );
          }
          return (
            <MobileAccordionItem key={item.handle} title={item.title}>
              <div className="pl-4 mt-2 flex flex-col space-y-3">
                {item.items.map((sub) => (
                  <NavLink
                    key={sub.handle}
                    to={sub.handle === 'projects' ? '/pages/projects' : `/pages/${sub.handle}`}
                    className="text-base font-sans text-gray-500 hover:text-primary"
                    onClick={close}
                  >
                    {sub.title}
                  </NavLink>
                ))}
              </div>
            </MobileAccordionItem>
          );
        })}

        {/* Mega Menu Categories for Mobile */}
        <div className="pt-2">
          <div className="flex flex-col space-y-4">
            {MEGA_MENU_ITEMS.map((item) => {
              const isSpares = item.handle === 'shower-spares';
              const shopifyCol = shopifyCollections.find(col => 
                col.handle === item.handle || 
                (item.handle === 'shower-spares' && (col.handle === 'spares' || col.handle === 'shower-spares'))
              );
              const isCollectionActive = isSpares ? (products && products.length > 0) : (shopifyCol && shopifyCol.products?.nodes?.length > 0);
              const path = isSpares ? '/collections/all' : (shopifyCol ? `/collections/${shopifyCol.handle}` : '/collections/all');
              
              if (!isCollectionActive) {
                return (
                  <MobileAccordionItem key={item.handle} title={item.title}>
                    <div className="pl-4 border-l border-gray-100 flex flex-col space-y-2">
                      <span className="text-xs font-sans text-gray-400 italic pl-2">Coming Soon</span>
                    </div>
                  </MobileAccordionItem>
                );
              }

              return (
                <MobileAccordionItem key={item.handle} title={item.title}>
                  <div className="pl-4 border-l border-gray-100 flex flex-col space-y-2">
                    {isSpares ? (() => {
                      const displayTypes = ['Shower Seals'];
                      return (
                        <div className="flex flex-col space-y-3 mt-2">
                          <span className="text-sm font-sans text-gray-400 pl-2">
                            Spares
                          </span>
                          {displayTypes.map(type => {
                            const typeStr = type as string;
                            return (
                              <NavLink
                                key={typeStr}
                                to={`/collections/all?filter.p.product_type=${encodeURIComponent(typeStr)}`}
                                className="text-base font-sans text-gray-500 hover:text-primary pl-4"
                                onClick={close}
                              >
                                {typeStr}
                              </NavLink>
                            );
                          })}
                        </div>
                      );
                    })() : (() => {
                      const colProducts = shopifyCol?.products?.nodes || [];
                      const colProductsByType = colProducts.reduce<Record<string, typeof colProducts>>((acc, p) => {
                        const type = p.category?.name || p.productType || 'Other';
                        if (!acc[type]) acc[type] = [];
                        acc[type].push(p);
                        return acc;
                      }, {});
                      return Object.keys(colProductsByType).map(type => (
                        <div key={type} className="flex flex-col space-y-3 mt-2">
                          <span className="text-sm font-sans text-gray-400 pl-2">
                            {type}
                          </span>
                          {colProductsByType[type].map(p => (
                            <NavLink
                              key={p.handle}
                              to={`/products/${p.handle}`}
                              className="text-base font-sans text-gray-500 hover:text-primary pl-4"
                              onClick={close}
                            >
                              {p.title}
                            </NavLink>
                          ))}
                        </div>
                      ));
                    })()}
                  </div>
                </MobileAccordionItem>
              );
            })}
          </div>
        </div>

        {/* Mobile Bottom Links */}
        <div className="pt-6 mt-2 border-t border-gray-100 flex flex-col gap-4">
          <NavLink to="/account" onClick={close} className="text-sm font-sans tracking-widest uppercase font-bold text-gray-800 hover:text-primary">
            Account / Login
          </NavLink>
          <NavLink to="/contact" onClick={close} className="text-sm font-sans tracking-widest uppercase font-bold text-gray-800 hover:text-primary">
            Contact
          </NavLink>
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

function MobileAccordionItem({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-lg font-sans font-medium text-gray-900 hover:text-primary transition-colors border-b border-gray-50 pb-2 flex justify-between items-center"
      >
        <span>{title}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
  customer,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart' | 'customer'>) {
  return (
    <nav className="flex items-center gap-6 text-gray-700" role="navigation">
      {/* Search Icon */}
      <SearchToggle />

      {/* Account Links & Icon */}
      <div className="flex items-center gap-3">
        <NavLink prefetch="intent" to="/account" className="text-primary hover:opacity-80 transition-opacity flex items-center">
          <Suspense fallback={<IconUser />}>
            <Await resolve={isLoggedIn} errorElement={<IconUser />}>
              {(isLoggedIn) => <IconUser loggedIn={isLoggedIn} />}
            </Await>
          </Suspense>
        </NavLink>
        <Suspense fallback={null}>
          <Await resolve={isLoggedIn} errorElement={<Link to="/account/login" className="text-primary hover:opacity-80 transition-opacity text-[10px] tracking-wider uppercase font-medium">Log In</Link>}>
            {(loggedIn) => loggedIn ? (
              <Suspense fallback={<Link to="/account" className="text-primary hover:opacity-80 transition-opacity text-[10px] tracking-wider uppercase font-medium">Account</Link>}>
                <Await resolve={customer}>
                  {(customerData) => (
                    <Link to="/account" className="text-primary hover:opacity-80 transition-all text-[10px] tracking-wider uppercase font-medium">
                      {customerData?.firstName ? customerData.firstName : 'Account'}
                    </Link>
                  )}
                </Await>
              </Suspense>
            ) : (
              <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase font-medium text-primary">
                <Link to="/account/login" className="hover:opacity-80 transition-opacity">Log In /</Link>
                <Link to="/account/register" className="hover:opacity-80 transition-opacity">Register</Link>
              </div>
            )}
          </Await>
        </Suspense>
      </div>

      {/* Cart Icon */}
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <button
      className="md:hidden p-2 -ml-2 text-gray-800"
      onClick={() => open('mobile')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
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
      className="flex items-center gap-2 bg-[#14294f] hover:bg-[#1e3b6e] !no-underline text-white px-4 py-1.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer h-[32px] min-w-[66px] justify-center"
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
        <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.5 1.5 0 0 0 3.998 2.25H2.25Z" />
        <circle cx="9" cy="19.5" r="1.5" />
        <circle cx="16.5" cy="19.5" r="1.5" />
      </svg>
      <span className="font-sans text-[13px] font-bold text-white leading-none">
        {count || 0}
      </span>
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
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function IconUser({ loggedIn = false }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={loggedIn ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
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
