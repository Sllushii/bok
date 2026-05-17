'use client';

import { useState } from 'react';
import { SearchDoodle, TakeoutBoxDoodle, XDoodle } from '@/components/doodles';
import CategoryDoodleTile from '@/components/CategoryDoodleTile';
import PriceTag from '@/components/PriceTag';
import SectionHeader from '@/components/SectionHeader';
import DragScroll from '@/components/DragScroll';

const BROWSE_CATS = [
  { kind: 'bokchoy', lb: 'Fresh produce',   color: 'var(--c-vietnamese)', cat: 'fresh-produce' },
  { kind: 'noodle',  lb: 'Pantry & noodles',color: 'var(--c-chinese)',    cat: 'pantry'        },
  { kind: 'fish',    lb: 'Meat & seafood',   color: 'var(--c-korean)',     cat: 'meat-seafood'  },
  { kind: 'dumpling',lb: 'Frozen',           color: 'var(--c-japanese)',   cat: 'frozen'        },
  { kind: 'snack',   lb: 'Snacks',           color: 'var(--bok-mustard)',  cat: 'snacks'        },
  { kind: 'drink',   lb: 'Drinks',           color: 'var(--c-pan-asian)',  cat: 'drinks'        },
];

const QUICK = ['Under $5', 'Fresh today', 'Top rated', 'Near me', '50%+ off', 'Just snapped'];

interface DealResult {
  id: string; product_name: string; price: number; unit: string | null;
  category: string; original_language: string | null; store: { name: string } | null;
  confidence: string; created_at: string;
}

function applyQuickFilters(deals: DealResult[], filters: string[]): DealResult[] {
  let out = deals;
  if (filters.includes('Under $5'))   out = out.filter(d => d.price < 5);
  if (filters.includes('Top rated'))  out = out.filter(d => d.confidence === 'high');
  if (filters.includes('Fresh today')) {
    const today = new Date().toDateString();
    out = out.filter(d => new Date(d.created_at).toDateString() === today);
  }
  return out;
}

function catKind(category: string) {
  const map: Record<string, string> = {
    'fresh-produce': 'bokchoy', 'meat-seafood': 'fish', 'pantry': 'rice',
    'frozen': 'dumpling', 'snacks': 'snack', 'drinks': 'drink', 'other': 'noodle',
  };
  return map[category] ?? 'noodle';
}

