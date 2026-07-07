import { useState, useEffect } from 'react';

const REVIEWS = [
  {
    id: 1,
    text: "I've used Shower Haus across three home renovations over 12 years — every time the service has been fantastic, from technical recommendations through measuring, manufacture and installation. A professional, efficient company, and fantastic value for superb quality.",
    author: "Ian Williams, Umhlanga",
    source: "Verified Google review"
  },
  {
    id: 2,
    text: "I asked Shower Haus for a frameless shower door. Within a day, someone came out to measure; I had a quote shortly after, and my glass was installed within a week. The team was highly professional and even wore shoe covers to keep the place clean. I'd highly recommend them.",
    author: "Happy Customer, Durban",
    source: "Verified Google review"
  },
  {
    id: 3,
    text: "Excellent service from start to finish. The team was very professional, on time and the final product is stunning. Will definitely use them again for my next bathroom renovation.",
    author: "Sarah Jenkins, Ballito",
    source: "Verified Google review"
  }
];

export function ReviewCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % REVIEWS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-[350px] md:h-[280px]">
      <div className="overflow-hidden w-full relative h-full flex flex-col justify-center items-center">
        {REVIEWS.map((review, idx) => (
          <div
            key={review.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col justify-center items-center ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="text-[#1C4E86] text-xl tracking-[0.3em] mb-6">★★★★★</div>
            <p className="font-display text-xl md:text-2xl lg:text-3xl text-primary font-light leading-relaxed text-center mb-8 px-4">
              "{review.text}"
            </p>
            <div className="text-[11px] tracking-[0.25em] text-primary font-bold text-center uppercase">
              {review.author}
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute -bottom-12 left-0 right-0 z-20 flex justify-center gap-3">
        {REVIEWS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="p-2 -m-2 group cursor-pointer"
            aria-label={`Go to review ${index + 1}`}
          >
            <div className={`h-2 transition-all duration-300 rounded-full ${
              index === current ? 'w-10 bg-primary' : 'w-4 bg-gray-300 group-hover:bg-gray-400'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}
