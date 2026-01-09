import { Link } from 'react-router';

export function HomeCategories() {
    const categories = [
        {
            id: 'baths',
            title: 'Baths',
            image: 'https://cdn.shopify.com/s/files/1/0861/7364/7160/files/freestanding-bath.jpg?v=1708680000', // Placeholder
            url: '/collections/baths',
            description: 'Discover our range of luxury freestanding and fitted baths.'
        },
        {
            id: 'showers',
            title: 'Showers',
            image: 'https://cdn.shopify.com/s/files/1/0861/7364/7160/files/shower-enclosure.jpg?v=1708680000', // Placeholder
            url: '/collections/showers',
            description: 'Premium frameless showers and wet room solutions.'
        },
        {
            id: 'basins',
            title: 'Basins',
            image: 'https://cdn.shopify.com/s/files/1/0861/7364/7160/files/basin-vanity.jpg?v=1708680000', // Placeholder
            url: '/collections/basins',
            description: 'Elegant basins and vanity units for every space.'
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">New Collections</h2>
                    <p className="font-sans text-gray-500 font-light max-w-2xl mx-auto">
                        Explore our latest arrivals, featuring contemporary designs and timeless classics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat) => (
                        <Link to={cat.url} key={cat.id} className="group cursor-pointer block">
                            <div className="relative overflow-hidden aspect-[4/5] mb-6">
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-display text-2xl text-primary mb-2 group-hover:text-secondary transition-colors">
                                    {cat.title}
                                </h3>
                                <p className="font-sans text-sm text-gray-500 font-light">
                                    {cat.description}
                                </p>
                                <div className="mt-4 inline-block border-b border-secondary pb-1 text-xs font-bold tracking-widest uppercase text-secondary group-hover:text-primary group-hover:border-primary transition-all">
                                    Shop Now
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
