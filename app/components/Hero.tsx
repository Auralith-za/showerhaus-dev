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
        image: '/images/black-friday-hero.jpg',
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
            className={`relative flex flex-col items-center justify-center h-[600px] md:h-[800px] w-full overflow-hidden transition-colors duration-700 ${
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
                            className={`absolute inset-0 z-10 flex items-center bg-white transition-opacity duration-1000 ease-in-out cursor-pointer hover:no-underline ${
                                isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                            }`}
                            style={{ willChange: 'opacity' }}
                        >
                            <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1440px] w-full py-10 md:py-0">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
                                    {/* Left Column: Razor-sharp native vector typography & logo */}
                                    <div className="lg:col-span-5 flex flex-col items-start text-left">
                                        <img
                                            src="/logo.png"
                                            alt="Shower Haus"
                                            className="h-10 md:h-12 w-auto object-contain mb-6 md:mb-8"
                                        />
                                        <span className="font-sans text-[11px] md:text-[13px] font-bold tracking-[0.28em] uppercase text-[#0c4a85] mb-4 block">
                                            BLACK FRIDAY &nbsp;/&nbsp; WHILE STOCKS LAST
                                        </span>
                                        <h1 className="font-sans text-4xl sm:text-5xl md:text-[3.5rem] xl:text-[4rem] font-extrabold text-[#0c4a85] tracking-tight leading-[1.05] mb-5">
                                            Shower glass,
                                            <br />
                                            marked down.
                                        </h1>
                                        <p className="font-sans text-xl md:text-2xl font-extrabold tracking-wide uppercase text-[#0c4a85] mb-2">
                                            NOW FROM R1 200
                                        </p>
                                        <p className="font-sans text-[9.5px] md:text-[10.5px] font-medium tracking-[0.22em] uppercase text-gray-500 mb-7 md:mb-9">
                                            PIVOT DOORS, SHOWER SCREENS AND BATH SCREENS. SUPPLY ONLY.
                                        </p>
                                        <span className="inline-block bg-[#0c4a85] hover:bg-[#14294f] text-white font-sans text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase px-8 py-4 transition-colors shadow-sm">
                                            SHOP THE SALE
                                        </span>
                                    </div>

                                    {/* Right Column: High-Resolution 2000x2000px Shopify CDN Product Renders */}
                                    <div className="lg:col-span-7 grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 items-end justify-items-center">
                                        <div className="w-full flex items-end justify-center">
                                            <img
                                                src="https://cdn.shopify.com/s/files/1/0961/8528/6960/files/sf-pivot-door_compressed.jpg?v=1795436374&width=1000"
                                                alt="Semi-frameless Pivot Shower Door"
                                                loading="eager"
                                                fetchPriority="high"
                                                className="w-full max-h-[220px] sm:max-h-[320px] md:max-h-[440px] lg:max-h-[500px] object-contain"
                                            />
                                        </div>
                                        <div className="w-full flex items-end justify-center">
                                            <img
                                                src="https://cdn.shopify.com/s/files/1/0961/8528/6960/files/sf-pivot-door-and-return_square_compressed.jpg?v=1793867033&width=1000"
                                                alt="Semi-frameless Pivot Shower Door with Return Panel"
                                                loading="eager"
                                                fetchPriority="high"
                                                className="w-full max-h-[230px] sm:max-h-[340px] md:max-h-[460px] lg:max-h-[520px] object-contain"
                                            />
                                        </div>
                                        <div className="w-full flex items-end justify-center">
                                            <img
                                                src="https://cdn.shopify.com/s/files/1/0961/8528/6960/files/sf-bathscreen-whitescreen_square_compressed.jpg?v=1794305502&width=900"
                                                alt="Semi-frameless Single Bath Screen"
                                                loading="eager"
                                                className="w-full max-h-[160px] sm:max-h-[240px] md:max-h-[320px] lg:max-h-[360px] object-contain"
                                            />
                                        </div>
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
            <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center gap-4">
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
