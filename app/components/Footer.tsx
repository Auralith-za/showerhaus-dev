import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="w-full bg-white pt-0">
      {/* Newsletter Section */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-display text-2xl mb-2">Join Our Mailing List</h3>
          <p className="font-sans text-sm text-gray-300 mb-6 max-w-lg mx-auto font-light">
            Sign up to receive the latest news, new collections and exclusive offers from ShowerHaus.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border-b border-white py-2 px-0 text-white placeholder-gray-400 focus:outline-none focus:border-gray-200 transition-colors font-sans"
            />
            <button
              type="submit"
              className="font-sans text-sm font-bold tracking-widest uppercase text-white hover:text-secondary transition-colors"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">

          {/* Column 1: Brand & Contact */}
          <div>
            <h4 className="font-display text-lg text-primary mb-6">ShowerHaus</h4>
            <div className="font-sans text-gray-500 space-y-2 font-light">
              <p>123 Luxury Avenue</p>
              <p>Cape Town, 8001</p>
              <p>South Africa</p>
              <br />
              <p className="font-medium text-primary">021 123 4567</p>
              <p className="font-medium text-primary">info@showerhaus.co.za</p>
            </div>
            {/* Social Icons Placeholder */}
            <div className="flex gap-4 mt-6 text-primary">
              {/* Icons would go here */}
              <span>IG</span>
              <span>FB</span>
              <span>PT</span>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="font-display text-lg text-primary mb-6">Collections</h4>
            <div className="flex flex-col gap-3 font-sans text-gray-500 font-light">
              <Link to="/collections/baths" className="hover:text-primary transition-colors">Baths</Link>
              <Link to="/collections/showers" className="hover:text-primary transition-colors">Showers</Link>
              <Link to="/collections/basins" className="hover:text-primary transition-colors">Basins</Link>
              <Link to="/collections/toilets" className="hover:text-primary transition-colors">Toilets</Link>
              <Link to="/collections/taps" className="hover:text-primary transition-colors">Taps & Mixers</Link>
              <Link to="/collections/accessories" className="hover:text-primary transition-colors">Accessories</Link>
            </div>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-display text-lg text-primary mb-6">Customer Care</h4>
            <div className="flex flex-col gap-3 font-sans text-gray-500 font-light">
              <Link to="/pages/contact" className="hover:text-primary transition-colors">Contact Us</Link>
              <Link to="/pages/delivery" className="hover:text-primary transition-colors">Delivery Information</Link>
              <Link to="/pages/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link>
              <Link to="/pages/guarantee" className="hover:text-primary transition-colors">Our Guarantee</Link>
              <Link to="/pages/faq" className="hover:text-primary transition-colors">FAQs</Link>
            </div>
          </div>

          {/* Column 4: About */}
          <div>
            <h4 className="font-display text-lg text-primary mb-6">About Us</h4>
            <div className="flex flex-col gap-3 font-sans text-gray-500 font-light">
              <Link to="/pages/about" className="hover:text-primary transition-colors">Our Story</Link>
              <Link to="/pages/showrooms" className="hover:text-primary transition-colors">Showrooms</Link>
              <Link to="/blogs/journal" className="hover:text-primary transition-colors">Journal</Link>
              <Link to="/pages/professionals" className="hover:text-primary transition-colors">Trade Professionals</Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-light">
          <p>&copy; {new Date().getFullYear()} ShowerHaus. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/policies/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/policies/terms-of-service" className="hover:text-primary">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
