import { useState, useEffect } from 'react';
import { Link } from 'react-router';

interface HeroSlide {
    id: string;
    title: string;
    subtitle: string;
    label: string;
    image: string;
    url: string;
    buttonText: string;
    isBlackFridayBanner?: boolean;
}

const SLIDES: HeroSlide[] = [
    {
        id: 'black-friday-sale',
        title: 'Shower glass, marked down.',
        subtitle: 'PIVOT DOORS, SHOWER SCREENS AND BATH SCREENS. SUPPLY ONLY.',
        label: 'BLACK FRIDAY   /   WHILE STOCKS LAST',
        image: '/images/black-friday-showers-hires.jpg',
        url: '/collections/black-friday',
        buttonText: 'SHOP THE SALE',
        isBlackFridayBanner: true,
    },
    {
        id: 'tahuna-terrace',
        title: 'Installed Right. Built to Last.',
        subtitle: 'Custom-made shower enclosures designed to fit your space and installed properly from the start.',
        label: 'SHOWER GLASS SPECIALISTS',
        image: '/images/hero-1.png',
        url: '/pages/custom-made-showers',
        buttonText: 'MORE ABOUT CUSTOM-MADE',
    },
    {
        id: 'bespoke-shower-design',
        title: 'The Right Fit, Every Time.',
        subtitle: 'From your first measurement to the final installation, we make sure it fits, works, and lasts.',
        label: 'CUSTOM-MADE SHOWER GLASS',
        image: '/images/hero-2.png',
        url: '/contact',
        buttonText: 'GET A FREE CONSULTATION',
    },
    {
        id: 'architectural-glass',
        title: 'Over Two Decades. Thousands of Showers.',
        subtitle: "Shower Haus has been getting it right for over 20 years. Durban's trusted shower glass specialists.",
        label: 'SINCE 2004',
        image: '/images/hero-3.png',
        url: '/pages/custom-made-showers',
        buttonText: 'DISCOVER BESPOKE',
    },
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

    const activeSlide = SLIDES[currentSlide];

    return (
        <section
            className={`relative flex flex-col items-center justify-center h-[600px] md:h-[800px] w-full overflow-hidden transition-colors duration-700 !p-0 ${
                activeSlide.isBlackFridayBanner
                    ? 'bg-white border-b border-gray-100'
                    : 'bg-black'
            }`}
        >
            {/* Carousel Slides */}
            {SLIDES.map((slide, index) => {
                const isActive = index === currentSlide;

                if (slide.isBlackFridayBanner) {
                    return (
                        <Link
                            key={slide.id}
                            to={slide.url}
                            aria-label="Black Friday Sale — Shower glass, marked down. Now from R1 200. Shop the sale"
                            style={{ textDecoration: 'none', willChange: 'opacity' }}
                            className={`absolute inset-0 z-10 flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out cursor-pointer !no-underline hover:!no-underline ${
                                isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                            }`}
                        >
                            <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 pb-10 md:pb-12">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-center">
                                    {/* Left Column: Exact banner typography & spacing (no logo, no hover underline) */}
                                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                                        <span
                                            style={{
                                                textDecoration: 'none',
                                                letterSpacing: '0.25em',
                                                color: '#0c4a85',
                                            }}
                                            className="font-sans text-[10px] sm:text-[12px] md:text-[14px] font-bold uppercase mb-3 md:mb-5 block !no-underline"
                                        >
                                            BLACK FRIDAY &nbsp;/&nbsp; WHILE STOCKS LAST
                                        </span>

                                        <div
                                            role="heading"
                                            aria-level={1}
                                            style={{
                                                textDecoration: 'none',
                                                color: '#0c4a85',
                                                lineHeight: 1.06,
                                                letterSpacing: '-0.02em',
                                                margin: 0,
                                            }}
                                            className="font-sans text-[2.2rem] sm:text-[3rem] md:text-[3.6rem] xl:text-[4.25rem] font-extrabold mb-3 md:mb-6 !no-underline"
                                        >
                                            Shower glass,
                                            <br />
                                            marked down.
                                        </div>

                                        <div
                                            style={{
                                                textDecoration: 'none',
                                                color: '#0c4a85',
                                                letterSpacing: '0.03em',
                                            }}
                                            className="font-sans text-[1.25rem] sm:text-[1.5rem] md:text-[1.85rem] font-extrabold uppercase mb-1.5 md:mb-2 !no-underline"
                                        >
                                            NOW FROM R1 200
                                        </div>

                                        <div
                                            style={{
                                                textDecoration: 'none',
                                                letterSpacing: '0.2em',
                                                color: '#4b5563',
                                            }}
                                            className="font-sans text-[8.5px] sm:text-[9.5px] md:text-[10.5px] font-medium uppercase mb-5 md:mb-8 !no-underline"
                                        >
                                            PIVOT DOORS, SHOWER SCREENS AND BATH SCREENS. SUPPLY ONLY.
                                        </div>

                                        <span
                                            style={{
                                                textDecoration: 'none',
                                                backgroundColor: '#0c4a85',
                                                color: '#ffffff',
                                                letterSpacing: '0.24em',
                                            }}
                                            className="inline-block font-sans text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase px-7 sm:px-9 py-3.5 sm:py-4 transition-opacity hover:opacity-90 !no-underline"
                                        >
                                            SHOP THE SALE
                                        </span>
                                    </div>

                                    {/* Right Column: High-Resolution 1520x1020 composite matching exact original spacing */}
                                    <div className="lg:col-span-7 flex items-center justify-center">
                                        <img
                                            src="/images/black-friday-showers-hires.jpg"
                                            alt="Black Friday Sale — Semi-frameless Pivot Door, Pivot Door with Return Panel, and Single Bath Screen"
                                            loading="eager"
                                            fetchPriority="high"
                                            className="w-full max-w-[460px] sm:max-w-[560px] lg:max-w-none max-h-[220px] sm:max-h-[280px] md:max-h-[420px] lg:max-h-[540px] object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                }

                return (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
                            isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ willChange: 'opacity' }}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            fetchPriority={index === 0 ? 'high' : 'auto'}
                            className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${
                                isActive ? 'scale-105' : 'scale-100'
                            }`}
                            style={{
                                willChange: 'transform',
                                backfaceVisibility: 'hidden',
                                transform: 'translateZ(0)',
                            }}
                        />
                        {/* Modern subtle overlay */}
                        <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                );
            })}

            {/* Content Container (Only for standard photographic slides) */}
            {!activeSlide.isBlackFridayBanner && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 animate-fade-in-up">
                    <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                        <span className="uppercase tracking-[0.3em] mb-4 block text-xs font-semibold text-white/90 text-center">
                            {activeSlide.label}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-[7rem] font-bold text-white mb-6 tracking-tight leading-none drop-shadow-md">
                            {activeSlide.title}
                        </h1>
                        <p className="font-sans text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed transition-all duration-700 text-center translate-y-[-1rem]">
                            {activeSlide.subtitle}
                        </p>
                        <div className="flex justify-center w-full mt-10">
                            <Link
                                to={activeSlide.url}
                                style={{ color: '#14294f' }}
                                className="inline-block bg-white px-12 py-5 text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-primary hover:no-underline transition-all duration-500 shadow-2xl"
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#14294f')}
                            >
                                {activeSlide.buttonText}
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Dots */}
            <div className="absolute bottom-6 md:bottom-12 left-0 right-0 z-20 flex justify-center gap-4">
                {SLIDES.map((_, index) => {
                    const isSelected = index === currentSlide;
                    const dotColorClass = activeSlide.isBlackFridayBanner
                        ? isSelected
                            ? 'w-12 bg-[#0c4a85]'
                            : 'w-6 bg-[#0c4a85]/25 group-hover:bg-[#0c4a85]/50'
                        : isSelected
                          ? 'w-12 bg-white'
                          : 'w-6 bg-white/40 group-hover:bg-white/60';

                    return (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className="p-2 -m-2 group cursor-pointer"
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            <div className={`h-1.5 transition-all duration-500 rounded-full ${dotColorClass}`} />
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
