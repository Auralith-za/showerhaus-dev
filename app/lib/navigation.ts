export interface MegaMenuSubItem {
    title: string;
    handle: string;
}

export interface MegaMenuCategory {
    title: string;
    handle: string;
    items?: MegaMenuSubItem[];
}

export interface MegaMenuItem {
    title: string;
    handle: string;
    categories?: MegaMenuCategory[];
    featuredImage?: string;
    featuredTitle?: string;
}

export const MEGA_MENU_ITEMS: MegaMenuItem[] = [
    {
        title: 'Showers',
        handle: 'showers',
        featuredImage: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/Modern_Bathroom_Ideas_We_Know_Will_Inspire_You_To_Create_LARGE.jpg.webp',
        featuredTitle: 'BATH ENCLOSURES',
        categories: [
            {
                title: 'Enclosures & Screens',
                handle: 'showers',
                items: [
                    { title: 'Frameless Shower Enclosures', handle: 'frameless-shower-enclosures' },
                    { title: 'Frameless Shower Screens', handle: 'frameless-shower-screens' },
                    { title: 'Framed Shower Enclosures', handle: 'framed-shower-enclosures' },
                    { title: 'Framed Shower Screens', handle: 'framed-shower-screens' },
                ],
            },
        ],
    },
    {
        title: 'Shower Spares',
        handle: 'shower-spares',
        featuredImage: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/PH_Andersen_Faci_Leboreiro_15.jpg.webp',
        featuredTitle: 'SPARES & ACCESSORIES',
        categories: [
            {
                title: 'All Spares',
                handle: 'shower-spares',
                items: [
                    { title: 'Accessories & Other', handle: 'accessories-other' },
                    { title: 'Bath Screens', handle: 'bath-screens' },
                    { title: 'Brackets & Wheels', handle: 'brackets-wheels' },
                    { title: 'Clamps', handle: 'clamps' },
                    { title: 'Consumables', handle: 'consumables' },
                    { title: 'Handles & Towel Rails', handle: 'handles-towel-rails' },
                    { title: 'Hinges', handle: 'hinges' },
                    { title: 'Knobs', handle: 'knobs' },
                    { title: 'Pivot Systems', handle: 'pivot-systems' },
                    { title: 'Profiles & Channels', handle: 'profiles-channels' },
                    { title: 'Stabiliser Systems', handle: 'stabiliser-systems' },
                ],
            },
        ],
    },
    {
        title: 'Consumables',
        handle: 'consumables',
        featuredImage: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/fjKXavfZcnZSsxLzuWvKQ8.jpg',
        featuredTitle: 'PREMIUM SEALANTS',
        categories: [
            {
                title: 'Sealing Products',
                handle: 'consumables',
                items: [
                    { title: 'Seals', handle: 'seals' },
                    { title: 'Silicone', handle: 'silicone' },
                ],
            }
        ]
    },
    {
        title: 'Shower Care',
        handle: 'shower-care',
        featuredImage: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/PH_Andersen_Faci_Leboreiro_15.jpg.webp',
        featuredTitle: 'AFTERCARE SOLUTIONS',
        categories: [
            {
                title: 'Cleaning Products',
                handle: 'shower-care',
                items: [
                    { title: 'Soap / Detergent', handle: 'soap-detergent' },
                    { title: 'Cloths', handle: 'cloths' },
                ],
            }
        ]
    },
    {
        title: 'Decorative',
        handle: 'decorative',
        featuredImage: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/hidraulico-decor-2-2.jpg',
        featuredTitle: 'DESIGN ELEMENTS',
        categories: [
            {
                title: 'Interior Accents',
                handle: 'decorative',
                items: [
                    { title: 'Mirrors', handle: 'mirrors' },
                    { title: 'Vanities & Basins', handle: 'vanities-basins' },
                ],
            }
        ]
    },
];

export const PRIMARY_MENU_ITEMS = [
    { title: 'Bespoke Showers', handle: 'bespoke-showers' },
    { 
        title: 'Our Story', 
        handle: 'about',
        items: [
            { title: 'Projects', handle: 'projects' },
            { title: 'Customer Stories', handle: 'customer-stories' },
        ]
    },
    { title: 'About Us', handle: 'about' },
    { title: 'Contact', handle: 'contact' },
];


export const FOOTER_MENU = {
    about: [
        { title: 'Our Story', handle: 'about' },
        { title: 'Projects', handle: 'projects' },
        { title: 'Customer Stories', handle: 'customer-stories' },
        { title: 'Accreditations', handle: 'accreditations' },
    ],
    customerService: [
        { title: 'Contact Us', handle: 'contact' },
        { title: 'Delivery & Collections', handle: 'delivery-collections' },
        { title: 'Aftersales Care', handle: 'aftersales-care' },
        { title: 'Find a Showroom', handle: 'showrooms' },
        { title: 'Newsletter', handle: 'newsletter' },
    ],
    discoverMore: [
        { title: 'Our Newsletter', handle: 'newsletter' },
        { title: 'Blog', handle: 'journal' },
    ],
    categories: [
        { title: 'Showers', handle: 'showers' },
        { title: 'Shower Spares', handle: 'shower-spares' },
        { title: 'Consumables', handle: 'consumables' },
        { title: 'Shower Care', handle: 'shower-care' },
    ],
    bottom: [
        { title: 'Terms & Conditions', handle: 'terms-of-service' },
        { title: 'Using Our Website', handle: 'using-our-website' },
        { title: 'Cookies Policy', handle: 'cookies-policy' },
        { title: 'Privacy Policy', handle: 'privacy-policy' },
    ],
};

