import { Link, useLoaderData } from 'react-router';
import type { Route } from './+types/blogs._index';
import { getPaginationVariables } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import type { BlogsQuery } from 'storefrontapi.generated';
import { DRAFT_ARTICLES } from '~/lib/draftArticles';

type BlogNode = BlogsQuery['blogs']['nodes'][0];

export const meta: Route.MetaFunction = () => {
    return [{ title: `Guides | Shower Haus` }];
};

export async function loader(args: Route.LoaderArgs) {
    const criticalData = await loadCriticalData(args);
    return { ...criticalData };
}

async function loadCriticalData({ context, request }: Route.LoaderArgs) {
    const paginationVariables = getPaginationVariables(request, { pageBy: 10 });
    const [{ blogs }] = await Promise.all([
        context.storefront.query(BLOGS_QUERY, { variables: { ...paginationVariables } }),
    ]);
    return { blogs };
}

export default function Blogs() {
    const { blogs } = useLoaderData<typeof loader>();

    // Extract all articles and sort them by date descending
    const shopifyArticles = blogs.nodes
        .flatMap((blog) => blog.articles?.nodes || [])
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const hasNoShopifyArticles = shopifyArticles.length === 0;
    const allArticles = hasNoShopifyArticles ? DRAFT_ARTICLES : shopifyArticles;

    const featuredArticle = allArticles[0];
    const gridArticles = allArticles.slice(1, 5); // Take next 4 for the grid
    
    // Fallback formatting for date
    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
        }).format(new Date(dateStr));
    };

    return (
        <div>
            {/* Hero */}
            <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
                <img
                    src="/images/hero-3.png"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Shower Haus Guides"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center px-6">
                    <span className="block font-sans text-[11px] font-bold tracking-[0.5em] uppercase text-white/70 mb-6">GUIDES</span>
                    <h1 className="font-display text-6xl md:text-8xl text-white tracking-tight">Learning About Showers</h1>
                    <div className="w-20 h-px bg-white/40 mx-auto mt-8" />
                </div>
            </section>

            {/* Intro */}
            <section className="py-14 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 text-center max-w-2xl">
                    <p className="font-sans text-gray-500 leading-relaxed text-lg">
                        Explore our latest thoughts on architectural glass, bathroom design trends, and care guides from our technical team.
                    </p>
                </div>
            </section>

            {/* Admin Notice */}
            {hasNoShopifyArticles && (
                <div className="bg-amber-50 border-y border-amber-100 py-3 px-6 text-center text-amber-800 text-[10px] uppercase tracking-wider font-semibold">
                    💡 Preview Mode: Displaying draft articles. Publish articles in Shopify Admin &gt; Online Store &gt; Blog Posts to sync live content.
                </div>
            )}

            {/* Featured Articles */}
            {allArticles.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        {/* Featured large card */}
                        {featuredArticle && (
                            <Link to={`/blogs/${featuredArticle.blog.handle}/${featuredArticle.handle}`} className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-16 group cursor-pointer border border-gray-100 hover:shadow-2xl hover:no-underline transition-all duration-700">
                                <div className="relative overflow-hidden" style={{ minHeight: '400px' }}>
                                    <img
                                        src={featuredArticle.image?.url || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80'}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={featuredArticle.title}
                                    />
                                </div>
                                <div className="p-12 md:p-16 flex flex-col justify-center bg-white">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="bg-secondary/10 text-secondary text-[9px] font-bold tracking-widest uppercase px-3 py-1">{featuredArticle.blog.title}</span>
                                        <span className="font-sans text-[10px] text-gray-400 uppercase tracking-widest">{formatDate(featuredArticle.publishedAt)}</span>
                                    </div>
                                    <h2 className="font-display text-3xl md:text-4xl text-primary mb-6 leading-tight">{featuredArticle.title}</h2>
                                    <div className="font-sans text-gray-500 leading-relaxed mb-8 line-clamp-3" dangerouslySetInnerHTML={{ __html: featuredArticle.excerptHtml || '' }} />
                                    <span className="inline-flex items-center gap-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-primary group-hover:text-secondary transition-colors">
                                        Read Article
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        )}

                        {/* Grid of remaining */}
                        {gridArticles.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {gridArticles.map((article) => (
                                    <Link to={`/blogs/${article.blog.handle}/${article.handle}`} key={article.id} className="group cursor-pointer block hover:no-underline">
                                        <div className="relative overflow-hidden mb-6 bg-gray-100" style={{ aspectRatio: '16/9' }}>
                                            <img
                                                src={article.image?.url || 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80'}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                alt={article.title}
                                            />
                                            <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] font-bold tracking-widest uppercase text-primary shadow-sm">
                                                {article.blog.title}
                                            </div>
                                        </div>
                                        <span className="block font-sans text-[10px] text-gray-400 uppercase tracking-widest mb-2">{formatDate(article.publishedAt)}</span>
                                        <h3 className="font-display text-2xl text-primary group-hover:text-secondary transition-colors duration-300 mb-3">{article.title}</h3>
                                        <div className="font-sans text-sm text-gray-500 leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: article.excerptHtml || '' }} />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}

const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
        articles(first: 5, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            publishedAt
            excerptHtml
            image {
              url
              altText
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
