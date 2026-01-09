import { Link } from 'react-router';

export function Hero() {
    return (
        <section className="relative flex flex-col md:flex-row h-[500px] md:h-[600px] w-full overflow-hidden">
            {/* Left Content */}
            <div className="w-full md:w-1/2 bg-primary text-white flex flex-col justify-center p-12 md:p-20 relative z-10 animate-fade-in-left">
                <span className="uppercase tracking-[0.2em] mb-4 text-sm font-light text-gray-300">
                    Luxury Bathrooms
                </span>
                <h1 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
                    Transform Your Daily Ritual
                </h1>
                <p className="font-sans text-lg text-gray-200 mb-8 max-w-md font-light">
                    Discover our curated collection of premium showers, taps, and sanitaryware designed for elegance and performance.
                </p>
                <Link
                    to="/collections"
                    className="inline-block border border-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-primary transition-all duration-300 w-fit"
                >
                    Explore Collection
                </Link>
            </div>

            {/* Right Image */}
            <div className="w-full md:w-1/2 relative h-full animate-fade-in-right">
                <img
                    src="https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Bathroom_Design.jpg?v=1630000000"
                    alt="Luxury Bathroom"
                    className="w-full h-full object-cover"
                />
                {/* Placeholder image from generic Shopify CDN until we have real assets */}
            </div>
        </section>
    );
}
