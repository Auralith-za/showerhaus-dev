import { useEffect } from 'react';
import { Form, useActionData, useNavigation, useLoaderData } from 'react-router';
import { renderToStaticMarkup } from 'react-dom/server';
import { Resend } from 'resend';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import FeedbackEmail from '~/components/FeedbackEmail';

export const meta = () => {
    return [{ title: 'Webmaster Feedback | Shower Haus' }];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const referer = url.searchParams.get('ref') || '';
    return { referer };
}

export async function action({ request, context }: { request: Request; context: any }) {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const issueType = formData.get('issueType') as string;
    const pageUrl = formData.get('pageUrl') as string;
    const message = formData.get('message') as string;
    const attachment = formData.get('attachment') as File | null;

    if (!email || !issueType || !message) {
        return { error: 'Please fill out all required fields.' };
    }

    const companyName = formData.get('companyName') as string;
    // Honeypot check for bots
    if (companyName) {
        // Silently succeed for bots, but don't send the email
        return { success: true };
    }

    let attachments = [];
    if (attachment && attachment.size > 0) {
        const arrayBuffer = await attachment.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < uint8Array.byteLength; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binary);
        
        attachments.push({
            filename: attachment.name,
            content: base64,
        });
    }

    const resend = new Resend(context.env.RESEND_API_KEY);

    try {
        const html = renderToStaticMarkup(
            <FeedbackEmail
                name={name || 'Anonymous'}
                email={email}
                issueType={issueType}
                pageUrl={pageUrl || 'Not specified'}
                message={message}
            />
        );

        const data = await resend.emails.send({
            from: 'Shower Haus Website <hello@showerhaus.co.za>',
            to: ['curtleroux7785@gmail.com'],
            cc: [email],
            subject: `Webmaster Feedback: ${issueType}`,
            replyTo: email,
            html,
            attachments: attachments.length > 0 ? attachments : undefined,
        });

        if (data.error) {
            return { error: data.error.message };
        }

        return { success: true };
    } catch (error: any) {
        return { error: error.message || 'Something went wrong. Please try again.' };
    }
}

export default function WebmasterFeedback() {
    const { referer } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <div className="bg-[#fafafa] min-h-screen py-16 md:py-24">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="bg-white p-8 md:p-12 shadow-sm rounded-md border border-gray-100">
                    <div className="mb-8">
                        <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-4">
                            New Site Beta
                        </span>
                        <h1 className="font-display text-4xl text-primary font-bold">
                            Webmaster Feedback
                        </h1>
                        <p className="font-sans text-gray-500 text-sm mt-3 leading-relaxed">
                            Thank you for helping us test our new website! If you encountered any bugs, alignment issues, broken links, or have suggestions, please fill out the form below. Our development team will review it.
                        </p>
                    </div>

                    {actionData?.success ? (
                        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-6 my-8">
                            <h3 className="font-display text-xl mb-2">Feedback Submitted!</h3>
                            <p className="font-sans text-sm">Thank you for your valuable feedback. We appreciate your patience as we build a better browsing experience.</p>
                        </div>
                    ) : (
                        <Form method="post" encType="multipart/form-data" className="space-y-8 mt-10">
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
                                    <label htmlFor="name" className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Your Name (Optional)</label>
                                    <input type="text" name="name" id="name" className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent" />
                                </div>
                                <div className="space-y-2 group">
                                    <label htmlFor="email" className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Email Address</label>
                                    <input type="email" name="email" id="email" required className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 group">
                                    <label htmlFor="issueType" className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Feedback Type</label>
                                    <select name="issueType" id="issueType" required className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent appearance-none rounded-none cursor-pointer">
                                        <option value="Bug / Issue">Bug / Issue</option>
                                        <option value="Visual / Layout Issue">Visual / Layout Issue</option>
                                        <option value="Broken Link">Broken Link</option>
                                        <option value="Suggestion">Suggestion / Idea</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2 group">
                                    <label htmlFor="pageUrl" className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Page URL where issue occurred (Optional)</label>
                                    <input type="text" name="pageUrl" id="pageUrl" defaultValue={referer} className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent" placeholder="e.g. /collections/all" />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label htmlFor="message" className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Describe the issue / feedback</label>
                                <textarea name="message" id="message" required rows={5} className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent resize-none" placeholder="Please provide as much detail as possible..." />
                            </div>

                            <div className="space-y-2 group">
                                <label htmlFor="attachment" className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-focus-within:text-secondary transition-colors">Screenshot or Video (Optional)</label>
                                <input type="file" name="attachment" id="attachment" accept="image/*,video/*" className="w-full border-b border-gray-200 py-3 focus:border-secondary focus:ring-0 outline-none transition-all font-sans text-primary bg-transparent file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:tracking-[0.2em] file:uppercase file:bg-gray-100 file:text-primary hover:file:bg-gray-200 cursor-pointer" />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="bg-primary text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-secondary transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
}
