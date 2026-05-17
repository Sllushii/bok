'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Store } from '@/lib/types';
import { CameraDoodle, HomeDoodle } from '@/components/doodles';
import PriceTag from '@/components/PriceTag';
import CategoryDoodleTile from '@/components/CategoryDoodleTile';
import SectionHeader from '@/components/SectionHeader';

type SnapState = 'idle' | 'selected' | 'extracting' | 'posting' | 'result' | 'posted';

interface ExtractResult {
  product_name: string; original_text: string | null; original_language: string | null;
  price: number; unit: string; category: string; confidence: string; image_url: string; store_id: string | null;
}

function catKind(category: string) {
  const map: Record<string, string> = {
    'fresh-produce': 'bokchoy', 'meat-seafood': 'fish', 'pantry': 'rice',
    'frozen': 'dumpling', 'snacks': 'snack', 'drinks': 'drink', 'other': 'noodle',
  };
  return map[category] ?? 'noodle';
}

export default function SnapPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [state, setState] = useState<SnapState>('idle');
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [error, setError] = useState('');
  const [pasted, setPasted] = useState('');

  useEffect(() => {
    fetch('/api/stores').then(r => r.json()).then(setStores);
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f)); setState('selected'); setError('');
  }

  async function handleExtract() {
    if (!file || !selectedStore) return;
    setState('extracting'); setError('');
    const fd = new FormData();
    fd.append('image', file); fd.append('store_id', selectedStore);
    try {
      const res = await fetch('/api/extract-deal', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Extraction failed'); setState('selected'); return; }
      setResult(data); setState('result');
    } catch { setError('Network error'); setState('selected'); }
  }

  async function handleExtractText() {
    if (!pasted.trim() || !selectedStore) return;
    setState('extracting'); setError('');
    try {
      const res = await fetch('/api/extract-deal-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pasted, store_id: selectedStore }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Extraction failed'); setState('idle'); return; }
      setResult(data); setState('result');
    } catch { setError('Network error'); setState('idle'); }
  }

  async function handlePost() {
    if (!result) return;
    setState('posting');
    const dealRow = {
      store_id: selectedStore || null, product_name: result.product_name,
      original_text: result.original_text ?? null, original_language: result.original_language ?? null,
      price: result.price, unit: result.unit ?? null, category: result.category,
      image_url: result.image_url, confidence: result.confidence ?? 'medium', is_featured: false,
    };
    try {
      const res = await fetch('/api/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dealRow) });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Failed'); setState('result'); return; }
    } catch { setError('Network error'); setState('result'); return; }
    setState('posted');
    setTimeout(() => router.push('/'), 1500);
  }

  function handleReset() {
    setFile(null); setPreview(''); setResult(null); setError(''); setState('idle');
    if (fileRef.current) fileRef.current.value = '';
  }

  const isLoading = state === 'extracting' || state === 'posting';
  const loadingLabel = state === 'extracting' ? 'Reading price tag…' : 'Posting deal…';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '18px 18px 6px' }}>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, fontWeight: 700, color: 'var(--bok-ink)', lineHeight: 1 }}>
          Snap a tag!
        </div>
        <div style={{ fontFamily: 'var(--f-body)', fontSize: 13, color: 'var(--bok-pencil)', marginTop: 10, lineHeight: 1.4 }}>
          Spotted a cheeky deal in-store? Snap the price tag — we&apos;ll do the rest.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '18px 0 30px' }}>

        {/* Capture card */}
        <div style={{ padding: '0 18px' }}>
          <div style={{
            background: 'var(--bok-white)', border: '2px solid var(--bok-ink)',
            borderRadius: 'var(--wr-md)', boxShadow: 'var(--ink-3)',
            padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
          }}>

            {/* Posted state */}
            {state === 'posted' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: 12 }}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, fontWeight: 700, color: 'var(--bok-red)' }}>Added to feed!</div>
                <div style={{ fontFamily: 'var(--f-body)', fontSize: 13, color: 'var(--bok-pencil)' }}>Redirecting…</div>
              </div>
            )}

            {/* Result: confirmation */}
            {state === 'result' && result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <CategoryDoodleTile kind={catKind(result.category)} size={88} />
                    <div style={{ position: 'absolute', top: -10, right: -16 }}>
                      <PriceTag value={Number(result.price)} unit={result.unit} size="md" rotate={-4} />
                    </div>
                  </div>
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <div style={{ fontFamily: 'var(--f-body)', fontSize: 16, fontWeight: 700, color: 'var(--bok-ink)', marginBottom: 4 }}>{result.product_name}</div>
                    {result.original_text && (
                      <div style={{ fontSize: 11, color: 'var(--bok-pencil)', marginBottom: 4 }}>Original: {result.original_text}</div>
                    )}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                      <span className="stamp">{result.unit}</span>
                      <span className="stamp">{result.category}</span>
                      {result.original_language && result.original_language !== 'en' && (
                        <span className="lang-pill">{result.original_language}</span>
                      )}
                      {result.confidence === 'low' && (
                        <span style={{ fontFamily: 'var(--f-stk)', fontSize: 11, color: 'var(--bok-mustard)', transform: 'rotate(-3deg)', display: 'inline-block' }}>unverified</span>
                      )}
                    </div>
                  </div>
                </div>
                {error && <p style={{ fontSize: 13, color: 'var(--bok-mustard)', textAlign: 'center' }}>{error}</p>}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-p" onClick={handlePost} style={{ flex: 1 }}>Looks good — post it ✓</button>
                  <button className="btn-s" onClick={handleReset} style={{ height: 50 }}>Try again</button>
                </div>
              </div>
            )}

            {/* Idle / selected / loading */}
            {state !== 'result' && state !== 'posted' && (
              <>
                {/* Buttons row */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <label style={{ flex: 1, cursor: 'pointer' }}>
                    <div className="btn-p" style={{ pointerEvents: 'none' }}>
                      <CameraDoodle size={18} /> Take photo
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" style={{ display: 'none' }} onChange={handleFileChange} />
                  </label>
                  <label style={{ flex: 1, cursor: 'pointer', display: 'block' }}>
                    <div className="btn-s" style={{ height: 50, width: '100%', display: 'flex', boxShadow: 'var(--ink-3)', pointerEvents: 'none' }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      Upload
                    </div>
                    <input type="file" accept="image/*" className="hidden" style={{ display: 'none' }} onChange={handleFileChange} />
                  </label>
                </div>

                {/* OR divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '2px 0' }}>
                  <div style={{ flex: 1, height: 0, borderTop: '2px dashed var(--bok-pencil-lt)' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--bok-pencil)', textTransform: 'uppercase' as const, letterSpacing: '.1em' }}>or</span>
                  <div style={{ flex: 1, height: 0, borderTop: '2px dashed var(--bok-pencil-lt)' }} />
                </div>

                {/* Paste textarea */}
                <div>
                  <textarea
                    value={pasted}
                    onChange={e => setPasted(e.target.value)}
                    placeholder="Paste deal text here…"
                    rows={4}
                    style={{
                      width: '100%', resize: 'none',
                      border: '2px solid var(--bok-ink)', borderRadius: 'var(--wr-sm)',
                      padding: '12px 14px', fontSize: 13, fontFamily: 'var(--f-body)',
                      fontWeight: 500, color: 'var(--bok-ink)', lineHeight: 1.5,
                      background: 'var(--bok-paper)', outline: 'none', display: 'block',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: pasted.length > 500 ? 'var(--bok-red)' : 'var(--bok-pencil)' }}>{pasted.length}/600</span>
                  </div>
                  <button className="btn-p" disabled={!pasted.trim() || !selectedStore} onClick={handleExtractText} style={{ marginTop: 4 }}>
                    {!selectedStore ? 'Select a store first' : 'Extract the deal →'}
                  </button>
                </div>

                {/* Preview + loading overlay */}
                {(state === 'selected' || isLoading) && preview && (
                  <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', border: '2px solid var(--bok-ink)' }}>
                    <Image src={preview} alt="Price tag" fill style={{ objectFit: 'cover' }} />
                    {isLoading && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,25,23,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        <div style={{ width: 44, height: 44, border: '3px solid rgba(255,255,255,.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                        <span style={{ color: 'white', fontSize: 13, fontWeight: 600, fontFamily: 'var(--f-display)' }}>{loadingLabel}</span>
                      </div>
                    )}
                  </div>
                )}

                {error && <p style={{ fontSize: 13, color: 'var(--bok-mustard)', textAlign: 'center' }}>{error}</p>}

                {state === 'selected' && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-p" onClick={handleExtract} disabled={!selectedStore} style={{ flex: 1 }}>
                      {selectedStore ? 'Extract deal' : 'Select a store first'}
                    </button>
                    <button className="btn-s" onClick={handleReset} style={{ height: 50, padding: '0 16px' }}>Cancel</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Which stall */}
        {state !== 'posted' && (
          <div style={{ padding: '0 18px' }}>
            <div style={{ background: 'var(--bok-white)', border: '2px solid var(--bok-ink)', borderRadius: 'var(--wr-md)', boxShadow: 'var(--ink-3)' }}>
              <div style={{ padding: '12px 16px 10px', borderBottom: '2px dashed var(--bok-pencil-lt)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <HomeDoodle size={18} />
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 700, color: 'var(--bok-ink)' }}>Which stall?</span>
                </div>
                <span style={{ fontFamily: 'var(--f-stk)', fontSize: 11, color: 'var(--bok-red)', transform: 'rotate(-4deg)', display: 'inline-block' }}>need this!</span>
              </div>
              <div style={{ padding: '12px 14px 14px', display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                {stores.map((s, i) => (
                  <div key={s.id} onClick={() => setSelectedStore(s.id)} className="fpill"
                    style={{
                      transform: `rotate(${i % 2 ? 1 : -1}deg)`,
                      background: selectedStore === s.id ? 'var(--bok-red)' : 'var(--bok-white)',
                      color: selectedStore === s.id ? 'white' : 'var(--bok-ink)',
                    }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.hero_color, flexShrink: 0, display: 'inline-block' }} />
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Community stats */}
        <div>
          <SectionHeader title="The auntie network" />
          <div style={{ display: 'flex', gap: 12, padding: '8px 16px 0' }}>
            {[
              { val: '1,240+', label: 'deals this week', color: 'var(--bok-red)', rot: -1.5 },
              { val: '380',    label: 'snappers strong', color: 'var(--bok-mustard)', rot: 1.5 },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, background: 'var(--bok-white)', border: '2px solid var(--bok-ink)',
                borderRadius: 'var(--wr-md)', boxShadow: 'var(--ink-3)',
                padding: '18px 14px 16px', textAlign: 'center', transform: `rotate(${s.rot}deg)`,
              }}>
                <div style={{ fontFamily: 'var(--f-stk)', fontSize: 34, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
                <div style={{ fontFamily: 'var(--f-body)', fontSize: 10.5, fontWeight: 600, color: 'var(--bok-pencil)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 18px' }}>
          <button className="btn-p">
            <CameraDoodle size={18} /> Start snapping deals
          </button>
          <p style={{ textAlign: 'center', marginTop: 12, fontFamily: 'var(--f-display)', fontSize: 17, color: 'var(--bok-pencil)' }}>
            verified snaps earn auntie badges ✦
          </p>
        </div>
      </div>
    </div>
  );
}
