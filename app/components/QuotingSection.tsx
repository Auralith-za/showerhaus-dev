import { NavLink } from 'react-router';

export function QuotingSection() {
    return (
        <section className="py-24 bg-architectural-gray/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/50 -skew-x-12 translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    <span className="font-sans text-xs tracking-widest uppercase text-gray-400 mb-6 block">
                        Bespoke Consultations
                    </span>
                    <h2 className="font-sans text-xs tracking-[0.3em] uppercase font-semibold text-primary mb-8 underline underline-offset-8 decoration-primary/20 w-fit mx-auto">
                        Your Vision, Our Precision
                    </h2>
                    <p className="font-sans text-gray-600 text-lg mb-12 leading-relaxed max-w-2xl mx-auto text-center">
                        Whether you are an architect, developer, or homeowner, our team provides expert quotes for projects of any scale.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-24">
                        <NavLink
                            to="/pages/quote"
                            className="bg-primary !text-white font-sans text-sm tracking-widest uppercase px-10 py-5 hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/10"
                        >
                            Request a Bespoke Quote
                        </NavLink>
                        <NavLink
                            to="/pages/contact"
                            className="border border-primary text-primary font-sans text-sm tracking-widest uppercase px-10 py-5 hover:bg-primary/5 transition-all duration-300"
                        >
                            Speak to an Expert
                        </NavLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
