export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';
import { Deal, Store } from '@/lib/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CategoryDoodleTile from '@/components/CategoryDoodleTile';
import PriceTag from '@/components/PriceTag';
import SectionHeader from '@/components/SectionHeader';
import AnimatedItem from '@/components/AnimatedItem';
import Image from 'next/image';
import { PinDoodle, CameraDoodle, TakeoutBoxDoodle } from '@/components/doodles';

const STORE_LOGOS: Record<string, string> = {
  'downtown': '/logos/downtowngrocer.jpg',
  'kfl':      '/logos/kflsupermarket.jpg',
  'kt-mart':  '/logos/ktmart.jpg',
  'tanhung':  '/logos/tanhunggrocer.png',
  'tang':     '/logos/tangsupermarket.png',
};

async function getStore(slug: string): Promise<Store | null> {
  const { data } = await supabase.from('stores').select('*').eq('slug', slug).single();
  return data as Store | null;
}

async function getDeals(storeId: string): Promise<Deal[]> {
  const { data } = await supabase
    .from('deals')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false });
  return (data as Deal[]) ?? [];
}

function catKind(category: string) {
  const map: Record<string, string> = {
    'fresh-produce': 'bokchoy', 'meat-seafood': 'fish', 'pantry': 'rice',
    'frozen': 'dumpling', 'snacks': 'snack', 'drinks': 'drink', 'other': 'noodle',
  };
  return map[category] ?? 'noodle';
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStore(slug);
  if (!store) notFound();

  const deals = await getDeals(store.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Store header */}
      <div style={{ padding: '18px 18px 14px', borderBottom: '2px dashed var(--bok-pencil-lt)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bok-pencil)" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          <span style={{ fontFamily: 'var(--f-body)', fontSize: 13, fontWeight: 500, color: 'var(--bok-pencil)' }}>Back</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            width: 64, height: 64, flexShrink: 0,
            background: 'var(--bok-white)', border: '2px solid var(--bok-ink)',
            borderRadius: '18px 14px 20px 16px', boxShadow: 'var(--ink-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: store.hero_color, position: 'relative', overflow: 'hidden',
          }}>
            {STORE_LOGOS[store.slug] ? (
              <Image src={STORE_LOGOS[store.slug]} alt={store.name} fill style={{ objectFit: 'contain', padding: 8 }} />
            ) : (
              <CategoryDoodleTile kind={catKind('pantry')} size={40} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 34, fontWeight: 700, color: 'var(--bok-ink)', lineHeight: 1, marginBottom: 6 }}>
              {store.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' as const }}>
              <PinDoodle size={13} color="var(--bok-red)" />
              <span style={{ fontFamily: 'var(--f-body)', fontSize: 12, color: 'var(--bok-pencil)', fontWeight: 500 }}>
                {store.address}, {store.suburb}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
              {store.opening_hours && (
                <span className="stamp" style={{ transform: 'rotate(-1.5deg)' }}>{store.opening_hours}</span>
              )}
              <span className="stamp" style={{ transform: 'rotate(1deg)', background: store.hero_color, color: 'var(--bok-white)' }}>
                {deals.length} deals
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 0 40px' }}>
        {deals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div style={{ color: 'var(--bok-ink)', display: 'flex', justifyContent: 'center', marginBottom: 14, opacity: .35 }}>
              <TakeoutBoxDoodle size={120} />
            </div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 30, fontWeight: 700, color: 'var(--bok-ink)', marginBottom: 6 }}>
              No deals yet!
            </div>
            <div style={{ fontFamily: 'var(--f-body)', fontSize: 13, color: 'var(--bok-pencil)', marginBottom: 20 }}>
              Be the first to snap one.
            </div>
            <Link href={`/snap?store=${store.id}`} style={{ textDecoration: 'none' }}>
              <button className="btn-p" style={{ width: 'auto', display: 'inline-flex' }}>
                <CameraDoodle size={18} /> Snap a deal
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <SectionHeader title="All deals" sub={`Fresh from ${store.name}`} />
            <div className="bok-feed-wrap" style={{ marginTop: 10 }}>
              {deals.map((deal, k) => (
                <AnimatedItem key={deal.id} index={k} delay={0.04}>
                  <div className="feed-card">
                    <div style={{ display: 'flex', padding: '14px 16px', gap: 14, alignItems: 'flex-start', position: 'relative' }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <CategoryDoodleTile kind={catKind(deal.category)} size={76} />
                        <div style={{ position: 'absolute', top: -10, right: -14 }}>
                          <PriceTag value={Number(deal.price)} unit={deal.unit ?? undefined} size="sm" rotate={k % 2 ? -3 : -5} />
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--f-body)', fontSize: 14.5, fontWeight: 700, color: 'var(--bok-ink)', lineHeight: 1.2, marginBottom: 5 }}>
                          {deal.product_name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7, flexWrap: 'wrap' as const }}>
                          <span style={{ fontSize: 11, color: 'var(--bok-pencil)', fontWeight: 500 }}>{deal.unit}</span>
                          {deal.original_language && deal.original_language !== 'en' && (
                            <span className="lang-pill">{deal.original_language}</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {deal.confidence === 'low' && (
                            <span style={{ fontFamily: 'var(--f-stk)', fontSize: 11, color: 'var(--bok-mustard)', transform: 'rotate(-3deg)', display: 'inline-block' }}>
                              unverified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedItem>
              ))}
              <div className="bok-feed-top-gradient" />
              <div className="bok-feed-bottom-gradient" />
            </div>
          </div>
        )}

        <div style={{ padding: '0 18px' }}>
          <Link href={`/snap?store=${store.id}`} style={{ textDecoration: 'none' }}>
            <button className="btn-p">
              <CameraDoodle size={18} /> Snap a deal here
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
