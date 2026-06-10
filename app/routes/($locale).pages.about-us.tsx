import { Link } from 'react-router';

export async function loader() {
    return {};
}

export default function AboutUs() {
    return (
        <div className="bg-[#FAF9F6] min-h-screen font-sans text-primary">
            {/* Parallax Hero Header */}
            <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1620626011160-9928f1b9b630?w=1800&q=80"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 transition-transform duration-[2000ms] hover:scale-105"
                    alt="Shower Haus Durban"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#14294f]/80 via-[#14294f]/60 to-[#FAF9F6]" />
                
                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <span className="block font-sans text-[11px] font-extrabold tracking-[0.5em] uppercase text-[#4A89C8] mb-6">SINCE 2006</span>
                    <h1 className="font-display text-5xl md:text-8xl text-white tracking-tight mb-8">About Shower Haus</h1>
                    <div className="w-16 h-[2px] bg-[#4A89C8] mx-auto mb-8" />
                    <p className="font-sans text-white/95 leading-relaxed text-lg md:text-xl font-light max-w-3xl mx-auto drop-shadow-sm">
                        For over 20 years, Shower Haus has been Durban’s trusted specialist in shower doors, enclosures, and screens. In that time, we have designed, supplied, and installed more than 30,000 showers across the region — for homeowners furnishing their bathrooms, and for the builders, plumbers, contractors, architects, and designers who rely on us to get it right, project after project.
                    </p>
                </div>
            </section>

            {/* Core Narrative / Philosophy */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-7 space-y-8">
                            <span className="inline-block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#4A89C8] border-b border-[#4A89C8] pb-1">
                                OUR CORE FOCUS
                            </span>
                            <h2 className="font-display text-4xl md:text-5xl text-primary tracking-tight leading-tight">
                                We focus on one thing, and we do it properly: getting the fit right.
                            </h2>
                            <p className="font-sans text-gray-600 leading-relaxed text-base md:text-lg">
                                That means selecting the correct solution for the space and installing it so it performs as intended and lasts. It is a simple idea, but two decades of doing it consistently is what has built our reputation.
                            </p>
                        </div>
                        <div className="lg:col-span-5 relative">
                            <div className="absolute -inset-4 bg-[#FAF9F6] rounded-xl transform -rotate-2" />
                            <div className="relative overflow-hidden rounded-lg shadow-xl border border-gray-100">
                                <img 
                                    src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80" 
                                    alt="Expert alignment" 
                                    className="w-full h-[400px] object-cover transition-transform duration-700 hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience & Trust Section */}
            <section className="py-24 bg-[#FAF9F6] border-y border-gray-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-stretch">
                        <div className="md:col-span-5 bg-primary text-white p-12 flex flex-col justify-center rounded-sm shadow-md">
                            <span className="block font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-[#4A89C8] mb-6">OUR PROPOSITION</span>
                            <h3 className="font-display text-3xl mb-6 tracking-tight leading-snug">Experience you can build on</h3>
                            <div className="w-10 h-px bg-white/30 mb-6" />
                            <p className="font-sans text-white/90 text-sm leading-relaxed font-light">
                                Shower Haus sits between mass retail and the luxury showroom. You get specialist expertise and practical, experience-led advice. 
                            </p>
                        </div>
                        
                        <div className="md:col-span-7 bg-white p-12 border border-gray-100 rounded-sm flex flex-col justify-center space-y-6 shadow-sm">
                            <p className="font-sans text-gray-600 leading-relaxed text-sm md:text-base">
                                Our recommendations are grounded in real installation experience. The guidance you receive considers your space, your budget, and how the solution will hold up over the years.
                            </p>
                            <p className="font-sans text-gray-600 leading-relaxed text-sm md:text-base">
                                Behind every installation is an experienced team of specialists and installers who take ownership of the full result — from the first measurement through to the finishing and aftercare. We believe consistency signals quality, and that doing the job right the first time is what earns trust and keeps it.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Showroom & Client Targets Grid */}
            <section className="py-24 bg-[#FAF9F6] border-y border-gray-200/30">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                        {/* Showroom card */}
                        <div className="flex flex-col justify-between p-12 bg-white border border-gray-100 rounded-lg group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="p-3 bg-[#FAF9F6] rounded-full text-secondary shadow-sm">
                                        <svg className="w-5 h-5 text-[#4A89C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </span>
                                    <span className="block font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-[#4A89C8]">VISIT OUR STORE</span>
                                </div>
                                <h3 className="font-display text-2xl md:text-3xl text-primary tracking-tight font-light">Our Showroom & Store</h3>
                                <p className="font-sans text-sm text-gray-500 leading-relaxed font-light">
                                    Our showroom and store in Springfield is the best place to see the range and talk through your options in person. Alongside our custom work, we stock a range of ready-to-install standard showers, as well as shower spares and accessories — so whether you are planning a full custom enclosure or simply need a replacement part, there is a practical solution on the shelf.
                                </p>
                                <div className="border-l-2 border-[#4A89C8] pl-4 py-1.5 font-sans text-xs text-gray-600 tracking-wide leading-relaxed font-medium">
                                    Intersite Avenue, Umgeni Business Park, Springfield.
                                </div>
                            </div>
                            <div className="mt-10 pt-6 border-t border-gray-100">
                                <a 
                                    href="https://maps.google.com/?q=Intersite+Avenue+Umgeni+Business+Park+Springfield" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-[#4A89C8] hover:text-primary transition-colors group/link"
                                >
                                    Get Directions 
                                    <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Trade & Homeowners card */}
                        <div className="flex flex-col justify-between p-12 bg-white border border-gray-100 rounded-lg group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="p-3 bg-[#FAF9F6] rounded-full text-secondary shadow-sm">
                                        <svg className="w-5 h-5 text-[#4A89C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </span>
                                    <span className="block font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-[#4A89C8]">PARTNERSHIP</span>
                                </div>
                                <h3 className="font-display text-2xl md:text-3xl text-primary tracking-tight font-light">Built for homeowners & trade</h3>
                                <p className="font-sans text-sm text-gray-500 leading-relaxed font-light">
                                    Homeowners come to Shower Haus for clear advice and an installation that is handled properly from start to finish. Trade partners come to us for a specialist they can depend on — consistent standards, reliable workmanship, and accountability for the final outcome on every job.
                                </p>
                                <div className="border-l-2 border-[#4A89C8] pl-4 py-1.5 font-sans text-xs text-primary/80 tracking-wider uppercase font-bold leading-relaxed">
                                    Whatever brings you to us, the standard is the same: do it right, first time.
                                </div>
                            </div>
                            <div className="mt-10 pt-6 border-t border-gray-100">
                                <Link 
                                    to="/contact" 
                                    className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-[#4A89C8] hover:text-primary transition-colors group/link"
                                >
                                    Work With Us
                                    <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Take The Next Step Actions */}
            <section className="py-24 bg-[#FAF9F6] border-t border-gray-200/30">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <span className="block font-sans text-[11px] font-bold tracking-[0.4em] uppercase text-secondary mb-4">CONNECT WITH US</span>
                    <h2 className="font-display text-4xl text-primary mb-16 tracking-tight font-light">Take the next step</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {/* Book Consultation */}
                        <Link 
                            to="/pages/bespoke-showers" 
                            className="bg-white border border-gray-200/60 p-10 rounded-sm hover:border-[#4A89C8]/50 hover:shadow-lg transition-all duration-300 flex items-start gap-6 group"
                        >
                            <span className="p-3 bg-[#FAF9F6] text-primary rounded-sm group-hover:bg-[#4A89C8]/10 group-hover:text-[#4A89C8] transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <div className="space-y-2 flex-1">
                                <h4 className="font-display text-xl text-primary">Book a Consultation</h4>
                                <p className="font-sans text-xs text-gray-500 leading-relaxed">Arrange a visit and get experience-led advice for your space.</p>
                                <span className="inline-block font-sans text-[9px] font-bold tracking-widest uppercase text-[#4A89C8] pt-2">Book Now →</span>
                            </div>
                        </Link>

                        {/* Browse Our Range */}
                        <Link 
                            to="/collections/all" 
                            className="bg-white border border-gray-200/60 p-10 rounded-sm hover:border-[#4A89C8]/50 hover:shadow-lg transition-all duration-300 flex items-start gap-6 group"
                        >
                            <span className="p-3 bg-[#FAF9F6] text-primary rounded-sm group-hover:bg-[#4A89C8]/10 group-hover:text-[#4A89C8] transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </span>
                            <div className="space-y-2 flex-1">
                                <h4 className="font-display text-xl text-primary">Browse Our Range</h4>
                                <p className="font-sans text-xs text-gray-500 leading-relaxed">Explore shower doors, enclosures, screens, and accessories.</p>
                                <span className="inline-block font-sans text-[9px] font-bold tracking-widest uppercase text-[#4A89C8] pt-2">Browse Store →</span>
                            </div>
                        </Link>

                        {/* Visit Showroom */}
                        <a 
                            href="https://maps.google.com/?q=Intersite+Avenue+Umgeni+Business+Park+Springfield" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-white border border-gray-200/60 p-10 rounded-sm hover:border-[#4A89C8]/50 hover:shadow-lg transition-all duration-300 flex items-start gap-6 group"
                        >
                            <span className="p-3 bg-[#FAF9F6] text-primary rounded-sm group-hover:bg-[#4A89C8]/10 group-hover:text-[#4A89C8] transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </span>
                            <div className="space-y-2 flex-1">
                                <h4 className="font-display text-xl text-primary">Visit the Showroom</h4>
                                <p className="font-sans text-xs text-gray-500 leading-relaxed">See the range in person at our Springfield store.</p>
                                <span className="inline-block font-sans text-[9px] font-bold tracking-widest uppercase text-[#4A89C8] pt-2">Get Location →</span>
                            </div>
                        </a>

                        {/* Call Us */}
                        <a 
                            href="tel:0313129095" 
                            className="bg-white border border-gray-200/60 p-10 rounded-sm hover:border-[#4A89C8]/50 hover:shadow-lg transition-all duration-300 flex items-start gap-6 group"
                        >
                            <span className="p-3 bg-[#FAF9F6] text-primary rounded-sm group-hover:bg-[#4A89C8]/10 group-hover:text-[#4A89C8] transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </span>
                            <div className="space-y-2 flex-1">
                                <h4 className="font-display text-xl text-primary">Call Us</h4>
                                <p className="font-sans text-xs text-gray-500 leading-relaxed">Speak to a specialist about your project.</p>
                                <span className="inline-block font-sans text-[9px] font-bold tracking-widest uppercase text-[#4A89C8] pt-2">031 312 9095 →</span>
                            </div>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
