// Types and interfaces
export interface Ingredient {
  name: string;
  safety: 'safe' | 'moderate' | 'harmful';
  rating: number;
  pros: string[];
  cons: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  tags: string[];
  match: string;
}

export interface SkinAnalysisResult {
  primaryType: {
    type: string;
    probability: string;
  };
  allResults: Array<{
    type: string;
    probability: string;
  }>;
  tip: string;
}

// Mock data
export const sampleIngredients: Ingredient[] = [
  {
    name: 'Hyaluronic Acid',
    safety: 'safe',
    rating: 9,
    pros: ['Intense hydration', 'Plumps skin'],
    cons: ['Can cause irritation in high concentrations']
  },
  // ... more ingredients
];

export const recommendations: Product[] = [
  {
    id: '1',
    name: 'Hydrating Serum',
    brand: 'La Roche-Posay',
    price: '$29.99',
    image: 'https://via.placeholder.com/80',
    tags: ['Hydrating', 'Dermatologist Verified'],
    match: '95%'
  },
  // ... more products
];