import { Await, useLoaderData } from 'react-router';
import type { Route } from './+types/_index';
import { Suspense } from 'react';
import type { RecommendedProductsQuery } from 'storefrontapi.generated';
import { ProductItem } from '~/components/ProductItem';
import { Hero } from '~/components/Hero';
import { TrustBar } from '~/components/TrustBar';
import { HomeCategories } from '~/components/HomeCategories';

import { getMockRecommendedProducts } from '~/lib/mockData';
import { InstallationSection } from '~/components/InstallationSection';
import { QuotingSection } from '~/components/QuotingSection';

import { InspirationSection } from '~/components/InspirationSection';
import { ProjectsSection } from '~/components/ProjectsSection';
import { ServicesSection } from '~/components/ServicesSection';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'ShowerHaus | Premium Bathroom & Kitchen' }];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  return { ...deferredData };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  const recommendedProducts = Promise.resolve(getMockRecommendedProducts() as any);

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home bg-white">
      {/* Section 1: Hero / Banner Carousel */}
      <Hero />

      {/* Section 2: Frameless Shower Experts – statement text */}
      <TrustBar />

      {/* Section 3: Most Popular Products slider */}
      <div className="bg-white py-24 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <RecommendedProducts products={data.recommendedProducts} />
        </div>
      </div>

      {/* Section 4: Engage With Us — Channels */}
      <div className="bg-[#c9c9c9]">
        <ServicesSection />
      </div>

      {/* Section 5: Ranges / HomeCategories */}
      <HomeCategories />

      {/* Section 6: Projects */}
      <div className="bg-[#c9c9c9]">
        <ProjectsSection />
      </div>

      {/* Section 7: Installation & Consultation Form */}
      <InstallationSection />

      {/* Section 8: Inspiration (Let Us Inspire You) */}
      <div className="bg-white">
        <InspirationSection />
      </div>

      {/* Section 9: Quoting / CTA */}
      <QuotingSection />
    </div>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2 className="font-sans text-4xl md:text-6xl font-bold text-primary leading-tight mb-6 tracking-tighter text-left">Our Most Popular Products</h2>
      
      <div style={{ height: '60px' }} className="w-full"></div>
      <Suspense fallback={<div className="text-center text-gray-400 py-12">Loading products...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
              {response
                ? response.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <div className="text-center mt-12">
        <a
          href="/collections/all"
          className="inline-flex items-center gap-3 font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-primary hover:text-secondary transition-colors"
        >
          <span className="w-8 h-[1px] bg-primary"></span>
          View Full Catalogue
          <span className="w-8 h-[1px] bg-primary"></span>
        </a>
      </div>
    </div>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
