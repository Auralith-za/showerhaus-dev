import { Link } from 'react-router';
import { DRAFT_ARTICLES } from '~/lib/draftArticles';

interface InspirationSectionProps {
    articles?: any[];
}

export function InspirationSection({ articles = DRAFT_ARTICLES.slice(0, 3) }: InspirationSectionProps) {
    // Ensure we only show up to 3 articles
    const displayArticles = articles.slice(0, 3);

    return (
        <section className="w-full bg-white py-32 border-b border-gray-100">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                    {/* Left Copy Container */}
                    <div className="lg:col-span-3 lg:col-start-1 pt-4 lg:sticky lg:top-32">
                        <h2 className="font-sans text-4xl md:text-6xl tracking-tighter font-bold text-primary mb-6">Get In The Know</h2>
                        <p className="font-sans text-gray-500 font-light leading-relaxed mb-6 max-w-sm">
                            Read our short guides on the most important considerations to take into account when buying a new shower.
                        </p>
                        <Link
                            to="/blogs"
                            className="inline-block bg-primary text-white mt-10 px-10 py-4 text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-primary/90 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-none hover:no-underline !text-white"
                        >
                            Explore All Guides
                        </Link>
                    </div>

                    {/* Right Images Grid */}
                    <div className="lg:col-span-8 lg:col-start-5 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayArticles.map((article) => {
                            const imageUrl = article.image?.url || 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80';
                            const title = article.title;
                            const link = `/blogs/${article.blog.handle}/${article.handle}`;

                            return (
                                <Link
                                    key={article.id || article.handle}
                                    to={link}
                                    className="group cursor-pointer block hover:no-underline"
                                >
                                    <div className="relative overflow-hidden aspect-[4/5] mb-6 shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
                                        <img
                                            src={imageUrl}
                                            alt={title}
                                            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                                    </div>
                                    <h3 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-300 pb-2 w-fit group-hover:border-primary transition-colors line-clamp-2">
                                        {title}
                                    </h3>
                                </Link>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}

