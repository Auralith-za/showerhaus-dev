export async function loader() {
    return {};
}

const ACCREDITATIONS = [
    { name: 'SABS Approved', desc: 'South African Bureau of Standards certification for high-impact safety glass used across all our enclosures.', icon: 'SABS' },
    { name: 'SAGGA Member', desc: 'Proud member of the South African Glass and Glazing Association, upholding the highest industry standards.', icon: 'SAGGA' },
    { name: 'SAIA Partner', desc: 'Collaborating with the South African Institute of Architects on premium residential and commercial developments.', icon: 'SAIA' },
    { name: 'ISO 9001', desc: 'Adhering to international quality management system standards in all our manufacturing and installation processes.', icon: 'ISO' }
];

export default function Accreditation() {
    return (
        <div>
            {/* Hero */}
            <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1800&q=80"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="ShowerHaus Quality Standards"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center px-6">
                    <span className="block font-sans text-[11px] font-bold tracking-[0.5em] uppercase text-white/70 mb-6">STANDARDS</span>
                    <h1 className="font-display text-6xl md:text-8xl text-white tracking-tight">Our Accreditation</h1>
                    <div className="w-20 h-px bg-white/40 mx-auto mt-8" />
                </div>
            </section>

            <section className="py-16 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 text-center max-w-2xl">
                    <p className="font-sans text-gray-500 leading-relaxed text-lg">
                        Quality is not just a promise — it's a certification. We adhere to the highest local and international standards to ensure the safety and longevity of every product we install.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 bg-[#F9F8F6]">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="aspect-[3/4] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=900&q=80"
                                    className="w-full h-full object-cover"
                                    alt="Safety Standard Testing"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary/10 -z-10" />
                        </div>
                        <div className="space-y-10">
                            <div>
                                <span className="block font-sans text-[10px] font-bold tracking-[0.4em] uppercase text-secondary mb-4">CERTIFICATIONS</span>
                                <h2 className="font-display text-4xl md:text-5xl text-primary leading-tight">
                                    Safety & Precision<br /><span className="italic">Guaranteed.</span>
                                </h2>
                            </div>
                            <div className="space-y-8">
                                {ACCREDITATIONS.map((acc, i) => (
                                    <div key={i} className="flex gap-7 group">
                                        <div className="w-16 h-16 flex-shrink-0 bg-white border border-gray-100 flex items-center justify-center font-display text-[9px] font-bold tracking-widest text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                            {acc.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-2">{acc.name}</h3>
                                            <p className="font-sans text-sm text-gray-500 leading-relaxed">{acc.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-primary p-14 md:p-20 text-center text-white">
                        <span className="block font-sans text-[10px] font-bold tracking-[0.4em] uppercase text-white/50 mb-6">PROFESSIONALS</span>
                        <h2 className="font-display text-4xl mb-8">Technical Documentation</h2>
                        <p className="font-sans text-gray-300 mb-12 max-w-lg mx-auto">Need specific technical drawings or safety certifications for your project? Access our architect resource portal.</p>
                        <a href="/contact" className="inline-block border border-white text-white px-14 py-5 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-primary transition-all duration-500">
                            Request Resource Access
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
