export async function loader() {
    return {};
}

const PROJECTS = [
    { title: 'The Sandton Villa', category: 'Frameless Enclosures', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80' },
    { title: 'Clifton Beach House', category: 'Glass Balustrades', image: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=800&q=80' },
    { title: 'Waterfront Penthouse', category: 'Custom Mirrors', image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800&q=80' },
    { title: 'Steyn City Estate', category: 'Walk-in Screens', image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80' },
    { title: 'Camps Bay Retreat', category: 'Architectural Hardware', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80' },
    { title: 'Dainfern Residence', category: 'Framed Showers', image: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=800&q=80' },
];

export default function Projects() {
    return (
        <div>
            {/* Hero */}
            <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1800&q=80"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="ShowerHaus Projects"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center px-6">
                    <span className="block font-sans text-[11px] font-bold tracking-[0.5em] uppercase text-white/70 mb-6">PORTFOLIO</span>
                    <h1 className="font-display text-6xl md:text-8xl text-white tracking-tight">Selected Projects</h1>
                    <div className="w-20 h-px bg-white/40 mx-auto mt-8" />
                </div>
            </section>

            {/* Intro text */}
            <section className="py-16 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 text-center max-w-2xl">
                    <p className="font-sans text-gray-500 leading-relaxed text-lg">
                        Explore our latest installations across South Africa's most prestigious developments and residential homes.
                    </p>
                </div>
            </section>

            {/* Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {PROJECTS.map((project, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="relative overflow-hidden bg-gray-100 mb-5" style={{ aspectRatio: '4/5' }}>
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-500" />
                                </div>
                                <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-secondary block mb-1">{project.category}</span>
                                <h3 className="font-display text-2xl text-primary group-hover:text-secondary transition-colors duration-300">{project.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white text-center border-t border-gray-100">
                <button className="border border-primary text-primary px-14 py-5 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all duration-300">
                    Load More Projects
                </button>
            </section>
        </div>
    );
}
