import { Link } from 'react-router';
import { ReviewCarousel } from '~/components/ReviewCarousel';

export function meta() {
  return [
    { title: 'Custom-Made Shower Enclosures & Doors | Shower Haus' },
    {
      name: 'description',
      content:
        "Individually measured, custom-made, and professionally installed shower enclosures in Durban & KwaZulu-Natal. Frameless, semi-frameless, and framed designs.",
    },
  ];
}

export default function CustomMadeShowersLanding() {
  return (
    <div className="font-sans text-[#47505F] bg-[#FFFFFF] antialiased">
      {/* 1. HERO */}
      <section className="relative !p-0 -mt-[1px] z-10">
        <div
          className="relative h-[680px] flex items-center justify-center text-center bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-1.png')",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative max-w-[880px] px-6 text-white flex flex-col items-center">
            <span className="uppercase tracking-[0.3em] mb-5 block text-xs font-semibold text-white/90 text-center">
              Custom-Made Shower Enclosures
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-bold text-white mb-6 tracking-tight leading-none text-center drop-shadow-md">
              Made to fit your space.<br />Installed to last.
            </h1>
            <p className="font-sans text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed text-center">
              Custom shower enclosures and shower doors — frameless, semi-frameless, framed and walk-in — measured, made and fitted properly by Durban's shower specialists.
            </p>
            <div className="flex justify-center w-full mt-10 mb-12">
              <Link
                to="/pages/design-your-shower"
                className="inline-block bg-white !text-[#14294f] hover:!text-white hover:bg-[#14294f] hover:no-underline px-12 py-5 text-[10px] tracking-[0.3em] font-bold uppercase transition-all duration-500 shadow-2xl rounded-none text-center"
              >
                Design Your Shower →
              </Link>
            </div>
            <p className="text-[13px] tracking-wider text-white/70 mt-6 block">
              Book a home measure ·{' '}
              <a href="tel:0313129095" className="text-white hover:underline">
                Call 031 312 9095
              </a>
            </p>
          </div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            <span className="w-[30px] h-[3px] bg-white rounded-full"></span>
            <span className="w-2 h-2 rounded-full bg-white/50"></span>
            <span className="w-2 h-2 rounded-full bg-white/50"></span>
          </div>
        </div>

        {/* trust strip */}
        <div className="bg-[#17233D] flex justify-center py-4 px-6">
          <div className="flex flex-wrap justify-center max-w-[1280px] w-full text-center text-[#C4CBD7] text-[12.5px] tracking-wider uppercase font-semibold">
            <div className="flex-1 min-w-[230px] py-2 md:border-r border-white/10">
              Over two decades of installations
            </div>
            <div className="flex-1 min-w-[230px] py-2 md:border-r border-white/10">
              Over 30,000 showers installed
            </div>
            <div className="flex-1 min-w-[230px] py-2 md:border-r border-white/10">
              WORKMANSHIP GUARANTEED
            </div>
            <div className="flex-1 min-w-[230px] py-2">
              Frameless specialists
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROOF STRIP */}
      <section className="w-full bg-[#F1F0ED] py-20 px-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-[1180px] mx-auto flex flex-col items-center justify-center text-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 mb-16">
            <div>
              <div className="text-6xl font-bold text-[#17233D] leading-none">22</div>
              <div className="text-[12px] tracking-[0.24em] text-[#93A0B2] mt-4 uppercase font-semibold">
                Years of excellence
              </div>
            </div>
            <div>
              <div className="text-6xl font-bold text-[#17233D] leading-none">30 000+</div>
              <div className="text-[12px] tracking-[0.24em] text-[#93A0B2] mt-4 uppercase font-semibold">
                Showers installed
              </div>
            </div>
            <div>
              <div className="text-6xl font-bold text-[#17233D] leading-none">
                4.3<span className="text-[#1C4E86]">★</span>
              </div>
              <div className="text-[12px] tracking-[0.24em] text-[#93A0B2] mt-4 uppercase font-semibold">
                Google rating
              </div>
            </div>
          </div>
          <p className="w-full text-[17px] text-[#5C6572] mt-16 max-w-3xl mx-auto leading-relaxed text-center">
            A preferred choice for architects, designers, contractors and homeowners across KwaZulu-Natal.
          </p>
          <p className="w-full text-[13px] tracking-wider text-[#93A0B2] mt-4 text-center max-w-3xl mx-auto">
            60+ years combined technician experience
          </p>
        </div>
      </section>

      {/* 3. VALUE PROP */}
      <section className="max-w-[1180px] mx-auto py-24 px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-[12px] tracking-[0.3em] text-[#1C4E86] font-semibold mb-4 uppercase">
            The Right Fit
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-6 leading-tight tracking-tight">
            Made for your space — not off the shelf.
          </h2>
          <p className="text-[16px] leading-relaxed mb-8 text-[#5C6572]">
            Bathrooms are rarely perfectly square or level, and no two are the same. A custom enclosure is measured and made to the exact dimensions and layout of your space — so it fits properly, seals correctly and looks clean.
            <br /><br />
            Whether you want a frameless shower, a walk-in shower, or a framed enclosure with a hinged or sliding shower door, it's made to the exact dimensions of your space.
            <br /><br />
            We handle the whole job: advice, measuring, manufacture, installation and aftercare. One team is accountable for the result, from the first measurement to the finished shower.
          </p>
          <div className="mt-10 pb-12 md:pb-0">
            <Link
              to="/pages/design-your-shower"
              className="inline-block bg-primary text-white hover:bg-secondary transition-all duration-300 px-10 py-5 text-[10px] tracking-[0.3em] font-bold uppercase rounded-none text-center"
            >
              Design Your Shower →
            </Link>
          </div>
        </div>
        <div className="relative h-[480px] w-full overflow-hidden bg-[#F1F0ED] rounded flex items-center justify-center">
          <img
            src="/images/free-consultation.jpg"
            alt="Technician measuring shower"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 4. STYLES */}
      <section className="bg-[#F1F0ED] py-24 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
              Styles
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5 leading-tight tracking-tight">
              Choose the style that suits your space.
            </h2>
            <div className="w-[70px] h-[1px] bg-[#C6CBCE] mx-auto mb-5"></div>
            <p className="text-[16px] text-[#5C6572]">
              Every enclosure is made to your dimensions. Start with the structural style, then choose your configuration, glass and hardware.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frameless */}
            <div className="relative h-[440px] overflow-hidden rounded group">
              <img
                src="/images/frameless-shower.png"
                alt="Frameless shower enclosure"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-7">
                <h3 className="text-[16px] tracking-[0.2em] text-white font-bold uppercase mb-2">
                  Frameless
                </h3>
                <p className="text-[14px] text-[#E4E8EF] leading-relaxed">
                  Our most popular look — minimal, modern, 8–10 mm toughened glass with metal kept to a minimum.
                </p>
              </div>
            </div>
            {/* Semi-Frameless */}
            <div className="relative h-[440px] overflow-hidden rounded group">
              <img
                src="/images/semi-frameless-shower.jpg"
                alt="Semi-Frameless shower door"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-7">
                <h3 className="text-[16px] tracking-[0.2em] text-white font-bold uppercase mb-2">
                  Semi-Frameless
                </h3>
                <p className="text-[14px] text-[#E4E8EF] leading-relaxed">
                  A balance of structure and clean lines — framing on some edges, open glass elsewhere. Great value for money.
                </p>
              </div>
            </div>
            {/* Framed */}
            <div className="relative h-[440px] overflow-hidden rounded group">
              <img
                src="/images/framed-shower.png"
                alt="Framed shower door"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-7">
                <h3 className="text-[16px] tracking-[0.2em] text-white font-bold uppercase mb-2">
                  Framed
                </h3>
                <p className="text-[14px] text-[#E4E8EF] leading-relaxed">
                  Robust, fully-framed with defined profiles. Durable and well-suited to busy or family bathrooms.
                </p>
              </div>
            </div>
          </div>

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

      {/* 5. WHY */}
      <section className="max-w-[1180px] mx-auto py-24 px-6">
        <div className="text-center max-w-[620px] mx-auto mb-14">
          <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
            Why Shower Haus
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5 leading-tight tracking-tight">
            We do one thing,<br />and we do it properly.
          </h2>
          <div className="w-[70px] h-[1px] bg-[#C6CBCE] mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
          <div className="flex gap-6 py-6 border-b border-[#EDE9DF]">
            <span className="text-[14px] text-[#1C4E86] font-bold min-w-[26px] tracking-widest mt-1">
              01
            </span>
            <div>
              <h3 className="text-[18px] text-[#17233D] font-bold mb-2">Specialist focus</h3>
              <p className="text-[15px] leading-relaxed text-[#5C6572]">
                Showers are all we do, from a single door to a complete enclosure.
              </p>
            </div>
          </div>
          <div className="flex gap-6 py-6 border-b border-[#EDE9DF]">
            <span className="text-[14px] text-[#1C4E86] font-bold min-w-[26px] tracking-widest mt-1">
              02
            </span>
            <div>
              <h3 className="text-[18px] text-[#17233D] font-bold mb-2">Experienced guidance</h3>
              <p className="text-[15px] leading-relaxed text-[#5C6572]">
                Recommendations from real installation experience — the right product for your space, budget and use.
              </p>
            </div>
          </div>
          <div className="flex gap-6 py-6 border-b border-[#EDE9DF]">
            <span className="text-[14px] text-[#1C4E86] font-bold min-w-[26px] tracking-widest mt-1">
              03
            </span>
            <div>
              <h3 className="text-[18px] text-[#17233D] font-bold mb-2">The right fit</h3>
              <p className="text-[15px] leading-relaxed text-[#5C6572]">
                Every enclosure is measured and made to your space, so it fits and works as it should.
              </p>
            </div>
          </div>
          <div className="flex gap-6 py-6 border-b border-[#EDE9DF]">
            <span className="text-[14px] text-[#1C4E86] font-bold min-w-[26px] tracking-widest mt-1">
              04
            </span>
            <div>
              <h3 className="text-[18px] text-[#17233D] font-bold mb-2">
                Installation accountability
              </h3>
              <p className="text-[15px] leading-relaxed text-[#5C6572]">
                We measure, manufacture and install. One team owns the result from start to finish.
              </p>
            </div>
          </div>
          <div className="flex gap-6 py-6 md:col-span-2 md:border-b-0 border-b border-[#EDE9DF]">
            <span className="text-[14px] text-[#1C4E86] font-bold min-w-[26px] tracking-widest mt-1">
              05
            </span>
            <div>
              <h3 className="text-[18px] text-[#17233D] font-bold mb-2">Made to last</h3>
              <p className="text-[15px] leading-relaxed text-[#5C6572]">
                Quality materials and correct installation, backed by our workmanship guarantee and aftercare.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-24 mb-12 px-6">
          <p className="text-base md:text-lg text-primary text-center max-w-4xl mx-auto font-medium tracking-wide">
            Unlike a general installer or a retailer, we take responsibility for the whole outcome — not just the glass.
          </p>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="bg-[#F1F0ED] py-24 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
              How It Works
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5 leading-tight tracking-tight">
              Quote to install<br />in 12 days.
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
          <div className="text-center mt-16 mb-16">
            <Link
              to="/pages/design-your-shower"
              className="inline-block bg-primary text-white hover:bg-secondary transition-all duration-300 px-10 py-5 text-[10px] tracking-[0.3em] font-bold uppercase rounded-none text-center"
            >
              Design Your Shower →
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER STORIES */}
      <section className="w-full max-w-[1180px] mx-auto py-24 px-6 flex flex-col items-center justify-center text-center">
        <ReviewCarousel />

        {/* 4 item grid representing recent projects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full">
          <div className="aspect-[4/5] bg-cover bg-center border border-[#E0DACE] flex items-end p-4 rounded-sm" style={{ backgroundImage: "url('/images/hero-2.png')" }}>
            {/* <span className="font-mono text-[10px] text-white bg-black/40 px-2 py-1 rounded">
              Umhlanga · frameless
            </span> */}
          </div>
          <div className="aspect-[4/5] bg-cover bg-center border border-[#E0DACE] flex items-end p-4 rounded-sm" style={{ backgroundImage: "url('/images/about-us-hero.png')" }}>
            {/* <span className="font-mono text-[10px] text-white bg-black/40 px-2 py-1 rounded">
              Hillcrest · walk-in
            </span> */}
          </div>
          <div className="aspect-[4/5] bg-cover bg-center border border-[#E0DACE] flex items-end p-4 rounded-sm" style={{ backgroundImage: "url('/images/about-us-narrative.png')" }}>
            {/* <span className="font-mono text-[10px] text-white bg-black/40 px-2 py-1 rounded">
              Durban N · framed
            </span> */}
          </div>
          <div className="aspect-[4/5] bg-cover bg-center border border-[#E0DACE] flex items-end p-4 rounded-sm" style={{ backgroundImage: "url('/images/engage-home.png')" }}>
            {/* <span className="font-mono text-[10px] text-white bg-black/40 px-2 py-1 rounded">
              Ballito · over-bath
            </span> */}
          </div>
        </div>
        <div className="mt-11">
          <Link
            to="/pages/customer-stories"
            className="text-[13px] tracking-[0.16em] text-[#17233D] font-bold uppercase underline underline-offset-8 hover:opacity-85"
          >
            See more of our work →
          </Link>
        </div>
      </section>

      {/* 8. RISK REVERSAL */}
      <section className="bg-[#F1F0ED] py-24 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
              Peace of Mind
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5 leading-tight tracking-tight">
              Accredited, insured and guaranteed.
            </h2>
            <div className="w-[70px] h-[1px] bg-[#C6CBCE] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#E7E3DA] p-7 rounded-sm">
              <h3 className="text-[16px] text-[#17233D] font-bold mb-3">
                Workmanship guarantee
              </h3>
              <p className="text-[14px] leading-relaxed text-[#5C6572]">
                If a leak or install issue appears within three months, we come back and fix it free of charge.
              </p>
            </div>
            <div className="bg-white border border-[#E7E3DA] p-7 rounded-sm">
              <h3 className="text-[16px] text-[#17233D] font-bold mb-3">Accredited &amp; insured</h3>
              <p className="text-[14px] leading-relaxed text-[#5C6572]">
                Fully accredited and insured, including membership of SAGGA.
              </p>
            </div>
            <div className="bg-white border border-[#E7E3DA] p-7 rounded-sm">
              <h3 className="text-[16px] text-[#17233D] font-bold mb-3">Safety glass</h3>
              <p className="text-[14px] leading-relaxed text-[#5C6572]">
                Toughened safety glass in 6 - 10mm to suit the design.
              </p>
            </div>
            <div className="bg-white border border-[#E7E3DA] p-7 rounded-sm">
              <h3 className="text-[16px] text-[#17233D] font-bold mb-3">Aftercare</h3>
              <p className="text-[14px] leading-relaxed text-[#5C6572]">
                Support after installation.{' '}
                <Link
                  to="/pages/aftersales-care"
                  className="text-[#1C4E86] font-semibold underline underline-offset-2"
                >
                  Aftersales Care →
                </Link>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 9. TRADE */}
      <section className="bg-[#17233D] text-[#DDE2EA] py-16 px-6">
        <div className="max-w-[1180px] mx-auto flex flex-wrap items-center justify-between gap-10">
          <div className="max-w-[660px]">
            <div className="text-[12px] tracking-[0.3em] text-[#8FB4E0] font-semibold mb-3 uppercase">
              Trade
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-3 leading-snug tracking-tight">
              Working with architects, designers and builders.
            </h2>
            <p className="text-[15.5px] text-[#C4CBD7]">
              Competitive rates, reliable specification, site compliance and accountability.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-block border border-white/50 text-white text-[10px] font-bold tracking-[0.3em] uppercase px-10 py-5 hover:bg-white hover:text-[#14294f] hover:no-underline transition-all duration-500 rounded-none text-center"
          >
            Talk to us about trade →
          </Link>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="max-w-[920px] mx-auto py-24 px-6">
        <div className="text-center mb-14">
          <div className="text-[12px] tracking-[0.3em] text-[#93A0B2] font-semibold mb-4 uppercase">
            Questions
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-5">
            Common questions about custom showers.
          </h2>
          <div className="w-[70px] h-[1px] bg-[#C6CBCE] mx-auto"></div>
        </div>
        <div className="border-t border-[#E3DED2]">
          {[
            {
              q: 'What types of shower do you make?',
              a: 'We design and install frameless, semi-frameless and framed shower enclosures, walk-in showers and shower screens, plus hinged, pivot and sliding shower doors. Every one is made to your exact measurements. For standard sizes, spares and accessories, see our online shop.',
            },
            {
              q: 'How much does a custom shower cost?',
              a: 'Because each enclosure is made to your space and specification, pricing is quoted per project. Use the configurator or book a measure for a tailored quote.',
            },
            {
              q: 'How long does it take?',
              a: "Manufacture takes about 10–12 working days from payment of your deposit. We'll confirm timing when we quote.",
            },
            {
              q: 'Do you measure on site?',
              a: 'Yes. A specialist measures accurately before manufacture, usually within 2–3 working days. Consultations within 50 km of our showroom are free; beyond that a call-out fee applies.',
            },
            {
              q: 'What glass do you use? Is it safe?',
              a: 'Toughened safety glass, in 6 / 8 / 10 mm to suit the design.',
            },
            {
              q: 'Is there a guarantee?',
              a: "Yes. Our installations carry a workmanship guarantee against leaks: if an installation issue arises within three months, we'll return and fix it free of charge.",
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

      {/* GET IN THE KNOW */}
      <section className="bg-[#F1F0ED] py-24 px-6">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_2fr] gap-14 items-center">
          <div>
            <h2 className="text-3xl text-[#17233D] font-bold mb-4">Get in the know</h2>
            <p className="text-[15px] leading-relaxed text-[#5C6572] mb-7">
              Read our short guides on the most important considerations to take into account when buying a new shower.
            </p>
            <div className="mt-8">
              <Link
                to="/blogs"
                className="inline-block bg-primary text-white hover:bg-secondary transition-all duration-300 px-10 py-5 text-[10px] tracking-[0.3em] font-bold uppercase rounded-none text-center"
              >
                Explore all guides
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="aspect-square bg-cover bg-center border border-[#E0DACE] rounded-sm" style={{ backgroundImage: "url('/images/stabilisers-blog.jpeg')" }}></div>
              <h3 className="text-[13px] tracking-wider text-[#17233D] font-bold uppercase mt-5 leading-snug">
                <Link to="/blogs/news/shower-enclosure-stabilisers" className="hover:text-[#1C4E86]">
                  Getting to grips with glass stabilisers
                </Link>
              </h3>
            </div>
            <div>
              <div className="aspect-square bg-cover bg-center border border-[#E0DACE] rounded-sm" style={{ backgroundImage: "url('/images/hardware-behind-your-shower-enclosure.jpeg')" }}></div>
              <h3 className="text-[13px] tracking-wider text-[#17233D] font-bold uppercase mt-5 leading-snug">
                <Link to="/blogs/news/hardware-behind-your-shower-enclosure" className="hover:text-[#1C4E86]">
                  The hardware behind your shower enclosure
                </Link>
              </h3>
            </div>
            <div>
              <div className="aspect-square bg-cover bg-center border border-[#E0DACE] rounded-sm" style={{ backgroundImage: "url('/images/what-your-shower-is-actually-called.jpeg')" }}></div>
              <h3 className="text-[13px] tracking-wider text-[#17233D] font-bold uppercase mt-5 leading-snug">
                <Link to="/blogs/guides/what-your-shower-is-actually-called" className="hover:text-[#1C4E86]">
                  What your shower is actually called
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="w-full bg-[#17233D] text-[#DDE2EA] py-36 px-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-[1180px] mx-auto flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white mb-6 tracking-tight leading-none">Ready for the right fit?</h2>
          <p className="text-lg md:text-xl text-[#C4CBD7] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Design your shower in a few steps and our team will prepare a tailored quote.
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
            Book a home measure · Call 031 312 9095
          </p>
        </div>
      </section>
    </div>
  );
}
