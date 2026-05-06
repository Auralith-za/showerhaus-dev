import { Link } from 'react-router';

export async function loader() {
    return {};
}

export default function AboutUs() {
    const sections = [
        {
            title: 'Our Story',
            handle: 'our-story',
            desc: 'A legacy of bathroom innovation spanning two decades.',
            image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/hidraulico-decor-2-2.jpg'
        },
        {
            title: 'Selected Projects',
            handle: 'projects',
            desc: 'Explore our architectural portfolio across South Africa.',
            image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/modern-shower-interior.jpg'
        },
        {
            title: 'Customer Stories',
            handle: 'customer-stories',
            desc: 'Real transformations from our valued clients.',
            image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/hidraulico-decor-2-2.jpg'
        },
        {
            title: 'Accreditation',
            handle: 'accreditation',
            desc: 'Our commitment to safety and international standards.',
            image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/modern-shower-interior.jpg'
        }
    ];

    return (
        <div>
            {/* Main Header */}
            <section className="py-32 bg-white text-center">
                <div className="container mx-auto px-6">
                    <span className="block font-sans text-[11px] font-bold tracking-[0.4em] uppercase text-gray-400 mb-8">DISCOVER</span>
                    <h1 className="font-display text-5xl md:text-8xl text-primary tracking-tight mb-12">About ShowerHaus</h1>
                    <p className="max-w-2xl mx-auto font-sans text-gray-500 leading-relaxed text-xl font-light">
                        Architectural glass solutions designed for the modern South African home. We blend heritage, innovation, and uncompromising quality.
                    </p>
                </div>
            </section>

            {/* Section Grid */}
            <section className="bg-white pb-32">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 border border-gray-100">
                        {sections.map((section, i) => (
                            <Link
                                key={i}
                                to={`/pages/${section.handle}`}
                                className="group relative overflow-hidden bg-white flex flex-col justify-end p-8 md:p-16"
                                style={{ minHeight: '400px' }}
                            >
                                <img
                                    src={section.image}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt={section.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                <div className="relative z-10 space-y-3">
                                    <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight">{section.title}</h2>
                                    <p className="font-sans text-gray-300 text-sm max-w-sm">{section.desc}</p>
                                    <div className="pt-2 flex items-center gap-4 text-white text-[10px] font-bold tracking-[0.2em] uppercase">
                                        <span>Explore</span>
                                        <div className="w-12 h-px bg-white/40" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="font-display text-4xl text-primary mb-8 tracking-tight">Experience the difference.</h2>
                    <Link to="/collections/all" className="inline-block bg-primary text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-secondary transition-all shadow-xl">
                        Shop our Collections
                    </Link>
                </div>
            </section>
        </div>
    );
}
