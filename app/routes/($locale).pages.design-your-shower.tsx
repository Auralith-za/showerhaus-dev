import { useState, useEffect } from 'react';
import { useActionData, useNavigation, useSubmit } from 'react-router';
import { renderToStaticMarkup } from 'react-dom/server';
import { Resend } from 'resend';
import BespokeEmail from '~/components/BespokeEmail';const STEPS = ['Style', 'Configurations', 'Dimensions', 'Hardware', 'Details'];

const STYLES = [
    { name: 'Frameless', desc: 'Minimalist 8mm–12mm safety glass for a seamless architectural look.' },
    { name: 'Semi-Frameless', desc: 'A blend of structure and transparency, offering great value.' },
    { name: 'Framed', desc: 'Classic, robust design with bold architectural profiles.' },
];

const CONFIGURATIONS = [
    'Shower screen',
    'Door between 2 walls',
    'Door + 1 panel',
    'Door + 2 panels',
    'Corner entry',
    'Pentagonal',
    'Sliding door',
    'Other'
];

const PREDEFINED_SIZES = [
    { w: '900', l: '900' },
    { w: '900', l: '1000' },
    { w: '900', l: '1100' },
    { w: '1000', l: '900' },
    { w: '1000', l: '1000' },
    { w: '1000', l: '1100' },
    { w: '1100', l: '900' },
    { w: '1100', l: '1000' },
    { w: '1100', l: '1100' }
];

const FINISHES = [
    { name: 'Polished Stainless Steel', color: '#E5E7EB', desc: 'A mirror-like reflective finish that is highly durable and easy to clean.' },
    { name: 'Chrome', color: '#D1D5DB', desc: 'Classic bright mirror finish that perfectly matches standard bathroom tapware.' },
    { name: 'Brushed Stainless Steel', color: '#9CA3AF', desc: 'Modern matte textured finish that minimizes fingerprints and water spots.' },
    { name: 'Satin Gold', color: '#D4AF37', desc: 'A luxurious, warm brushed gold finish for a contemporary statement look.' },
    { name: 'Antique Brass', color: '#B5A642', desc: 'Rich, aged brass finish with subtle dark undertones for traditional elegance.' },
    { name: 'Black', color: '#1F2937', desc: 'Deep matte black coating for a bold, striking architectural contrast.' },
];

const MATERIALS = [
    { name: 'Stainless Steel', desc: 'High-grade marine alloy offering exceptional corrosion resistance and a sleek finish.' },
    { name: 'Brass', desc: 'A superior metal alloy for harder-wearing longer-lasting hinges.' }
];

