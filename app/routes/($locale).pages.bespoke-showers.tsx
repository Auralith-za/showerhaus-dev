import { Link, useLoaderData } from 'react-router';
import type { Route } from './+types/pages.bespoke-showers';

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const step = Math.min(Math.max(parseInt(url.searchParams.get('step') || '0', 10), 0), 4);
    const style = url.searchParams.get('style') || '';
    const layout = url.searchParams.get('layout') || '';
    const width = url.searchParams.get('width') || '1200';
    const glass = url.searchParams.get('glass') || '';
    const finish = url.searchParams.get('finish') || '';
    return { step, config: { style, layout, width, glass, finish } };
}

const STEPS = ['Style', 'Layout', 'Dimensions', 'Finish', 'Details'];

const STYLES = [
    { name: 'Frameless', desc: 'Minimalist 8mm–12mm safety glass for a seamless architectural look.' },
    { name: 'Semi-Frameless', desc: 'A blend of structure and transparency, offering great value.' },
    { name: 'Framed', desc: 'Classic, robust design with bold architectural profiles.' },
];

const LAYOUTS = ['Corner', 'Alcove', 'Walk-in', 'Bath Screen'];
const GLASS = [
    { val: '8mm', label: 'Standard' },
    { val: '10mm', label: 'Premium' },
    { val: '12mm', label: 'Architectural' },
];
const WIDTHS = ['600', '750', '900', '1050', '1200', '1350', '1500', '1800', '2000'];
const FINISHES = [
    { name: 'Polished Chrome', color: '#E5E7EB' },
    { name: 'Matte Black', color: '#1F2937' },
    { name: 'Brushed Gold', color: '#D4AF37' },
    { name: 'Satin Nickel', color: '#9CA3AF' },
];

