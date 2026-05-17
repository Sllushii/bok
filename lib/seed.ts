/**
 * Run once: npx ts-node --project tsconfig.json -e "require('./lib/seed.ts')"
 * Or via: npx tsx lib/seed.ts
 *
 * Coordinate notes:
 *   - Tang:          confirmed via Google Maps (-37.8121, 144.9676)
 *   - KT Mart:       544 Elizabeth St estimate — verify in Maps
 *   - KFL:           176-180 Barkly St, Footscray estimate — verify in Maps
 *   - Tan Hung:      329 Elizabeth St, Melbourne CBD — verify in Maps
 *   - Downtown:      Box Hill estimate — verify in Maps
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SEED_STORES = [
  {
    slug: 'tang',
    name: 'Tang Asian Supermarket',
    cuisine: 'chinese',
    address: '185-187 Russell St',
    suburb: 'Melbourne',
    lat: -37.8121,
    lng: 144.9676,
    opening_hours: 'Mon–Sun 10am–11pm',
    hero_color: '#16a34a',
  },
  {
    slug: 'downtown',
    name: 'Downtown Grocer',
    cuisine: 'pan-asian',
    address: 'Box Hill Central, 1 Main St',
    suburb: 'Box Hill',
    lat: -37.8197,
    lng: 145.1216,
    opening_hours: 'Mon–Sun 8am–9pm',
    hero_color: '#7c3aed',
  },
  {
    slug: 'kt-mart',
    name: 'KT Mart',
    cuisine: 'korean',
    address: '544 Elizabeth St',
    suburb: 'Melbourne',
    lat: -37.7994,
    lng: 144.9561,
    opening_hours: 'Mon–Sun 9am–10pm',
    hero_color: '#2563eb',
  },
  {
    slug: 'kfl',
    name: 'KFL Supermarket',
    cuisine: 'chinese',
    address: '176-180 Barkly St',
    suburb: 'Footscray',
    lat: -37.8003,
    lng: 144.8998,
    opening_hours: 'Mon–Sun 9am–8pm',
    hero_color: '#dc2626',
  },
  {
    slug: 'tanhung',
    name: 'Tan Hung Asian Grocery',
    cuisine: 'vietnamese',
    address: '329 Elizabeth St',
    suburb: 'Melbourne',
    lat: -37.8082,
    lng: 144.9635,
    opening_hours: 'Mon–Sun 8am–8pm',
    hero_color: '#f59e0b',
  },
];

const SEED_DEALS: Array<{
  store_slug: string;
  product_name: string;
  original_text: string | null;
  original_language: string;
  price: number;
  unit: string;
  category: string;
  confidence: string;
  is_featured: boolean;
}> = [
  // Tang
  { store_slug: 'tang', product_name: 'Bok Choy', original_text: '白菜', original_language: 'zh', price: 1.99, unit: 'per bunch', category: 'fresh-produce', confidence: 'high', is_featured: true },
  { store_slug: 'tang', product_name: 'Instant Noodles', original_text: '方便面', original_language: 'zh', price: 4.50, unit: 'per pack', category: 'pantry', confidence: 'high', is_featured: false },
  { store_slug: 'tang', product_name: 'Pork Belly', original_text: '五花肉', original_language: 'zh', price: 14.99, unit: 'per kg', category: 'meat-seafood', confidence: 'high', is_featured: true },
  { store_slug: 'tang', product_name: 'Tsingtao Beer 6-Pack', original_text: '青岛啤酒', original_language: 'zh', price: 12.99, unit: 'per pack', category: 'drinks', confidence: 'high', is_featured: false },
  { store_slug: 'tang', product_name: 'Shiitake Mushrooms', original_text: '香菇', original_language: 'zh', price: 3.50, unit: 'per pack', category: 'fresh-produce', confidence: 'high', is_featured: false },

  // Downtown Grocer
  { store_slug: 'downtown', product_name: 'Jasmine Rice 5kg', original_text: null, original_language: 'en', price: 9.99, unit: 'per pack', category: 'pantry', confidence: 'high', is_featured: true },
  { store_slug: 'downtown', product_name: 'Frozen Gyoza', original_text: null, original_language: 'en', price: 6.50, unit: 'per pack', category: 'frozen', confidence: 'high', is_featured: false },
  { store_slug: 'downtown', product_name: 'Fish Sauce', original_text: null, original_language: 'en', price: 3.99, unit: 'each', category: 'pantry', confidence: 'high', is_featured: false },
  { store_slug: 'downtown', product_name: 'Lychee Drink', original_text: null, original_language: 'en', price: 2.20, unit: 'each', category: 'drinks', confidence: 'high', is_featured: false },
  { store_slug: 'downtown', product_name: 'Gai Lan', original_text: null, original_language: 'en', price: 2.50, unit: 'per bunch', category: 'fresh-produce', confidence: 'high', is_featured: true },

  // KT Mart
  { store_slug: 'kt-mart', product_name: 'Kimchi 1kg', original_text: '김치', original_language: 'ko', price: 8.99, unit: 'per pack', category: 'pantry', confidence: 'high', is_featured: true },
  { store_slug: 'kt-mart', product_name: 'Nongshim Shin Ramyun', original_text: '신라면', original_language: 'ko', price: 3.50, unit: 'per pack', category: 'pantry', confidence: 'high', is_featured: false },
  { store_slug: 'kt-mart', product_name: 'Korean Pork Belly', original_text: '삼겹살', original_language: 'ko', price: 17.99, unit: 'per kg', category: 'meat-seafood', confidence: 'high', is_featured: true },
  { store_slug: 'kt-mart', product_name: 'Banana Milk', original_text: '바나나 우유', original_language: 'ko', price: 2.80, unit: 'each', category: 'drinks', confidence: 'high', is_featured: false },
  { store_slug: 'kt-mart', product_name: 'Honey Butter Chips', original_text: '허니버터칩', original_language: 'ko', price: 4.20, unit: 'per pack', category: 'snacks', confidence: 'high', is_featured: false },

  // KFL
  { store_slug: 'kfl', product_name: 'Snow Pea Sprouts', original_text: '豆苗', original_language: 'zh', price: 2.99, unit: 'per bunch', category: 'fresh-produce', confidence: 'high', is_featured: false },
  { store_slug: 'kfl', product_name: 'Frozen Dim Sim', original_text: '点心', original_language: 'zh', price: 5.50, unit: 'per pack', category: 'frozen', confidence: 'high', is_featured: true },
  { store_slug: 'kfl', product_name: 'Oyster Sauce 500ml', original_text: '蚝油', original_language: 'zh', price: 4.99, unit: 'each', category: 'pantry', confidence: 'high', is_featured: false },
  { store_slug: 'kfl', product_name: 'Whole Barramundi', original_text: '金目鲈', original_language: 'zh', price: 18.99, unit: 'per kg', category: 'meat-seafood', confidence: 'high', is_featured: true },
  { store_slug: 'kfl', product_name: 'Green Tea Ice Cream', original_text: '抹茶冰淇淋', original_language: 'zh', price: 7.99, unit: 'per pack', category: 'frozen', confidence: 'high', is_featured: false },

  // Tan Hung
  { store_slug: 'tanhung', product_name: 'Indomie Mi Goreng', original_text: null, original_language: 'en', price: 4.50, unit: 'per pack', category: 'pantry', confidence: 'high', is_featured: false },
  { store_slug: 'tanhung', product_name: 'Vietnamese Mint', original_text: 'Rau húng lủi', original_language: 'vi', price: 1.50, unit: 'per bunch', category: 'fresh-produce', confidence: 'high', is_featured: false },
  { store_slug: 'tanhung', product_name: 'Pork Spare Ribs', original_text: 'Sườn heo', original_language: 'vi', price: 12.99, unit: 'per kg', category: 'meat-seafood', confidence: 'high', is_featured: true },
  { store_slug: 'tanhung', product_name: 'Coconut Milk', original_text: 'Nước cốt dừa', original_language: 'vi', price: 2.99, unit: 'each', category: 'pantry', confidence: 'high', is_featured: false },
  { store_slug: 'tanhung', product_name: 'Pocky Strawberry', original_text: null, original_language: 'en', price: 3.20, unit: 'per pack', category: 'snacks', confidence: 'high', is_featured: true },
];

async function seed() {
  console.log('Seeding stores...');

  const { data: stores, error: storeError } = await supabase
    .from('stores')
    .upsert(SEED_STORES.map(({ slug, ...rest }) => ({ slug, ...rest })), { onConflict: 'slug' })
    .select();

  if (storeError) {
    console.error('Store seed failed:', storeError.message);
    process.exit(1);
  }

  console.log(`✓ ${stores?.length} stores inserted/updated`);

  const storeMap = Object.fromEntries((stores ?? []).map((s) => [s.slug, s.id]));

  const dealRows = SEED_DEALS.map(({ store_slug, ...deal }) => ({
    ...deal,
    store_id: storeMap[store_slug],
  })).filter((d) => d.store_id);

  console.log('Seeding deals...');

  const { data: deals, error: dealError } = await supabase
    .from('deals')
    .insert(dealRows)
    .select();

  if (dealError) {
    console.error('Deal seed failed:', dealError.message);
    process.exit(1);
  }

  console.log(`✓ ${deals?.length} deals inserted`);
  console.log('Seed complete.');
}

seed();
