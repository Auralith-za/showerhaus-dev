export interface MegaMenuItem {
    title: string;
    handle: string;
    items?: {
        title: string;
        handle: string;
    }[];
    image?: string;
}

export const MEGA_MENU_ITEMS: MegaMenuItem[] = [
    {
        title: 'Showers',
        handle: 'showers',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
        items: [
            { title: 'Frameless Shower Enclosures', handle: 'frameless-shower-enclosures' },
            { title: 'Semi-frameless Shower Enclosures', handle: 'semi-frameless-shower-enclosures' },
            { title: 'Framed Shower Enclosures', handle: 'framed-shower-enclosures' },
            { title: 'Walk-in Shower Screens', handle: 'walk-in-shower-screens' },
        ],
    },
    {
        title: 'Bath Enclosures',
        handle: 'bath-enclosures',
        image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/streamline-house-hufft-imge941bd7c0c6f2d3d_14-3747-1-fcbd831.jpg',
        items: [
            { title: 'Frameless Bath Screens', handle: 'frameless-bath-screens' },
            { title: 'Semi-Frameless Bath Screens', handle: 'semi-frameless-bath-screens' },
        ],
    },
    {
        title: 'Spares & Accessories',
        handle: 'spares-accessories',
        image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/hidraulico-decor-2-2.jpg',
        items: [
            { title: 'Handles & Towel Rails', handle: 'handles-towel-rails' },
            { title: 'Hinges and Clamps', handle: 'hinges-and-clamps' },
            { title: 'Shower Seals and Cill Plate', handle: 'shower-seals-and-cill-plate' },
            { title: 'Shower Wheels & Brackets', handle: 'shower-wheels-brackets' },
            { title: 'Stay Bars & Brackets', handle: 'stay-bars-brackets' },
        ],
    },
    {
        title: 'Mirrors',
        handle: 'mirrors',
        image: 'https://cloudsplash.co.za/wp/wp-content/uploads/2026/03/TahunaTerrace-MasterBathroom3-bde23112c62e4595a651d9733a93dfbe-77dee1e3a73648b597f8555771375d87.jpg',
        items: [
            { title: 'Framed Mirrors', handle: 'framed-mirrors' },
            { title: 'Frameless Mirrors', handle: 'frameless-mirrors' },
        ],
    },
    {
        title: 'About',
        handle: 'about',
    },
    {
        title: 'Shipping',
        handle: 'shipping',
    },
];
