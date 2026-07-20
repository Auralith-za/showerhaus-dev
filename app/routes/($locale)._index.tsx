import { Await, useLoaderData, Link } from 'react-router';
import type { Route } from './+types/_index';
import { Suspense } from 'react';
import type { RecommendedProductsQuery } from 'storefrontapi.generated';
import { ProductItem } from '~/components/ProductItem';
import { Hero } from '~/components/Hero';
import { TrustBar } from '~/components/TrustBar';
import { HomeCategories } from '~/components/HomeCategories';
import { DRAFT_ARTICLES } from '~/lib/draftArticles';


import { InstallationSection } from '~/components/InstallationSection';
import { QuotingSection } from '~/components/QuotingSection';

import { InspirationSection } from '~/components/InspirationSection';
import { ProjectsSection } from '~/components/ProjectsSection';
import { ServicesSection } from '~/components/ServicesSection';

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Shower Haus | The Shower Specialists' },
    {
      name: 'description',
      content:
        'Premium custom-made and ready-to-install showers, expertly installed. Shop our comprehensive range of shower spares, online and in-store.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  return { ...deferredData };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    ? context.storefront.query(RECOMMENDED_PRODUCTS_QUERY).catch((err) => {
        console.error('Failed to fetch recommended products:', err);
        return null;
      })
    : Promise.resolve(null);

  const homepageBlogs = context.storefront
    ? context.storefront.query(HOMEPAGE_BLOGS_QUERY).catch((err) => {
        console.error('Failed to fetch blogs for homepage:', err);
        return null;
      })
    : Promise.resolve(null);

  return {
    recommendedProducts,
    homepageBlogs,
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

      {/* Section 6: Projects (Hidden for now) */}
      {/* <div className="bg-[#c9c9c9]">
        <ProjectsSection />
      </div> */}

      {/* Section 7: Installation & Consultation Form */}
      <InstallationSection />

      {/* Section 8: Inspiration (Let Us Inspire You) */}
      <div className="bg-white">
        <Suspense fallback={<div className="text-center text-gray-400 py-12">Loading inspiration guides...</div>}>
          <Await resolve={data.homepageBlogs}>
            {(response) => {
              const shopifyArticles = response?.blogs?.nodes
                ?.flatMap((blog: any) => blog.articles?.nodes || [])
                ?.sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()) || [];
              const hasNoShopifyArticles = shopifyArticles.length === 0;
              const displayArticles = hasNoShopifyArticles 
                ? DRAFT_ARTICLES.slice(0, 3) 
                : shopifyArticles.slice(0, 3);
              return <InspirationSection articles={displayArticles} />;
            }}
          </Await>
        </Suspense>
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
      <h2 className="font-sans text-4xl md:text-6xl font-bold text-primary leading-tight mb-6 tracking-tighter text-left">Trending on our online store</h2>
      
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
    products(first: 5, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

const HOMEPAGE_BLOGS_QUERY = `#graphql
  query HomepageBlogs($country: CountryCode, $language: LanguageCode)
    @inContext(language: $language, country: $country) {
    blogs(first: 10) {
      nodes {
        title
        handle
        articles(first: 3, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            publishedAt
            excerptHtml
            image {
              id
              altText
              url
              width
              height
            }
            blog {
              title
              handle
            }
          }
        }
      }
    }
  }
` as const;


