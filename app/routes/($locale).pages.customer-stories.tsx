import { useState } from 'react';

export async function loader() {
    return {};
}

const STORIES = [
    {
        quote: "The attention to detail in their frameless enclosures is unmatched. It completely transformed our master suite into a true sanctuary.",
        author: "Sarah Mitchell",
        location: "Umhlanga Rocks",
        rating: 5
    },
    {
        quote: "Professional, efficient, and a result that exceeded every expectation. The custom mirrors they designed are nothing short of a work of art.",
        author: "David van der Merwe",
        location: "Zimbali Estate",
        rating: 5
    },
    {
        quote: "ShowerHaus was the missing piece in our architectural vision. Their team truly understands what luxury means and how to deliver it.",
        author: "Marcus Thorne",
        location: "Steyn City",
        rating: 5
    },
    {
        quote: "From the first consultation to final installation, the process was seamless. I wouldn't trust anyone else with my next project.",
        author: "Anita Patel",
        location: "Ballito",
        rating: 5
    },
    {
        quote: "We specified ShowerHaus for our entire development. Consistent quality, on time, every single time. An outstanding supplier.",
        author: "James Fourie",
        location: "Sandton",
        rating: 5
    },
];

export default function CustomerStories() {
    const [active, setActive] = useState(0);
    const story = STORIES[active];

    return (
        <div>


            {/* Carousel */}
            <section className="py-28 bg-[#F9F8F6]">
                <div className="container mx-auto px-6 max-w-5xl">

                    {/* Quote Display */}
                    <div className="text-center mb-20 min-h-[200px] flex flex-col items-center justify-center">
                        {/* Stars */}
                        <div className="flex gap-1 mb-10 justify-center">
                            {Array.from({ length: story.rating }).map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <blockquote className="font-display text-3xl md:text-4xl text-primary leading-tight max-w-3xl mx-auto mb-10">
                            "{story.quote}"
                        </blockquote>
                        <div className="space-y-1">
                            <p className="font-sans text-[12px] font-bold tracking-[0.3em] uppercase text-primary">{story.author}</p>
                            <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest">{story.location}</p>
                        </div>
                    </div>

                    {/* Navigation Dots & Arrows */}
                    <div className="flex items-center justify-center gap-8">
                        <button
                            onClick={() => setActive((active - 1 + STORIES.length) % STORIES.length)}
                            className="w-12 h-12 border border-gray-300 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                            aria-label="Previous"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="flex gap-3">
                            {STORIES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`transition-all duration-300 rounded-full ${i === active ? 'w-8 h-2 bg-primary' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`}
                                    aria-label={`Go to story ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setActive((active + 1) % STORIES.length)}
                            className="w-12 h-12 border border-gray-300 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                            aria-label="Next"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                </div>
            </section>

            {/* Stats Strip */}
            <section className="py-20 bg-white border-t border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { num: '20+', label: 'Years of excellence' },
                            { num: '5,000+', label: 'Projects completed' },
                            { num: '100%', label: 'Client satisfaction' },
                            { num: '4.9★', label: 'Average rating' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="font-display text-4xl md:text-5xl text-primary mb-3">{stat.num}</div>
                                <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
}
