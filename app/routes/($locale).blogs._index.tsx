import { Link, useLoaderData } from 'react-router';
import type { Route } from './+types/blogs._index';
import { getPaginationVariables } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import type { BlogsQuery } from 'storefrontapi.generated';

type BlogNode = BlogsQuery['blogs']['nodes'][0];

export const meta: Route.MetaFunction = () => {
    return [{ title: `Journal | ShowerHaus` }];
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

const MOCK_ARTICLES = [
    {
        title: 'Choosing the Right Frameless Shower',
        date: 'May 2026',
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
        category: 'Design Tips',
        excerpt: 'From glass thickness to hardware finishes, discover the key decisions that define the perfect frameless enclosure for your space.'
    },
    {
        title: 'The Rise of Matte Black Finishes',
        date: 'Apr 2026',
        image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80',
        category: 'Trends',
        excerpt: 'Matte black hardware has become the defining aesthetic of contemporary bathroom design. Here\'s why it works and how to get it right.'
    },
    {
        title: 'Maintaining Your Glass: A Pro Guide',
        date: 'Mar 2026',
        image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800&q=80',
        category: 'Maintenance',
        excerpt: 'Keep your frameless glass looking pristine for years with these professional care tips and product recommendations.'
    },
];

export default function Blogs() {
    const { blogs } = useLoaderData<typeof loader>();

    return (
        <div>
            {/* Hero */}
            <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1800&q=80"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="ShowerHaus Journal"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center px-6">
                    <span className="block font-sans text-[11px] font-bold tracking-[0.5em] uppercase text-white/70 mb-6">JOURNAL</span>
                    <h1 className="font-display text-6xl md:text-8xl text-white tracking-tight">Design & Innovation</h1>
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

            {/* Featured Articles */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    {/* Featured large card */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-16 group cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-700">
                        <div className="relative overflow-hidden" style={{ minHeight: '400px' }}>
                            <img
                                src={MOCK_ARTICLES[0].image}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={MOCK_ARTICLES[0].title}
                            />
                        </div>
                        <div className="p-12 md:p-16 flex flex-col justify-center bg-white">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-secondary/10 text-secondary text-[9px] font-bold tracking-widest uppercase px-3 py-1">{MOCK_ARTICLES[0].category}</span>
                                <span className="font-sans text-[10px] text-gray-400 uppercase tracking-widest">{MOCK_ARTICLES[0].date}</span>
                            </div>
                            <h2 className="font-display text-3xl md:text-4xl text-primary mb-6 leading-tight">{MOCK_ARTICLES[0].title}</h2>
                            <p className="font-sans text-gray-500 leading-relaxed mb-8">{MOCK_ARTICLES[0].excerpt}</p>
                            <span className="inline-flex items-center gap-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-primary group-hover:text-secondary transition-colors">
                                Read Article
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Grid of remaining */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {MOCK_ARTICLES.slice(1).map((article, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="relative overflow-hidden mb-6 bg-gray-100" style={{ aspectRatio: '16/9' }}>
                                    <img
                                        src={article.image}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={article.title}
                                    />
                                    <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] font-bold tracking-widest uppercase text-primary shadow-sm">
                                        {article.category}
                                    </div>
                                </div>
                                <span className="block font-sans text-[10px] text-gray-400 uppercase tracking-widest mb-2">{article.date}</span>
                                <h3 className="font-display text-2xl text-primary group-hover:text-secondary transition-colors duration-300 mb-3">{article.title}</h3>
                                <p className="font-sans text-sm text-gray-500 leading-relaxed">{article.excerpt}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shopify Blogs if present */}
            {blogs.nodes.length > 0 && (
                <section className="py-20 bg-gray-50 border-t border-gray-100">
                    <div className="container mx-auto px-6">
                        <h2 className="font-display text-3xl text-primary mb-12">More from the Journal</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <PaginatedResourceSection<BlogNode> connection={blogs}>
                                {({ node: blog }) => (
                                    <Link
                                        className="bg-white p-8 border border-gray-100 hover:shadow-xl transition-all group block"
                                        key={blog.handle}
                                        prefetch="intent"
                                        to={`/blogs/${blog.handle}`}
                                    >
                                        <h3 className="font-display text-xl text-primary group-hover:text-secondary transition-colors mb-4">{blog.title}</h3>
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            Read More
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </Link>
                                )}
                            </PaginatedResourceSection>
                        </div>
                    </div>
                </section>
            )}

            {/* Newsletter Strip */}
            <section className="py-24 bg-primary text-white text-center">
                <div className="container mx-auto px-6 max-w-2xl">
                    <h2 className="font-display text-4xl mb-6">Stay Inspired</h2>
                    <p className="font-sans text-gray-300 mb-10">Get the latest design insights and product launches delivered to your inbox.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-6 py-4 bg-white/10 border border-white/30 text-white placeholder-white/50 outline-none focus:border-white transition-colors font-sans text-sm"
                        />
                        <button className="bg-white text-primary px-8 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-secondary hover:text-white transition-all duration-300 flex-shrink-0">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
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
      }
    }
  }
` as const;
