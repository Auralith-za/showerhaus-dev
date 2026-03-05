export interface MockProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    price: string;
    currency: string;
    image: string;
    collection: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
    {
        id: 'mock-1',
        title: 'Mineral Grey Suite',
        handle: 'horizon-frameless-enclosure',
        description: 'A sleek, modern frameless shower enclosure with 10mm toughened glass and polished chrome fittings.',
        price: '849.00',
        currency: 'ZAR',
        image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/modern-bathroom-wood-grey-tiles-mineral-tiles.png.webp',
        collection: 'showers',
    },
    {
        id: 'mock-2',
        title: 'Hidraulico Decor',
        handle: 'linear-walk-in-screen',
        description: 'Minimalist walk-in shower screen designed for wet rooms. Features Easy-Clean glass coating.',
        price: '425.00',
        currency: 'ZAR',
        image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/hidraulico-decor-2-2.jpg',
        collection: 'showers',
    },
    {
        id: 'mock-3',
        title: 'Contemporary Spa',
        handle: 'orbit-led-mirror',
        description: 'Circular architectural mirror with integrated touch-sensor LED lighting and demister pad.',
        price: '295.00',
        currency: 'ZAR',
        image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/contemporary-bathroom.jpg',
        collection: 'mirrors',
    },
    {
        id: 'mock-4',
        title: 'Streamline House',
        handle: 'apex-thermostatic-valve',
        description: 'Dual-outlet thermostatic shower mixer in brushed brass. Precision temperature control.',
        price: '185.00',
        currency: 'ZAR',
        image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/streamline-house-hufft-imge941bd7c0c6f2d3d_14-3747-1-fcbd831.jpg',
        collection: 'spares-accessories',
    },
    {
        id: 'mock-5',
        title: 'Edge Semi-Frameless Screen',
        handle: 'edge-semi-frameless-screen',
        description: 'Elegant semi-frameless bath screen with a pivot door and chrome profile.',
        price: '315.00',
        currency: 'ZAR',
        image: 'https://images.unsplash.com/photo-1553136591-143bc373180c?q=80&w=1000&auto=format&fit=crop',
        collection: 'bath-enclosures',
    },
];

export function getMockRecommendedProducts() {
    return {
        products: {
            nodes: MOCK_PRODUCTS.slice(0, 4).map(p => ({
                id: p.id,
                title: p.title,
                handle: p.handle,
                priceRange: {
                    minVariantPrice: {
                        amount: p.price,
                        currencyCode: p.currency,
                    },
                },
                featuredImage: {
                    id: p.id + '-img',
                    url: p.image,
                    altText: p.title,
                    width: 1000,
                    height: 1000,
                },
            })),
        },
    };
}
