import { useState } from 'react';

export function ProductTabs({ description }: { description: string }) {
    const [activeTab, setActiveTab] = useState<'description' | 'delivery' | 'returns'>('description');

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'delivery', label: 'Delivery & Returns' },
        { id: 'returns', label: 'Guarantee' },
    ] as const;

    return (
        <div className="mt-12 border-t border-gray-100 pt-8">
            <div className="flex border-b border-gray-100 mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              pb-4 px-4 font-display text-sm uppercase tracking-widest transition-colors whitespace-nowrap
              ${activeTab === tab.id
                                ? 'text-primary border-b-2 border-primary -mb-[1px]'
                                : 'text-gray-400 hover:text-primary'}
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="font-sans font-light text-gray-600 prose prose-sm max-w-none">
                {activeTab === 'description' && (
                    <div dangerouslySetInnerHTML={{ __html: description }} />
                )}

                {activeTab === 'delivery' && (
                    <div className="space-y-4">
                        <p><strong>Standard Delivery:</strong> 3-5 working days.</p>
                        <p><strong>Express Delivery:</strong> Next working day if ordered before 12pm.</p>
                        <p>We offer a hassle-free 30-day return policy for all unused items in their original packaging.</p>
                    </div>
                )}

                {activeTab === 'returns' && (
                    <div className="space-y-4">
                        <p>All ShowerHaus products come with a minimum 5-year manufacturer guarantee.</p>
                        <p>Our brassware and ceramics are covered for 10 years against manufacturing defects.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
