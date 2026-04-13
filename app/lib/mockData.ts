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
        image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/fjKXavfZcnZSsxLzuWvKQ8.jpg',
        collection: 'bath-enclosures',
    },
];

export function getMockRecommendedProducts() {
    const items = [...MOCK_PRODUCTS, ...MOCK_PRODUCTS]; // Repeat to easily get 10 items
    return {
        products: {
            nodes: items.slice(0, 10).map((p, index) => ({
                id: p.id + '-' + index,
                title: p.title,
                handle: p.handle,
                priceRange: {
                    minVariantPrice: {
                        amount: p.price,
                        currencyCode: p.currency,
                    },
                },
                featuredImage: {
                    id: p.id + '-img-' + index,
                    url: p.image,
                    altText: p.title,
                    width: 1000,
                    height: 1000,
                },
            })),
        },
    };
}
