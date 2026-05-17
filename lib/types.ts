export type Cuisine = 'chinese' | 'vietnamese' | 'korean' | 'japanese' | 'pan-asian';

export type Category =
  | 'fresh-produce'
  | 'meat-seafood'
  | 'pantry'
  | 'frozen'
  | 'snacks'
  | 'drinks'
  | 'other';

export type Confidence = 'high' | 'medium' | 'low';

export type Language = 'zh' | 'vi' | 'ko' | 'ja' | 'en';

export type Unit =
  | 'per kg'
  | 'per 100g'
  | 'each'
  | 'per pack'
  | 'per bunch'
  | 'per box';

export interface Store {
  id: string;
  slug: string;
  name: string;
  cuisine: Cuisine;
  address: string;
  suburb: string;
  lat: number;
  lng: number;
  opening_hours: string | null;
  hero_color: string;
  created_at: string;
}

export interface Deal {
  id: string;
  store_id: string;
  product_name: string;
  original_text: string | null;
  original_language: Language | null;
  price: number;
  unit: Unit | null;
  category: Category;
  image_url: string | null;
  confidence: Confidence;
  is_featured: boolean;
  created_at: string;
  store?: Store;
}

export interface ExtractedDeal {
  product_name: string;
  original_text: string;
  original_language: Language;
  price: number;
  unit: Unit;
  category: Category;
  confidence: Confidence;
  error?: string;
}
