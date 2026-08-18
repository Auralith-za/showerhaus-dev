import { useState, useEffect } from 'react';
import { Link, useActionData, useLoaderData, useNavigation, useSubmit } from 'react-router';
import { renderToStaticMarkup } from 'react-dom/server';
import { Resend } from 'resend';
import BespokeEmail from '~/components/BespokeEmail';
import { createTimestampToken, verifyFormSubmission } from '~/lib/antiSpam';

// --- DATA STRUCTURES BASED ON LOGIC MATRIX ---

export interface ShapeConfig {
    id: string;
    name: string;
    subtitle: string;
    allowedTypes: ('Frameless' | 'Semi-Frameless' | 'Framed')[];
    measurementMode: 'WH' | 'WLH'; // WxH vs WxLxH
    note?: string;
    defaultSizes: { w: string; l?: string; h: string }[];
}

export const SHAPES: ShapeConfig[] = [
    {
        id: 'shower-screen',
        name: 'Shower screen',
        subtitle: 'Walk-in single fixed panel or screen',
        allowedTypes: ['Frameless', 'Semi-Frameless', 'Framed'],
        measurementMode: 'WH',
        defaultSizes: [
            { w: '800', h: '2000' },
            { w: '900', h: '2000' },
            { w: '1000', h: '2000' },
            { w: '1100', h: '2000' },
            { w: '1200', h: '2000' },
            { w: '1400', h: '2000' },
        ],
    },
    {
        id: 'alcove',
        name: 'Alcove (between two walls)',
        subtitle: 'Enclosure or door fitted between two solid walls',
        allowedTypes: ['Frameless', 'Semi-Frameless', 'Framed'],
        measurementMode: 'WH',
        note: 'Subject to width, our sales rep will discuss the exact configuration & door split.',
        defaultSizes: [
            { w: '900', h: '2000' },
            { w: '1000', h: '2000' },
            { w: '1100', h: '2000' },
            { w: '1200', h: '2000' },
            { w: '1400', h: '2000' },
            { w: '1600', h: '2000' },
        ],
    },
    {
        id: 'two-sided',
        name: 'Two-sided enclosure',
        subtitle: 'Corner setup with front door and one return panel',
        allowedTypes: ['Frameless', 'Semi-Frameless', 'Framed'],
        measurementMode: 'WLH',
        note: 'Subject to width, our sales rep will discuss the optimal layout & door placement.',
        defaultSizes: [
            { w: '900', l: '900', h: '2000' },
            { w: '900', l: '1000', h: '2000' },
            { w: '900', l: '1100', h: '2000' },
            { w: '1000', l: '1000', h: '2000' },
            { w: '1000', l: '1200', h: '2000' },
            { w: '1200', l: '1200', h: '2000' },
        ],
    },
    {
        id: 'three-sided',
        name: 'Three-sided enclosure',
        subtitle: 'U-shaped enclosure against a single flat wall',
        allowedTypes: ['Frameless', 'Framed'],
        measurementMode: 'WLH',
        defaultSizes: [
            { w: '900', l: '900', h: '2000' },
            { w: '1000', l: '1000', h: '2000' },
            { w: '1000', l: '1200', h: '2000' },
            { w: '1200', l: '1200', h: '2000' },
        ],
    },
    {
        id: 'pentagonal',
        name: 'Pentagonal enclosure',
        subtitle: 'Neo-angle corner enclosure with angled center door',
        allowedTypes: ['Frameless', 'Framed'],
        measurementMode: 'WLH',
        defaultSizes: [
            { w: '900', l: '900', h: '2000' },
            { w: '1000', l: '1000', h: '2000' },
            { w: '1100', l: '1100', h: '2000' },
            { w: '1200', l: '1200', h: '2000' },
        ],
    },
    {
        id: 'corner-entry',
        name: 'Corner-entry enclosure',
        subtitle: 'Dual sliding or hinged doors meeting at a 90° corner',
        allowedTypes: ['Frameless', 'Semi-Frameless', 'Framed'],
        measurementMode: 'WLH',
        note: 'Subject to width, our sales rep will discuss the size guide and door clearance.',
        defaultSizes: [
            { w: '900', l: '900', h: '2000' },
            { w: '900', l: '1000', h: '2000' },
            { w: '1000', l: '1000', h: '2000' },
            { w: '1100', l: '1100', h: '2000' },
            { w: '1200', l: '1200', h: '2000' },
        ],
    },
    {
        id: 'sliding-door',
        name: 'Sliding door',
        subtitle: 'Space-saving smooth rolling sliding door system',
        allowedTypes: ['Frameless', 'Semi-Frameless', 'Framed'],
        measurementMode: 'WH',
        note: 'Subject to width, our sales rep will discuss opening clearance & door track guide.',
        defaultSizes: [
            { w: '1000', h: '2000' },
            { w: '1100', h: '2000' },
            { w: '1200', h: '2000' },
            { w: '1400', h: '2000' },
            { w: '1500', h: '2000' },
            { w: '1600', h: '2000' },
        ],
    },
    {
        id: 'other',
        name: 'Other',
        subtitle: 'Custom footprint, over-bath, or bespoke architectural design',
        allowedTypes: ['Frameless', 'Semi-Frameless', 'Framed'],
        measurementMode: 'WLH',
        defaultSizes: [
            { w: '900', l: '900', h: '2000' },
            { w: '1000', l: '1000', h: '2000' },
            { w: '1200', l: '900', h: '2000' },
            { w: '1500', l: '1000', h: '2000' },
        ],
    },
];

