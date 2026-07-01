import { Outlet, NavLink, useLocation } from 'react-router';
import type { Route } from './+types/legal';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Legal | Shower Haus' }];
};

const POLICIES = [
  { name: 'Using Our Website', path: '/legal/using-our-website' },
  { name: 'Terms and Conditions', path: '/legal/terms-and-conditions' },
  { name: 'Privacy Policy', path: '/legal/privacy' },
  { name: 'Cookies Policy', path: '/legal/cookies' },
  { name: 'Refund and Returns', path: '/legal/refund-and-returns' },
  { name: 'Shipping and Delivery', path: '/legal/shipping-and-delivery' },
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
              <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                <svg className="w-16 h-16 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="font-display text-xl text-primary mb-2">Select a Policy</h3>
                <p className="font-sans text-gray-500 text-sm">Please select a document from the menu to read our policies.</p>
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
