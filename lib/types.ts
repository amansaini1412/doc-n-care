export type SkinType =
  | 'Oily'
  | 'Dry'
  | 'Combination'
  | 'Normal'
  | 'Sensitive'
  | 'Acne-Prone';

export type Concern =
  | 'Acne'
  | 'Dryness'
  | 'Oiliness'
  | 'Dark spots'
  | 'Large pores'
  | 'Redness'
  | 'Fine lines'
  | 'Dullness';

export type ProductCategory =
  | 'cleanser'
  | 'serum'
  | 'moisturizer'
  | 'sunscreen'
  | 'mask'
  | 'toner';

export type Compatibility = 'compatible' | 'caution' | 'avoid';

export interface QuizAnswers {
  afterWash: 'tight' | 'comfortable' | 'oily';
  breakouts: 'rarely' | 'sometimes' | 'often';
  sensitivity: 'low' | 'medium' | 'high';
  climate: 'dry' | 'humid' | 'mixed';
  concerns: Concern[];
}

export interface ProblemDetail {
  title: string;
  detail: string;
  mechanism?: string;
  provenActives?: string[];
}

export interface SkinProfile {
  name: string;
  age: string;
  skinType: SkinType;
  confidence: number;
  concerns: Concern[];
  recommendedIngredients: string[];
  avoidIngredients: string[];
  problems: ProblemDetail[];
  dailyRoutine: { time: 'AM' | 'PM'; step: string }[];
  tips: string[];
  suggestedProductIds: string[];
  quiz: QuizAnswers | null;
  lastScanAt: string | null;
  photoUri: string | null;
  completedRoutineSteps?: string[];
  barrierStatus?: 'Resilient' | 'Compromised' | 'Dehydrated' | 'Balanced';
}

export interface CatalogProduct {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  price: string;
  category: ProductCategory;
  image: string;
  ingredients: string[];
  skinTypes: SkinType[];
  benefits: string[];
  warnings: string[];
  description: string;
  howToUse?: string;
  precautions?: string;
  beneficialActives?: string[];
  potentialIrritants?: string[];
  rating?: number;
  reviewCount?: string;
  discount?: string;
  originalPrice?: string;
}

export interface SkincareKit {
  id: string;
  title: string;
  tier: 'essential' | 'clinical' | 'advanced';
  tierLabel: string;
  totalPrice: string;
  tagline: string;
  rationale: string;
  products: CatalogProduct[];
}

export interface CompatibilityResult {
  product: CatalogProduct;
  score: number;
  verdict: Compatibility;
  headline: string;
  reasons: string[];
  watchouts: string[];
  barrierSafety?: 'Optimal' | 'Caution' | 'High Risk';
  comedogenicRisk?: 'Low' | 'Moderate' | 'High';
  activeMatchSummary?: string;
  usageAdvice?: string;
  precautions?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}