export interface FinishOption {
    name: string;
    color: string;
    border?: string;
    desc: string;
}

export interface TypeConfig {
    name: 'Frameless' | 'Semi-Frameless' | 'Framed';
    code: 'FL' | 'SF' | 'FR';
    desc: string;
    finishes: FinishOption[];
}

export const TYPES: Record<'Frameless' | 'Semi-Frameless' | 'Framed', TypeConfig> = {
    'Frameless': {
        name: 'Frameless',
        code: 'FL',
        desc: 'Minimalist 8–10mm safety glass for a seamless architectural look.',
        finishes: [
            { name: 'Polished Stainless Steel', color: '#E5E7EB', desc: 'Mirror-reflective marine-grade stainless steel.' },
            { name: 'Chrome', color: '#CBD5E1', desc: 'Classic bright mirror finish matching luxury tapware.' },
            { name: 'Antique Brass', color: '#B5A642', desc: 'Warm vintage aged brass finish with deep undertones.' },
            { name: 'Satin Gold', color: '#D4AF37', desc: 'Contemporary brushed gold for an elegant statement.' },
            { name: 'Black', color: '#1F2937', desc: 'Architectural matte black finish with durable coating.' },
        ],
    },
    'Semi-Frameless': {
        name: 'Semi-Frameless',
        code: 'SF',
        desc: 'A balance of slim perimeter structure and frameless open glass edges.',
        finishes: [
            { name: 'Chrome', color: '#CBD5E1', desc: 'Bright polished chrome perimeter framing and hardware.' },
        ],
    },
    'Framed': {
        name: 'Framed',
        code: 'FR',
        desc: 'Classic robust aluminum frame profiles engineered for high durability.',
        finishes: [
            { name: 'White', color: '#F9FAFB', border: '#D1D5DB', desc: 'Clean powder-coated gloss white architectural frame.' },
            { name: 'Black', color: '#1F2937', desc: 'Modern powder-coated matte black architectural frame.' },
            { name: 'Grey', color: '#6B7280', desc: 'Contemporary neutral charcoal/grey architectural frame.' },
        ],
    },
};

// --- SHAPE ICONS ---

