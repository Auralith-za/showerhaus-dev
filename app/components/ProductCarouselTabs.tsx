import { Link, Await } from 'react-router';
import { useState, Suspense } from 'react';
import { Image } from '@shopify/hydrogen';
import { ProductPrice } from '~/components/ProductPrice';

interface ProductCarouselTabsProps {
  currentProduct: any;
  relatedProducts?: any;
}

export function ProductCarouselTabs({ currentProduct, relatedProducts }: ProductCarouselTabsProps) {
  const [activeTab, setActiveTab] = useState('collection');

  const tabs = [
    { id: 'collection', label: 'YOU MAY ALSO LIKE' },
  ];

  return (
    <section className="product-carousel-tabs py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        
        {/* Tabs Header */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16 border-b border-gray-100 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-sans text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase transition-all relative pb-4 ${
                activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-primary'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-secondary animate-in fade-in slide-in-from-left-2 duration-300" />
              )}
            </button>
          ))}
        </div>

        {/* Carousel / Grid */}
        <div className="relative group">
          <Suspense fallback={<div className="text-center text-gray-400 py-12">Loading recommendations...</div>}>
            <Await resolve={relatedProducts}>
              {(response: any) => {
                const products = response?.productRecommendations || [];
                if (products.length === 0) {
                  return null;
                }
                return (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {products.map((product: any) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.handle}`}
                        className="flex flex-col gap-4 group/item"
                      >
                        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-sm">
                          {product.featuredImage ? (
                            <img
                              src={product.featuredImage.url}
                              alt={product.featuredImage.altText || product.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">No Image</div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/5 transition-colors duration-300" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className="font-sans text-[11px] text-gray-900 font-medium tracking-tight leading-tight group-hover/item:text-secondary transition-colors">
                            {product.title}
                          </h3>
                          <div className="font-sans text-[11px] text-gray-500 font-light">
                            <ProductPrice
                              price={product.priceRange?.minVariantPrice}
                              compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                );
              }}
            </Await>
          </Suspense>

          {/* Navigation Arrows (Decorative for now, would use a slider library in prod) */}
          <button className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100 text-primary hover:text-secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100 text-primary hover:text-secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
