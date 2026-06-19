import { Link } from 'react-router';
import { FOOTER_MENU } from '~/lib/navigation';

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-50">
      {/* Newsletter Section */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <h3 className="font-sans text-4xl md:text-5xl tracking-tighter font-bold mb-4 !text-white">Specials and Giveaways</h3>
          <p className="font-sans text-sm text-gray-300 mb-8 max-w-xl mx-auto font-light leading-relaxed">
            Sign up to our newsletter and be the first to hear about upcoming specials and promotions
          </p>
          <form className="max-w-md w-full flex flex-col sm:flex-row gap-0 group border border-white/20 focus-within:border-white transition-colors mt-10">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent py-4 px-6 text-white placeholder-gray-400 focus:outline-none transition-all font-sans text-sm"
              style={{ border: 'none', borderRadius: 0, margin: 0 }}
              required
            />
            <button
              type="submit"
              className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase bg-white text-primary px-8 py-4 sm:py-0 hover:bg-secondary hover:text-white transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-8">
            <Link to="/" className="block">
              <img src="/logo.png" alt="ShowerHaus" className="h-16 w-auto object-contain" />
            </Link>
            <div className="font-sans text-gray-500 text-sm space-y-6 font-light leading-relaxed">
              <div className="flex items-start gap-4">
                <svg className="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p>90A Intersite Avenue</p>
                  <p>Umgeni Business Park</p>
                  <p>Springfield 4091</p>
                  <p>South Africa</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="font-medium text-gray-500">031 312 9095</p>
              </div>
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="font-medium text-gray-500 hover:text-primary transition-colors underline decoration-primary/20 underline-offset-4 cursor-pointer">hello@showerhaus.co.za</p>
              </div>
            </div>
          </div>

          {/* About Us */}
          <div className="space-y-8">
            <h4 className="font-display text-[10px] tracking-[0.3em] uppercase font-bold text-primary border-b border-gray-100 pb-4">About Us</h4>
            <div className="flex flex-col gap-4 font-sans text-gray-500 text-sm font-light">
              {FOOTER_MENU.about.map((item) => (
                <Link key={item.handle} to={item.handle === 'about' ? '/pages/about' : `/pages/${item.handle}`} className="hover:text-primary transition-colors hover:translate-x-1 transform transition-transform duration-200">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-8">
            <h4 className="font-display text-[10px] tracking-[0.3em] uppercase font-bold text-primary border-b border-gray-100 pb-4">Customer Care</h4>
            <div className="flex flex-col gap-4 font-sans text-gray-500 text-sm font-light">
              {FOOTER_MENU.customerService.map((item) => (
                <Link key={item.handle} to={`/pages/${item.handle}`} className="hover:text-primary transition-colors hover:translate-x-1 transform transition-transform duration-200">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Discover More (Hidden for now) */}
          {/* <div className="space-y-8">
            <h4 className="font-display text-[10px] tracking-[0.3em] uppercase font-bold text-primary border-b border-gray-100 pb-4">Discover</h4>
            <div className="flex flex-col gap-4 font-sans text-gray-500 text-sm font-light">
              {FOOTER_MENU.discoverMore.map((item) => (
                <Link key={item.handle} to={item.handle === 'journal' ? '/blogs/journal' : `/pages/${item.handle}`} className="hover:text-primary transition-colors hover:translate-x-1 transform transition-transform duration-200">
                  {item.title}
                </Link>
              ))}
            </div>
          </div> */}

          {/* Categories */}
          <div className="space-y-8">
            <h4 className="font-display text-[10px] tracking-[0.3em] uppercase font-bold text-primary border-b border-gray-100 pb-4">Shop</h4>
            <div className="flex flex-col gap-4 font-sans text-gray-500 text-sm font-light">
              {FOOTER_MENU.categories.map((item) => (
                <Link key={item.handle} to={item.handle === 'shower-spares' ? '/collections/all' : `/collections/${item.handle}`} className="hover:text-primary transition-colors hover:translate-x-1 transform transition-transform duration-200">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 border-t border-gray-100 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] text-gray-400 font-light uppercase">
          <p className="order-2 md:order-1 text-center md:text-left mt-4 md:mt-0 text-gray-400 text-[10px] font-light tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} SHOWERHAUS. THE RIGHT FIT.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 order-1 md:order-2 text-xs md:text-[10px]">
            {FOOTER_MENU.bottom.map((item) => (
              <Link key={item.handle} to={`/policies/${item.handle}`} className="hover:text-primary transition-colors">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

