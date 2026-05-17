'use client';

import { useState, useEffect, useRef } from 'react';
import { Deal, Store } from '@/lib/types';
import CategoryDoodleTile from '@/components/CategoryDoodleTile';
import PriceTag from '@/components/PriceTag';
import AnimatedItem from '@/components/AnimatedItem';
import { getClient } from '@/lib/supabase';

type SortMode = 'live' | 'savings';

function catKind(category: string) {
  const map: Record<string, string> = {
    'fresh-produce': 'bokchoy', 'meat-seafood': 'fish', 'pantry': 'rice',
    'frozen': 'dumpling', 'snacks': 'snack', 'drinks': 'drink', 'other': 'noodle',
  };
  return map[category] ?? 'noodle';
}

export default function DealsFeed({ initial }: { initial: Deal[] }) {
  const [sort, setSort] = useState<SortMode>('live');
  const [deals, setDeals] = useState<Deal[]>(initial);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(initial.length < 20);
  const [newCount, setNewCount] = useState(0);
  const offsetRef = useRef(initial.length);

  async function fetchDeals(mode: SortMode, reset = false) {
    setLoading(true);
    try {
      const offset = reset ? 0 : offsetRef.current;
      const params = new URLSearchParams({ limit: '20', offset: String(offset) });
      if (mode === 'savings') params.set('sort', 'savings');
      const res = await fetch(`/api/deals?${params}`);
      if (!res.ok) return;
      const more: Deal[] = await res.json();
      if (reset) {
        setDeals(more);
        offsetRef.current = more.length;
        setDone(more.length < 20);
      } else {
        setDeals(prev => [...prev, ...more]);
        offsetRef.current += more.length;
        if (more.length < 20) setDone(true);
      }
    } finally { setLoading(false); }
  }

  function switchSort(mode: SortMode) {
    if (mode === sort) return;
    setSort(mode);
    setNewCount(0);
    fetchDeals(mode, true);
  }

  // Realtime subscription — only active in live mode
  useEffect(() => {
    if (sort !== 'live') return;
    const client = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (client.channel('deals-live-feed') as any)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'deals' },
        (payload: { new: Deal }) => {
          setDeals(prev => [payload.new, ...prev]);
          setNewCount(n => n + 1);
          offsetRef.current += 1;
        }
      )
      .subscribe();

    return () => { client.removeChannel(channel); };
  }, [sort]);

  return (
    <>
      {/* Sort toggle */}
      <div style={{ display: 'flex', gap: 8, padding: '8px 16px 0' }}>
        <button
          onClick={() => switchSort('live')}
          style={{
            height: 34, padding: '0 14px', borderRadius: 20,
            border: '2px solid var(--bok-ink)',
            background: sort === 'live' ? 'var(--bok-ink)' : 'var(--bok-white)',
            color: sort === 'live' ? 'var(--bok-white)' : 'var(--bok-ink)',
            fontFamily: 'var(--f-body)', fontSize: 12.5, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: 'var(--ink-2)',
          }}
        >
          {sort === 'live' && (
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#e63946', display: 'inline-block',
              animation: 'live-pulse 1.4s ease-in-out infinite',
            }} />
          )}
          Live feed
          {newCount > 0 && (
            <span style={{
              background: '#e63946', color: 'white', borderRadius: 10,
              padding: '1px 5px', fontSize: 10, fontWeight: 700, marginLeft: 2,
            }}>{newCount}</span>
          )}
        </button>

        <button
          onClick={() => switchSort('savings')}
          style={{
            height: 34, padding: '0 14px', borderRadius: 20,
            border: '2px solid var(--bok-ink)',
            background: sort === 'savings' ? 'var(--bok-ink)' : 'var(--bok-white)',
            color: sort === 'savings' ? 'var(--bok-white)' : 'var(--bok-ink)',
            fontFamily: 'var(--f-body)', fontSize: 12.5, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: 'var(--ink-2)',
          }}
        >
          Best savings
        </button>
      </div>

      <div className="bok-feed-wrap" style={{ marginTop: 10 }}>
        {deals.map((deal, k) => {
          const store = deal.store as Store | undefined;
          return (
            <AnimatedItem key={deal.id} index={k} delay={0.04}>
              <div className="feed-card">
                <div style={{ display: 'flex', padding: '14px 16px 14px', gap: 14, alignItems: 'flex-start', position: 'relative' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <CategoryDoodleTile kind={catKind(deal.category)} size={76} />
                    <div style={{ position: 'absolute', top: -10, right: -14 }}>
                      <PriceTag value={Number(deal.price)} unit={deal.unit ?? undefined} size="sm" rotate={k % 2 ? -3 : -5} />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 50 }}>
                    <div style={{ fontFamily: 'var(--f-body)', fontSize: 14.5, fontWeight: 700, color: 'var(--bok-ink)', lineHeight: 1.2, marginBottom: 5 }}>
                      {deal.product_name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7, flexWrap: 'wrap' as const }}>
                      <span style={{ fontSize: 11, color: 'var(--bok-pencil)', fontWeight: 500 }}>{deal.unit}</span>
                      {deal.original_language && deal.original_language !== 'en' && (
                        <span className="lang-pill">{deal.original_language}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                      <span className="stamp">{store?.name ?? 'Store'}</span>
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
          );
        })}
        <div className="bok-feed-top-gradient" />
        <div className="bok-feed-bottom-gradient" />
      </div>

      {!done && (
        <div style={{ padding: '4px 16px 0', textAlign: 'center' }}>
          <button className="btn-s" onClick={() => fetchDeals(sort)} disabled={loading}
            style={{ width: 'auto', height: 42, fontSize: 14 }}>
            {loading ? 'Loading…' : 'Load more ↓'}
          </button>
        </div>
      )}
    </>
  );
}
