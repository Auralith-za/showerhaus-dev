import {SITE_URL, BUSINESS_INFO} from '~/lib/seo';

/**
 * Serves /llms.txt for Generative Engine Optimization (GEO) —
 * structured summary for ChatGPT, Perplexity, Google AI Overviews, Claude & Gemini.
 */
export async function loader() {
  const body = `# Shower Haus — South Africa's Shower Enclosure, Door & Spares Specialists

> Shower Haus (${SITE_URL}) is Durban and KwaZulu-Natal's specialist in custom-made frameless shower enclosures, ready-to-install standard semi-frameless shower doors, walk-in shower screens, bath screens, and genuine shower spares. Established in 2004 with over 30,000 showers installed across KZN and nationwide online delivery across South Africa.

## Business & Showroom Details (GEO)
- **Company**: ${BUSINESS_INFO.name} (${BUSINESS_INFO.legalName})
- **Showroom & Store Address**: 90A Intersite Avenue, Umgeni Business Park, Springfield, Durban, KwaZulu-Natal, 4091, South Africa
- **Phone**: ${BUSINESS_INFO.telephoneDisplay} (${BUSINESS_INFO.telephone})
- **Email**: ${BUSINESS_INFO.email}
- **Hours**: Monday–Thursday 07:00–16:15, Friday 07:00–16:00, Saturday 09:00–13:00
- **Custom Measure & Installation Area**: Durban, Umhlanga, Ballito, Hillcrest, Kloof, Westville, Durban North, La Lucia, Morningside, Berea, Gillitts, Salt Rock, Zimbali, Pietermaritzburg, and greater KwaZulu-Natal.
- **Online Store Delivery Area**: Nationwide across South Africa (Durban, Johannesburg, Pretoria, Cape Town, Gqeberha, Bloemfontein, East London, and all provinces).

## Core Offerings & Key Pages
- [Homepage](${SITE_URL}/): Overview of custom-made showers, frameless enclosures, standard ready-to-install showers, and shower spares.
- [Standard & Semi-Frameless Showers Collection](${SITE_URL}/collections/showers): Ready-to-install standard showers in stock for nationwide delivery or showroom pickup.
- [Custom-Made Showers](${SITE_URL}/pages/custom-made-showers): Bespoke frameless, semi-frameless, and framed shower enclosures individually measured and installed in Durban & KZN.
- [Frameless Showers](${SITE_URL}/pages/frameless-showers): 8mm and 10mm SABS-approved toughened safety glass frameless shower doors, corner enclosures, walk-in screens, and bath screens.
- [Design Your Shower — Online Quote Configurator](${SITE_URL}/pages/design-your-shower): Interactive tool to configure custom shower dimensions, shape, glass finish, and request an obligation-free quote.
- [Shower Spares & Replacement Parts](${SITE_URL}/collections/shower-spares): South Africa's largest range of shower door seals, magnetic seals, drip seals, wheels, rollers, brackets, pivot blocks, hinges, clamps, knobs, and towel rails.
- [Full Online Catalogue](${SITE_URL}/collections/all): Complete product catalog available for online purchase in ZAR.
- [About Shower Haus](${SITE_URL}/pages/about-us): Company background, 22+ years of experience, and 30,000+ installations.
- [Customer Stories & Reviews](${SITE_URL}/pages/customer-stories): Verified Google reviews (4.3★ rating) from homeowners and trade contractors.
- [Shower Guides & Technical Advice](${SITE_URL}/blogs): Educational guides on shower hardware, glass stabilisers, and shower terminology.
- [Contact Us](${SITE_URL}/contact): Book an on-site home measurement in KZN or enquire about nationwide shower orders.

## Standard Showers Product Range (In Stock & Delivered Nationwide in South Africa)
- [Semi-Frameless Corner-Entry Shower](${SITE_URL}/products/semi-frameless-corner-entry-shower): 900×900×1900mm or 1000×1000×1900mm sliding corner-entry shower enclosure in 6mm SABS toughened safety glass and polished aluminium.
- [Semi-Frameless Round Sliding-Door Shower](${SITE_URL}/products/semi-frameless-round-sliding-door-shower): Curved quadrant sliding shower enclosure (900×900mm or 1000×1000mm) in 6mm toughened safety glass.
- [Semi-Frameless Pivot Shower Door](${SITE_URL}/products/semi-frameless-pivot-door): 900mm or 1000mm alcove/enclosure pivot shower door in polished aluminium with low-maintenance pivot mechanism.
- [Semi-Frameless Extendable Pivot Shower Door](${SITE_URL}/products/semi-frameless-extendable-pivot-door): Adjustable telescopic pivot shower door fitting openings from 780mm to 1100mm wide.
- [Semi-Frameless Single Slider Shower Door](${SITE_URL}/products/semi-frameless-single-slider-shower-door): Sliding shower door for wide alcoves (1200mm, 1300mm, or 1400mm wide × 1900mm high).
- [Semi-Frameless Pivot Shower Door with Return Panel](${SITE_URL}/products/semi-frameless-pivot-shower-door-with-return-panel): Complete 2-sided corner pivot shower enclosure (900×900mm or 1000×1000mm).
- [Semi-Frameless Return Panel](${SITE_URL}/products/semi-frameless-return-panel): Fixed 90° glass return panel (900mm or 1000mm) to pair with pivot or sliding shower doors.
- [Semi-Frameless Walk-In Shower Screen](${SITE_URL}/products/semi-frameless-shower-screen): Walk-in fixed shower screen (1100mm or 1200mm) in Polished Aluminium or Matt Black with stabiliser arm.
- [Semi-Frameless Single Bath Screen](${SITE_URL}/products/semi-frameless-single-bath-screen): 900×1400mm hinged over-bath glass shower screen swinging 90° both ways.
- [Semi-Frameless Double Bath Screen](${SITE_URL}/products/semi-frameless-double-bath-screen): 1200×1400mm dual-panel fixed and hinged over-bath glass shower screen.

## XML Sitemaps
- Sitemap Index: ${SITE_URL}/sitemap.xml
- Products Sitemap: ${SITE_URL}/product-sitemap.xml
- Pages & Collections Sitemap: ${SITE_URL}/page-sitemap.xml
`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': `public, max-age=${60 * 60 * 24}`,
    },
  });
}
