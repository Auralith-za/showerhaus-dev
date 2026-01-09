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
        image: 'https://showerhaus.co.za/wp-content/uploads/2019/07/frameless-showers-1.jpg', // Placeholder or real image if available
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
        image: 'https://showerhaus.co.za/wp-content/uploads/2019/07/bath-screens-1.jpg', // Placeholder
        items: [
            { title: 'Frameless Bath Screens', handle: 'frameless-bath-screens' },
            { title: 'Semi-Frameless Bath Screens', handle: 'semi-frameless-bath-screens' },
        ],
    },
    {
        title: 'Spares & Accessories',
        handle: 'spares-accessories',
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
        image: 'https://showerhaus.co.za/wp-content/uploads/2019/07/mirrors-1.jpg', // Placeholder
        items: [
            { title: 'Framed Mirrors', handle: 'framed-mirrors' },
            { title: 'Frameless Mirrors', handle: 'frameless-mirrors' },
        ],
    },
];
