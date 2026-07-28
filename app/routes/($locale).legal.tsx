import { Outlet, NavLink, Link, useLocation } from 'react-router';
import type { Route } from './+types/legal';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Legal | Shower Haus' }];
};

const POLICIES = [
  { name: 'Using Our Website', path: '/legal/using-our-website', desc: 'Terms and rules governing the use of our website and services.' },
  { name: 'Terms and Conditions', path: '/legal/terms-and-conditions', desc: 'Detailed terms for purchasing products and services from Shower Haus.' },
  { name: 'Privacy Policy', path: '/legal/privacy', desc: 'How we collect, store, and protect your personal information.' },
  { name: 'Cookies Policy', path: '/legal/cookies', desc: 'Information on how cookie technology is used on our site.' },
  { name: 'Refund and Returns', path: '/legal/refund-and-returns', desc: 'Guidelines and conditions for returns, exchanges, and refunds.' },
  { name: 'Shipping and Delivery', path: '/legal/shipping-and-delivery', desc: 'Details on delivery options, timeframes, and shipping costs.' },
];

export default function LegalLayout() {
  const location = useLocation();

  return (
    <div className="bg-[#fafafa] min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-12">
          <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-4">
            Help Centre
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-primary font-bold">
            Legal & Policies
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 flex-shrink-0">
            <nav className="flex flex-col space-y-2 sticky top-32">
              <span className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-primary border-b border-gray-200 pb-3 mb-3">
                Documents
              </span>
              {POLICIES.map((policy) => {
                const isActive = location.pathname.includes(policy.path);
                return (
                  <NavLink
                    key={policy.path}
                    to={policy.path}
                    className={`font-sans text-sm py-2 px-4 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary text-white font-medium shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                    }`}
                  >
                    {policy.name}
                  </NavLink>
                );
              })}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="w-full md:w-3/4 bg-white p-8 md:p-12 shadow-sm rounded-md min-h-[500px]">
            {location.pathname === '/legal' || location.pathname === '/legal/' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-primary font-bold mb-2">Legal & Policies Hub</h2>
                  <p className="font-sans text-gray-500 text-sm">Please select a policy below or from the sidebar to view full details.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {POLICIES.map((policy) => (
                    <Link
                      key={policy.path}
                      to={policy.path}
                      className="p-5 border border-gray-100 rounded-lg hover:border-primary/30 hover:shadow-md transition-all group bg-gray-50/50 hover:bg-white"
                    >
                      <h3 className="font-sans font-medium text-base text-primary group-hover:text-secondary mb-1 flex items-center justify-between">
                        <span>{policy.name}</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </h3>
                      <p className="font-sans text-xs text-gray-500 font-light leading-relaxed">
                        {policy.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
