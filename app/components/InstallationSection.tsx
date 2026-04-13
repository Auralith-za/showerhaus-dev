import { NavLink } from 'react-router';

export function InstallationSection() {
    return (
        <section className="py-24 bg-[#f3f4f6] overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 max-w-7xl animate-fade-in-up">
                <div className="flex flex-col lg:flex-row shadow-2xl overflow-hidden bg-black">
                    {/* Image & Copy Column */}
                    <div className="w-full lg:w-1/2 relative flex flex-col justify-between p-12 md:p-16 lg:p-20 bg-black text-white overflow-hidden min-h-[600px]">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/contemporary-bathroom.jpg"
                                alt="ShowerHaus Professional Installation"
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        </div>

                        <div className="relative z-10">
                            <span className="font-sans text-xs tracking-widest uppercase text-white/70 mb-4 block">
                                ON SITE SERVICE
                            </span>
                            <h2 className="font-sans text-4xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-tighter">
                                Shower Technicians
                            </h2>
                            <p className="font-sans text-white/80 text-lg leading-relaxed max-w-md font-light">
                                We don't just sell the best shower enclosures, we ensure the right fit. Our shower technicians design shower enclosures to perfectly fit your space, taking into account all the features of your bathroom.
                            </p>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 border-t border-white/20 pt-8">
                            <div>
                                <h4 className="font-sans font-medium text-white mb-2 tracking-wide">60+ Years Experience</h4>
                                <p className="font-sans text-sm text-white/60 font-light">
                                    Our shower technicians have over 60 years combined experience measuring and designing showers.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-sans font-medium text-white mb-2 tracking-wide">Fully Industry Accredited</h4>
                                <p className="font-sans text-sm text-white/60 font-light">
                                    We are fully accredited and insured. <NavLink to="/pages/accreditations" className="underline hover:text-white transition-colors">Click here</NavLink> to read more about the certifications and accreditations.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Column */}
                    <div className="w-full lg:w-1/2 p-12 md:p-16 lg:p-20 bg-white relative">
                        <div className="max-w-md mx-auto h-full flex flex-col justify-center">
                            <h3 className="font-sans text-sm tracking-[0.3em] uppercase font-bold text-primary mb-6">GET YOUR FREE CONSULTATION</h3>
                            <p className="font-sans text-gray-500 mb-10 leading-relaxed text-sm">
                                Use this form to ensure you get the next available consultation available for your area - usually within 2 working days.
                            </p>

                            <form className="space-y-8 mt-12" onSubmit={(e) => { e.preventDefault(); alert("Form submission handled here"); }}>
                                <div>
                                    <label htmlFor="name" className="block text-xs font-sans uppercase tracking-widest text-primary mb-2 font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full border-b border-gray-300 py-3 bg-transparent text-primary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors font-sans"
                                        placeholder="Jane Doe"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-sans uppercase tracking-widest text-primary mb-2 font-medium">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full border-b border-gray-300 py-3 bg-transparent text-primary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors font-sans"
                                            placeholder="jane@example.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-xs font-sans uppercase tracking-widest text-primary mb-2 font-medium">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            className="w-full border-b border-gray-300 py-3 bg-transparent text-primary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors font-sans"
                                            placeholder="+44 20"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-xs font-sans uppercase tracking-widest text-primary mb-2 font-medium">Physical Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        className="w-full border-b border-gray-300 py-3 bg-transparent text-primary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors font-sans"
                                        placeholder="123 Example Street, City Name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-xs font-sans uppercase tracking-widest text-primary mb-2 font-medium">Project Details (Optional)</label>
                                    <textarea
                                        id="message"
                                        rows={2}
                                        className="w-full border-b border-gray-300 py-3 bg-transparent text-primary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none font-sans"
                                        placeholder="Tell us a bit about your vision..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary !text-white font-sans text-xs tracking-[0.3em] uppercase py-5 px-10 hover:bg-primary/90 transition-all duration-300 mt-10 group flex justify-center items-center gap-3"
                                >
                                    <span>Submit Request</span>
                                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