export async function action({ request, context }: any) {
    const formData = await request.formData();
    const style = formData.get('style') as string;
    const layout = formData.get('layout') as string;
    const width = formData.get('width') as string;
    const length = formData.get('length') as string;
    const height = formData.get('height') as string;
    const finish = formData.get('finish') as string;
    const material = formData.get('material') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const notes = formData.get('notes') as string;

    if (!firstName || !lastName || !email) {
        return { error: 'Please fill out all required fields.' };
    }

    const resend = new Resend((context.env as any).RESEND_API_KEY);

    try {
        const html = renderToStaticMarkup(
            <BespokeEmail
                style={style}
                layout={layout}
                width={width}
                length={length}
                height={height}
                finish={finish}
                material={material}
                firstName={firstName}
                lastName={lastName}
                email={email}
                phone={phone}
                notes={notes}
            />
        );

        const data = await resend.emails.send({
            from: 'Shower Haus Website <hello@showerhaus.co.za>',
            to: ['hello@showerhaus.co.za', 'curtleroux7785@gmail.com'],
            subject: `New Custom-made Shower Request from ${firstName} ${lastName}`,
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

export default function BespokeShowers() {
    const [step, setStep] = useState(0);
    const [style, setStyle] = useState('');
    const [layout, setLayout] = useState('');
    const [width, setWidth] = useState('900');
    const [length, setLength] = useState('900');
    const [height, setHeight] = useState('2000');
    const [finish, setFinish] = useState('');
    const [material, setMaterial] = useState('');

    // Step 4 User Info States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const submit = useSubmit();
    const isSubmitting = navigation.state === 'submitting';

    useEffect(() => {
        if (actionData?.success) {
            setSubmitted(true);
            if (typeof window !== 'undefined') {
                const gtag = (window as any).gtag;
                if (typeof gtag === 'function') {
                    // Tracking custom shower form submission
                    gtag('event', 'conversion', { 'send_to': 'AW-17650233161/jVP2CMfLpckcEMnepOBB' });
                }
            }
        }
    }, [actionData]);

    const progress = ((step + 1) / STEPS.length) * 100;

    const handleSelectStyle = (val: string) => {
        console.log('Selected Style:', val);
        setStyle(val);
    };

    const handleSelectLayout = (val: string) => {
        console.log('Selected Configuration:', val);
        setLayout(val);
    };

    const handleSelectPredefinedSize = (w: string, l: string) => {
        console.log('Selected Predefined Size:', w, 'x', l);
        setWidth(w);
        setLength(l);
    };

    const handleSelectFinish = (val: string) => {
        console.log('Selected Finish:', val);
        setFinish(val);
    };

    const handleSelectMaterial = (val: string) => {
        console.log('Selected Material:', val);
        setMaterial(val);
    };

    const handleStepNav = (i: number) => {
        console.log('Step navigated via headers to:', i);
        setStep(i);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('style', style);
        formData.append('layout', layout);
        formData.append('width', width);
        formData.append('length', length);
        formData.append('height', height);
        formData.append('finish', finish);
        formData.append('material', material);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('notes', notes);
        
        submit(formData, { method: "post" });
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            {/* Header */}
            <section className="py-16 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <span className="block font-sans text-[11px] font-bold tracking-[0.4em] uppercase text-[#4A89C8] mb-4">CUSTOM CONFIGURATOR</span>
                    <h1 className="font-display text-5xl md:text-6xl text-primary tracking-tight mb-4">Custom-made Showers</h1>
                    <div className="flex justify-center w-full">
                        <p className="max-w-xl font-sans text-gray-500 leading-relaxed text-center">
                            Design your perfect sanctuary. Follow the steps and our team will provide a tailored quote.
                        </p>
                    </div>
                </div>
            </section>

            {/* Progress */}
            <div className="bg-white border-b border-gray-100 sticky top-[78px] z-30 shadow-sm">
                <div className="h-1 bg-gray-100">
                    <div className="h-full bg-[#4A89C8] transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <div className="container mx-auto px-6">
                    <div className="flex justify-between py-4">
                        {STEPS.map((s, i) => (
                            <button key={s} type="button" onClick={() => handleStepNav(i)} className="flex items-center gap-2 text-left focus:outline-none cursor-pointer">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                                    step === i ? 'bg-primary text-white border-primary'
                                    : i < step ? 'bg-[#4A89C8] text-white border-[#4A89C8]'
                                    : 'bg-white text-gray-300 border-gray-200'
                                }`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className={`hidden md:block font-sans text-[10px] font-bold tracking-[0.2em] uppercase ${step >= i ? 'text-primary' : 'text-gray-300'}`}>{s}</span>
                            </button>
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
                            {submitted ? (
                                <div className="flex flex-col items-center justify-center space-y-8 py-10 text-center w-full">
                                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-3xl shadow-sm">
                                        ✓
                                    </div>
                                    <div className="flex flex-col items-center justify-center space-y-3 w-full">
                                        <h2 className="font-display text-4xl text-primary text-center">Thank You!</h2>
                                        <p className="font-sans text-gray-500 max-w-md text-center leading-relaxed">
                                            Your custom-made request has been successfully submitted. Our team will review your specifications and contact you within 24 hours to coordinate.
                                        </p>
                                    </div>
                                    <div className="pt-6 border-t border-gray-100 w-full max-w-xs">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSubmitted(false);
                                                setStep(0);
                                                setStyle('');
                                                setLayout('');
                                                setFinish('');
                                                setMaterial('');
                                                setFirstName('');
                                                setLastName('');
                                                setEmail('');
                                                setPhone('');
                                                setNotes('');
                                            }}
                                            className="w-full bg-[#14294f] text-white py-4 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[#4A89C8] transition-all duration-300 shadow-md cursor-pointer"
                                        >
                                            Configure Another
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {/* Step 0: Style */}
                                    {step === 0 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="font-display text-3xl text-primary mb-1">Choose your Style</h2>
                                                <p className="font-sans text-sm text-gray-400">The structural type of your shower enclosure.</p>
                                            </div>
                                            {STYLES.map(s => (
                                                <div key={s.name}
                                                    onClick={() => handleSelectStyle(s.name)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectStyle(s.name); }}
                                                    role="button"
                                                    tabIndex={0}
                                                    className={`block w-full p-7 text-left border rounded-sm transition-all duration-200 cursor-pointer focus:outline-none ${
                                                        style === s.name ? 'border-[#4A89C8] bg-[#4A89C8]/5 shadow-md ring-1 ring-[#4A89C8]' : 'border-gray-200 hover:border-gray-400 focus:border-gray-400'
                                                    }`}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-display text-2xl text-primary">{s.name}</h3>
                                                        {style === s.name && (
                                                            <span className="w-5 h-5 rounded-full bg-[#4A89C8] flex items-center justify-center text-white text-[10px]">✓</span>
                                                        )}
                                                    </div>
                                                    <p className="font-sans text-sm text-gray-500">{s.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Step 1: Configurations */}
                                    {step === 1 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="font-display text-3xl text-primary mb-1">Select Configuration</h2>
                                                <p className="font-sans text-sm text-gray-400">How the enclosure fits into your bathroom.</p>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                                {CONFIGURATIONS.map(l => (
                                                    <div key={l}
                                                        onClick={() => handleSelectLayout(l)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectLayout(l); }}
                                                        role="button"
                                                        tabIndex={0}
                                                        className={`block p-4 md:p-8 flex flex-col justify-center items-center text-center border rounded-sm transition-all duration-200 cursor-pointer min-h-[120px] focus:outline-none ${
                                                            layout === l ? 'border-[#4A89C8] bg-[#4A89C8]/5 shadow-md ring-1 ring-[#4A89C8]' : 'border-gray-200 hover:border-gray-400 focus:border-gray-400'
                                                        }`}>
                                                        <h3 className="font-display text-base md:text-lg text-primary leading-tight">{l}</h3>
                                                        {layout === l && <div className="mt-2 w-6 h-1 bg-[#4A89C8] mx-auto" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Dimensions */}
                                    {step === 2 && (
                                        <div className="space-y-10">
                                            <div>
                                                <h2 className="font-display text-3xl text-primary mb-1">Define Dimensions</h2>
                                                <p className="font-sans text-sm text-gray-400">Select standard dimensions or enter a custom size.</p>
                                            </div>
                                            <div>
                                                <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Standard Sizes</p>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {PREDEFINED_SIZES.map(sz => {
                                                        const isSelected = width === sz.w && length === sz.l;
                                                        return (
                                                            <button key={`${sz.w}x${sz.l}`} type="button"
                                                                onClick={() => handleSelectPredefinedSize(sz.w, sz.l)}
                                                                className={`block p-4 text-center border rounded-sm font-bold text-sm transition-all duration-200 cursor-pointer ${
                                                                    isSelected ? 'border-[#4A89C8] bg-[#4A89C8]/5 text-[#4A89C8] shadow-md ring-1 ring-[#4A89C8]' : 'border-gray-200 text-primary hover:border-gray-400'
                                                                }`}>
                                                                {sz.w} x {sz.l}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-gray-100 space-y-6">
                                                <div>
                                                    <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Custom Size (mm)</p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="block font-sans text-[10px] font-bold tracking-[0.1em] text-gray-400">Width</label>
                                                            <input
                                                                type="number"
                                                                value={width}
                                                                onChange={(e) => setWidth(e.target.value)}
                                                                className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#4A89C8] transition-colors font-sans text-primary bg-transparent text-sm"
                                                                placeholder="Width in mm"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="block font-sans text-[10px] font-bold tracking-[0.1em] text-gray-400">Length</label>
                                                            <input
                                                                type="number"
                                                                value={length}
                                                                onChange={(e) => setLength(e.target.value)}
                                                                className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#4A89C8] transition-colors font-sans text-primary bg-transparent text-sm"
                                                                placeholder="Length in mm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Height (mm)</p>
                                                    <div className="max-w-xs space-y-2">
                                                        <input
                                                            type="number"
                                                            value={height}
                                                            onChange={(e) => setHeight(e.target.value)}
                                                            className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#4A89C8] transition-colors font-sans text-primary bg-transparent text-sm"
                                                            placeholder="2000"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Hardware */}
                                    {step === 3 && (
                                        <div className="space-y-10">
                                            <div className="space-y-6">
                                                <div>
                                                    <h2 className="font-display text-3xl text-primary mb-1">Choose Finish</h2>
                                                    <p className="font-sans text-sm text-gray-400">Hardware finish for your enclosure hinges and brackets.</p>
                                                </div>
                                                <div className="space-y-3">
                                                    {FINISHES.map(f => (
                                                        <div key={f.name}
                                                            onClick={() => handleSelectFinish(f.name)}
                                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectFinish(f.name); }}
                                                            role="button"
                                                            tabIndex={0}
                                                            className={`w-full flex items-center gap-5 p-5 border rounded-sm transition-all duration-200 text-left cursor-pointer focus:outline-none ${
                                                                finish === f.name ? 'border-[#4A89C8] bg-[#4A89C8]/5 shadow-md ring-1 ring-[#4A89C8]' : 'border-gray-200 hover:border-gray-400 focus:border-gray-400'
                                                            }`}>
                                                            <div className="w-10 h-10 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: f.color }} />
                                                            <div className="flex-1 flex items-center">
                                                                <span className="font-sans text-sm font-bold uppercase tracking-[0.15em] text-primary">{f.name}</span>
                                                                <div className="relative group inline-block ml-2 cursor-pointer z-20">
                                                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-400 hover:text-[#4A89C8] hover:border-[#4A89C8] text-[10px] font-serif font-bold transition-colors">
                                                                        i
                                                                    </span>
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-[#14294f] text-white text-xs rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 text-center normal-case tracking-normal leading-relaxed">
                                                                        {f.desc}
                                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#14294f]" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {finish === f.name && <span className="w-5 h-5 rounded-full bg-[#4A89C8] text-white flex items-center justify-center text-[10px]">✓</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-gray-100 space-y-6">
                                                <div>
                                                    <h2 className="font-display text-3xl text-primary mb-1">Choose Material</h2>
                                                    <p className="font-sans text-sm text-gray-400">Hinges and brackets primary material.</p>
                                                </div>
                                                <div className="space-y-3">
                                                    {MATERIALS.map(m => (
                                                        <div key={m.name}
                                                            onClick={() => handleSelectMaterial(m.name)}
                                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectMaterial(m.name); }}
                                                            role="button"
                                                            tabIndex={0}
                                                            className={`w-full flex items-center justify-between p-5 border rounded-sm transition-all duration-200 text-left cursor-pointer focus:outline-none ${
                                                                material === m.name ? 'border-[#4A89C8] bg-[#4A89C8]/5 shadow-md ring-1 ring-[#4A89C8]' : 'border-gray-200 hover:border-gray-400 focus:border-gray-400'
                                                            }`}>
                                                            <div className="flex-1 flex items-center">
                                                                <span className="font-sans text-sm font-bold uppercase tracking-[0.15em] text-primary">{m.name}</span>
                                                                <div className="relative group inline-block ml-2 cursor-pointer z-20">
                                                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-400 hover:text-[#4A89C8] hover:border-[#4A89C8] text-[10px] font-serif font-bold transition-colors">
                                                                        i
                                                                    </span>
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#14294f] text-white text-xs rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 text-center normal-case tracking-normal leading-relaxed">
                                                                        {m.desc}
                                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#14294f]" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {material === m.name && <span className="w-5 h-5 rounded-full bg-[#4A89C8] text-white flex items-center justify-center text-[10px]">✓</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Details */}
                                    {step === 4 && (
                                        <form onSubmit={handleSubmit} className="space-y-6 max-w-none">
                                            <div>
                                                <h2 className="font-display text-3xl text-primary mb-1">Final Details</h2>
                                                <p className="font-sans text-sm text-gray-400">Add any notes and submit your request.</p>
                                            </div>
                                            {actionData?.error && (
                                                <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-8 font-sans text-sm">
                                                    {actionData.error}
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">First Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#4A89C8] transition-colors font-sans text-primary bg-transparent text-sm"
                                                        placeholder="First Name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Last Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                        className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#4A89C8] transition-colors font-sans text-primary bg-transparent text-sm"
                                                        placeholder="Last Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Email</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#4A89C8] transition-colors font-sans text-primary bg-transparent text-sm"
                                                        placeholder="Email Address"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#4A89C8] transition-colors font-sans text-primary bg-transparent text-sm"
                                                        placeholder="Phone Number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Notes</label>
                                                <textarea
                                                    rows={4}
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="Special requirements, site conditions..."
                                                    className="w-full border border-gray-200 p-4 rounded-sm outline-none focus:border-[#4A89C8] transition-colors font-sans text-primary bg-transparent resize-none text-sm"
                                                />
                                            </div>
                                            <div className="bg-gray-50 border border-gray-100 p-5 text-[11px] font-sans text-gray-500 leading-relaxed">
                                                Our team will contact you within 24 hours to arrange a site measurement before providing your final quote.
                                            </div>
                                        </form>
                                    )}

                                    {/* Navigation */}
                                    <div className="pt-10 mt-10 border-t border-gray-100 flex justify-between items-center">
                                        {step > 0 ? (
                                            <button type="button" onClick={() => setStep(step - 1)} className="px-8 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-primary transition-colors focus:outline-none cursor-pointer">
                                                ← Back
                                            </button>
                                        ) : <div />}

                                        {step < STEPS.length - 1 ? (
                                            <button type="button" onClick={() => setStep(step + 1)} className="bg-primary text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[#4A89C8] hover:text-white transition-all duration-300 shadow-lg inline-block focus:outline-none cursor-pointer">
                                                Next Step →
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="bg-[#4A89C8] text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-primary transition-all duration-300 shadow-lg focus:outline-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-[80px]">
                            <div className="bg-white border border-gray-100 shadow-sm p-8">
                                <h3 className="font-display text-2xl text-primary mb-6 pb-4 border-b border-gray-100">Your Configuration</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Style', value: style },
                                        { label: 'Configuration', value: layout },
                                        { label: 'Dimensions', value: `${width}mm x ${length}mm x ${height}mm` },
                                        { label: 'Hardware Finish', value: finish },
                                        { label: 'Hardware Material', value: material },
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
                                <div className="w-8 h-px bg-[#4A89C8] my-4" />
                                <a href="tel:0313129095" className="flex items-center gap-3 group">
                                    <svg className="w-4 h-4 text-[#4A89C8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="font-sans text-lg font-bold text-primary group-hover:text-[#4A89C8] transition-colors">031 312 9095</span>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
