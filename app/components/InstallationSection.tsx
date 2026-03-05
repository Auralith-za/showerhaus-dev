import { NavLink } from 'react-router';

export function InstallationSection() {
    return (
        <section className="py-24 bg-[#F8F7F4] overflow-hidden">
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
                                Full Service Excellence
                            </span>
                            <h2 className="font-sans text-sm tracking-[0.3em] uppercase font-bold text-white mb-8 underline underline-offset-8 decoration-white/20">
                                Expert Installation
                            </h2>
                            <p className="font-sans text-white/80 text-lg leading-relaxed max-w-md font-light">
                                We don't just provide the world's finest shower enclosures; we ensure they are fitted to perfection. Our master installers specialize in bespoke configurations, ensuring a lifetime of precision performance.
                            </p>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16 border-t border-white/20 pt-8">
                            <div>
                                <h4 className="font-sans font-medium text-white mb-2 tracking-wide">Certified Masters</h4>
                                <p className="font-sans text-sm text-white/60 font-light">Rigorous training on luxury bespoke projects.</p>
                            </div>
                            <div>
                                <h4 className="font-sans font-medium text-white mb-2 tracking-wide">5-Year Guarantee</h4>
                                <p className="font-sans text-sm text-white/60 font-light">Complete peace of mind with our warranty.</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Column */}
                    <div className="w-full lg:w-1/2 p-12 md:p-16 lg:p-20 bg-white relative">
                        <div className="max-w-md mx-auto h-full flex flex-col justify-center">
                            <h3 className="font-sans text-sm tracking-[0.3em] uppercase font-bold text-primary mb-6">Request a Consultation</h3>
                            <p className="font-sans text-gray-500 mb-10 leading-relaxed">
                                Leave your details below and a ShowerHaus master installer will be in touch to discuss your project.
                            </p>

                            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert("Form submission handled here"); }}>
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
                                    <label htmlFor="project" className="block text-xs font-sans uppercase tracking-widest text-primary mb-2 font-medium">Project Type</label>
                                    <div className="relative">
                                        <select
                                            id="project"
                                            className="w-full border-b border-gray-300 py-3 bg-transparent text-primary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer font-sans"
                                            defaultValue=""
                                            required
                                        >
                                            <option value="" disabled>Select an option</option>
                                            <option value="new">New Bathroom Installation</option>
                                            <option value="renovation">Bathroom Renovation</option>
                                            <option value="custom">Custom Glass Enclosure</option>
                                            <option value="consultation">General Consultation</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
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
                                    className="w-full bg-primary !text-white font-sans text-xs tracking-[0.3em] uppercase py-5 px-10 hover:bg-black transition-all duration-300 mt-10 group flex justify-center items-center gap-3"
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
