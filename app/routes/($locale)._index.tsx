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
  return [{ title: 'ShowerHaus | Premium Bathroom & Kitchen' }];
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
        <InspirationSection />
      </div>

      {/* Section 8.5: Blog / Journal Section */}
      <HomepageBlogsSection blogsData={data.homepageBlogs} />

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
    blogs(first: 1) {
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

function HomepageBlogsSection({ blogsData }: { blogsData: Promise<any> }) {
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
    }).format(new Date(dateStr));
  };

  return (
    <Suspense fallback={<div className="text-center text-gray-400 py-12">Loading journal posts...</div>}>
      <Await resolve={blogsData}>
        {(response) => {
          const shopifyArticles = response?.blogs?.nodes?.[0]?.articles?.nodes || [];
          const hasNoShopifyArticles = shopifyArticles.length === 0;
          const displayArticles = hasNoShopifyArticles 
            ? DRAFT_ARTICLES.slice(0, 3) 
            : shopifyArticles.slice(0, 3);

          if (displayArticles.length === 0) return null;

          return (
            <section className="py-24 bg-white border-t border-gray-200/50">
              <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                  <span className="block font-sans text-[11px] font-bold tracking-[0.4em] uppercase text-secondary/70 mb-4">JOURNAL</span>
                  <h2 className="font-display text-4xl md:text-5xl text-primary tracking-tight font-light">Latest from the Journal</h2>
                  <div className="w-12 h-px bg-secondary/35 mx-auto mt-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {displayArticles.map((article: any) => (
                    <Link
                      key={article.id}
                      to={`/blogs/${article.blog.handle}/${article.handle}`}
                      className="group cursor-pointer block"
                    >
                      <div className="relative overflow-hidden bg-gray-100 aspect-[16/10] rounded-sm shadow-sm">
                        <img
                          src={article.image?.url || 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80'}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          alt={article.title}
                        />
                      </div>
                      <span className="block font-sans text-[10px] text-gray-400 uppercase tracking-widest mt-6 mb-2">
                        {formatDate(article.publishedAt)}
                      </span>
                      <h3 className="font-display text-xl md:text-2xl text-primary group-hover:text-secondary transition-colors duration-300 mb-3 leading-snug">
                        {article.title}
                      </h3>
                      <div
                        className="font-sans text-sm text-gray-500 leading-relaxed line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: article.excerptHtml || '' }}
                      />
                      <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-[#4A89C8] pt-4 group-hover:text-primary transition-colors">
                        Read Article →
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-16">
                  <Link
                    to="/blogs/journal"
                    className="inline-block border border-primary text-primary px-10 py-4 text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    View All Articles
                  </Link>
                </div>
              </div>
            </section>
          );
        }}
      </Await>
    </Suspense>
  );
}
