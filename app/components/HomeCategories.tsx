import { Link } from 'react-router';

export function HomeCategories() {
    const categories = [
        {
            id: 'framed-showers',
            title: 'Framed Showers',
            image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/PH_Andersen_Faci_Leboreiro_15.jpg.webp',
            url: '/contact',
            description: 'Traditional metal-framed doors and panels'
        },
        {
            id: 'semi-frameless-showers',
            title: 'Semi-frameless Showers',
            image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/Modern_Bathroom_Ideas_We_Know_Will_Inspire_You_To_Create_LARGE.jpg.webp',
            url: '/contact',
            description: 'Minimalist modern alternative for an elegant finish'
        },
        {
            id: 'frameless-showers',
            title: 'Frameless Showers',
            image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/hidraulico-decor-2-2.jpg',
            url: '/contact',
            description: 'Glass-to-tile design for a barely-visible timeless look'
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 text-left">
                    <div className="max-w-xl">
                        
                        <h2 className="font-sans text-4xl md:text-6xl font-bold text-primary tracking-tighter leading-tight mt-6 text-left">
                            Complete your bathroom with <br />
                            <span className="font-light text-secondary">the right enclosure.</span>
                        </h2>
                    </div>
                    <p className="font-sans text-gray-500 font-light max-w-sm mb-2 text-left">
                        Browse our shower enclosures, based on type, from traditional framed showers through to modern semi-framed and completely frameless showers.
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
                                    Coming Soon
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
