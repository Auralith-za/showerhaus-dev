import { Link } from 'react-router';

export function HomeCategories() {
    const categories = [
        {
            id: 'showers',
            title: 'Showers',
            image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/PH_Andersen_Faci_Leboreiro_15.jpg.webp',
            url: '/collections/showers',
            description: 'Frameless glass enclosures and bespoke wet room screens.'
        },
        {
            id: 'bath-enclosures',
            title: 'Bath Enclosures',
            image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/Modern_Bathroom_Ideas_We_Know_Will_Inspire_You_To_Create_LARGE.jpg.webp',
            url: '/collections/bath-enclosures',
            description: 'Elegant partitioning for integrated bathing and showering.'
        },
        {
            id: 'mirrors',
            title: 'Mirrors',
            image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/hidraulico-decor-2-2.jpg',
            url: '/collections/mirrors',
            description: 'Architectural mirrors with signature LED lighting and frames.'
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <span className="uppercase tracking-[0.2em] text-xs font-semibold text-secondary mb-4 block">
                            Curated Collections
                        </span>
                        <h2 className="font-sans text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight">
                            Elevate your space with <br />
                            <span className="font-light italic text-secondary">signature design.</span>
                        </h2>
                    </div>
                    <p className="font-sans text-gray-500 font-light max-w-sm mb-2">
                        Discover our most popular architectural solutions, meticulously designed to complement modern South African interiors.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {categories.map((cat, index) => (
                        <Link to={cat.url} key={cat.id} className="group cursor-pointer block">
                            <div className="relative overflow-hidden aspect-[3/4] mb-8 bg-gray-50 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10">
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                            </div>
                            <div>
                                <h3 className="font-sans text-sm tracking-[0.3em] uppercase font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                                    {cat.title}
                                </h3>
                                <p className="font-sans text-sm text-gray-400 font-light mb-6 leading-relaxed">
                                    {cat.description}
                                </p>
                                <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-primary group-hover:text-secondary transition-all">
                                    <span className="w-8 h-[1px] bg-primary group-hover:bg-secondary transition-colors"></span>
                                    Explore Series
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
