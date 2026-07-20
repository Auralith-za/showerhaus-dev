export function TrustBar() {
    return (
        <section className="w-full bg-[#fafafa] py-32 border-b border-gray-100 relative overflow-hidden">
            {/* Subtle decorative element */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
            
            <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                <span className="font-sans text-[10px] tracking-[0.4em] uppercase font-bold text-primary/40 mb-4 block">
                    Technical Excellence
                </span>
                
                <h2 className="font-sans text-4xl md:text-6xl font-bold text-primary leading-tight mb-6 tracking-tighter">
                    The Frameless Shower Experts
                </h2>
                
                <div className="flex flex-col items-center">
                    <div className="w-20 h-[1.5px] bg-primary/20 mb-8" />
                    <p className="font-sans text-base md:text-lg text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
                        We take pride in technical excellence. That&apos;s why we are the preferred choice for architects, interior designers, contractors, and the most discerning home-owners in KZN.
                    </p>
                    <div className="w-20 h-[1.5px] bg-primary/20 mt-8" />
                </div>
            </div>
        </section>
    );
}
