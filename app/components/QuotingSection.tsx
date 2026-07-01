import { NavLink } from 'react-router';

export function QuotingSection() {
    return null;
    return (
        <section className="py-32 bg-architectural-gray/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/50 -skew-x-12 translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    <span className="font-sans text-xs tracking-widest uppercase font-bold text-gray-400 mb-4 block">
                        Custom-made Consultations
                    </span>
                    <h2 className="font-sans text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tighter w-fit mx-auto">
                        Your Vision, Our Precision
                    </h2>
                    <p className="font-sans text-gray-600 text-lg mb-10 leading-relaxed max-w-2xl mx-auto text-center font-light">
                        Whether you are an architect, developer, or homeowner, our team provides expert quotes for projects of any scale.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
                        <NavLink
                            to="/pages/quote"
                            className="bg-primary !text-white font-sans text-sm tracking-widest uppercase font-bold px-10 py-5 hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/10"
                        >
                            Request a Custom-made Quote
                        </NavLink>
                        <NavLink
                            to="/pages/contact"
                            className="border border-primary text-primary font-sans text-sm tracking-widest font-bold uppercase px-10 py-5 hover:bg-primary/5 transition-all duration-300"
                        >
                            Speak to an Expert
                        </NavLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
