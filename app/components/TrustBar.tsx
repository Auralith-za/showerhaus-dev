export function TrustBar() {
    return (
        <section className="w-full bg-[#FAF9F7] py-24 border-b border-gray-100">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 text-center">

                    <div className="flex flex-col items-center px-4 group">
                        <div className="mb-8 w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm text-[#A8988D] group-hover:scale-110 transition-transform duration-500">
                            {/* Award / Medal Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                        </div>
                        <h3 className="font-sans text-sm tracking-[0.3em] uppercase font-bold text-primary mb-6">Trusted Industry Experts</h3>
                        <p className="font-sans text-sm text-gray-500 font-light leading-relaxed">
                            Over 15 years' experience in sourcing premium products for both homeowners and trade professionals.
                        </p>
                    </div>

                    <div className="flex flex-col items-center px-4 group">
                        <div className="mb-8 w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm text-[#8EA0AB] group-hover:scale-110 transition-transform duration-500">
                            {/* Swatches / Design Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.55l.812-1.25M9.53 16.122V16.12M12.918 13.323l4.5-9.378a.375.375 0 0 1 .533-.186c.2.1.378.23.518.384l2.126 2.128c.16.16.29.337.385.534a.375.375 0 0 1-.186.533L16.22 17.5M12.918 13.323l1.868 1.869-7.14 7.14a1.5 1.5 0 0 1-2.12-2.12l7.14-7.14Z" />
                            </svg>
                        </div>
                        <h3 className="font-sans text-sm tracking-[0.3em] uppercase font-bold text-primary mb-6">Award-Winning Design Service</h3>
                        <p className="font-sans text-sm text-gray-500 font-light leading-relaxed">
                            Meet with our award-winning and professionally qualified bathroom designers.
                        </p>
                    </div>

                    <div className="flex flex-col items-center px-4 group">
                        <div className="mb-8 w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm text-[#D7B69C] group-hover:scale-110 transition-transform duration-500">
                            {/* House / Installation Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                        </div>
                        <h3 className="font-sans text-sm tracking-[0.3em] uppercase font-bold text-primary mb-6">Specially-Trained Installation</h3>
                        <p className="font-sans text-sm text-gray-500 font-light leading-relaxed">
                            Our bathroom installation service offers peace-of-mind workmanship with an extended guarantee.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
