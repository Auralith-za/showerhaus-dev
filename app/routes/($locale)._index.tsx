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
    <div className="home bg-[#FAF9F7]">
      <Hero />
      <TrustBar />
      <HomeCategories />
      <InstallationSection />

      {/* New Architectural Sections */}
      <div className="bg-white">
        <InspirationSection />
      </div>
      <div className="bg-[#FAF9F7]">
        <ProjectsSection />
      </div>
      <div className="bg-white">
        <ServicesSection />
      </div>

      <div className="bg-white py-24 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <RecommendedProducts products={data.recommendedProducts} />
        </div>
      </div>
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
      <h2 className="font-sans text-xs tracking-[0.3em] uppercase font-semibold text-primary mb-12 text-center">Discover Our Favorites</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {response
                ? response.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
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
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
