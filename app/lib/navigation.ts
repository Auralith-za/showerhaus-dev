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
                title: 'Shower Enclosures',
                handle: 'showers',
                items: [
                    { title: 'Frameless Shower Enclosures', handle: 'frameless-shower-enclosures' },
                    { title: 'Semi-Frameless Showers', handle: 'semi-frameless-showers' },
                    { title: 'Framed Shower Enclosures', handle: 'framed-shower-enclosures' },
                    { title: 'Walk In Shower Screens', handle: 'walk-in-shower-screens' },
                    { title: 'Bath Enclosures', handle: 'bath-enclosures' },
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
                    { title: 'Handles & Towel Rails', handle: 'handles-towel-rails' },
                    { title: 'Hinges and Clamps', handle: 'hinges-and-clamps' },
                    { title: 'Shower Seals and Cill Plate', handle: 'shower-seals-and-cill-plate' },
                    { title: 'Shower Wheels & Brackets', handle: 'brackets-wheels' },
                    { title: 'Profiles & Channels', handle: 'profiles-channels' },
                    { title: 'Accessories & Other', handle: 'accessories-other' },
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

];

export const PRIMARY_MENU_ITEMS = [
    { title: 'Shop', handle: 'all', to: '/collections/all' },
    { title: 'Custom-made Showers', handle: 'custom-made-showers', to: '/pages/custom-made-showers' },
    { title: 'Frameless Showers', handle: 'frameless-showers', to: '/pages/frameless-showers' },
    { 
        title: 'About Us', 
        handle: 'about-us',
        to: '/pages/about-us',
        items: [
            { title: 'Customer Stories', handle: 'customer-stories', to: '/pages/customer-stories' },
            { title: 'Blog', handle: 'journal', to: '/blogs' },
        ]
    },
    { title: 'Contact Us', handle: 'contact', to: '/contact' },
];


export const FOOTER_MENU = {
    about: [
        { title: 'About Us', handle: 'about-us' },
        { title: 'Customer Stories', handle: 'customer-stories' },
    ],
    customerService: [
        { title: 'Contact Us', handle: 'contact' },
        { title: 'Newsletter', handle: 'newsletter' },
    ],
    discoverMore: [
        { title: 'Mailing List', handle: 'newsletter' },
        { title: 'Journal', handle: 'blogs' },
    ],
    categories: [
        { title: 'Showers', handle: 'showers' },
        { title: 'Spares', handle: 'shower-spares' },
        { title: 'Consumables', handle: 'consumables' },
        { title: 'Shower Care', handle: 'shower-care' },

    ],
    bottom: [
        { title: 'Terms & Conditions', handle: 'terms-and-conditions' },
        { title: 'Using Our Website', handle: 'using-our-website' },
        { title: 'Cookies Policy', handle: 'cookies' },
        { title: 'Privacy Policy', handle: 'privacy' },
        { title: 'Refund & Returns', handle: 'refund-and-returns' },
        { title: 'Shipping & Delivery', handle: 'shipping-and-delivery' },
    ],
};

