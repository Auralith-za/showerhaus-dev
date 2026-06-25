import type { Route } from './+types/contact';

export const meta: Route.MetaFunction = () => {
    return [{ title: 'Contact Us | ShowerHaus' }];
};

export default function Contact() {
    const businessHours = [
        { day: 'Monday to Thursday', hours: '7am – 4.15pm' },
        { day: 'Friday', hours: '7am – 4pm' },
        { day: 'Saturday', hours: '9am – 1pm' },
        { day: 'Sundays & Public Holidays', hours: 'Closed' },
    ];

    return (
        <div>
            <section className="relative min-h-screen flex flex-col lg:flex-row bg-white">

                {/* Left Side: Information */}
                <div className="lg:w-2/5 bg-[#F9F8F6] p-8 md:p-16 lg:p-24 flex flex-col justify-between">
                    <div>
                        <span className="block font-sans text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400 mb-8">GET IN TOUCH</span>
                        <h1 className="font-display text-5xl md:text-7xl text-primary tracking-tight mb-12">Contact Us</h1>

                        <div className="space-y-12">
                            <div>
                                <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-secondary mb-3">Phone</h3>
                                <a href="tel:0313129095" className="font-sans text-2xl text-primary hover:text-secondary transition-colors duration-300">031 312 9095</a>
                            </div>

                            <div>
                                <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-secondary mb-3">Email</h3>
                                <a href="mailto:hello@showerhaus.co.za" className="font-sans text-2xl text-primary hover:text-secondary transition-colors duration-300">hello@showerhaus.co.za</a>
                            </div>

                            <div>
                                <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-secondary mb-3">Address</h3>
                                <p className="font-sans text-lg text-primary leading-relaxed max-w-sm">
                                    90A Intersite Avenue, Umgeni Business Park, Springfield, Durban
                                </p>
                            </div>

                            <div className="pt-8 border-t border-gray-200">
                                <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-secondary mb-6">Business Hours</h3>
                                <div className="space-y-4">
                                    {businessHours.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-[11px] font-sans text-primary border-b border-gray-200 pb-2 uppercase tracking-wider">
                                            <span className="font-medium text-gray-500">{item.day}</span>
                                            <span className="font-bold">{item.hours}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 flex gap-8">
                        <a href="#" className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-primary hover:text-secondary transition-colors">Instagram</a>
                        <a href="#" className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-primary hover:text-secondary transition-colors">Facebook</a>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-3/5 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
                    <div className="max-w-2xl mx-auto w-full">
                        <h2 className="font-display text-4xl text-primary mb-4">Send us a message</h2>
                        <p className="font-sans text-gray-500 pb-16">Whether it's a quote request or a design query, our team is ready to help.</p>

                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 group">
                                    <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">First Name</label>
                                    <input type="text" className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent" />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Last Name</label>
                                    <input type="text" className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent" />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Email Address</label>
                                <input type="email" className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent" />
                            </div>

                            <div className="space-y-2 group">
                                <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Contact Number (Optional)</label>
                                <input type="tel" className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent" />
                            </div>

                            <div className="space-y-2 group">
                                <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Message</label>
                                <textarea rows={4} className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent resize-none" />
                            </div>

                            <button type="submit" className="bg-primary text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-secondary transition-all shadow-lg">
                                Send Inquiry
                            </button>
                        </form>
                    </div>
                </div>

            </section>
        </div>
    );
}
