import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { useLoaderData, Form, useActionData, useNavigation, useSearchParams, Link } from 'react-router';
import { useState } from 'react';
import { Money } from '@shopify/hydrogen';
import { MOCK_PRODUCTS } from '~/lib/mockData';

export async function loader({ context }: LoaderFunctionArgs) {
  const cart = await context.cart.get();
  
  if (!cart?.lines?.nodes?.length) {
      // If no items, probably shouldn't be here, but we'll show empty state
  }
  
  return Response.json({ cart: cart as any });
}

export default function Checkout() {
    const { cart } = useLoaderData<typeof loader>() as { cart: any };
    const [searchParams, setSearchParams] = useSearchParams();
    const currentStep = searchParams.get('step') || '1';
    const step = parseInt(currentStep, 10) as 1 | 2 | 3;
    
    // Form state
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        province: '',
        zip: '',
        phone: '',
        shippingRate: '150.00', // Standard mock
        shippingTitle: 'Standard Courier',
        billingFirstName: '',
        billingLastName: '',
        billingAddress: '',
        billingCity: '',
        billingProvince: '',
        billingZip: '',
    });
    const [sameBilling, setSameBilling] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const setStep = (newStep: number) => {
        setSearchParams(prev => {
            prev.set('step', newStep.toString());
            return prev;
        }, { preventScrollReset: true });
    };

    const nextStep = () => setStep(Math.min(step + 1, 3));
    const prevStep = () => setStep(Math.max(step - 1, 1));

    const subtotal = cart?.cost?.subtotalAmount?.amount ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
    const shippingAmount = parseFloat(formData.shippingRate);
    const totalAmount = subtotal + shippingAmount;

    return (
        <div className="bg-[#f7f7f7] min-h-screen pb-20 font-sans">
            {/* Top Navigation Bar / Breadcrumbs */}
            <div className="border-b border-gray-200 bg-[#f7f7f7] py-6">
                <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                    <div className="hidden"></div>
                    
                    <div className="hidden md:flex items-center gap-4 text-[10px] tracking-[0.1em] text-primary uppercase">
                        <span className="text-primary font-semibold cursor-pointer">Cart</span>
                        <span>›</span>
                        <span className={step >= 1 ? 'text-primary font-semibold' : ''}>Address Details</span>
                        <span>›</span>
                        <span className={step >= 2 ? 'text-primary font-semibold' : ''}>Delivery & Collection</span>
                        <span>›</span>
                        <span className={step >= 3 ? 'text-primary font-semibold' : ''}>Payment</span>
                    </div>

                    <div className="text-[10px] text-primary tracking-wider hidden lg:block">
                        Need Help? <a href="/contact" className="underline hover:text-primary transition-colors">Contact Us</a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 max-w-7xl pt-16">
                
                <h1 className="font-display text-4xl text-primary mb-12 tracking-[0.15em] uppercase font-light">
                    {step === 1 && 'Address Details'}
                    {step === 2 && 'Delivery & Collection'}
                    {step === 3 && 'Payment'}
                </h1>
                
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    
                    {/* Left Column: Form Steps */}
                    <div className="flex-1 w-full max-w-2xl">

                        <div>
                            {step === 1 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        
                                        <div className="md:col-span-2">
                                            <h2 className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-200 pb-3 mb-6">Contact</h2>
                                            <div>
                                                <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Email *</label>
                                                <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" placeholder="you@example.com" />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 mt-4">
                                            <h2 className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-200 pb-3 mb-6">Shipping Address</h2>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">First Name *</label>
                                            <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Last Name *</label>
                                            <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Street Address *</label>
                                            <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" placeholder="123 Street Name" />
                                        </div>

                                        <div>
                                            <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Town / City *</label>
                                            <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Province / State</label>
                                            <div className="relative">
                                                <select name="province" value={formData.province} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors appearance-none text-sm text-primary">
                                                    <option value="">Select...</option>
                                                    <option value="GT">Gauteng</option>
                                                    <option value="WC">Western Cape</option>
                                                    <option value="KZN">KwaZulu-Natal</option>
                                                    <option value="EC">Eastern Cape</option>
                                                    <option value="FS">Free State</option>
                                                    <option value="MP">Mpumalanga</option>
                                                    <option value="NW">North West</option>
                                                    <option value="NC">Northern Cape</option>
                                                    <option value="LP">Limpopo</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                                    <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Post Code *</label>
                                            <input name="zip" value={formData.zip} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Phone Number *</label>
                                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" />
                                        </div>
                                    </div>

                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-fade-in">
                                    <h2 className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-200 pb-3 mb-6">Shipping Method</h2>
                                    
                                    <div className="border border-gray-200 bg-white flex flex-col rounded-sm overflow-hidden">
                                        <label className={`flex items-center gap-4 cursor-pointer p-5 transition-colors ${formData.shippingRate === '150.00' ? 'bg-[#f4f7f8]' : 'hover:bg-gray-50'}`}>
                                            <input type="radio" name="shippingRate" value="150.00" checked={formData.shippingRate === '150.00'} onChange={(e) => {handleChange(e); setFormData(p => ({...p, shippingTitle: 'Standard Courier'}))}} className="w-4 h-4 text-primary accent-primary" />
                                            <div className="flex-1">
                                                <span className="block font-semibold text-sm">Standard Courier</span>
                                                <span className="block text-xs text-primary mt-1">3-5 business days</span>
                                            </div>
                                            <span className="font-semibold text-sm">ZAR 150.00</span>
                                        </label>
                                        <hr className="border-gray-200 m-0" />
                                        <label className={`flex items-center gap-4 cursor-pointer p-5 transition-colors ${formData.shippingRate === '350.00' ? 'bg-[#f4f7f8]' : 'hover:bg-gray-50'}`}>
                                            <input type="radio" name="shippingRate" value="350.00" checked={formData.shippingRate === '350.00'} onChange={(e) => {handleChange(e); setFormData(p => ({...p, shippingTitle: 'Express Delivery'}))}} className="w-4 h-4 text-primary accent-primary" />
                                            <div className="flex-1">
                                                <span className="block font-semibold text-sm">Express Delivery</span>
                                                <span className="block text-xs text-primary mt-1">1-2 business days</span>
                                            </div>
                                            <span className="font-semibold text-sm">ZAR 350.00</span>
                                        </label>
                                        <hr className="border-gray-200 m-0" />
                                        <label className={`flex items-center gap-4 cursor-pointer p-5 transition-colors ${formData.shippingRate === '0.00' ? 'bg-[#f4f7f8]' : 'hover:bg-gray-50'}`}>
                                            <input type="radio" name="shippingRate" value="0.00" checked={formData.shippingRate === '0.00'} onChange={(e) => {handleChange(e); setFormData(p => ({...p, shippingTitle: 'Store Collection'}))}} className="w-4 h-4 text-primary accent-primary" />
                                            <div className="flex-1">
                                                <span className="block font-semibold text-sm">Store Collection</span>
                                                <span className="block text-xs text-primary mt-1">Ready within 24 hours</span>
                                            </div>
                                            <span className="font-semibold text-sm">Free</span>
                                        </label>
                                    </div>

                                    <div className="flex mt-8 pt-8 border-t border-gray-200">
                                        <Link 
                                            to={`?step=1`}
                                            preventScrollReset={true}
                                            className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase hover:text-primary transition-colors cursor-pointer text-center lg:text-left pt-2 lg:pt-0"
                                        >
                                            Return to Information
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8 animate-fade-in">
                                    <h2 className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-200 pb-3 mb-6">Payment</h2>
                                    
                                    <div className="flex items-center gap-4 border border-gray-200 bg-white p-6">
                                        <input type="radio" readOnly checked className="w-4 h-4 text-primary accent-primary" />
                                        <div className="flex-1">
                                            <span className="block text-sm font-semibold text-primary">Card - Payfast Payment</span>
                                            <span className="block text-xs text-primary mt-1">Your order confirmation will be sent to <span className="font-bold text-primary">{formData.email}</span></span>
                                        </div>
                                        <img src="https://my.payfast.io/images/payfast_logo.svg" alt="Payfast" className="h-6 opacity-80" />
                                    </div>

                                    <h2 className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-200 pb-3 mb-6 mt-12">Billing Address</h2>
                                    <div className="border border-gray-200 bg-white rounded-sm mb-8 flex flex-col overflow-hidden">
                                        <div 
                                            onClick={() => setSameBilling(true)}
                                            className={`flex items-center gap-4 cursor-pointer p-5 transition-colors select-none ${sameBilling ? 'bg-[#f4f7f8]' : 'hover:bg-gray-50'}`}
                                        >
                                            <input type="radio" name="billingChoice" checked={sameBilling} readOnly className="w-4 h-4 text-primary accent-primary cursor-pointer pointer-events-none" />
                                            <span className="text-sm font-semibold text-primary">Same as shipping address</span>
                                        </div>
                                        
                                        <hr className="border-gray-200 m-0" />
                                        
                                        <div 
                                            onClick={() => setSameBilling(false)}
                                            className={`flex items-center gap-4 cursor-pointer p-5 transition-colors select-none ${!sameBilling ? 'bg-[#f4f7f8]' : 'hover:bg-gray-50'}`}
                                        >
                                            <input type="radio" name="billingChoice" checked={!sameBilling} readOnly className="w-4 h-4 text-primary accent-primary cursor-pointer pointer-events-none" />
                                            <span className="text-sm font-semibold text-primary">Use a different billing address</span>
                                        </div>
                                        
                                        {!sameBilling && (
                                            <div className="p-6 border-t border-gray-200 space-y-4 bg-[#f9fafb] animate-fade-in block">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                    <div>
                                                        <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">First Name *</label>
                                                        <input autoComplete="billing given-name" name="billingFirstName" value={formData.billingFirstName} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Last Name *</label>
                                                        <input autoComplete="billing family-name" name="billingLastName" value={formData.billingLastName} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Street Address *</label>
                                                        <input autoComplete="billing street-address" name="billingAddress" value={formData.billingAddress} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" placeholder="123 Street Name" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Town / City *</label>
                                                        <input autoComplete="billing address-level2" name="billingCity" value={formData.billingCity} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Post Code *</label>
                                                        <input autoComplete="billing postal-code" name="billingZip" value={formData.billingZip} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[8px] uppercase tracking-[0.15em] text-primary mb-2">Province / State *</label>
                                                        <div className="relative">
                                                            <select autoComplete="billing address-level1" name="billingProvince" value={formData.billingProvince} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3.5 focus:border-primary focus:ring-0 outline-none transition-colors appearance-none text-sm text-primary">
                                                                <option value="">Select...</option>
                                                                <option value="GT">Gauteng</option>
                                                                <option value="WC">Western Cape</option>
                                                                <option value="KZN">KwaZulu-Natal</option>
                                                                <option value="EC">Eastern Cape</option>
                                                                <option value="FS">Free State</option>
                                                                <option value="MP">Mpumalanga</option>
                                                                <option value="NW">North West</option>
                                                                <option value="NC">Northern Cape</option>
                                                                <option value="LP">Limpopo</option>
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                                                <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Form action="/api/payfast" method="post" className="mt-8 pt-8 border-t border-gray-200">
                                        <input type="hidden" name="cartId" value={cart?.id || ''} />
                                        <input type="hidden" name="amount" value={totalAmount.toFixed(2)} />
                                        {Object.entries(formData).map(([k, v]) => (
                                            <input key={k} type="hidden" name={k} value={v} />
                                        ))}
                                        
                                        <div className="flex flex-col-reverse lg:flex-row justify-between lg:items-center gap-6">
                                            <Link 
                                                to={`?step=2`}
                                                preventScrollReset={true}
                                                className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase hover:text-primary transition-colors cursor-pointer text-center lg:text-left pt-2 lg:pt-0"
                                            >
                                                Return to Shipping
                                            </Link>
                                            <button type="submit" className="w-full lg:w-auto bg-primary !text-white border border-primary px-10 py-5 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-secondary transition-colors cursor-pointer text-center">
                                                Pay Now
                                            </button>
                                        </div>
                                    </Form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-[420px]">
                        <div className="bg-white p-8 lg:p-10 border border-gray-100 h-fit lg:sticky lg:top-24 rounded-sm">
                            <h2 className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary border-b border-gray-200 pb-3 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6 pt-2 text-[10px] uppercase tracking-[0.15em] text-primary">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-primary/70">Subtotal</span>
                                    <span className="font-bold font-sans tracking-wide text-sm">{cart?.cost?.subtotalAmount ? <Money data={cart?.cost?.subtotalAmount} /> : 'ZAR 0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-primary/70">Tax</span>
                                    <span className="font-bold">Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-primary/70">Delivery Fee</span>
                                    <span className="font-bold">{shippingAmount === 0 ? 'Free' : `ZAR ${shippingAmount.toFixed(2)}`}</span>
                                </div>

                            </div>
                            
                            <div className="flex justify-between items-center py-6 border-t border-b border-gray-200 mb-8 text-[11px] uppercase tracking-[0.2em] text-primary font-bold">
                                <span>Total</span>
                                <span className="font-sans text-xl tracking-normal text-primary">ZAR {totalAmount.toFixed(2)}</span>
                            </div>
                            
                            {step < 3 && (
                                <Link 
                                    to={step === 1 ? `?step=2` : `?step=3`}
                                    preventScrollReset={true}
                                    className="block w-full bg-primary !text-white border border-primary px-10 py-5 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-secondary transition-colors cursor-pointer text-center select-none"
                                >
                                    {step === 1 ? 'Continue to Delivery & Collection' : 'Continue to Payment'}
                                </Link>
                            )}

                             {/* Minimalist Cart Item toggle representation */}
                            <div className="border border-gray-100 bg-gray-50 flex items-center justify-between p-6 mt-8 rounded-sm">
                                <div className="flex items-center gap-4 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <span>{cart?.totalQuantity || 0} items in your cart</span>
                                </div>
                                <a href="/cart" className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary hover:text-secondary underline underline-offset-4 transition-colors">Modify</a>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
