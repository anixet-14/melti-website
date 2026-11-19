// app/config/productsConfig.ts

export type FlavorCategory = 'all' | 'dark' | 'nutty' | 'sweet' | 'spiced';

export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  category: Exclude<FlavorCategory, 'all'>;
  cocoaPercent: string;
  badge: string;
  accentColor: string;
  labelTint: string;
  price20g: number;
  price200g: number;
  description: string;
  tastingNotes: string[];
  sensory: {
    richness: number; // 0 to 100
    sweetness: number;
    roast: number;
  };
  origin: string;
  ritualTip: string;
  /** Optional: drop a real PNG/WebP path here later (e.g., '/assets/midnight-velvet.png') to replace the custom SVG tin */
  imageUrl?: string;
}

export const FLAVOR_FILTERS: { id: FlavorCategory; label: string }[] = [
  { id: 'all', label: 'All Blends' },
  { id: 'dark', label: '70%+ Intense Dark' },
  { id: 'nutty', label: 'Nutty & Praline' },
  { id: 'sweet', label: 'Caramel & Velvet' },
  { id: 'spiced', label: 'Botanical & Spiced' },
];

export const MELTI_PRODUCTS: ProductItem[] = [
  {
    id: 'midnight-velvet',
    name: 'Midnight Velvet 72%',
    tagline: 'Single-Origin Idukki Dark Couverture',
    category: 'dark',
    cocoaPercent: '72%',
    badge: 'Bestseller',
    accentColor: '#C86D51',
    labelTint: '#F9EBDD',
    price20g: 31,
    price200g: 256,
    description:
      'Shaved from pure single-origin dark chocolate slabs—never compound powder. Melts into a thick, glossy pour with deep berry undertones.',
    tastingNotes: ['Roasted Espresso', 'Black Cherry', 'Raw Cacao'],
    sensory: { richness: 94, sweetness: 35, roast: 88 },
    origin: 'Idukki Hills, Kerala',
    ritualTip: 'Whisk 3 heaped spoons into 180ml steamed oat or whole milk at 70°C for a café-thick, pour.',
    imageUrl: '/image.png',
  },
];