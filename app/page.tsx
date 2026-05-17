export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';
import { Deal, Store } from '@/lib/types';
import Link from 'next/link';
import TopDealsCarousel from '@/components/TopDealsCarousel';
import SectionHeader from '@/components/SectionHeader';
import CategoryDoodleTile from '@/components/CategoryDoodleTile';
import PriceTag from '@/components/PriceTag';
import DealsFeed from '@/components/DealsFeed';
import DragScroll from '@/components/DragScroll';
import Image from 'next/image';
import { BokChoyDoodle, ChopsticksDoodle, NoodleBowlDoodle, PinDoodle, SparkleDoodle } from '@/components/doodles';

const STORE_LOGOS: Record<string, string> = {
  'downtown': '/logos/downtowngrocer.jpg',
  'kfl':      '/logos/kflsupermarket.jpg',
  'kt-mart':  '/logos/ktmart.jpg',
  'tanhung':  '/logos/tanhunggrocer.png',
  'tang':     '/logos/tangsupermarket.png',
};

async function getData() {
  const [featuredRes, dealsRes, storesRes] = await Promise.all([
    supabase.from('deals').select('*, store:stores(*)').eq('is_featured', true).order('created_at', { ascending: false }).limit(6),
    supabase.from('deals').select('*, store:stores(*)').order('created_at', { ascending: false }).limit(20),
    supabase.from('stores').select('*').order('name'),
  ]);
  return {
    featured: (featuredRes.data ?? []) as Deal[],
    deals:    (dealsRes.data ?? [])    as Deal[],
    stores:   (storesRes.data ?? [])   as Store[],
  };
}

// Map DB category to doodle 'kind' key
function catKind(category: string) {
  const map: Record<string, string> = {
    'fresh-produce': 'bokchoy', 'meat-seafood': 'fish', 'pantry': 'rice',
    'frozen': 'dumpling', 'snacks': 'snack', 'drinks': 'drink', 'other': 'noodle',
  };
  return map[category] ?? 'noodle';
}

