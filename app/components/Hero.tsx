import { useState, useEffect } from 'react';
import { Link } from 'react-router';

const SLIDES = [
    {
        id: 'tahuna-terrace',
        title: 'The Art of the Bathroom.',
        subtitle: 'Bespoke frameless showers designed with precision and crafted for the most discerning architectural interiors.',
        label: 'Architectural Excellence',
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1800&q=80',
        url: '/collections/showers',
        buttonText: 'Explore Showers'
    },
    {
        id: 'bespoke-shower-design',
        title: 'Seamless Wet Rooms.',
        subtitle: 'Minimalist walk-in solutions that transform your daily ritual into a spa-like experience within your home.',
        label: 'Modern Minimalism',
        image: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1800&q=80',
        url: '/collections/showers',
        buttonText: 'View Wet Rooms'
    },
    {
        id: 'architectural-glass',
        title: 'Precision Glass Craft.',
        subtitle: 'Tailored glass enclosures that define space with clarity and sophisticated architectural engineering.',
        label: 'Signature Engineering',
        image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1800&q=80',
        url: '/collections/showers',
        buttonText: 'Discover Bespoke'
    }
];

export function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides every 6 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative flex flex-col items-center justify-center h-[600px] md:h-[800px] w-full overflow-hidden bg-black">

            {/* Carousel Images */}
            {SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-105' : 'scale-100'
                            }`}
                    />
                    {/* Modern subtle overlay */}
                    <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
            ))}

            {/* Content Container */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 animate-fade-in-up">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    <span className="uppercase tracking-[0.3em] mb-4 block text-xs font-semibold text-white/90 text-center">
                        {SLIDES[currentSlide].label}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-[7rem] font-bold text-white mb-6 tracking-tight leading-none drop-shadow-md">
                        {SLIDES[currentSlide].title}
                    </h1>
                    <p className="font-sans text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed transition-all duration-700 text-center translate-y-[-1rem]">
                        {SLIDES[currentSlide].subtitle}
                    </p>
                    <div className="flex justify-center w-full mt-10">
                        <Link
                            to={SLIDES[currentSlide].url}
                            style={{ color: '#14294f' }}
                            className="inline-block bg-white px-12 py-5 text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-primary hover:no-underline transition-all duration-500 shadow-2xl"
                            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#14294f')}
                        >
                            {SLIDES[currentSlide].buttonText}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center gap-4">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1 cursor-pointer transition-all duration-500 rounded-full ${index === currentSlide ? 'w-12 bg-white' : 'w-6 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
