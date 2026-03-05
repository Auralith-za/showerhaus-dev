import { NavLink } from 'react-router';
import type { Route } from './+types/contact';
import { Image } from '@shopify/hydrogen';

export const meta: Route.MetaFunction = () => {
    return [{ title: 'Contact Us | ShowerHaus' }];
};

export default function Contact() {
    const businessHours = [
        { day: 'Monday to Thursday', hours: '7am – 4.15pm' },
        { day: 'Friday', hours: '7am – 4pm' },
        { day: 'Saturday', hours: '9am – 1pm' },
        { day: 'Sunday & Public Holidays', hours: 'Closed' },
    ];

    return (
        <div className="contact-page bg-white">
            {/* Header Section */}
            <section className="pt-24 pb-16 px-6 md:px-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-sans text-[10px] tracking-[0.4em] uppercase font-bold text-gray-400 mb-4">Get in Touch</h2>
                    <h1 className="font-display text-5xl md:text-7xl text-primary lowercase tracking-tight">Contact Us</h1>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
                {/* Left Column: Details */}
                <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-[#FAF9F7]">
                    <div className="max-w-md space-y-16">

                        {/* Contact Details */}
                        <div className="space-y-10">
                            <div className="space-y-2">
                                <h3 className="font-sans text-[9px] tracking-[0.3em] uppercase font-bold text-primary">Phone</h3>
                                <a href="tel:0313129095" className="font-sans text-xl text-gray-600 hover:text-primary transition-colors tracking-tight">031 312 9095</a>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-sans text-[9px] tracking-[0.3em] uppercase font-bold text-primary">Email</h3>
                                <a href="mailto:jackie@showerhaus.co.za" className="font-sans text-xl text-gray-600 hover:text-primary transition-colors tracking-tight">jackie@showerhaus.co.za</a>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-sans text-[9px] tracking-[0.3em] uppercase font-bold text-primary">Location</h3>
                                <p className="font-sans text-lg text-gray-600 leading-relaxed tracking-tight">
                                    90A Intersite Avenue, Umgeni Business Park,<br />Springfield, Durban
                                </p>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="space-y-6 pt-10 border-t border-gray-200">
                            <h3 className="font-sans text-[9px] tracking-[0.3em] uppercase font-bold text-primary">Showroom Hours</h3>
                            <div className="space-y-4">
                                {businessHours.map((item, index) => (
                                    <div key={index} className="flex justify-between items-end border-b border-gray-100 pb-2">
                                        <span className="font-sans text-[11px] uppercase tracking-widest text-gray-400 font-medium">{item.day}</span>
                                        <span className="font-sans text-xs text-primary font-bold">{item.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="pt-10">
                            <h3 className="font-sans text-[9px] tracking-[0.3em] uppercase font-bold text-primary mb-6">Social</h3>
                            <div className="flex gap-8">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex items-center gap-3"
                                >
                                    <span className="p-3 bg-white border border-gray-200 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-2.221c0-.822.112-1.117.73-1.117h3.27v-4h-4.471c-4.165 0-5.529 1.813-5.529 4.74v2.598z" />
                                        </svg>
                                    </span>
                                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 group-hover:text-primary transition-colors">Facebook</span>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: Imagery */}
                <div className="relative min-h-[500px] lg:min-h-full">
                    <img
                        src="https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/TahunaTerrace-MasterBathroom3-bde23112c62e4595a651d9733a93dfbe-77dee1e3a73648b597f8555771375d87.jpg"
                        className="absolute inset-0 w-full h-full object-cover grayscale-[20%]"
                        alt="ShowerHaus Premium Showroom"
                    />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                </div>
            </section>

            {/* Map Section or Bottom Contact Form */}
            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2">
                        <h2 className="font-display text-4xl md:text-5xl text-primary mb-8 tracking-tight">Visit our showroom for expert advice.</h2>
                        <p className="font-sans text-gray-500 text-lg font-light leading-relaxed mb-10 max-w-lg">
                            Whether you are an architect, developer, or homeowner, our team provides expert quotes for projects of any scale. Explore our collections in person and find the perfect fit for your architectural vision.
                        </p>
                        <div className="inline-flex">
                            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="bg-primary text-white px-10 py-4 text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-black transition-all duration-500">
                                Get Directions
                            </a>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full aspect-video bg-gray-100 grayscale-[100%] border border-gray-100 relative overflow-hidden">
                        {/* This would be an iframe for Google Maps or another generated image of the exterior */}
                        <img
                            src="https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/modern-bathroom-wood-grey-tiles-mineral-tiles.png.webp"
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                            alt="ShowerHaus Springfield Location"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white p-6 shadow-2xl relative z-10 border border-gray-50">
                                <p className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-primary">ShowerHaus Springfield</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