export default function SearchPage() {
  const [q, setQ]                       = useState('');
  const [results, setResults]           = useState<DealResult[]>([]);
  const [searching, setSearching]       = useState(false);
  const [activeCat, setActiveCat]       = useState<typeof BROWSE_CATS[0] | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [recent, setRecent]             = useState(['Bok choy', 'Shin Ramyun', 'Jasmine rice 5kg']);

  async function doSearch(query: string, category?: string) {
    setSearching(true);
    try {
      const p = new URLSearchParams({ limit: '40' });
      if (query.trim()) p.set('search', query.trim());
      if (category)    p.set('category', category);
      const res = await fetch(`/api/deals?${p}`);
      if (res.ok) setResults(await res.json());
    } finally { setSearching(false); }
  }

  function handleChange(val: string) {
    setQ(val);
    setActiveCat(null);
    setActiveFilters([]);
    if (val.trim()) {
      if (!recent.includes(val)) setRecent(prev => [val, ...prev].slice(0, 6));
      doSearch(val);
    } else {
      setResults([]);
    }
  }

  function handleCat(c: typeof BROWSE_CATS[0]) {
    setQ('');
    setActiveCat(c);
    setActiveFilters([]);
    doSearch('', c.cat);
  }

  function toggleFilter(f: string) {
    const next = activeFilters.includes(f)
      ? activeFilters.filter(x => x !== f)
      : [...activeFilters, f];
    setActiveFilters(next);
    if (!q.trim() && !activeCat) {
      if (next.length > 0) doSearch('');
      else setResults([]);
    }
  }

  const isActive = !!(q.trim() || activeCat || activeFilters.length);
  const displayResults = activeFilters.length ? applyQuickFilters(results, activeFilters) : results;
  const resultTitle = activeCat ? activeCat.lb : `"${q}"`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Sticky header */}
      <div className="sth" style={{ paddingBottom: 14 }}>
        <div style={{ padding: '14px 18px 8px' }}>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, fontWeight: 700, color: 'var(--bok-ink)', lineHeight: 1 }}>
            Find a deal
          </div>
        </div>
        <div style={{ padding: '4px 18px 0' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text" value={q} onChange={e => handleChange(e.target.value)}
              placeholder="what's cheap today?"
              style={{
                width: '100%', height: 52,
                border: '2px solid var(--bok-ink)', borderRadius: 'var(--wr-md)',
                boxShadow: 'var(--ink-3)', padding: '0 44px 0 46px',
                fontFamily: 'var(--f-body)', fontSize: 15, fontWeight: 500, color: 'var(--bok-ink)',
                background: 'var(--bok-white)', outline: 'none',
              }}
            />
            <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--bok-pencil)' }}>
              <SearchDoodle size={18} />
            </div>
            {(q || activeCat) && (
              <div onClick={() => { setQ(''); setActiveCat(null); setActiveFilters([]); setResults([]); }} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                width: 24, height: 24, borderRadius: '50%', background: 'var(--bok-ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--bok-paper)',
              }}>
                <XDoodle size={12} />
              </div>
            )}
          </div>
        </div>

        {/* Quick filters — always visible */}
        <DragScroll style={{ paddingRight: 40, paddingTop: 10 }}>
          {QUICK.map((f, i) => (
            <div key={f} onClick={() => toggleFilter(f)} className={`fpill${activeFilters.includes(f) ? ' on' : ''}`} style={{
              height: 36, fontSize: 12.5,
              transform: `rotate(${i % 2 ? 1 : -1}deg)`,
              background: activeFilters.includes(f) ? 'var(--bok-red)' : 'var(--bok-white)',
              color: activeFilters.includes(f) ? 'white' : 'var(--bok-ink)',
            }}>
              {f}
            </div>
          ))}
        </DragScroll>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, padding: '20px 0 30px' }}>

        {/* Results */}
        {isActive && (
          <div>
            <SectionHeader title={resultTitle} sub={searching ? 'Searching…' : `${displayResults.length} found`} />
            <div style={{ marginTop: 10 }}>
              {!searching && displayResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 16px' }}>
                  <div style={{ color: 'var(--bok-ink)', display: 'flex', justifyContent: 'center', marginBottom: 14, opacity: .4 }}>
                    <TakeoutBoxDoodle size={120} />
                  </div>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 700, color: 'var(--bok-ink)', marginBottom: 4 }}>
                    Nothing matched
                  </div>
                  <div style={{ fontFamily: 'var(--f-body)', fontSize: 13, color: 'var(--bok-pencil)' }}>try a broader term, or snap one!</div>
                </div>
              ) : displayResults.map((deal, k) => (
                <div key={deal.id} className="feed-card">
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                        <span style={{ fontSize: 11, color: 'var(--bok-pencil)', fontWeight: 500 }}>{deal.unit}</span>
                        {deal.original_language && deal.original_language !== 'en' && (
                          <span className="lang-pill">{deal.original_language}</span>
                        )}
                      </div>
                      <span className="stamp">{deal.store?.name ?? 'Store'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Browse state */}
        {!isActive && (
          <>
            {recent.length > 0 && (
              <div>
                <SectionHeader title="Recent" link="Clear" onLink={() => setRecent([])} />
                <div style={{ padding: '8px 18px 0' }}>
                  {recent.map((r, i) => (
                    <div key={r} onClick={() => handleChange(r)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', cursor: 'pointer', borderBottom: i < recent.length - 1 ? '2px dashed var(--bok-pencil-lt)' : 'none' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bok-pencil)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                      <span style={{ flex: 1, fontFamily: 'var(--f-body)', fontSize: 14, fontWeight: 500, color: 'var(--bok-ink)' }}>{r}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--bok-pencil)" strokeWidth="2.2" strokeLinecap="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <SectionHeader title="Browse by aisle" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '10px 16px 0' }}>
                {BROWSE_CATS.map((c, i) => (
                  <div key={c.lb} onClick={() => handleCat(c)} style={{
                    background: 'var(--bok-white)', border: '2px solid var(--bok-ink)',
                    borderRadius: i % 2 ? 'var(--wr-md)' : '18px 14px 20px 16px',
                    boxShadow: 'var(--ink-3)', padding: '14px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    position: 'relative', overflow: 'hidden',
                    transform: `rotate(${i % 2 ? .4 : -.4}deg)`,
                  }}>
                    <div style={{ color: c.color, display: 'flex' }}>
                      <CategoryDoodleTile kind={c.kind} size={42} />
                    </div>
                    <div style={{ fontFamily: 'var(--f-body)', fontSize: 14, fontWeight: 700, color: 'var(--bok-ink)', lineHeight: 1.1 }}>{c.lb}</div>
                    <div style={{ fontFamily: 'var(--f-stk)', fontSize: 16, color: c.color, lineHeight: 1, transform: 'rotate(-2deg)', display: 'inline-block', marginTop: -2 }}>
                      deals
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