function ShapeIcon({ shapeId, className = 'w-10 h-10' }: { shapeId: string; className?: string }) {
    switch (shapeId) {
        case 'shower-screen':
            return (
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M12 8V56" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
                    <rect x="8" y="8" width="4" height="48" fill="#CBD5E1" />
                    <rect x="12" y="18" width="38" height="3.5" rx="1" fill="#4A89C8" />
                    <rect x="12" y="16" width="3.5" height="7.5" fill="#14294F" rx="1" />
                    <path d="M50 20L58 20M54 16L58 20L54 24" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'alcove':
            return (
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect x="8" y="8" width="4" height="48" fill="#94A3B8" />
                    <rect x="52" y="8" width="4" height="48" fill="#94A3B8" />
                    <rect x="12" y="30" width="40" height="3.5" rx="1" fill="#4A89C8" />
                    <path d="M26 30C26 38 38 38 38 30" stroke="#4A89C8" strokeWidth="1.5" strokeDasharray="2 2" />
                    <circle cx="14" cy="32" r="2" fill="#14294F" />
                </svg>
            );
        case 'two-sided':
            return (
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect x="10" y="8" width="46" height="3.5" fill="#94A3B8" />
                    <rect x="8" y="8" width="3.5" height="48" fill="#94A3B8" />
                    <rect x="52" y="12" width="3.5" height="38" rx="1" fill="#4A89C8" />
                    <rect x="12" y="46" width="44" height="3.5" rx="1" fill="#4A89C8" />
                    <circle cx="54" cy="48" r="2.5" fill="#14294F" />
                </svg>
            );
        case 'three-sided':
            return (
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect x="8" y="10" width="48" height="3.5" fill="#94A3B8" />
                    <rect x="12" y="14" width="3.5" height="36" rx="1" fill="#4A89C8" />
                    <rect x="48" y="14" width="3.5" height="36" rx="1" fill="#4A89C8" />
                    <rect x="12" y="46" width="40" height="3.5" rx="1" fill="#4A89C8" />
                </svg>
            );
        case 'pentagonal':
            return (
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect x="10" y="8" width="46" height="3.5" fill="#94A3B8" />
                    <rect x="8" y="8" width="3.5" height="48" fill="#94A3B8" />
                    <path d="M12 52L22 52L46 28L52 28L52 12" stroke="#4A89C8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="22" y1="52" x2="46" y2="28" stroke="#14294F" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
            );
        case 'corner-entry':
            return (
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect x="10" y="8" width="46" height="3.5" fill="#94A3B8" />
                    <rect x="8" y="8" width="3.5" height="48" fill="#94A3B8" />
                    <rect x="52" y="12" width="3.5" height="22" rx="1" fill="#4A89C8" />
                    <rect x="12" y="48" width="22" height="3.5" rx="1" fill="#4A89C8" />
                    <path d="M42 42L50 50M46 50L50 50L50 46" stroke="#14294F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M34 48L52 34" stroke="#4A89C8" strokeWidth="2" strokeDasharray="3 3" />
                </svg>
            );
        case 'sliding-door':
            return (
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect x="8" y="12" width="3.5" height="40" fill="#94A3B8" />
                    <rect x="52" y="12" width="3.5" height="40" fill="#94A3B8" />
                    <rect x="12" y="28" width="22" height="3.5" rx="1" fill="#4A89C8" />
                    <rect x="30" y="34" width="22" height="3.5" rx="1" fill="#14294F" />
                    <path d="M36 44L46 44M42 41L46 44L42 47" stroke="#4A89C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect x="10" y="10" width="44" height="44" rx="2" stroke="#4A89C8" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M22 32H42M32 22V42" stroke="#14294F" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );
    }
}

// --- SERVER LOADER & ACTION ---

export async function loader({ context }: any) {
    const sessionSecret = (context.env as any)?.SESSION_SECRET;
    const formTimeToken = createTimestampToken(Date.now(), sessionSecret);
    return { formTimeToken };
}

export async function action({ request, context }: any) {
    const formData = await request.formData();
    const sessionSecret = (context.env as any)?.SESSION_SECRET;

    const spamCheck = verifyFormSubmission(formData, { secret: sessionSecret });
    if (spamCheck.isSpam) {
        console.warn(`[AntiSpam] Blocked custom shower inquiry spam. Reason: ${spamCheck.reason}`);
        return { success: true };
    }

    const shape = formData.get('shape') as string;
    const type = formData.get('type') as string;
    const width = formData.get('width') as string;
    const length = formData.get('length') as string;
    const height = formData.get('height') as string;
    const finish = formData.get('finish') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const notes = formData.get('notes') as string;

    if (!firstName || !lastName || !email || !phone) {
        return { error: 'Please fill out all required contact fields.' };
    }

    const resendApiKey = (context.env as any)?.RESEND_API_KEY;
    if (!resendApiKey) {
        console.warn('RESEND_API_KEY not configured. Simulating successful quote submission.');
        return { success: true };
    }

    const resend = new Resend(resendApiKey);

    try {
        const html = renderToStaticMarkup(
            <BespokeEmail
                shape={shape}
                type={type}
                width={width}
                length={length}
                height={height}
                finish={finish}
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
            subject: `New Custom Shower Request - ${firstName} ${lastName} (${shape})`,
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

// --- MAIN COMPONENT ---

export default function ShowerDesigner() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const submit = useSubmit();
    const isSubmitting = navigation.state === 'submitting';

    const [currentStep, setCurrentStep] = useState<0 | 1>(0);
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
    const activeShape = SHAPES.find((s) => s.id === selectedShapeId) || SHAPES[0];

    const [cardTab, setCardTab] = useState<'type' | 'size' | 'finish'>('type');

    const [selectedType, setSelectedType] = useState<'Frameless' | 'Semi-Frameless' | 'Framed'>('Frameless');
    const activeTypeConfig = TYPES[selectedType] || TYPES['Frameless'];

    const [width, setWidth] = useState<string>('900');
    const [length, setLength] = useState<string>('900');
    const [height, setHeight] = useState<string>('2000');

    const [selectedFinish, setSelectedFinish] = useState<string>('Polished Stainless Steel');

    // Customer info
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [jsVerified, setJsVerified] = useState('');

    useEffect(() => {
        setJsVerified('sh_js_ok_' + Date.now());
    }, []);

    useEffect(() => {
        if (selectedShapeId && !activeShape.allowedTypes.includes(selectedType)) {
            setSelectedType(activeShape.allowedTypes[0]);
        }
    }, [selectedShapeId, activeShape, selectedType]);

    useEffect(() => {
        const validFinishes = TYPES[selectedType]?.finishes || [];
        const isCurrentFinishValid = validFinishes.some((f) => f.name === selectedFinish);
        if (!isCurrentFinishValid && validFinishes.length > 0) {
            setSelectedFinish(validFinishes[0].name);
        }
    }, [selectedType, selectedFinish]);

    const handleSelectShape = (shape: ShapeConfig) => {
        setSelectedShapeId(shape.id);
        setCardTab('type');
        if (shape.defaultSizes && shape.defaultSizes.length > 0) {
            const firstPreset = shape.defaultSizes[0];
            setWidth(firstPreset.w);
            if (firstPreset.l) setLength(firstPreset.l);
            setHeight(firstPreset.h);
        }
    };

    const handleSelectPredefinedSize = (sz: { w: string; l?: string; h: string }) => {
        setWidth(sz.w);
        if (sz.l) setLength(sz.l);
        setHeight(sz.h);
    };

    useEffect(() => {
        if (actionData?.success) {
            setSubmitted(true);
            if (typeof window !== 'undefined') {
                const gtag = (window as any).gtag;
                if (typeof gtag === 'function') {
                    gtag('event', 'conversion', { send_to: 'AW-17650233161/jVP2CMfLpckcEMnepOBB' });
                }
            }
        }
    }, [actionData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('form_time_token', loaderData?.formTimeToken || '');
        formData.append('js_verified', jsVerified);
        formData.append('shape', activeShape.name);
        formData.append('type', selectedType);
        formData.append('width', width);
        if (activeShape.measurementMode === 'WLH') {
            formData.append('length', length);
        }
        formData.append('height', height);
        formData.append('finish', selectedFinish);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('notes', notes);

        submit(formData, { method: 'post' });
    };

    const activeFinishObj = activeTypeConfig.finishes.find((f) => f.name === selectedFinish) || activeTypeConfig.finishes[0];

    const formattedDimensionString = activeShape.measurementMode === 'WLH'
        ? `${width || 0} × ${length || 0} × ${height || 0} mm`
        : `${width || 0} × ${height || 0} mm`;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
            {/* Header Banner */}
            <section className="pt-10 pb-6 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <span className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-[#4A89C8] mb-2">
                        Bespoke Configurator
                    </span>
                    <h1 className="font-display text-2xl md:text-4xl text-[#14294F] tracking-tight font-bold mb-2">
                        Design Your Shower
                    </h1>
                    <p className="max-w-xl mx-auto text-slate-500 text-xs md:text-sm leading-relaxed">
                        Choose your shape to customize framing, dimensions, and luxury hardware finishes.
                    </p>
                </div>
            </section>

            {/* Stepper Navigation */}
            <div className="bg-white border-b border-slate-100 sticky top-[70px] z-30 shadow-2xs">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex items-center justify-between py-3">
                        <button
                            type="button"
                            onClick={() => setCurrentStep(0)}
                            className="flex items-center gap-2.5 text-left cursor-pointer transition-colors"
                        >
                            <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                    currentStep === 0
                                        ? 'bg-[#14294F] text-white shadow-xs'
                                        : 'bg-emerald-500 text-white'
                                }`}
                            >
                                {currentStep > 0 ? '✓' : '1'}
                            </span>
                            <div>
                                <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">Step 1</span>
                                <span className={`text-xs font-bold ${currentStep === 0 ? 'text-[#14294F]' : 'text-slate-600'}`}>
                                    Configure Enclosure
                                </span>
                            </div>
                        </button>

                        <div className="flex-1 mx-6 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#4A89C8] transition-all duration-300 rounded-full"
                                style={{ width: currentStep === 0 ? '50%' : '100%' }}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                if (selectedShapeId) setCurrentStep(1);
                            }}
                            className={`flex items-center gap-2.5 text-left transition-colors ${
                                selectedShapeId ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                            }`}
                        >
                            <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    currentStep === 1
                                        ? 'bg-[#14294F] text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-400'
                                }`}
                            >
                                2
                            </span>
                            <div>
                                <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">Step 2</span>
                                <span className={`text-xs font-bold ${currentStep === 1 ? 'text-[#14294F]' : 'text-slate-400'}`}>
                                    Confirm & Request Quote
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="py-8 md:py-10">
                <div className="container mx-auto px-6 max-w-5xl flex justify-center">
                    {submitted ? (
                        /* Thank You State */
                        <div 
                            className="bg-white border border-slate-200/80 shadow-sm p-10 md:p-14 max-w-2xl w-full mx-auto text-center rounded-xl"
                            style={{ margin: '0 auto', textAlign: 'center' }}
                        >
                            <div 
                                className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs"
                                style={{ margin: '0 auto 24px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: '28px', height: '28px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 
                                className="font-display text-2xl md:text-3xl text-[#14294F] font-bold mb-4 text-center"
                                style={{ textAlign: 'center', marginBottom: '18px' }}
                            >
                                Request Received
                            </h2>
                            <p
                                className="text-slate-600 max-w-lg mx-auto text-center text-balance text-sm md:text-base leading-relaxed"
                                style={{ 
                                    textAlign: 'center', 
                                    marginLeft: 'auto', 
                                    marginRight: 'auto', 
                                    maxWidth: '480px', 
                                    textWrap: 'balance', 
                                    lineHeight: '1.75',
                                    paddingLeft: '12px',
                                    paddingRight: '12px'
                                }}
                            >
                                Thank you{firstName ? <> <span className="font-semibold text-slate-800">{firstName}</span></> : null}. Our shower sales team will contact you within the next 1-2 working hours to finalise your quote or site visit for your <span className="font-semibold text-slate-800">{activeShape.name}</span> shower.
                            </p>

                            <div 
                                className="flex justify-center items-center"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}
                            >
                                <Link
                                    to="/"
                                    className="inline-flex items-center justify-center bg-[#14294F] text-white px-9 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#4A89C8] transition-colors rounded-lg shadow-sm cursor-pointer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#14294F',
                                        color: '#ffffff',
                                        padding: '14px 36px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        borderRadius: '8px',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Continue Browsing
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Configurator Column */}
                            <div className="lg:col-span-7">
                                {currentStep === 0 ? (
                                    selectedShapeId === null ? (
                                        /* 8 Shape Grid */
                                        <div className="bg-white border border-slate-200/80 p-6 md:p-7 rounded-xl shadow-xs">
                                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A89C8] block mb-0.5">
                                                        Step 1
                                                    </span>
                                                    <h2 className="font-display text-xl font-bold text-[#14294F]">
                                                        Select Layout Shape
                                                    </h2>
                                                </div>
                                                <span className="text-[11px] text-slate-400">
                                                    8 Options
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {SHAPES.map((shape) => (
                                                    <button
                                                        key={shape.id}
                                                        type="button"
                                                        onClick={() => handleSelectShape(shape)}
                                                        className="flex flex-col items-center text-center p-3.5 rounded-lg border border-slate-200 hover:border-[#4A89C8] hover:shadow-md hover:-translate-y-0.5 bg-white transition-all duration-200 cursor-pointer group"
                                                    >
                                                        <div className="w-12 h-12 mb-2 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                                                            <ShapeIcon shapeId={shape.id} className="w-10 h-10" />
                                                        </div>
                                                        <span className="font-display text-xs font-bold text-[#14294F] group-hover:text-[#4A89C8] leading-tight mb-1 transition-colors">
                                                            {shape.name}
                                                        </span>
                                                        <span className="text-[9px] text-slate-400 font-mono">
                                                            {shape.measurementMode === 'WH' ? 'W × H' : 'W × L × H'}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Sleek Enlarged Card */
                                        <div className="bg-white border border-slate-200/90 shadow-lg rounded-xl overflow-hidden transition-all duration-200">
                                            {/* Header */}
                                            <div className="p-4 md:p-5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-2xs">
                                                        <ShapeIcon shapeId={activeShape.id} className="w-7 h-7" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#4A89C8] block">
                                                            Selected Layout
                                                        </span>
                                                        <h3 className="font-display text-base md:text-lg font-bold text-[#14294F]">
                                                            {activeShape.name}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedShapeId(null)}
                                                    className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 text-[10px] font-semibold tracking-wider rounded-md transition-colors cursor-pointer flex items-center gap-1"
                                                >
                                                    <span>← Change</span>
                                                </button>
                                            </div>

                                            {/* Clean Segmented Sub-Tabs */}
                                            <div className="p-3 bg-slate-50/40 border-b border-slate-100">
                                                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/50 rounded-lg text-xs font-semibold">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCardTab('type')}
                                                        className={`py-2 px-3 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                                            cardTab === 'type'
                                                                ? 'bg-white text-[#14294F] shadow-xs font-bold'
                                                                : 'text-slate-500 hover:text-slate-800'
                                                        }`}
                                                    >
                                                        <span className="text-[10px] opacity-60">1.</span>
                                                        <span>Frame</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setCardTab('size')}
                                                        className={`py-2 px-3 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                                            cardTab === 'size'
                                                                ? 'bg-white text-[#14294F] shadow-xs font-bold'
                                                                : 'text-slate-500 hover:text-slate-800'
                                                        }`}
                                                    >
                                                        <span className="text-[10px] opacity-60">2.</span>
                                                        <span>Dimensions</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setCardTab('finish')}
                                                        className={`py-2 px-3 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                                            cardTab === 'finish'
                                                                ? 'bg-white text-[#14294F] shadow-xs font-bold'
                                                                : 'text-slate-500 hover:text-slate-800'
                                                        }`}
                                                    >
                                                        <span className="text-[10px] opacity-60">3.</span>
                                                        <span>Finish</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sub-Step Content */}
                                            <div className="p-5 md:p-6 min-h-[260px]">
                                                {/* TAB 1: TYPE */}
                                                {cardTab === 'type' && (
                                                    <div className="space-y-4 animate-fadeIn">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-semibold text-slate-700">
                                                                Select Structural Glass Type
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">
                                                                Filtered for {activeShape.name}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                            {(['Frameless', 'Semi-Frameless', 'Framed'] as const).map((tName) => {
                                                                const isAvailable = activeShape.allowedTypes.includes(tName);
                                                                const isSelected = selectedType === tName;
                                                                const config = TYPES[tName];

                                                                if (!isAvailable) {
                                                                    return (
                                                                        <div
                                                                            key={tName}
                                                                            className="p-3.5 border border-slate-100 bg-slate-50/50 rounded-lg opacity-40 cursor-not-allowed flex flex-col justify-between"
                                                                        >
                                                                            <div className="flex items-center justify-between mb-1">
                                                                                <span className="font-display text-xs font-medium text-slate-400">
                                                                                    {tName}
                                                                                </span>
                                                                                <span className="text-[8px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                                                                                    {config.code}
                                                                                </span>
                                                                            </div>
                                                                            <span className="text-[10px] text-slate-400">Not compatible</span>
                                                                        </div>
                                                                    );
                                                                }

                                                                return (
                                                                    <button
                                                                        key={tName}
                                                                        type="button"
                                                                        onClick={() => setSelectedType(tName)}
                                                                        className={`p-3.5 text-left border rounded-lg transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                                                                            isSelected
                                                                                ? 'border-[#4A89C8] bg-sky-50/40 ring-2 ring-[#4A89C8]/20 shadow-xs'
                                                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                                                        }`}
                                                                    >
                                                                        <div>
                                                                            <div className="flex items-center justify-between mb-1.5">
                                                                                <span className="font-display text-xs font-bold text-[#14294F]">
                                                                                    {tName}
                                                                                </span>
                                                                                <span
                                                                                    className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                                                                        isSelected
                                                                                            ? 'bg-[#4A89C8] text-white'
                                                                                            : 'bg-slate-100 text-slate-600'
                                                                                    }`}
                                                                                >
                                                                                    {config.code}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-[11px] text-slate-500 leading-snug font-sans line-clamp-2">
                                                                                {config.desc}
                                                                            </p>
                                                                        </div>
                                                                        <div className="mt-3 text-[9px] font-semibold text-[#4A89C8]">
                                                                            {config.finishes.length} Finishes Available
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* TAB 2: SIZE */}
                                                {cardTab === 'size' && (
                                                    <div className="space-y-4 animate-fadeIn">
                                                        {activeShape.note && (
                                                            <div className="bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                                                                <span className="text-amber-600">ℹ️</span>
                                                                <span className="text-[11px] leading-tight">{activeShape.note}</span>
                                                            </div>
                                                        )}

                                                        {/* Presets */}
                                                        {activeShape.defaultSizes && activeShape.defaultSizes.length > 0 && (
                                                            <div>
                                                                <label className="block text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
                                                                    Popular Standard Sizes (mm)
                                                                </label>
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                                    {activeShape.defaultSizes.map((sz, idx) => {
                                                                        const isMatch =
                                                                            width === sz.w &&
                                                                            (activeShape.measurementMode === 'WH' || length === sz.l) &&
                                                                            height === sz.h;
                                                                        const label =
                                                                            activeShape.measurementMode === 'WH'
                                                                                ? `${sz.w} × ${sz.h}`
                                                                                : `${sz.w} × ${sz.l} × ${sz.h}`;

                                                                        return (
                                                                            <button
                                                                                key={idx}
                                                                                type="button"
                                                                                onClick={() => handleSelectPredefinedSize(sz)}
                                                                                className={`py-2 px-2.5 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                                                                                    isMatch
                                                                                        ? 'border-[#4A89C8] bg-[#4A89C8] text-white shadow-2xs'
                                                                                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                                                                                }`}
                                                                            >
                                                                                {label} mm
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Custom dimensions */}
                                                        <div className="pt-2 border-t border-slate-100">
                                                            <label className="block text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
                                                                Custom Millimeter Inputs
                                                            </label>
                                                            <div
                                                                className={`grid gap-3 ${
                                                                    activeShape.measurementMode === 'WLH'
                                                                        ? 'grid-cols-3'
                                                                        : 'grid-cols-2'
                                                                }`}
                                                            >
                                                                <div>
                                                                    <label className="block text-[9px] font-bold text-slate-500 mb-1">
                                                                        Width (W) mm
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        value={width}
                                                                        onChange={(e) => setWidth(e.target.value)}
                                                                        className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 focus:border-[#4A89C8] focus:outline-none bg-slate-50/50"
                                                                    />
                                                                </div>

                                                                {activeShape.measurementMode === 'WLH' && (
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-slate-500 mb-1">
                                                                            Length (L) mm
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={length}
                                                                            onChange={(e) => setLength(e.target.value)}
                                                                            className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 focus:border-[#4A89C8] focus:outline-none bg-slate-50/50"
                                                                        />
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    <label className="block text-[9px] font-bold text-slate-500 mb-1">
                                                                        Height (H) mm
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        value={height}
                                                                        onChange={(e) => setHeight(e.target.value)}
                                                                        className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 focus:border-[#4A89C8] focus:outline-none bg-slate-50/50"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* TAB 3: FINISH */}
                                                {cardTab === 'finish' && (
                                                    <div className="space-y-3 animate-fadeIn">
                                                        <span className="text-xs font-semibold text-slate-700 block">
                                                            Hardware Finish for {selectedType}
                                                        </span>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                            {activeTypeConfig.finishes.map((f) => {
                                                                const isSelected = selectedFinish === f.name;
                                                                return (
                                                                    <div
                                                                        key={f.name}
                                                                        onClick={() => setSelectedFinish(f.name)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter' || e.key === ' ') setSelectedFinish(f.name);
                                                                        }}
                                                                        role="button"
                                                                        tabIndex={0}
                                                                        className={`flex items-center justify-between p-2.5 border rounded-lg transition-all cursor-pointer ${
                                                                            isSelected
                                                                                ? 'border-[#4A89C8] bg-sky-50/40 ring-2 ring-[#4A89C8]/20 shadow-2xs'
                                                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-2.5">
                                                                            <div
                                                                                className="w-6 h-6 rounded-full shadow-2xs flex-shrink-0"
                                                                                style={{
                                                                                    backgroundColor: f.color,
                                                                                    border: `1.5px solid ${f.border || '#CBD5E1'}`,
                                                                                }}
                                                                            />
                                                                            <div>
                                                                                <div className="text-xs font-bold text-[#14294F]">
                                                                                    {f.name}
                                                                                </div>
                                                                                <p className="text-[10px] text-slate-400 line-clamp-1">{f.desc}</p>
                                                                            </div>
                                                                        </div>
                                                                        {isSelected && (
                                                                            <span className="w-4 h-4 rounded-full bg-[#4A89C8] text-white flex items-center justify-center text-[9px] font-bold">
                                                                                ✓
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Single Unified Navigation Footer */}
                                            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                                                <div>
                                                    {cardTab !== 'type' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (cardTab === 'finish') setCardTab('size');
                                                                else if (cardTab === 'size') setCardTab('type');
                                                            }}
                                                            className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                                                        >
                                                            ← Back
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedShapeId(null)}
                                                            className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                                                        >
                                                            ← Change Shape
                                                        </button>
                                                    )}
                                                </div>

                                                <div>
                                                    {cardTab === 'type' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setCardTab('size')}
                                                            className="bg-[#14294F] hover:bg-[#4A89C8] text-white px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-colors cursor-pointer shadow-xs"
                                                        >
                                                            Next: Dimensions →
                                                        </button>
                                                    )}
                                                    {cardTab === 'size' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setCardTab('finish')}
                                                            className="bg-[#14294F] hover:bg-[#4A89C8] text-white px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-colors cursor-pointer shadow-xs"
                                                        >
                                                            Next: Finish →
                                                        </button>
                                                    )}
                                                    {cardTab === 'finish' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCurrentStep(1);
                                                                window.scrollTo({ top: 120, behavior: 'smooth' });
                                                            }}
                                                            className="bg-[#4A89C8] hover:bg-[#14294F] text-white px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer shadow-xs"
                                                        >
                                                            Confirm Details →
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    /* Step 2: Contact Form */
                                    <div className="bg-white border border-slate-200/80 p-6 md:p-8 rounded-xl shadow-xs space-y-6">
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A89C8] block mb-0.5">
                                                    Step 2
                                                </span>
                                                <h2 className="font-display text-2xl font-bold text-[#14294F]">
                                                    Your Contact Details
                                                </h2>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(0)}
                                                className="text-xs font-semibold text-[#4A89C8] hover:underline cursor-pointer"
                                            >
                                                ← Edit Configuration
                                            </button>
                                        </div>

                                        {actionData?.error && (
                                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs">
                                                {actionData.error}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                        First Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs text-slate-800 focus:border-[#4A89C8] focus:outline-none bg-slate-50/50"
                                                        placeholder="First Name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                        Last Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs text-slate-800 focus:border-[#4A89C8] focus:outline-none bg-slate-50/50"
                                                        placeholder="Last Name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                        Email Address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs text-slate-800 focus:border-[#4A89C8] focus:outline-none bg-slate-50/50"
                                                        placeholder="name@example.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                        Phone Number *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs text-slate-800 focus:border-[#4A89C8] focus:outline-none bg-slate-50/50"
                                                        placeholder="082 123 4567"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                    Site Notes or Special Requirements (Optional)
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    className="w-full border border-slate-200 p-2.5 rounded-lg text-xs text-slate-800 focus:border-[#4A89C8] focus:outline-none bg-slate-50/50 resize-none"
                                                    placeholder="Specify ceiling height, floor slope, or tile finishes..."
                                                />
                                            </div>

                                            <div className="pt-2 flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentStep(0)}
                                                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                                                >
                                                    ← Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="bg-[#4A89C8] hover:bg-[#14294F] text-white px-8 py-3 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                                                >
                                                    {isSubmitting ? 'Sending...' : 'Request Quotation →'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>

                            {/* Right Summary Column */}
                            <aside className="lg:col-span-5 lg:sticky lg:top-[130px] space-y-4">
                                <div className="bg-white border border-slate-200/80 shadow-sm p-5 md:p-6 rounded-xl">
                                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${selectedShapeId ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                            <h3 className="font-display text-base font-bold text-[#14294F]">
                                                Summary
                                            </h3>
                                        </div>
                                        <span className="text-[9px] font-mono font-bold tracking-wider text-[#4A89C8] uppercase bg-sky-50 px-2 py-0.5 rounded">
                                            Custom Build
                                        </span>
                                    </div>

                                    {selectedShapeId ? (
                                        <div className="space-y-4">
                                            <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-lg flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white border border-slate-200 rounded-md flex items-center justify-center flex-shrink-0">
                                                    <ShapeIcon shapeId={activeShape.id} className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h4 className="font-display text-xs font-bold text-[#14294F]">
                                                        {activeShape.name}
                                                    </h4>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                                        {selectedType} · {selectedFinish}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 text-xs">
                                                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                                                    <span className="text-slate-400 text-[11px]">Framing</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-semibold text-slate-800">{selectedType}</span>
                                                        <span className="text-[8px] font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded">
                                                            {activeTypeConfig.code}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                                                    <span className="text-slate-400 text-[11px]">Dimensions</span>
                                                    <span className="font-semibold text-slate-800 font-mono text-[11px]">
                                                        {formattedDimensionString}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                                                    <span className="text-slate-400 text-[11px]">Hardware Finish</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className="w-3 h-3 rounded-full border border-slate-300"
                                                            style={{ backgroundColor: activeFinishObj.color }}
                                                        />
                                                        <span className="font-semibold text-slate-800">{selectedFinish}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {currentStep === 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCurrentStep(1);
                                                        window.scrollTo({ top: 120, behavior: 'smooth' });
                                                    }}
                                                    className="w-full bg-[#14294F] hover:bg-[#4A89C8] text-white py-3 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-colors cursor-pointer shadow-xs"
                                                >
                                                    Continue to Quote →
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-slate-400 text-xs">
                                            Select a shower shape to view configuration details.
                                        </div>
                                    )}
                                </div>

                                {/* Support Box */}
                                <div className="bg-[#14294F] text-white p-5 rounded-xl">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8FB4E0] block mb-1">
                                        Expert Assistance
                                    </span>
                                    <h4 className="font-display text-sm font-bold mb-1">
                                        Need measurement advice?
                                    </h4>
                                    <p className="text-[11px] text-slate-300 mb-3 font-light">
                                        Our installation team is available to assist with site measurements and door clearances.
                                    </p>
                                    <a
                                        href="tel:0313129095"
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8FB4E0] hover:text-white uppercase tracking-wider transition-colors"
                                    >
                                        <span>031 312 9095</span>
                                        <span>→</span>
                                    </a>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
