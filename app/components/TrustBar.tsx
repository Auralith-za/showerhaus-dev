export function TrustBar() {
    return (
        <div className="w-full bg-gray-50 py-12 border-b border-gray-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">

                    <div className="flex flex-col items-center px-4 group hover:transform hover:scale-105 transition-transform duration-300">
                        <h3 className="font-display text-lg uppercase tracking-widest mb-2 text-primary group-hover:text-secondary transition-colors">Trusted Industry Experts</h3>
                        <p className="font-sans text-sm text-gray-500 font-light">
                            Over 15 years of experience delivering premium bathroom solutions.
                        </p>
                    </div>

                    <div className="flex flex-col items-center px-4 pt-8 md:pt-0 group hover:transform hover:scale-105 transition-transform duration-300">
                        <h3 className="font-display text-lg uppercase tracking-widest mb-2 text-primary group-hover:text-secondary transition-colors">Award-Winning Design</h3>
                        <p className="font-sans text-sm text-gray-500 font-light">
                            Our in-house design team creates bespoke spaces tailored to you.
                        </p>
                    </div>

                    <div className="flex flex-col items-center px-4 pt-8 md:pt-0 group hover:transform hover:scale-105 transition-transform duration-300">
                        <h3 className="font-display text-lg uppercase tracking-widest mb-2 text-primary group-hover:text-secondary transition-colors">Approved Installers</h3>
                        <p className="font-sans text-sm text-gray-500 font-light">
                            Complete peace of mind with our certified installation service.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
