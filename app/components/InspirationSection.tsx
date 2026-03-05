import { Link } from 'react-router';

export function InspirationSection() {
    return (
        <section className="w-full bg-white py-24 border-b border-gray-100">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                    {/* Left Copy Container */}
                    <div className="lg:col-span-3 lg:col-start-1 pt-4 lg:sticky lg:top-32">
                        <span className="font-sans text-xs tracking-[0.3em] uppercase font-bold text-gray-400 mb-6 block">Inspiration</span>
                        <h2 className="font-sans text-4xl tracking-tight text-primary mb-6">Let Us Inspire You</h2>
                        <p className="font-sans text-gray-500 font-light leading-relaxed mb-8 max-w-sm">
                            Explore the world of premium bathrooms with our dedicated Inspiration area.
                        </p>
                        <Link
                            to="/collections/showers"
                            className="inline-block bg-primary text-white mt-10 px-10 py-4 text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-black hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-none hover:no-underline !text-white"
                        >
                            Get Inspired
                        </Link>
                    </div>

                    {/* Right Images Grid */}
                    <div className="lg:col-span-8 lg:col-start-5 grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Image 1 */}
                        <div className="group cursor-pointer">
                            <div className="relative overflow-hidden aspect-[4/5] mb-6 shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
                                <img
                                    src="https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/swan-veritek-pro-vp6030csl-shower-kit-pano.jpg"
                                    alt="Luxury Bathroom Design"
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                            </div>
                            <h3 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-300 pb-2 w-fit group-hover:border-primary transition-colors">
                                HOW TO DESIGN A LUXURY BATHROOM
                            </h3>
                        </div>

                        {/* Image 2 */}
                        <div className="group cursor-pointer">
                            <div className="relative overflow-hidden aspect-[4/5] mb-6 shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
                                <img
                                    src="https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/luxury_shower.jpeg"
                                    alt="Inspirational Brochures"
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                            </div>
                            <h3 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-300 pb-2 w-fit group-hover:border-primary transition-colors">
                                BROWSE INSPIRATIONAL BROCHURES
                            </h3>
                        </div>

                        {/* Image 3 */}
                        <div className="group cursor-pointer">
                            <div className="relative overflow-hidden aspect-[4/5] mb-6 shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
                                <img
                                    src="https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/Design-Inspirations-8-Luxury-Shower-Ideas-that-Will-Motivate-Your-Day-2.jpg"
                                    alt="Design Trends"
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                            </div>
                            <h3 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-300 pb-2 w-fit group-hover:border-primary transition-colors">
                                LEADING DESIGN TRENDS FOR 2026
                            </h3>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
