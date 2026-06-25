import { useState } from 'react';

export async function loader() {
    return {};
}

const STORIES = [
    {
        quote: "Excellent service from Martyn and the team. From the enquiry to completion, a seamless job, well done with great value, the best service delivered promptly. Shower Haus lives up to the great reputation built over many years.",
        author: "Rehna Wollentine",
        location: "Google Review",
        rating: 5
    },
    {
        quote: "We just recently bought 4 shower doors and received an exceptional service from the Shower Haus team. The staff at the shop, the advice from technician taking measurements and the installers was super. I would highly recommend them for great quality, exceptional service and quick turnaround time.",
        author: "Mxolisi Phiri",
        location: "Google Review",
        rating: 5
    },
    {
        quote: "I'm really impressed with the sales and installation team at Shower Haus. The quality of the product is excellent and functional. Brandon and Pierre are knowledgeable, experienced and friendly installers while the sales person Clinton provided the best advice and was very punctual. I had cheaper quotes but when I looked at the reviews and unprofessional suggestions, I changed my mind. Well done Shower Haus",
        author: "jayan pillay",
        location: "Google Review",
        rating: 5
    },
    {
        quote: "Friendly staff with honest advice was experience here. I went in looking for a roller replacement for a corner shower unit which they offer and recieved good advice from the staff. They have shower units and mirrors as their primary material for sale with replacement wheels and rollers for shower door as well.",
        author: "Ashley Parbhoo",
        location: "Google Review",
        rating: 4
    },
    {
        quote: "I just wanted to take a moment to compliment your team on their professionalism. It's rare these days to come across a company that conducts itself with such high standards. Well done to you and your team — truly impressive.",
        author: "Annelize Jacobs",
        location: "Google Review",
        rating: 5
    }
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {[
                            { num: '22+', label: 'Years of excellence' },
                            { num: '10 000+', label: 'Showers installed' },
                            { num: '4.3★', label: 'Google rating' },
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
