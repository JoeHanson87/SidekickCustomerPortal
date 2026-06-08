export interface PriceTier {
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Proof {
  id: string;
  name: string;
  description: string;
  specifications: string[];
  priceTiers: PriceTier[];
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  tagline: string;
  colorFrom: string;
  colorTo: string;
  proofs: Proof[];
}

const PRODUCTS: ProductCategory[] = [
  {
    id: 'stationery',
    name: 'Stationery',
    description: 'Professional branded stationery for your business',
    tagline: 'Business Cards · Letterheads · Comp Slips',
    colorFrom: '#4F46E5',
    colorTo: '#7C3AED',
    proofs: [
      {
        id: 'business-cards',
        name: 'Business Cards',
        description: 'Premium double-sided business cards with your branding',
        specifications: ['85mm × 55mm', 'Double-sided', '400gsm silk laminated', 'Full colour'],
        priceTiers: [
          { quantity: 100, unitPrice: 0.25, total: 25 },
          { quantity: 250, unitPrice: 0.18, total: 45 },
          { quantity: 500, unitPrice: 0.15, total: 75 },
          { quantity: 1000, unitPrice: 0.12, total: 120 },
        ],
      },
      {
        id: 'letterheads',
        name: 'Letterheads',
        description: 'A4 branded letterheads for professional correspondence',
        specifications: ['A4 (210mm × 297mm)', 'Single-sided', '120gsm uncoated', 'Full colour'],
        priceTiers: [
          { quantity: 100, unitPrice: 0.35, total: 35 },
          { quantity: 250, unitPrice: 0.26, total: 65 },
          { quantity: 500, unitPrice: 0.22, total: 110 },
          { quantity: 1000, unitPrice: 0.185, total: 185 },
        ],
      },
      {
        id: 'comp-slips',
        name: 'Compliment Slips',
        description: 'Branded compliment slips for your correspondence',
        specifications: ['210mm × 99mm (1/3 A4)', 'Single-sided', '120gsm uncoated', 'Full colour'],
        priceTiers: [
          { quantity: 100, unitPrice: 0.20, total: 20 },
          { quantity: 250, unitPrice: 0.152, total: 38 },
          { quantity: 500, unitPrice: 0.12, total: 60 },
          { quantity: 1000, unitPrice: 0.098, total: 98 },
        ],
      },
    ],
  },
  {
    id: 'brochures',
    name: 'Brochures',
    description: 'High-quality printed brochures showcasing your brand',
    tagline: 'A5 · A4 · DL Tri-fold',
    colorFrom: '#0EA5E9',
    colorTo: '#0284C7',
    proofs: [
      {
        id: 'a5-brochure',
        name: 'A5 Brochure',
        description: 'Compact 4-page A5 brochure, perfect for promotions',
        specifications: ['A5 (148mm × 210mm)', '4 pages', '150gsm gloss', 'Full colour both sides'],
        priceTiers: [
          { quantity: 100, unitPrice: 0.85, total: 85 },
          { quantity: 250, unitPrice: 0.70, total: 175 },
          { quantity: 500, unitPrice: 0.59, total: 295 },
          { quantity: 1000, unitPrice: 0.48, total: 480 },
        ],
      },
      {
        id: 'a4-brochure',
        name: 'A4 Brochure',
        description: 'Full-size 4-page A4 brochure for detailed presentations',
        specifications: ['A4 (210mm × 297mm)', '4 pages', '150gsm gloss', 'Full colour both sides'],
        priceTiers: [
          { quantity: 100, unitPrice: 1.10, total: 110 },
          { quantity: 250, unitPrice: 0.90, total: 225 },
          { quantity: 500, unitPrice: 0.77, total: 385 },
          { quantity: 1000, unitPrice: 0.64, total: 640 },
        ],
      },
      {
        id: 'dl-brochure',
        name: 'DL Tri-fold',
        description: 'Slim DL tri-fold brochure, ideal for racks and mailers',
        specifications: ['DL (99mm × 210mm)', 'Tri-fold', '150gsm gloss', 'Full colour both sides'],
        priceTiers: [
          { quantity: 100, unitPrice: 0.75, total: 75 },
          { quantity: 250, unitPrice: 0.60, total: 150 },
          { quantity: 500, unitPrice: 0.50, total: 250 },
          { quantity: 1000, unitPrice: 0.42, total: 420 },
        ],
      },
    ],
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Branded clothing for your team and promotions',
    tagline: 'T-Shirts · Polo Shirts · Hoodies',
    colorFrom: '#10B981',
    colorTo: '#059669',
    proofs: [
      {
        id: 't-shirts',
        name: 'T-Shirts',
        description: 'Classic branded t-shirts, embroidered or printed',
        specifications: ['100% cotton', 'Sizes S–3XL', 'Front chest logo', 'Choice of colours'],
        priceTiers: [
          { quantity: 10, unitPrice: 12.00, total: 120 },
          { quantity: 25, unitPrice: 10.60, total: 265 },
          { quantity: 50, unitPrice: 9.60, total: 480 },
          { quantity: 100, unitPrice: 8.80, total: 880 },
        ],
      },
      {
        id: 'polo-shirts',
        name: 'Polo Shirts',
        description: 'Smart polo shirts with embroidered branding',
        specifications: ['65% polyester / 35% cotton', 'Sizes S–3XL', 'Left chest embroidery', 'Choice of colours'],
        priceTiers: [
          { quantity: 10, unitPrice: 15.00, total: 150 },
          { quantity: 25, unitPrice: 13.60, total: 340 },
          { quantity: 50, unitPrice: 12.40, total: 620 },
          { quantity: 100, unitPrice: 11.50, total: 1150 },
        ],
      },
      {
        id: 'hoodies',
        name: 'Hoodies',
        description: 'Premium hoodies with embroidered or printed branding',
        specifications: ['80% cotton / 20% polyester', 'Sizes S–3XL', 'Front chest logo', 'Choice of colours'],
        priceTiers: [
          { quantity: 10, unitPrice: 20.00, total: 200 },
          { quantity: 25, unitPrice: 18.40, total: 460 },
          { quantity: 50, unitPrice: 17.20, total: 860 },
          { quantity: 100, unitPrice: 15.80, total: 1580 },
        ],
      },
    ],
  },
  {
    id: 'fliers',
    name: 'Fliers & Leaflets',
    description: 'Eye-catching fliers and leaflets for marketing campaigns',
    tagline: 'A5 Fliers · A4 Leaflets · DL Inserts',
    colorFrom: '#F59E0B',
    colorTo: '#D97706',
    proofs: [
      {
        id: 'a5-flier',
        name: 'A5 Flier',
        description: 'Single-sided A5 fliers, perfect for events and promotions',
        specifications: ['A5 (148mm × 210mm)', 'Single-sided', '130gsm silk', 'Full colour'],
        priceTiers: [
          { quantity: 500, unitPrice: 0.09, total: 45 },
          { quantity: 1000, unitPrice: 0.065, total: 65 },
          { quantity: 2500, unitPrice: 0.048, total: 120 },
          { quantity: 5000, unitPrice: 0.039, total: 195 },
        ],
      },
      {
        id: 'a4-leaflet',
        name: 'A4 Leaflet',
        description: 'Double-sided A4 leaflets for detailed information',
        specifications: ['A4 (210mm × 297mm)', 'Double-sided', '130gsm silk', 'Full colour'],
        priceTiers: [
          { quantity: 500, unitPrice: 0.13, total: 65 },
          { quantity: 1000, unitPrice: 0.095, total: 95 },
          { quantity: 2500, unitPrice: 0.07, total: 175 },
          { quantity: 5000, unitPrice: 0.056, total: 280 },
        ],
      },
      {
        id: 'dl-insert',
        name: 'DL Insert',
        description: 'DL size inserts for direct mail and display racks',
        specifications: ['DL (99mm × 210mm)', 'Double-sided', '130gsm silk', 'Full colour'],
        priceTiers: [
          { quantity: 500, unitPrice: 0.09, total: 45 },
          { quantity: 1000, unitPrice: 0.065, total: 65 },
          { quantity: 2500, unitPrice: 0.05, total: 125 },
          { quantity: 5000, unitPrice: 0.038, total: 190 },
        ],
      },
    ],
  },
  {
    id: 'promotional',
    name: 'Promotional Products',
    description: 'Branded promotional items to make a lasting impression',
    tagline: 'Mugs · Pens · Tote Bags',
    colorFrom: '#EC4899',
    colorTo: '#BE185D',
    proofs: [
      {
        id: 'mugs',
        name: 'Branded Mugs',
        description: 'Classic white mugs with full-wrap or panel printing',
        specifications: ['330ml ceramic mug', 'Dishwasher safe', 'Full wrap print', 'White or coloured'],
        priceTiers: [
          { quantity: 10, unitPrice: 6.00, total: 60 },
          { quantity: 25, unitPrice: 5.20, total: 130 },
          { quantity: 50, unitPrice: 4.80, total: 240 },
          { quantity: 100, unitPrice: 4.20, total: 420 },
        ],
      },
      {
        id: 'pens',
        name: 'Branded Pens',
        description: 'Smooth-writing ballpoint pens with printed branding',
        specifications: ['Twist-action ballpoint', 'Blue ink', 'Barrel print', 'Matt or gloss barrel'],
        priceTiers: [
          { quantity: 25, unitPrice: 1.40, total: 35 },
          { quantity: 50, unitPrice: 1.20, total: 60 },
          { quantity: 100, unitPrice: 1.05, total: 105 },
          { quantity: 250, unitPrice: 0.88, total: 220 },
        ],
      },
      {
        id: 'tote-bags',
        name: 'Tote Bags',
        description: 'Eco-friendly cotton tote bags with your logo',
        specifications: ['Natural cotton', '38cm × 42cm', 'Screen printed logo', 'Long handles'],
        priceTiers: [
          { quantity: 25, unitPrice: 4.80, total: 120 },
          { quantity: 50, unitPrice: 4.20, total: 210 },
          { quantity: 100, unitPrice: 3.60, total: 360 },
          { quantity: 250, unitPrice: 2.96, total: 740 },
        ],
      },
    ],
  },
];

export default PRODUCTS;
