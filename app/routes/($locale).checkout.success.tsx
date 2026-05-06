import { Link, useLoaderData } from 'react-router';
import { Money } from '@shopify/hydrogen';
import { useEffect, useState } from 'react';
import { MOCK_PRODUCTS } from '~/lib/mockData';

export async function loader({ request }: any) {
    // In a real app, you would fetch the order details from Shopify using the ID from params
    // For this demo, we'll use the last cart data or just some mock order data
    return {
        order: {
            id: 'SH-' + Math.floor(Math.random() * 90000 + 10000),
            date: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }),
            email: 'customer@example.com',
            total: '4500.00',
            subtotal: '4350.00',
            shipping: '150.00',
            items: [
                MOCK_PRODUCTS[0],
                MOCK_PRODUCTS[1],
            ]
        }
    };
}

export default function OrderSuccess() {
    const { order } = useLoaderData<typeof loader>();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className={`min-h-screen bg-white transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="container mx-auto px-6 py-24 max-w-4xl">
                
                {/* Header Success Animation/Icon */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-700">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="font-display text-4xl lg:text-5xl text-primary mb-4 tracking-tight">Thank you for your order</h1>
                    <p className="text-gray-500 font-sans max-w-md mx-auto leading-relaxed">
                        Your order <span className="font-bold text-primary">#{order.id}</span> has been placed successfully. 
                        A confirmation email has been sent to <span className="text-primary font-medium">{order.email}</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-gray-100 pt-16">
                    
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary mb-8 border-b border-gray-100 pb-3">Order Items</h2>
                            <div className="space-y-6">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-24 h-24 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                        </div>
                                        <div className="flex flex-col justify-center flex-1">
                                            <h3 className="font-sans text-sm font-semibold text-primary mb-1">{item.title}</h3>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Finish: Chrome / Size: Standard</p>
                                            <p className="font-sans text-sm font-bold text-primary">ZAR {item.price}</p>
                                        </div>
                                        <div className="flex items-center text-[10px] font-bold text-gray-400">
                                            QTY: 1
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary mb-4">Shipping Address</h3>
                                <p className="text-sm text-gray-500 font-sans leading-relaxed">
                                    John Doe<br />
                                    123 Designer Street<br />
                                    Sandton, Johannesburg<br />
                                    Gauteng, 2196<br />
                                    South Africa
                                </p>
                            </div>
                            <div>
                                <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary mb-4">Shipping Method</h3>
                                <p className="text-sm text-gray-500 font-sans leading-relaxed">
                                    Standard Courier<br />
                                    (3-5 Business Days)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-8 rounded-sm sticky top-24 border border-gray-100 shadow-sm">
                            <h2 className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary mb-6 border-b border-gray-200 pb-3">Summary</h2>
                            
                            <div className="space-y-4 text-[11px] font-sans text-primary/70 uppercase tracking-wider">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-primary">ZAR {order.subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-bold text-primary">ZAR {order.shipping}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-4 text-sm font-bold text-primary tracking-normal">
                                    <span>Total</span>
                                    <span>ZAR {order.total}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <p className="text-[10px] text-gray-400 italic mb-6 leading-relaxed">
                                    Need to make changes? Please contact us as soon as possible.
                                </p>
                                <Link 
                                    to="/collections/all"
                                    className="block w-full bg-primary text-white py-4 text-center text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-secondary transition-all rounded-sm shadow-md"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Message */}
                <div className="mt-24 text-center border-t border-gray-100 pt-12">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
                        Follow your order status in <Link to="/account" className="text-primary hover:underline underline-offset-4">Your Account</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}
