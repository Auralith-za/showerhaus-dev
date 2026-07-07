import { useState } from 'react';
import { Link } from 'react-router';
import { ReviewCarousel } from '~/components/ReviewCarousel';

export function meta() {
  return [
    { title: 'Frameless Shower Enclosures & Doors | Shower Haus' },
    {
      name: 'description',
      content:
        "Individually measured, high-quality frameless shower enclosures in Durban & KwaZulu-Natal. Clean lines, more light, and premium safety glass.",
    },
  ];
}

interface GalleryItem {
  id: number;
  location: string;
  category: string;
  image: string;
}

export default function FramelessShowersLanding() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const galleryItems: GalleryItem[] = [
    { id: 1, location: 'Umhlanga · walk-in', category: 'walk-in', image: '/images/hero-1.png' },
    { id: 2, location: 'Ballito · corner', category: 'corner', image: '/images/hero-2.png' },
    { id: 3, location: 'Hillcrest · alcove', category: 'alcove', image: '/images/hero-3.png' },
    { id: 4, location: 'Durban N · over-bath', category: 'over-bath', image: '/images/about-us-hero.png' },
    { id: 5, location: 'Kloof · walk-in', category: 'walk-in', image: '/images/about-us-narrative.png' },
    { id: 6, location: 'Westville · corner', category: 'corner', image: '/images/engage-home.png' },
    { id: 7, location: 'Umhlanga · pentagonal', category: 'curved', image: '/images/engage-online.png' },
    { id: 8, location: 'La Lucia · alcove', category: 'alcove', image: '/images/engage-showroom.jpeg' },
    { id: 9, location: 'Gillitts · walk-in', category: 'walk-in', image: '/images/free-consultation.jpg' },
    { id: 10, location: 'Ballito · corner', category: 'corner', image: '/images/contact-us.jpg' },
    { id: 11, location: 'Morningside · over-bath', category: 'over-bath', image: '/images/stabilisers-blog.jpeg' },
    { id: 12, location: 'Durban N · curved', category: 'curved', image: '/images/what-your-shower-is-actually-called.jpeg' },
  ];

  const filters = ['all', 'corner', 'alcove', 'walk-in', 'over-bath', 'curved'];

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="font-sans text-[#47505F] bg-[#FFFFFF] antialiased">
      {/* 1. HERO */}
      <section className="relative p-0 -mt-[1px] z-10">
        <div
          className="relative h-[680px] flex items-center bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-2.png')",
          }}
        >
          <div className="absolute inset-0 bg-black/45"></div>
          <div className="relative max-w-[1180px] w-full mx-auto px-6 md:px-14">
            <div className="max-w-[760px] text-white flex flex-col items-start">
              <span className="uppercase tracking-[0.3em] mb-5 block text-xs font-semibold text-white/90 text-left">
                Frameless Shower Enclosures
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-bold text-white mb-6 tracking-tight leading-none text-left drop-shadow-md">
                Frameless showers,<br />made to fit your space.
              </h1>
              <p className="font-sans text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-light leading-relaxed text-left">
                Frameless shower enclosures — individually measured, made to your exact dimensions and installed properly, across KwaZulu-Natal.
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-10 mb-12">
                <Link
                  to="/pages/design-your-shower"
                  className="inline-block bg-white !text-[#14294f] hover:!text-white hover:bg-[#14294f] hover:no-underline px-12 py-5 text-[10px] tracking-[0.3em] font-bold uppercase transition-all duration-500 shadow-2xl rounded-none text-center"
                >
                  Design Your Shower →
                </Link>
                <a
                  href="#gallery"
                  className="text-[10px] tracking-[0.3em] font-bold uppercase text-white hover:text-white/80 transition-colors underline underline-offset-8"
                >
                  See our work ↓
                </a>
              </div>
              <p className="text-[13px] tracking-wider text-white/70 mt-6 block">
                Book a home measure ·{' '}
                <a href="tel:0313129095" className="text-white hover:underline">
                  Call 031 312 9095
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* trust strip */}
        <div className="bg-[#17233D] flex justify-center py-4 px-6">
          <div className="flex flex-wrap justify-center max-w-[1280px] w-full text-center text-[#C4CBD7] text-[12.5px] tracking-wider uppercase font-semibold">
            <div className="flex-1 min-w-[230px] py-2 md:border-r border-white/10">
              OVER 30,000 SHOWERS INSTALLED
            </div>
            <div className="flex-1 min-w-[230px] py-2 md:border-r border-white/10">
              Frameless specialists
            </div>
            <div className="flex-1 min-w-[230px] py-2 md:border-r border-white/10">
              WORKMANSHIP GUARANTEED
            </div>
            <div className="flex-1 min-w-[230px] py-2">
              Accredited &amp; insured
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY FRAMELESS */}
      <section className="max-w-[1180px] mx-auto py-24 px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-[12px] tracking-[0.3em] text-[#1C4E86] font-semibold mb-4 uppercase">
            Why Frameless
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-8 leading-tight tracking-tight">
            Clean lines. More light.
          </h2>
          <div className="flex flex-col">
            {[
              {
                title: 'More light and space',
                desc: 'Without bulky frames, a frameless shower opens up the room and shows off your tiling.',
              },
              {
                title: 'Minimal hardware',
                desc: 'Slim hinges and clamps instead of an aluminium framework.',
              },
              {
                title: 'Easier to keep clean',
                desc: "Fewer frames and tracks to trap water and grime.",
              },
              {
                title: 'Made to measure',
                desc: 'Every frameless shower is individually measured and made to your space.',
                link: '#process',
              },
              {
                title: 'Toughened safety glass',
                desc: '6–10 mm tempered glass for your safety and compliance.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-5 py-5 ${
                  idx < 4 ? 'border-b border-[#EDE9DF]' : ''
                }`}
              >
                <span className="text-[#1C4E86] text-xl font-bold leading-none">◇</span>
                <div>
                  <h3 className="text-[17px] text-[#17233D] font-bold mb-1.5">{item.title}</h3>
                  <p className="text-[14.5px] leading-relaxed text-[#5C6572]">
                    {item.desc}{' '}
                    {item.link && (
                      <a href={item.link} className="text-[#1C4E86] font-semibold underline">
                        How it works →
                      </a>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[600px] w-full overflow-hidden bg-[#F1F0ED] rounded flex items-center justify-center">
          <img
            src="/images/about-us-narrative.png"
            alt="Bright bathroom design with frameless shower"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="relative font-mono text-[11px] tracking-wider text-[#8A8474] bg-white/80 px-3 py-1.5 rounded uppercase">
            Bright frameless install
          </span>
        </div>
      </section>

      {/* 3. PROJECT GALLERY */}
      <section id="gallery" className="bg-[#F1F0ED] py-24 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-[640px] mx-auto mb-11">
            <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
              Our Work
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5 leading-tight tracking-tight">
              Frameless showers we've installed.
            </h2>
            <div className="w-[70px] h-[1px] bg-[#C6CBCE] mx-auto mb-5"></div>
            <p className="text-[16px] text-[#5C6572]">
              A selection of real installations across KwaZulu-Natal. Filter by configuration to find something like your space.
            </p>
          </div>

          {/* filter chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-[12px] tracking-widest uppercase px-5 py-2.5 rounded-sm font-semibold border transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-[#17233D] text-white border-[#17233D]'
                    : 'bg-white text-[#17233D] border-[#DED8CB] hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Grid of gallery items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => setLightboxImage(item.image)}
                className="relative h-[280px] bg-cover bg-center border border-[#DED8CB] flex items-end p-4 rounded-sm group cursor-pointer overflow-hidden shadow-sm"
                style={{ backgroundImage: `url('${item.image}')` }}
              >
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white/90 text-[#17233D] text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-sm">
                    View Photo
                  </span>
                </div>
                {/* <span className="relative font-mono text-[10px] text-white bg-black/45 px-2 py-1 rounded">
                  {item.location}
                </span> */}
              </div>
            ))}
          </div>

          {/* Photo lightbox modal */}
          {lightboxImage && (
            <div
              className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
              onClick={() => setLightboxImage(null)}
            >
              <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
                <img
                  src={lightboxImage}
                  alt="Enlarged installation"
                  className="max-w-full max-h-full object-contain rounded"
                />
                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute -top-10 right-0 text-white text-3xl font-light hover:opacity-70 focus:outline-none cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-14 pb-12 md:pb-0">
            <Link
              to="/pages/design-your-shower"
              className="inline-block bg-primary text-white hover:bg-secondary transition-all duration-300 px-10 py-5 text-[10px] tracking-[0.3em] font-bold uppercase rounded-none text-center"
            >
              Design Your Shower →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CONFIGURATIONS */}
      <section className="max-w-[1280px] mx-auto py-24 px-6">
        <div className="text-center max-w-[640px] mx-auto mb-14">
          <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
            Configurations
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5 leading-tight tracking-tight">
          Frameless, in the shape of your bathroom.
          </h2>
          <div className="w-[70px] h-[1px] bg-[#C6CBCE] mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(() => {
            const layouts = [
              { 
                title: 'Shower screen', 
                desc: 'A single fixed glass panel: open, walk-in, no door.', 
                gradient: 'linear-gradient(135deg, #dbe4ff 0%, #c3d4ff 100%)',
                svg: (
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary opacity-75" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20,20 L20,80 L80,80" stroke="#cbd5e1" strokeWidth="2" />
                    <path d="M20,80 L80,80" stroke="currentColor" strokeWidth="3" />
                  </svg>
                )
              },
              { 
                title: 'Door between 2 walls', 
                desc: 'A single door fitted into a recess between two walls (alcove).', 
                gradient: 'linear-gradient(135deg, #fdfbf7 0%, #efeae1 100%)',
                svg: (
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary opacity-75" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20,20 L20,80 L80,80 L80,20" stroke="#cbd5e1" strokeWidth="2" />
                    <path d="M20,20 L40,20" stroke="currentColor" strokeWidth="3" />
                    <path d="M40,20 A40,40 0 0 1 80,60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M40,20 L80,60" stroke="currentColor" strokeWidth="3" />
                  </svg>
                )
              },
              { 
                title: 'Door and 1 panel', 
                desc: 'A door with one fixed panel alongside, for a wider or returned opening.', 
                gradient: 'linear-gradient(135deg, #e3ebf3 0%, #c8d7e6 100%)',
                svg: (
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary opacity-75" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20,20 L20,80 L80,80" stroke="#cbd5e1" strokeWidth="2" />
                    <path d="M20,80 L80,80 L80,45" stroke="currentColor" strokeWidth="3" />
                    <path d="M80,45 A45,45 0 0 0 35,20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M80,45 L35,20" stroke="currentColor" strokeWidth="3" />
                  </svg>
                )
              },
              { 
                title: 'Door and 2 panels', 
                desc: 'A door with two fixed panels, for wider runs or corner layouts.', 
                gradient: 'linear-gradient(135deg, #d8efff 0%, #b3e0ff 100%)',
                svg: (
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary opacity-75" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20,20 L20,80 L80,80" stroke="#cbd5e1" strokeWidth="2" />
                    <path d="M20,80 L80,80 L80,50" stroke="currentColor" strokeWidth="3" />
                    <path d="M20,20 L20,40" stroke="currentColor" strokeWidth="3" />
                    <path d="M20,40 A40,40 0 0 1 60,80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M20,40 L60,80" stroke="currentColor" strokeWidth="3" />
                  </svg>
                )
              },
              { 
                title: 'Corner entry', 
                desc: 'Panels that meet in the corner, with the entrance on the corner.', 
                gradient: 'linear-gradient(135deg, #d9fce1 0%, #b5f5c4 100%)',
                svg: (
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary opacity-75" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20,20 L20,80 L80,80" stroke="#cbd5e1" strokeWidth="2" />
                    <path d="M20,80 L20,45" stroke="currentColor" strokeWidth="3" />
                    <path d="M55,80 L80,80" stroke="currentColor" strokeWidth="3" />
                    <path d="M26,45 L26,70 M70,74 L45,74" stroke="currentColor" strokeWidth="3" opacity="0.5" />
                    <path d="M26,60 L26,65 L30,61 M60,74 L65,74 L61,70" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )
              },
              { 
                title: 'Pentagonal', 
                desc: 'A five-sided corner enclosure with an angled front; space-saving in smaller bathrooms.', 
                gradient: 'linear-gradient(135deg, #fff9cc 0%, #fff299 100%)',
                svg: (
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary opacity-75" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20,20 L20,80 L80,80" stroke="#cbd5e1" strokeWidth="2" />
                    <path d="M20,80 L20,40" stroke="currentColor" strokeWidth="3" />
                    <path d="M60,80 L80,80" stroke="currentColor" strokeWidth="3" />
                    <path d="M20,40 L60,80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M20,40 L70,30" stroke="currentColor" strokeWidth="3" />
                  </svg>
                )
              },
              { 
                title: 'Sliding door', 
                desc: 'A sliding glass door, ideal where there\'s no room for a door to swing out.', 
                gradient: 'linear-gradient(135deg, #fbe8ff 0%, #f6d1ff 100%)',
                svg: (
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary opacity-75" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20,20 L20,80 L80,80 L80,20" stroke="#cbd5e1" strokeWidth="2" />
                    <path d="M20,20 L55,20" stroke="currentColor" strokeWidth="3" />
                    <path d="M45,26 L80,26" stroke="currentColor" strokeWidth="3" opacity="0.5" />
                    <path d="M49,26 L42,26 L45,23 M42,26 L45,29" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )
              },
              { 
                title: 'Other', 
                desc: 'An unusual space? Tell us the details and we\'ll design for it.', 
                gradient: 'linear-gradient(135deg, #f0f3f7 0%, #e1e7ee 100%)',
                svg: (
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary opacity-75" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M25,75 C25,20 75,20 80,55 C85,85 45,95 25,75 Z" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" />
                    <circle cx="55" cy="55" r="3" fill="currentColor" />
                  </svg>
                )
              },
            ];

            return layouts.map((item, idx) => (
              <div key={idx} className="border border-[#E7E3DA] rounded-sm overflow-hidden bg-white shadow-sm flex flex-col h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="h-[180px] relative flex items-center justify-center overflow-hidden" style={{ background: item.gradient }}>
                  <div className="absolute inset-0 opacity-10 bg-black/5" />
                  <div className="relative z-10 transform scale-[1.3]">{item.svg}</div>
                </div>
                <div className="p-6 flex-1">
                  <h3 className="text-[16px] text-[#17233D] font-bold mb-2">{item.title}</h3>
                  <p className="text-[13.5px] leading-relaxed text-[#5C6572]">{item.desc}</p>
                </div>
              </div>
            ));
          })()}
        </div>
          <div className="text-center mt-16 pb-12 md:pb-0">
            <Link
              to="/pages/design-your-shower"
              className="inline-block bg-primary text-white hover:bg-secondary transition-all duration-300 px-10 py-5 text-[10px] tracking-[0.3em] font-bold uppercase rounded-none text-center"
            >
              Design Your Shower →
            </Link>
          </div>
      </section>

      {/* 5. HARDWARE FINISHES */}
      <section className="bg-[#F1F0ED] py-24 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
              Hardware Finishes
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5 leading-tight tracking-tight">
              Finish it your way.
            </h2>
            <div className="w-[70px] h-[1px] bg-[#C6CBCE] mx-auto mb-5"></div>
            <p className="text-[16px] text-[#5C6572]">
              A choice of hardware finishes to match the rest of your bathroom
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: 'Polished stainless', grad: 'linear-gradient(145deg, #EDEDED, #B9BDC2)' },
              { name: 'Chrome', grad: 'linear-gradient(145deg, #F4F6F8, #C7CDD3)' },
              { name: 'Brushed stainless', grad: 'linear-gradient(145deg, #D8D8D6, #A9ADB0)' },
              { name: 'Satin gold', grad: 'linear-gradient(145deg, #E8D9A8, #B79A5C)' },
              { name: 'Antique brass', grad: 'linear-gradient(145deg, #B79B6E, #7C633C)' },
              { name: 'Black', grad: 'linear-gradient(145deg, #3E4247, #17181A)' },
            ].map((finish, idx) => (
              <div key={idx} className="text-center flex flex-col items-center">
                <div
                  className="w-24 h-24 rounded-full border border-gray-300 shadow-inner mb-4 transition-transform duration-300 hover:scale-105"
                  style={{ background: finish.grad }}
                />
                <div className="text-[12px] font-semibold tracking-wider text-[#17233D] uppercase">
                  {finish.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GLASS OPTIONS */}
      <section className="max-w-[1180px] mx-auto py-24 px-6">
        <div className="text-center max-w-[640px] mx-auto mb-14">
          <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
            Glass
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5 leading-tight tracking-tight">
            Choose your glass.
          </h2>
          <div className="w-[70px] h-[1px] bg-[#C6CBCE] mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: 'Clear',
              desc: 'The standard: bright and neutral.',
              style: { background: 'linear-gradient(135deg, rgba(230, 238, 240, 0.65), rgba(200, 214, 218, 0.55))' },
            },
            {
              title: 'Low-iron (Opti-white)',
              desc: 'Removes the faint green tint of ordinary glass for true clarity.',
              style: { background: 'linear-gradient(135deg, rgba(240, 244, 242, 0.8), rgba(216, 226, 222, 0.6))' },
            },
            {
              title: 'Obscure',
              desc: 'A textured privacy glass that lets light through while hiding detail.',
              style: { background: 'repeating-linear-gradient(90deg, rgba(220, 226, 224, 0.7), rgba(220, 226, 224, 0.7) 3px, rgba(238, 242, 240, 0.7) 3px, rgba(238, 242, 240, 0.7) 6px)' },
            },
            {
              title: 'Reeded',
              desc: 'Vertical fluted lines: on-trend texture with a degree of privacy.',
              style: { background: 'repeating-linear-gradient(90deg, rgba(206, 214, 212, 0.85), rgba(206, 214, 212, 0.85) 6px, rgba(236, 240, 238, 0.85) 6px, rgba(236, 240, 238, 0.85) 12px)' },
            },
            {
              title: 'Grey reeded',
              desc: 'The same fluted texture in a soft grey tone.',
              style: { background: 'repeating-linear-gradient(90deg, rgba(176, 182, 184, 0.9), rgba(176, 182, 184, 0.9) 6px, rgba(206, 212, 214, 0.9) 6px, rgba(206, 212, 214, 0.9) 12px)' },
            },
            {
              title: 'Satinato',
              desc: 'A smooth, matt, acid-etched finish for full privacy.',
              style: { background: 'linear-gradient(135deg, rgba(228, 230, 229, 0.95), rgba(210, 214, 213, 0.95))' },
            },
          ].map((glass, idx) => (
            <div key={idx} className="border border-[#E7E3DA] rounded-sm overflow-hidden flex flex-col h-full shadow-sm bg-white">
              <div className="h-[150px]" style={glass.style} />
              <div className="p-6 flex-1">
                <h3 className="text-[16px] text-[#17233D] font-bold mb-2">{glass.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-[#5C6572]">{glass.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[15px] text-[#5C6572] text-center mt-8">
          Thickness: <strong className="text-[#17233D]">6, 8, or 10 mm</strong> toughened safety glass, to suit the design.
        </p>
      </section>

      {/* 7. INSTAGRAM */}
      <section className="bg-[#F1F0ED] py-24 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-[640px] mx-auto mb-11">
            <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
              @showerhaussa
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-4">
              See more on Instagram.
            </h2>
            <p className="text-[16px] text-[#5C6572]">
              Fresh installs and work in progress from our team.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="aspect-square bg-cover bg-center border border-[#DED8CB] rounded-sm" style={{ backgroundImage: "url('/images/hero-3.png')" }}></div>
            <div className="aspect-square bg-cover bg-center border border-[#DED8CB] rounded-sm" style={{ backgroundImage: "url('/images/free-consultation.jpg')" }}></div>
            <div className="aspect-square bg-cover bg-center border border-[#DED8CB] rounded-sm" style={{ backgroundImage: "url('/images/about-us-hero.png')" }}></div>
            <div className="aspect-square bg-cover bg-center border border-[#DED8CB] rounded-sm" style={{ backgroundImage: "url('/images/engage-showroom.jpeg')" }}></div>
            <div className="aspect-square bg-cover bg-center border border-[#DED8CB] rounded-sm" style={{ backgroundImage: "url('/images/engage-home.png')" }}></div>
            <div className="aspect-square bg-cover bg-center border border-[#DED8CB] rounded-sm" style={{ backgroundImage: "url('/images/contact-us.jpg')" }}></div>
          </div>
          <div className="text-center mt-12 pb-12 md:pb-0">
            <a
              href="https://instagram.com/showerhaussa"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-primary text-white hover:bg-secondary transition-all duration-300 px-10 py-5 text-[10px] tracking-[0.3em] font-bold uppercase rounded-none text-center"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                <circle cx="12" cy="12" r="4"></circle>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle>
              </svg>
              Follow @showerhaussa
            </a>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS / PROCESS */}
      <section id="process" className="max-w-[1180px] mx-auto py-24 px-6">
        <div className="text-center max-w-[640px] mx-auto mb-14">
          <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
            Made to Measure
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5 leading-tight tracking-tight">
            From your bathroom to a finished frameless shower.
          </h2>
          <div className="w-[70px] h-[1px] bg-[#C6CBCE] mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center sm:text-left">
            <div className="w-[52px] h-[52px] rounded-full bg-[#17233D] text-white flex items-center justify-center text-lg font-semibold mb-5 mx-auto sm:mx-0">
              1
            </div>
            <h3 className="text-[18px] text-[#17233D] font-bold mb-3">Measure &amp; quote</h3>
            <p className="text-[14.5px] leading-relaxed text-[#5C6572]">
              A specialist visits to measure accurately — usually within 2–3 working days — then we prepare a design and a clear, itemised quote to your specification. Consultations within 50 km of our showroom are free.
            </p>
          </div>
          <div className="text-center sm:text-left">
            <div className="w-[52px] h-[52px] rounded-full bg-[#17233D] text-white flex items-center justify-center text-lg font-semibold mb-5 mx-auto sm:mx-0">
              2
            </div>
            <h3 className="text-[18px] text-[#17233D] font-bold mb-3">Manufacture</h3>
            <p className="text-[14.5px] leading-relaxed text-[#5C6572]">
              Your enclosure is made to your exact measurements, with a typical lead time of 10–12 working days from your deposit.
            </p>
          </div>
          <div className="text-center sm:text-left">
            <div className="w-[52px] h-[52px] rounded-full bg-[#17233D] text-white flex items-center justify-center text-lg font-semibold mb-5 mx-auto sm:mx-0">
              3
            </div>
            <h3 className="text-[18px] text-[#17233D] font-bold mb-3">Install</h3>
            <p className="text-[14.5px] leading-relaxed text-[#5C6572]">
              Our technicians fit it properly — aligned, sealed and finished — backed by a three-month workmanship guarantee against leaks.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-8 mt-14 pt-9 border-t border-[#EDE9DF]">
          <span className="text-[14.5px] text-[#5C6572] font-medium">
            Fully accredited and insured — members of AAAMSA and SAGGA.
          </span>
          <Link
            to="/pages/custom-made-showers"
            className="text-[13px] tracking-wider text-[#1C4E86] font-bold uppercase underline underline-offset-4 hover:opacity-80"
          >
            See the full process →
          </Link>
        </div>

        <div className="text-center mt-16 pb-12 md:pb-0">
          <Link
            to="/pages/design-your-shower"
            className="inline-block bg-primary text-white hover:bg-secondary transition-all duration-300 px-10 py-5 text-[10px] tracking-[0.3em] font-bold uppercase rounded-none text-center"
          >
            Design Your Shower →
          </Link>
        </div>
      </section>

      {/* 9. SOCIAL PROOF */}
      <section className="w-full bg-[#F1F0ED] py-24 px-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-[1180px] mx-auto">
          <div className="text-center w-full max-w-[640px] mx-auto mb-14">
            <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
              Customer Stories
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5 leading-tight tracking-tight">
              Trusted across KwaZulu-Natal.
            </h2>
            <div className="w-[70px] h-[1px] bg-[#C6CBCE] mx-auto"></div>
          </div>
          <ReviewCarousel />
          <p className="text-center text-[15px] text-[#17233D] font-medium mt-16 tracking-wide">
            <span className="text-[#1C4E86] tracking-wider mr-1">★★★★★</span> 4.3 on Google · Over 100+ reviews
          </p>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="max-w-[920px] mx-auto py-24 px-6">
        <div className="text-center mb-14">
          <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
            Questions
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5">
            Frameless shower questions, answered.
          </h2>
          <div className="w-[70px] h-[1px] bg-[#C6CBCE] mx-auto"></div>
        </div>
        <div className="border-t border-[#E3DED2]">
          {[
            {
              q: 'What is a frameless shower?',
              a: 'A frameless shower uses toughened safety glass held by minimal hardware — slim hinges and clamps — rather than a full aluminium frame. The result is a clean, open look that makes the most of light and space.',
            },
            {
              q: 'Frameless, semi-frameless or framed — what\'s the difference?',
              a: (
                <span>
                  Frameless uses thick 8–10mm glass with minimal hardware. Semi-frameless keeps framing on some edges for support with open glass elsewhere. Framed has a full profile around the panels and door.{' '}
                  <Link to="/pages/custom-made-showers" className="text-[#1C4E86] font-semibold underline underline-offset-2">
                    Compare styles on our Custom-made Showers page →
                  </Link>
                </span>
              ),
            },
            {
              q: 'Do frameless showers leak?',
              a: 'Installed correctly, no. Accurate measurement, the right seals and a level fit keep water where it should be — which is why every frameless shower we fit is individually measured. Our installations carry a three-month workmanship guarantee against leaks.',
            },
            {
              q: 'Are frameless showers more expensive?',
              a: 'Frameless showers are more expensive than semi-frameless or framed options, as they require thicker toughened glass (8-10mm) and high-quality heavy-duty brass or stainless steel hardware to safely support the heavy glass panels.',
            },
            {
              q: 'How thick is the glass? Is it safe?',
              a: 'We use toughened safety glass, usually 8mm or 10mm for frameless designs to guarantee structural stability, rigidity, and safety.',
            },
            {
              q: 'Are frameless showers hard to clean?',
              a: 'The opposite — with fewer frames and tracks, there\'s far less to trap water and grime, so routine cleaning keeps the glass clear.',
            },
            {
              q: 'Can you do sandblasted or etched glass designs?',
              a: 'We don\'t sandblast in-house, but we can arrange it — we work with a trusted specialist nearby and can send your glass out for sandblasting.',
            },
            {
              q: 'Do frameless showers add value to my home?',
              a: 'A well-made frameless shower is a strong selling point in a modern bathroom, thanks to the clean, high-quality finish.',
            },
            {
              q: 'How long does it take?',
              a: 'About 10–12 working days from deposit to installation, depending on the time of year and production workloads at the glass factories.',
            },
            {
              q: 'Do you install across KZN?',
              a: 'Yes — across Durban and KwaZulu-Natal. On-site consultations within roughly 50 km of our Springfield showroom are free; a call-out fee applies further afield. Long-distance installations also attract a surcharge which is individually calculated depending on operational impact the job will have.',
            },
          ].map((item, idx) => (
            <details key={idx} className="group border-b border-[#E3DED2]">
              <summary className="flex justify-between items-center gap-6 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-semibold text-[17px] text-[#17233D] hover:text-[#1C4E86] transition-colors">
                <span>{item.q}</span>
                <span className="text-2xl font-normal text-[#1C4E86] transition-transform duration-300 group-open:rotate-45 leading-none">
                  +
                </span>
              </summary>
              <div className="pb-6 pr-10 text-[15px] leading-relaxed text-[#5C6572]">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="w-full bg-[#17233D] text-[#DDE2EA] py-36 px-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-[1180px] mx-auto flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white mb-6 tracking-tight leading-none">Ready for the right fit?</h2>
          <p className="text-lg md:text-xl text-[#C4CBD7] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Design your frameless shower in a few steps and our team will prepare a tailored quote.
          </p>
          <div className="flex justify-center w-full mt-10 mb-12">
            <Link
              to="/pages/design-your-shower"
              className="inline-block bg-white !text-[#14294f] hover:!text-white hover:bg-[#14294f] hover:no-underline px-12 py-5 text-[10px] tracking-[0.3em] font-bold uppercase transition-all duration-500 shadow-2xl rounded-none text-center"
            >
              Design Your Shower →
            </Link>
          </div>
          <p className="text-[13px] text-[#93A0B2] mt-6 block tracking-wide">
            Book a home measure · Call 031 312 9095 · Visit our showroom
          </p>
        </div>
      </section>
    </div>
  );
}
