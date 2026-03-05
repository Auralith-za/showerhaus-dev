import { Link } from 'react-router';

export function ProjectsSection() {
    return (
        <section className="w-full bg-[#F3F2EE] py-24 border-b border-gray-100">
            <div className="container mx-auto px-6 max-w-7xl">
                <h2 className="font-sans text-xs tracking-[0.4em] uppercase font-bold text-gray-400 mb-16">Projects We're Proud Of</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Project 1 */}
                    <div className="group relative overflow-hidden aspect-[4/3] shadow-sm cursor-pointer">
                        <img
                            src="https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/0d8d451ef2f2eecf040b38049febdf27.jpg"
                            alt="Garden Court Residential Project"
                            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        <div className="absolute bottom-8 left-8 right-8 text-white z-10 flex flex-col items-start gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div>
                                <span className="uppercase text-xs tracking-[0.3em] font-bold mb-3 block text-white/70">Residential Project</span>
                                <h3 className="font-sans text-3xl tracking-tight uppercase font-bold">Garden Court</h3>
                            </div>
                            <Link
                                to="/collections/showers"
                                className="inline-block bg-white text-primary mt-6 px-10 py-4 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-primary hover:!text-white hover:no-underline hover:-translate-y-1 hover:shadow-lg transition-all duration-300 rounded-none opacity-0 group-hover:opacity-100"
                            >
                                Discover
                            </Link>
                        </div>
                    </div>

                    {/* Project 2 */}
                    <div className="group relative overflow-hidden aspect-[4/3] shadow-sm cursor-pointer">
                        <img
                            src="https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/Frameless-Shower-South-Africa-Showerline-2.jpg"
                            alt="Islington Penthouse Residential Project"
                            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        <div className="absolute bottom-8 left-8 right-8 text-white z-10 flex flex-col items-start gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div>
                                <span className="uppercase text-xs tracking-[0.2em] font-bold mb-2 block text-white/70">Residential Project</span>
                                <h3 className="font-sans text-4xl tracking-tight uppercase font-bold">Islington Penthouse</h3>
                            </div>
                            <Link
                                to="/collections/showers"
                                className="inline-block bg-white text-primary mt-6 px-10 py-4 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-primary hover:!text-white hover:no-underline hover:-translate-y-1 hover:shadow-lg transition-all duration-300 rounded-none opacity-0 group-hover:opacity-100"
                            >
                                Discover
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
