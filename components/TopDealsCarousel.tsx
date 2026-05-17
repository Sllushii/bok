'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Deal, Store } from '@/lib/types';
import PriceTag from '@/components/PriceTag';
import CategoryDoodleTile from '@/components/CategoryDoodleTile';

const BANNER_BG: Record<string, string> = {
  chinese:    '#FDE8DF',
  vietnamese: '#E8F0DF',
  korean:     '#DDE5F3',
  japanese:   '#F5E0EC',
  'pan-asian':'#FDF3DC',
};

const HOT_LABELS: Record<string, string> = {
  'fresh-produce': 'FRESH!', 'meat-seafood': 'HOT!', 'pantry': 'BULK!',
  'frozen': 'COLD!', 'snacks': 'SNACK!', 'drinks': 'CHUG!', 'other': 'DEAL!',
};

export default function TopDealsCarousel({ deals }: { deals: Deal[] }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<number | null>(null);

  const go = useCallback((newIdx: number, newDir: number) => {
    setDir(newDir); setIdx(newIdx); setAnimKey(k => k + 1);
  }, []);

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDir(1); setIdx(i => (i + 1) % deals.length); setAnimKey(k => k + 1);
    }, 3800);
  }, [deals.length]);

  useEffect(() => { restart(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [restart]);

  if (!deals.length) return null;

  const deal = deals[idx];
  const store = deal.store as Store | undefined;
  const tint = BANNER_BG[store?.cuisine ?? ''] ?? '#F0EDE8';
  const hot = HOT_LABELS[deal.category] ?? 'DEAL!';

  const next = () => { go((idx + 1) % deals.length, 1); restart(); };
  const prev = () => { go((idx - 1 + deals.length) % deals.length, -1); restart(); };

  return (
    <div>
      <div style={{
        margin: '0 16px', border: '2px solid var(--bok-ink)', borderRadius: 'var(--wr-lg)',
        boxShadow: 'var(--ink-3)', overflow: 'hidden', background: tint, transition: 'background .4s ease',
      }}>
        <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}
          onTouchStart={e => { touchStart.current = e.touches[0].clientX; if (timerRef.current) clearInterval(timerRef.current); }}
          onTouchEnd={e => {
            if (touchStart.current == null) return;
            const dx = e.changedTouches[0].clientX - touchStart.current;
            if (dx < -40) next(); else if (dx > 40) prev(); else restart();
            touchStart.current = null;
          }}>
          <div key={animKey} style={{
            position: 'absolute', inset: 0,
            animation: `slide-${dir > 0 ? 'in-r' : 'in-l'} 380ms cubic-bezier(.22,1,.36,1) both`,
          }}>
            {/* DealCard big — layout per AsiaCart spec */}
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 18px' }}>
              <div style={{ position: 'relative', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <CategoryDoodleTile kind={deal.category} size={120} />
                <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span className="hot-sticker">{hot}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--f-body)', fontSize: 17, fontWeight: 700, color: 'var(--bok-ink)', lineHeight: 1.15, marginBottom: 6 }}>
                    {deal.product_name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 12, color: 'var(--bok-pencil)', fontWeight: 500 }}>{deal.unit}</span>
                    {deal.original_language && deal.original_language !== 'en' && (
                      <span className="lang-pill">{deal.original_language}</span>
                    )}
                  </div>
                  <span className="stamp">{store?.name ?? 'Store'}</span>
                </div>
              </div>
              <div className="dashed-d" style={{ paddingTop: 11, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 700, color: 'var(--bok-red)', lineHeight: 1 }}>
                    ${Number(deal.price).toFixed(2)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--bok-pencil)', marginTop: 2 }}>{deal.unit}</div>
                </div>
                <PriceTag value={Number(deal.price)} unit={deal.unit ?? undefined} size="lg" rotate={-4} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
        {deals.map((_, i) => (
          <div key={i} onClick={() => { go(i, i > idx ? 1 : -1); restart(); }}
            style={{
              height: 7, width: i === idx ? 22 : 7,
              background: i === idx ? 'var(--bok-red)' : 'var(--bok-pencil-lt)',
              borderRadius: 3, cursor: 'pointer', border: '1px solid var(--bok-ink)',
              transition: 'width .28s ease, background .28s ease',
            }} />
        ))}
      </div>
    </div>
  );
}
