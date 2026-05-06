import * as fs from 'fs';
import * as path from 'path';

const csvPath = '/Users/curt/Desktop/CSA /Clients/ShowerHaus/showerhaus-dev/Products CSV/wc-product-export-6-5-2026-1778047626525.csv';
let content = fs.readFileSync(csvPath, 'utf8');

// Strip UTF-8 BOM if present
if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}

function parseCSVLine(line: string): string[] {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(cur);
            cur = '';
        } else {
            cur += char;
        }
    }
    result.push(cur);
    return result;
}

const lines = content.split('\n');
const header = parseCSVLine(lines[0]);

const ID_IDX = header.indexOf('ID');
const NAME_IDX = header.indexOf('Name');
const DESC_IDX = header.indexOf('Description');
const PRICE_IDX = header.indexOf('Regular price');
const CAT_IDX = header.indexOf('Categories');
const IMG_IDX = header.indexOf('Images');

const products = [];

for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const row = parseCSVLine(lines[i]);
    const id = row[ID_IDX];
    const name = row[NAME_IDX];
    if (!name) continue;

    const desc = row[DESC_IDX] ? row[DESC_IDX].replace(/<[^>]*>/g, '').replace(/\\n/g, ' ').trim() : '';
    let price = row[PRICE_IDX] || '';
    if (!price || price === '0' || price === '') {
        price = (Math.floor(Math.random() * 5000) + 1000).toString(); // Default random price for demo
    }
    const categories = row[CAT_IDX] || '';
    const images = row[IMG_IDX] ? row[IMG_IDX].split(',')[0].trim() : 'https://placehold.co/600x600?text=' + encodeURIComponent(name);

    let collection = 'showers';
    if (categories.includes('Mirrors')) collection = 'decorative';
    else if (categories.includes('Shower Spares')) collection = 'shower-spares';

    const handle = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    products.push({
        id: 'wc-' + id,
        title: name,
        handle: handle,
        description: desc,
        price: price,
        currency: 'ZAR',
        image: images,
        collection: collection
    });
}

const tsContent = `export interface MockProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    price: string;
    currency: string;
    image: string;
    collection: string;
}

export const MOCK_PRODUCTS: MockProduct[] = ${JSON.stringify(products, null, 4)};

export function getMockRecommendedProducts() {
    const items = [...MOCK_PRODUCTS].sort(() => 0.5 - Math.random());
    return {
        products: {
            nodes: items.slice(0, 10).map((p, index) => ({
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
`;

fs.writeFileSync('/Users/curt/Desktop/CSA /Clients/ShowerHaus/showerhaus-dev/app/lib/mockData.ts', tsContent);
console.log('Successfully updated mockData.ts with ' + products.length + ' products.');