export default function BespokeShowers() {
    const { step, config } = useLoaderData<typeof loader>();
    const progress = ((step + 1) / STEPS.length) * 100;

    function buildUrl(updates: Record<string, string | number>) {
        const params = new URLSearchParams({
            step: String(step),
            style: config.style,
            layout: config.layout,
            width: config.width,
            glass: config.glass,
            finish: config.finish,
            ...Object.fromEntries(Object.entries(updates).map(([k, v]) => [k, String(v)])),
        });
        return `?${params.toString()}`;
    }

    const nextUrl = buildUrl({ step: step + 1 });
    const prevUrl = buildUrl({ step: step - 1 });

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            {/* Header */}
            <section className="py-16 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <span className="block font-sans text-[11px] font-bold tracking-[0.4em] uppercase text-secondary mb-4">CUSTOM CONFIGURATOR</span>
                    <h1 className="font-display text-5xl md:text-6xl text-primary tracking-tight mb-4">Bespoke Showers</h1>
                    <p className="max-w-xl mx-auto font-sans text-gray-500 leading-relaxed">
                        Design your perfect sanctuary. Follow the steps and our team will provide a tailored quote.
                    </p>
                </div>
            </section>

            {/* Progress */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="h-1 bg-gray-100">
                    <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <div className="container mx-auto px-6">
                    <div className="flex justify-between py-4">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                                    step === i ? 'bg-primary text-white border-primary'
                                    : i < step ? 'bg-secondary text-white border-secondary'
                                    : 'bg-white text-gray-300 border-gray-200'
                                }`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className={`hidden md:block font-sans text-[10px] font-bold tracking-[0.2em] uppercase ${step >= i ? 'text-primary' : 'text-gray-300'}`}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Body */}
            <section className="py-14">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

                        {/* Step Panel */}
                        <div className="lg:col-span-3 bg-white border border-gray-100 shadow-sm p-10">

                            {/* Step 0: Style */}
                            {step === 0 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="font-display text-3xl text-primary mb-1">Choose your Style</h2>
                                        <p className="font-sans text-sm text-gray-400">The structural type of your shower enclosure.</p>
                                    </div>
                                    {STYLES.map(s => (
                                        <Link key={s.name} to={buildUrl({ style: s.name })}
                                            className={`block w-full p-7 text-left border rounded-sm transition-all duration-200 ${
                                                config.style === s.name ? 'border-secondary bg-secondary/5 shadow-md' : 'border-gray-200 hover:border-gray-400'
                                            }`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-display text-2xl text-primary">{s.name}</h3>
                                                {config.style === s.name && (
                                                    <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-white text-[10px]">✓</span>
                                                )}
                                            </div>
                                            <p className="font-sans text-sm text-gray-500">{s.desc}</p>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Step 1: Layout */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="font-display text-3xl text-primary mb-1">Select the Layout</h2>
                                        <p className="font-sans text-sm text-gray-400">How the enclosure fits into your bathroom.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {LAYOUTS.map(l => (
                                            <Link key={l} to={buildUrl({ layout: l })}
                                                className={`block p-8 text-center border rounded-sm transition-all duration-200 ${
                                                    config.layout === l ? 'border-secondary bg-secondary/5 shadow-md' : 'border-gray-200 hover:border-gray-400'
                                                }`}>
                                                <h3 className="font-display text-xl text-primary">{l}</h3>
                                                {config.layout === l && <div className="mt-2 w-6 h-1 bg-secondary mx-auto" />}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Dimensions */}
                            {step === 2 && (
                                <div className="space-y-10">
                                    <div>
                                        <h2 className="font-display text-3xl text-primary mb-1">Define Dimensions</h2>
                                        <p className="font-sans text-sm text-gray-400">Select approximate width — our team will measure on-site.</p>
                                    </div>
                                    <div>
                                        <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Width</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {WIDTHS.map(w => (
                                                <Link key={w} to={buildUrl({ width: w })}
                                                    className={`block p-4 text-center border rounded-sm font-bold text-sm transition-all duration-200 ${
                                                        config.width === w ? 'border-secondary bg-secondary/5 text-secondary shadow-md' : 'border-gray-200 text-primary hover:border-gray-400'
                                                    }`}>
                                                    {w}mm
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-gray-100">
                                        <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Glass Thickness</p>
                                        <div className="grid grid-cols-3 gap-4">
                                            {GLASS.map(g => (
                                                <Link key={g.val} to={buildUrl({ glass: g.val })}
                                                    className={`block p-5 text-center border rounded-sm transition-all duration-200 ${
                                                        config.glass === g.val ? 'border-secondary bg-secondary/5 shadow-md' : 'border-gray-200 hover:border-gray-400'
                                                    }`}>
                                                    <div className={`font-bold text-sm ${config.glass === g.val ? 'text-secondary' : 'text-primary'}`}>{g.val}</div>
                                                    <div className="text-[9px] text-gray-400 mt-1">{g.label}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Finish */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="font-display text-3xl text-primary mb-1">Choose Finish</h2>
                                        <p className="font-sans text-sm text-gray-400">Hardware and frame finish for your enclosure.</p>
                                    </div>
                                    {FINISHES.map(f => (
                                        <Link key={f.name} to={buildUrl({ finish: f.name })}
                                            className={`flex items-center gap-5 p-6 border rounded-sm transition-all duration-200 ${
                                                config.finish === f.name ? 'border-secondary bg-secondary/5 shadow-md' : 'border-gray-200 hover:border-gray-400'
                                            }`}>
                                            <div className="w-12 h-12 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: f.color }} />
                                            <span className="font-sans text-sm font-bold uppercase tracking-[0.15em] text-primary flex-1">{f.name}</span>
                                            {config.finish === f.name && <span className="w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center text-[10px]">✓</span>}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Step 4: Details */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="font-display text-3xl text-primary mb-1">Final Details</h2>
                                        <p className="font-sans text-sm text-gray-400">Add any notes and submit your request.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">First Name</label>
                                            <input type="text" className="w-full border-b border-gray-200 py-3 outline-none focus:border-secondary transition-colors font-sans text-primary bg-transparent" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Last Name</label>
                                            <input type="text" className="w-full border-b border-gray-200 py-3 outline-none focus:border-secondary transition-colors font-sans text-primary bg-transparent" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Email</label>
                                        <input type="email" className="w-full border-b border-gray-200 py-3 outline-none focus:border-secondary transition-colors font-sans text-primary bg-transparent" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Notes</label>
                                        <textarea rows={4} placeholder="Special requirements, site conditions..."
                                            className="w-full border border-gray-200 p-4 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-primary bg-transparent resize-none" />
                                    </div>
                                    <div className="bg-gray-50 border border-gray-100 p-5 text-[11px] font-sans text-gray-500 leading-relaxed">
                                        Our team will contact you within 24 hours to arrange a site measurement before providing your final quote.
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="pt-10 mt-10 border-t border-gray-100 flex justify-between items-center">
                                {step > 0 ? (
                                    <Link to={prevUrl} className="px-8 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-primary transition-colors">
                                        ← Back
                                    </Link>
                                ) : <div />}

                                {step < STEPS.length - 1 ? (
                                    <Link to={nextUrl} className="bg-primary text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-secondary hover:text-white transition-all duration-300 shadow-lg inline-block">
                                        Next Step →
                                    </Link>
                                ) : (
                                    <button type="button" className="bg-secondary text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-primary transition-all duration-300 shadow-lg">
                                        Submit Request
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-[80px]">
                            <div className="bg-white border border-gray-100 shadow-sm p-8">
                                <h3 className="font-display text-2xl text-primary mb-6 pb-4 border-b border-gray-100">Your Configuration</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Style', value: config.style },
                                        { label: 'Layout', value: config.layout },
                                        { label: 'Width', value: config.width ? `${config.width}mm` : '' },
                                        { label: 'Glass', value: config.glass },
                                        { label: 'Finish', value: config.finish },
                                    ].map(item => (
                                        <div key={item.label} className="flex justify-between items-center text-[11px] font-sans uppercase tracking-[0.15em] pb-3 border-b border-gray-50">
                                            <span className="text-gray-400">{item.label}</span>
                                            <span className={`font-bold ${item.value ? 'text-primary' : 'text-gray-200'}`}>{item.value || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 shadow-sm p-8">
                                <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-2">Need help deciding?</p>
                                <p className="font-display text-xl text-primary mb-1">Speak to a Sales Consultant</p>
                                <div className="w-8 h-px bg-secondary my-4" />
                                <a href="tel:0313129095" className="flex items-center gap-3 group">
                                    <svg className="w-4 h-4 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="font-sans text-lg font-bold text-primary group-hover:text-secondary transition-colors">031 312 9095</span>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
