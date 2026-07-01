export async function loader() {
    return {};
}

export default function OurStory() {
    return (
        <div>
            {/* Hero Section - clean, no blend issues */}
            <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1800&q=80"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Shower Haus Heritage"
                />
                {/* Simple dark overlay */}
                <div className="absolute inset-0 bg-black/45" />
                <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
                    <span className="block font-sans text-[11px] font-bold tracking-[0.5em] uppercase text-white/70 mb-8">
                        ESTABLISHED 2004
                    </span>
                    <h1 className="font-display text-6xl md:text-8xl text-white mb-8 tracking-tight leading-none">
                        Our Story
                    </h1>
                    <div className="w-20 h-px bg-white/40 mx-auto" />
                </div>
            </section>

            {/* The Vision */}
            <section className="py-28 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <span className="block font-sans text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">OUR HERITAGE</span>
                            <h2 className="font-display text-4xl md:text-5xl text-primary leading-tight">
                                Defining Luxury in <br /><span className="italic">Every Detail.</span>
                            </h2>
                            <p className="font-sans text-gray-600 leading-relaxed text-lg">
                                For over Two decades, Shower Haus has been at the forefront of bathroom innovation in South Africa. What started as a passion for precision engineering has evolved into a full-service design house for premium shower solutions.
                            </p>
                            <p className="font-sans text-gray-500 leading-relaxed">
                                Our journey began with a simple observation: the bathroom is no longer just a functional space, but a sanctuary of wellness and personal expression. This philosophy drives everything we do — from the hardware we source to the craftspeople we employ.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-[3/4] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=900&q=80"
                                    className="w-full h-full object-cover"
                                    alt="Modern Bathroom Design"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-secondary/10 -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-28 bg-[#F9F8F6]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="block font-sans text-[10px] font-bold tracking-[0.4em] uppercase text-secondary mb-4">PRINCIPLES</span>
                        <h2 className="font-display text-4xl md:text-5xl text-primary tracking-tight">Our Core Values</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                        {[
                            { title: 'Quality', desc: 'We source only the finest materials, from toughened safety glass to high-grade architectural hardware. Every product is tested to exceed industry standards.', num: '01' },
                            { title: 'Precision', desc: 'Every measurement, every cut, and every installation is executed with surgical precision. Our technical teams are certified and experienced.', num: '02' },
                            { title: 'Elegance', desc: 'Our designs are timeless, blending seamless functionality with contemporary aesthetics that enhance any architectural vision.', num: '03' }
                        ].map((v) => (
                            <div key={v.num} className="bg-white p-14 border border-gray-100 hover:shadow-2xl transition-all duration-700 group">
                                <div className="font-display text-6xl text-gray-100 mb-8 group-hover:text-secondary/20 transition-colors duration-700">{v.num}</div>
                                <h3 className="font-display text-3xl text-primary mb-6 group-hover:text-secondary transition-colors duration-300">{v.title}</h3>
                                <p className="font-sans text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-28 bg-primary text-white text-center">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="font-display text-4xl md:text-5xl mb-8">Ready to transform your space?</h2>
                    <p className="font-sans text-gray-300 mb-14 text-lg">Let our team of experts guide you through creating your perfect bathroom sanctuary.</p>
                    <a href="/contact" className="inline-block border border-white text-white px-14 py-5 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-primary transition-all duration-500">
                        Get in Touch
                    </a>
                </div>
            </section>
        </div>
    );
}
