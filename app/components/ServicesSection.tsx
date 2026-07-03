import { Link } from 'react-router';

export function ServicesSection() {
    return (
        <section className="w-full bg-[#c9c9c9] border-b border-gray-100" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
            <div className="container mx-auto px-6 max-w-7xl text-center">
                <h2 className="font-sans text-xs tracking-[0.4em] uppercase font-bold text-primary text-center" style={{ marginBottom: '48px' }}>
                    Engage With Us
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Channel 1 */}
                    <div className="relative overflow-hidden aspect-[3/4] group cursor-pointer shadow-2xl">
                        <img
                            src="/images/image-1.png"
                            alt="At Our Showroom"
                            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-black/90 group-hover:via-black/30 transition-all duration-700"></div>

                        <div className="absolute inset-x-0 bottom-0 p-8 text-white z-10 flex flex-col items-center justify-center text-center">
                            <h3 className="font-sans text-xl tracking-[0.2em] uppercase font-bold mb-4 transform transition-all duration-700 group-hover:-translate-y-4">
                                In Our Showroom
                            </h3>

                            <div className="max-h-0 opacity-0 transform translate-y-8 transition-all duration-700 ease-out group-hover:max-h-96 group-hover:opacity-100 group-hover:translate-y-0 overflow-hidden">
                                <p className="font-sans text-xs font-light text-gray-200 mb-10 leading-relaxed max-w-[240px] mx-auto">
                                    Experience our full range in person. Visit our showroom and speak with a specialist today.
                                </p>
                                <Link
                                    to="/contact"
                                    className="inline-block border border-white !text-white mt-8 mb-4 px-10 py-4 text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-white hover:!text-primary transition-all duration-300 w-full rounded-none"
                                >
                                    Find A Showroom
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Channel 2 */}
                    <div className="relative overflow-hidden aspect-[3/4] group cursor-pointer shadow-2xl">
                        <img
                            src="/images/image.png"
                            alt="At Your Home"
                            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-black/90 group-hover:via-black/30 transition-all duration-700"></div>

                        <div className="absolute inset-x-0 bottom-0 p-8 text-white z-10 flex flex-col items-center justify-center text-center">
                            <h3 className="font-sans text-xl tracking-[0.2em] uppercase font-bold mb-4 transform transition-all duration-700 group-hover:-translate-y-4">
                                At Your Home
                            </h3>

                            <div className="max-h-0 opacity-0 transform translate-y-8 transition-all duration-700 ease-out group-hover:max-h-96 group-hover:opacity-100 group-hover:translate-y-0 overflow-hidden">
                                <p className="font-sans text-xs font-light text-gray-200 mb-10 leading-relaxed max-w-[240px] mx-auto">
                                    We come to you. Our specialists can visit your home for a personalised measurement and design consultation.
                                </p>
                                <Link
                                    to="/contact"
                                    className="inline-block border border-white !text-white mt-8 mb-4 px-10 py-4 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-white hover:!text-primary transition-all duration-300 w-full rounded-none"
                                >
                                    Book A Visit
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Channel 3 */}
                    <div className="relative overflow-hidden aspect-[3/4] group cursor-pointer shadow-2xl">
                        <img
                            src="/images/engage-online.png"
                            alt="Online"
                            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-black/90 group-hover:via-black/30 transition-all duration-700"></div>

                        <div className="absolute inset-x-0 bottom-0 p-8 text-white z-10 flex flex-col items-center justify-center text-center">
                            <h3 className="font-sans text-xl tracking-[0.2em] uppercase font-bold mb-4 transform transition-all duration-700 group-hover:-translate-y-4">
                                Online
                            </h3>

                            <div className="max-h-0 opacity-0 transform translate-y-8 transition-all duration-700 ease-out group-hover:max-h-96 group-hover:opacity-100 group-hover:translate-y-0 overflow-hidden">
                                <p className="font-sans text-xs font-light text-gray-200 mb-10 leading-relaxed max-w-[240px] mx-auto">
                                    Shop our full catalogue online and receive your purchase via courier.
                                </p>
                                <Link
                                    to="/contact"
                                    className="inline-block border border-white !text-white mt-8 mb-4 px-10 py-4 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-white hover:!text-primary transition-all duration-300 w-full rounded-none"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
