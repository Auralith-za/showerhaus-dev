import { useEffect } from 'react';
import { Form, useActionData, useNavigation } from 'react-router';
import { renderToStaticMarkup } from 'react-dom/server';
import { Resend } from 'resend';
import type { Route } from './+types/contact';
import ContactEmail from '~/components/ContactEmail';

export const meta: Route.MetaFunction = () => {
    return [{ title: 'Contact Us | Shower Haus' }];
};

export async function action({ request, context }: Route.ActionArgs) {
    const formData = await request.formData();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    if (!firstName || !lastName || !email || !message) {
        return { error: 'Please fill out all required fields.' };
    }

    const companyName = formData.get('companyName') as string;
    // Honeypot check for bots
    if (companyName) {
        // Silently succeed for bots, but don't send the email
        return { success: true };
    }

    const resend = new Resend((context.env as any).RESEND_API_KEY);

    try {
        // Generate the HTML email
        const html = renderToStaticMarkup(
            <ContactEmail
                firstName={firstName}
                lastName={lastName}
                email={email}
                phone={phone}
                message={message}
            />
        );

        const data = await resend.emails.send({
            from: 'Shower Haus Website <hello@showerhaus.co.za>',
            to: ['hello@showerhaus.co.za', 'curtleroux7785@gmail.com'],
            subject: `New Enquiry from ${firstName} ${lastName}`,
            replyTo: email,
            html,
        });

        if (data.error) {
            return { error: data.error.message };
        }

        return { success: true };
    } catch (error: any) {
        return { error: error.message || 'Something went wrong. Please try again.' };
    }
}

export default function Contact() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    useEffect(() => {
        if (actionData?.success && typeof window !== 'undefined') {
            const gtag = (window as any).gtag;
            if (typeof gtag === 'function') {
                // Tracking contact form submission (replace AW-17650233161/REPLACE_ME with your actual conversion label)
                gtag('event', 'conversion', { 'send_to': 'AW-17650233161/REPLACE_ME' });
            }
        }
    }, [actionData]);

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
                <div className="lg:w-2/5 relative p-8 md:p-16 lg:p-24 flex flex-col justify-between text-white overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/contact-us.jpg"
                            alt="Contact Us"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[#14294f]/85 mix-blend-multiply"></div>
                    </div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                            <span className="block font-sans text-[10px] font-bold tracking-[0.4em] uppercase text-white/70 mb-8">GET IN TOUCH</span>
                            <h1 className="font-display text-5xl md:text-7xl text-white tracking-tight mb-12">Contact Us</h1>

                            <div className="space-y-12">
                                <div>
                                    <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">Phone</h3>
                                    <a href="tel:0313129095" className="font-sans text-2xl text-white hover:text-white/80 transition-colors duration-300">031 312 9095</a>
                                </div>

                                <div>
                                    <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">Email</h3>
                                    <a href="mailto:hello@showerhaus.co.za" className="font-sans text-2xl text-white hover:text-white/80 transition-colors duration-300">hello@showerhaus.co.za</a>
                                </div>

                                <div>
                                    <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">Address</h3>
                                    <p className="font-sans text-lg text-white/90 leading-relaxed max-w-sm">
                                        90A Intersite Avenue, Umgeni Business Park, Springfield, Durban
                                    </p>
                                </div>

                                <div className="pt-8 border-t border-white/20">
                                    <h3 className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 mb-6">Business Hours</h3>
                                    <div className="space-y-4">
                                        {businessHours.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-[11px] font-sans text-white border-b border-white/10 pb-2 uppercase tracking-wider">
                                                <span className="font-medium text-white/60">{item.day}</span>
                                                <span className="font-bold">{item.hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 flex gap-8">
                            <a href="https://www.instagram.com/showerhaussa/" target="_blank" rel="noopener noreferrer" className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-white hover:text-white/80 transition-colors">Instagram</a>
                            <a href="https://www.facebook.com/Shower Haus/" target="_blank" rel="noopener noreferrer" className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-white hover:text-white/80 transition-colors">Facebook</a>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-3/5 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
                    <div className="max-w-2xl mx-auto w-full">
                        <h2 className="font-display text-4xl text-primary mb-4">Send us a message</h2>
                        <p className="font-sans text-gray-500 mb-12">Whether it's a quote request or a design query, our team is ready to help.</p>

                        {actionData?.success ? (
                            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-6 mt-10 mb-8">
                                <h3 className="font-display text-xl mb-2">Message Sent!</h3>
                                <p className="font-sans text-sm">Thank you for getting in touch. We will get back to you as soon as possible.</p>
                            </div>
                        ) : (
                            <Form method="post" className="space-y-8 mt-10">
                                {actionData?.error && (
                                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-8 font-sans text-sm">
                                        {actionData.error}
                                    </div>
                                )}
                                
                                {/* Honeypot field - hidden from real users */}
                                <div style={{ display: 'none' }} aria-hidden="true">
                                    <label htmlFor="companyName">Company Name</label>
                                    <input type="text" name="companyName" id="companyName" tabIndex={-1} autoComplete="off" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 group">
                                        <label htmlFor="firstName" className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">First Name</label>
                                        <input type="text" name="firstName" id="firstName" required className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent" />
                                    </div>
                                    <div className="space-y-2 group">
                                        <label htmlFor="lastName" className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Last Name</label>
                                        <input type="text" name="lastName" id="lastName" required className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent" />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label htmlFor="email" className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Email Address</label>
                                    <input type="email" name="email" id="email" required className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent" />
                                </div>

                                <div className="space-y-2 group">
                                    <label htmlFor="phone" className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Contact Number (Optional)</label>
                                    <input type="tel" name="phone" id="phone" className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent" />
                                </div>

                                <div className="space-y-2 group">
                                    <label htmlFor="message" className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Message</label>
                                    <textarea name="message" id="message" required rows={4} className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent resize-none" />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="bg-primary text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-secondary transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                                </button>
                            </Form>
                        )}
                    </div>
                </div>

            </section>
        </div>
    );
}