export default async function HomePage() {
  const { featured, deals, stores } = await getData();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Header — scrolls with content (non-sticky) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--bok-leaf)', transform: 'rotate(-8deg)', display: 'flex' }}>
              <BokChoyDoodle size={32} />
            </span>
            <span style={{ fontFamily: 'var(--f-display)', fontSize: 34, fontWeight: 700, color: 'var(--bok-ink)', lineHeight: 1, letterSpacing: '-.01em' }}>Bok</span>
          </div>
          <button aria-label="Profile" style={{
            width: 40, height: 40, border: '2px solid var(--bok-ink)',
            borderRadius: '12px 14px 11px 13px', background: 'var(--bok-white)',
            boxShadow: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--bok-ink)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 21c1-4 4-6 7-6s6 2 7 6"/>
              <path d="M12 13c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5Z"/>
            </svg>
          </button>
        </div>
        <div style={{ padding: '0 18px 14px' }}>
          <div style={{ fontFamily: 'var(--f-body)', fontSize: 15, fontWeight: 500, color: 'var(--bok-pencil)', lineHeight: 1.3 }}>
            Live deals from your local Asian grocers
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, padding: '8px 0 32px', position: 'relative' }}>
        {/* Watermarks */}
        <div className="watermark" style={{ top: 380, right: -60, transform: 'rotate(15deg)' }}>
          <NoodleBowlDoodle size={220} />
        </div>
        <div className="watermark" style={{ top: 840, left: -50, transform: 'rotate(-20deg)' }}>
          <ChopsticksDoodle size={180} />
        </div>

        {/* ① Top Deals carousel */}
        <div>
          <SectionHeader
            title="Today's Top Deals"
            sub="Hand-picked by your auntie"
            link="See all →"
            href="#all-deals"
            icon={<ChopsticksDoodle size={22} />}
          />
          <TopDealsCarousel deals={featured} />
        </div>

        {/* ② Cheapest nearby — recent deals rail */}
        <div>
          <SectionHeader
            title="Cheapest nearby"
            sub="Just spotted · fresh today"
            link="Map →"
            href="/map"
            icon={<PinDoodle size={22} color="var(--bok-mustard)" />}
          />
          <DragScroll style={{ paddingRight: 40, paddingTop: 10 }}>
            {deals.slice(0, 5).map((deal, k) => {
              const store = deal.store as Store | undefined;
              return (
                <div key={deal.id} className="dcard">
                  <div style={{ padding: 10, paddingBottom: 0, position: 'relative' }}>
                    <CategoryDoodleTile kind={catKind(deal.category)} size={148} />
                    <div style={{ position: 'absolute', top: 0, right: -6 }}>
                      <PriceTag value={Number(deal.price)} unit={deal.unit ?? undefined} size="sm" rotate={k % 2 === 0 ? -4 : -2} />
                    </div>
                  </div>
                  <div style={{ padding: '10px 12px 12px' }}>
                    <div style={{ fontFamily: 'var(--f-body)', fontSize: 13.5, fontWeight: 600, color: 'var(--bok-ink)', lineHeight: 1.2, marginBottom: 5, minHeight: 32, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {deal.product_name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--bok-pencil)', fontWeight: 500 }}>{deal.unit ?? 'each'}</span>
                      {deal.original_language && deal.original_language !== 'en' && (
                        <span className="lang-pill">{deal.original_language}</span>
                      )}
                    </div>
                    <span className="stamp">{store?.name ?? 'Store'}</span>
                  </div>
                </div>
              );
            })}
          </DragScroll>
        </div>

        {/* ③ Browse by stall */}
        <div>
          <SectionHeader
            title="Browse by stall"
            sub="Your local Asian grocers"
            link="See all →"
            icon={undefined}
          />
          <DragScroll style={{ paddingRight: 40, paddingTop: 8, gap: 14 }}>
            {stores.map((store, i) => (
              <Link key={store.id} href={`/store/${store.slug}`} style={{ textDecoration: 'none', flexShrink: 0, width: 128, cursor: 'pointer', userSelect: 'none' }}>
                <div style={{
                  width: 128, height: 128,
                  background: 'var(--bok-white)', border: '2px solid var(--bok-ink)',
                  borderRadius: i % 2 ? '18px 14px 20px 16px' : '14px 20px 16px 18px',
                  boxShadow: 'var(--ink-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                  transform: i % 2 ? 'rotate(.6deg)' : 'rotate(-.8deg)',
                }}>
                  {STORE_LOGOS[store.slug] ? (
                    <Image
                      src={STORE_LOGOS[store.slug]}
                      alt={store.name}
                      fill
                      style={{ objectFit: 'contain', padding: 12 }}
                    />
                  ) : (
                    <div style={{ color: store.hero_color, display: 'flex' }}>
                      <CategoryDoodleTile kind={catKind('pantry')} size={72} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: -4, right: -4, transform: 'rotate(10deg)' }}>
                    <span className="hot-sticker" style={{ fontSize: 11, padding: '2px 7px' }}>deals</span>
                  </div>
                </div>
                <div style={{ marginTop: 10, padding: '0 4px' }}>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 700, color: 'var(--bok-ink)', lineHeight: 1, marginBottom: 4 }}>{store.name}</div>
                  <div style={{ fontFamily: 'var(--f-body)', fontSize: 11, color: store.hero_color, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>{store.suburb}</div>
                </div>
              </Link>
            ))}
          </DragScroll>
        </div>

        {/* ④ All deals feed */}
        <div id="all-deals">
          <SectionHeader title="All the deals" sub="Fresh today, ranked by savings" icon={<SparkleDoodle size={18} />} />
          <DealsFeed initial={deals} />
        </div>
      </div>
    </div>
  );
}
