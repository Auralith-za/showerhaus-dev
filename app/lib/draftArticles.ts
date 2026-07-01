export interface DraftArticle {
  id: string;
  title: string;
  handle: string;
  publishedAt: string;
  excerptHtml: string;
  contentHtml: string;
  image: {
    url: string;
    altText: string;
  };
  blog: {
    title: string;
    handle: string;
  };
  author?: {
    name: string;
  };
}

export const DRAFT_ARTICLES: DraftArticle[] = [
  {
    id: 'draft-1',
    title: 'The Hardware Behind Your Shower Enclosure: An Architectural Guide',
    handle: 'hardware-behind-your-shower-enclosure',
    publishedAt: '2026-06-01T10:00:00Z',
    excerptHtml: '<p>Explore the essential engineering components, hinges, and brackets that keep your frameless shower enclosure safe and stable.</p>',
    contentHtml: `
      <p>Modern bathroom design is shifting rapidly towards high-transparency layouts that emphasize architectural lines and custom finishes. The era of bulky framed doors is making way for sleek, frameless installations that maximize natural light and create an illusion of expansive space.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">1. The Rise of Minimalist Frameless Enclosures</h3>
      <p>Frameless enclosures utilize thick safety glass (typically 8mm to 12mm) to support their own structure, minimizing the need for heavy metal framing. This creates a floating panel effect that integrates seamlessly with clean tiling, marble, or polished concrete backgrounds.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">2. Contrast with Bold Matte Hardware</h3>
      <p>Although the glass itself is invisible, the hinges and brackets serve as striking punctuation marks. Matte black, satin gold, and antique brass finishes are highly sought after to match standard luxury tapware and create visual interest in an otherwise white or neutral environment.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">3. Customized Dimensions and Flow</h3>
      <p>Standard retail units often fail to make the most of unique bathroom shapes. Bespoke planning lets you wrap a shower enclosure around support pillars, align it under low-hanging beams, or shape it into custom angles (such as pentagonal layouts) that turn tight corners into luxury shower zones.</p>
    `,
    image: {
      url: '/images/hardware-behind-your-shower-enclosure.jpeg',
      altText: 'The Hardware Behind Your Shower Enclosure'
    },
    blog: {
      title: 'Design Insights',
      handle: 'news'
    },
    author: {
      name: 'Shower Haus Design Team'
    }
  },
  {
    id: 'draft-2',
    title: 'Why Your Shower Needs More Than Glass',
    handle: 'why-your-shower-needs-more-than-glass',
    publishedAt: '2026-05-28T14:30:00Z',
    excerptHtml: '<p>A deep dive into why structural support, professional seals, and precision design are crucial for a long-lasting shower enclosure.</p>',
    contentHtml: `
      <p>Your shower enclosure is built to last, but the flexible plastic seals that keep water inside are subject to wear, soap residue, and hard water minerals. Taking care of these seals prevents leaks, keeps the bathroom dry, and ensures doors open and close smoothly.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">Regular Cleaning for Mineral Prevention</h3>
      <p>Soap scum and limescale buildup can degrade the transparency and flexibility of drip seals and magnetic strike profiles. We recommend wiping down your seals weekly with a soft cloth and a mild soap solution. Avoid using abrasive scrubbing pads or aggressive chemical cleaners, as these can pit the plastic and lead to premature yellowing.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">Inspecting Magnetic Alignment</h3>
      <p>If you have a pivot door, magnetic seals on the closing edge must meet flush to make a waterproof barrier. Over time, heavy doors can experience minor settling. Check the hinges and tighten the grub screws if you notice the magnetic seal overlapping or leaving a gap. Keeping the glass aligned extends seal life.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">When to Replace Your Seals</h3>
      <p>Flexible PVC seals generally last between 1 to 3 years depending on water hardness and usage frequency. If a seal is discolored, stiff, cracked, or tearing at the bottom hinge points, it's time to replace it. Keeping spares on hand ensures you can easily clip on a new drip profile to maintain the clean look of your shower enclosure.</p>
    `,
    image: {
      url: '/images/why-your-shower-needs-more-than-glass.jpg',
      altText: 'Why Your Shower Needs More Than Glass'
    },
    blog: {
      title: 'Technical Care',
      handle: 'guides'
    },
    author: {
      name: 'Technical Support Team'
    }
  },
  {
    id: 'draft-3',
    title: 'What Your Shower is Actually Called: Enclosure Names Explained',
    handle: 'what-your-shower-is-actually-called',
    publishedAt: '2026-05-24T09:00:00Z',
    excerptHtml: '<p>From pentagonal to corner entry, we demystify the terms used to describe different shower designs and layout configurations.</p>',
    contentHtml: `
      <p>One of the most important decisions when designing a custom frameless shower is selecting the glass thickness. While it affects the budget, it also directly impacts structural stability, door weight, and overall architectural presence.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">8mm Safety Glass: Versatile and Practical</h3>
      <p>8mm tempered safety glass is the entry point for frameless design. It is lighter, making it easier to handle during installation and putting less stress on hinges and rollers. It is ideal for smaller bath screens, sliding doors, and panels that are supported by stability bars.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">10mm Safety Glass: The Professional Standard</h3>
      <p>10mm is our recommended thickness for most walk-in showers and hinged doors. It offers a solid weight that feels premium to open and close, while providing excellent structural rigidity. At 10mm, glass panels remain perfectly flat and resist flexing when doors swing shut, offering high safety and architectural impact.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">12mm Safety Glass: Ultimate Rigidity</h3>
      <p>For large-format glass partitions, full-height screens, or commercial applications, 12mm glass is the gold standard. It provides maximum strength, completely eliminating any glass flex. However, it is very heavy and requires heavy-duty brass hinges and solid wall fixing points to manage the weight load over time.</p>
    `,
    image: {
      url: '/images/what-your-shower-is-actually-called.jpeg',
      altText: 'What Your Shower is Actually Called'
    },
    blog: {
      title: 'Guides & FAQ',
      handle: 'guides'
    },
    author: {
      name: 'Engineering Division'
    }
  },
  {
    id: 'draft-4',
    title: 'Shower Enclosure Stabilisers: Why Stability Bars Matter',
    handle: 'shower-enclosure-stabilisers',
    publishedAt: '2026-05-17T11:15:00Z',
    excerptHtml: '<p>Learn about stabiliser bars, when you need them, and how they secure frameless glass panels for maximum safety and rigidity.</p>',
    contentHtml: `
      <p>For builders, plumbers, and interior designers, details are everything. A successful custom-made shower installation depends on coordinating wall preparation and measurements before ordering custom panels.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">1. The Importance of Out-of-Plumb Walls</h3>
      <p>In renovation projects, walls are rarely perfectly vertical. For custom frameless installations, even a 3mm tilt over a 2-meter height can leave a gap. Always take width measurements at three points: the bottom, middle, and top. This lets us water-cut the glass panels at precise tapers to align flush against tilted walls.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">2. Fixing Points and Stud Reinforcements</h3>
      <p>A 10mm glass door can weigh upward of 30kg. Relying on standard drywall plugs or hollow brick fixings is a safety risk. Ensure your builders install solid timber studding or blockwork reinforcement behind the tiles at the hinge and brace positions. This guarantees absolute rigidity for years to come.</p>
      <br/>
      <h3 class="text-xl font-bold font-display text-primary mt-6 mb-2">3. Planning Slope and Threshold Drainage</h3>
      <p>Whether you are creating a wet room floor or using a tray, ensure the floor slopes toward the drain at a minimum 1.5% gradient. The entrance threshold should be flat or slightly raised to allow drip seals to make contact and wipe clean without getting pinched against tiles.</p>
    `,
    image: {
      url: '/images/stabilisers-blog.jpeg',
      altText: 'Shower Enclosure Stabilisers'
    },
    blog: {
      title: 'Trade & Partner',
      handle: 'news'
    },
    author: {
      name: 'Trade Relations'
    }
  }
];
