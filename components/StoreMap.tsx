'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Store } from '@/lib/types';
import { SearchDoodle, PinDoodle, XDoodle } from '@/components/doodles';
import Link from 'next/link';

declare global { interface Window { L: typeof import('leaflet'); } }

const CUISINE_HEX: Record<string, string> = {
  chinese: '#D94F2A', vietnamese: '#4A7234', korean: '#3D5FA0',
  japanese: '#C2598A', 'pan-asian': '#C8860A',
};
const CUISINE_COLOR: Record<string, string> = {
  chinese: 'var(--c-chinese)', vietnamese: 'var(--c-vietnamese)',
  korean: 'var(--c-korean)', japanese: 'var(--c-japanese)', 'pan-asian': 'var(--c-pan-asian)',
};

const MAP_FILTERS = [
  { id: 'open', lb: 'Open now' },
  { id: 'cn', lb: 'Chinese', cuisine: 'chinese' },
  { id: 'kr', lb: 'Korean', cuisine: 'korean' },
  { id: 'jp', lb: 'Japanese', cuisine: 'japanese' },
  { id: 'vn', lb: 'Vietnamese', cuisine: 'vietnamese' },
  { id: 'pan', lb: 'Pan-Asian', cuisine: 'pan-asian' },
];

function loadLeaflet(): Promise<void> {
  if (window.L) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="leaflet.js"]')) {
      // already injected, wait for it
      const check = setInterval(() => { if (window.L) { clearInterval(check); resolve(); } }, 50);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function StoreMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<ReturnType<typeof window.L.map> | null>(null);
  const markersRef = useRef<Record<string, ReturnType<typeof window.L.marker>>>({});
  const [stores, setStores] = useState<Store[]>([]);
  const [leafletReady, setLeafletReady] = useState(false);
  const [sel, setSel] = useState<Store | null>(null);
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/stores').then(r => r.json()).then(setStores);
    loadLeaflet().then(() => setLeafletReady(true));
  }, []);

  const makePinIcon = useCallback((store: Store, selected: boolean) => {
    const L = window.L;
    const sz = selected ? 40 : 30;
    const sh = Math.round(sz * 1.32);
    const col = CUISINE_HEX[store.cuisine] || '#4A7234';
    const badgeStr = '';
    const html = `<div style="position:relative;width:${sz}px;height:${sh}px;">
      <svg width="${sz}" height="${sh}" viewBox="0 0 32 42" overflow="visible" style="display:block;filter:drop-shadow(2px 2px 0 #1C1917)">
        <path d="M16 2c7 0 13 5 13 12 0 9-13 26-13 26S3 23 3 14c0-7 6-12 13-12Z" fill="${col}" stroke="#1C1917" stroke-width="2"/>
        <circle cx="16" cy="14" r="5" fill="#F8F5F0" stroke="#1C1917" stroke-width="1.5"/>
        <text x="16" y="17.5" text-anchor="middle" fill="#1C1917" font-size="9" font-weight="700" font-family="DM Sans,sans-serif">${store.name[0]}</text>
        ${badgeStr}
      </svg>
    </div>`;
    return L.divIcon({ className: '', html, iconSize: [sz, sh], iconAnchor: [sz / 2, sh] });
  }, []);

  useEffect(() => {
    if (!leafletReady || !stores.length || !mapContainerRef.current || leafletMapRef.current) return;
    const L = window.L;
    const map = L.map(mapContainerRef.current, { center: [-37.8136, 144.9631], zoom: 13, zoomControl: false, scrollWheelZoom: true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    L.circleMarker([-37.8136, 144.9631], { radius: 8, fillColor: '#4A7234', color: '#1C1917', weight: 2, fillOpacity: 0.9 })
      .addTo(map)
      .bindTooltip('<span style="font-family:Caveat,cursive;font-size:15px;font-weight:700">you!</span>', { permanent: true, direction: 'right', offset: [10, -8], className: 'bok-you-label' });

    stores.forEach(store => {
      const marker = L.marker([store.lat, store.lng], { icon: makePinIcon(store, false) }).addTo(map);
      marker.on('click', () => setSel(prev => prev?.id === store.id ? null : store));
      markersRef.current[store.id] = marker;
    });

    leafletMapRef.current = map;
    // Leaflet CSS may still be applying — force a layout recalculation
    requestAnimationFrame(() => map.invalidateSize());
    setTimeout(() => map.invalidateSize(), 300);
    return () => { map.remove(); leafletMapRef.current = null; };
  }, [leafletReady, stores, makePinIcon]);

  useEffect(() => {
    if (!leafletMapRef.current || !stores.length) return;
    stores.forEach(store => {
      const m = markersRef.current[store.id];
      if (m) m.setIcon(makePinIcon(store, sel?.id === store.id));
    });
    if (sel && leafletMapRef.current) {
      leafletMapRef.current.panTo([sel.lat, sel.lng], { animate: true, duration: 0.4 });
    }
  }, [sel, stores, makePinIcon]);

  useEffect(() => {
    if (!leafletMapRef.current || !stores.length) return;
    const cuisineFilters = MAP_FILTERS.filter(f => f.cuisine && filters.includes(f.id)).map(f => f.cuisine!);
    stores.forEach(store => {
      const m = markersRef.current[store.id];
      if (!m) return;
      let show = true;
      // 'open' filter not supported until open status is added to stores table
      if (cuisineFilters.length > 0 && !cuisineFilters.includes(store.cuisine)) show = false;
      if (show && !leafletMapRef.current!.hasLayer(m)) m.addTo(leafletMapRef.current!);
      if (!show && leafletMapRef.current!.hasLayer(m)) leafletMapRef.current!.removeLayer(m);
    });
  }, [filters, stores]);

  const tog = (id: string) => setFilters(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  const zoomIn = () => leafletMapRef.current?.zoomIn();
  const zoomOut = () => leafletMapRef.current?.zoomOut();

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      {/* Zoom buttons */}
      <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 8, zIndex: 10 }}>
        {([['+', zoomIn], ['−', zoomOut]] as const).map(([b, fn], i) => (
          <div key={i} onClick={fn} style={{
            width: 38, height: 38, background: 'var(--bok-white)', border: '2px solid var(--bok-ink)',
            borderRadius: '12px 14px 11px 13px', boxShadow: 'var(--ink-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 18, fontWeight: 700, color: 'var(--bok-ink)',
            fontFamily: 'var(--f-body)', userSelect: 'none', zIndex: 10,
          }}>{b}</div>
        ))}
      </div>

      {/* Search + filter overlay */}
      <div className="map-overlay">
        <div className="searchbar">
          <SearchDoodle size={16} />
          <span style={{ fontFamily: 'var(--f-body)', fontSize: 13, color: 'var(--bok-pencil)', flex: 1 }}>Search stores, suburbs…</span>
          <div style={{ height: 18, width: 2, background: 'var(--bok-pencil-lt)' }} />
          <PinDoodle size={16} color="var(--bok-red)" />
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {MAP_FILTERS.map((f, i) => (
            <div key={f.id}
              className={`fpill${filters.includes(f.id) ? ' on' : ''}`}
              style={{
                transform: `rotate(${i % 2 ? 1 : -1}deg)`,
                background: filters.includes(f.id) ? (f.cuisine ? CUISINE_COLOR[f.cuisine] : 'var(--bok-red)') : 'var(--bok-white)',
                color: filters.includes(f.id) ? 'white' : 'var(--bok-ink)',
              }}
              onClick={() => tog(f.id)}>
              {f.cuisine && <span style={{ width: 8, height: 8, borderRadius: '50%', background: CUISINE_COLOR[f.cuisine], border: '1.5px solid var(--bok-ink)', display: 'inline-block' }} />}
              {f.lb}
            </div>
          ))}
        </div>
      </div>

      {/* Store count badge */}
      {!sel && (
        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%) rotate(-1deg)', zIndex: 10 }}>
          <div style={{
            background: 'var(--bok-ink)', color: 'var(--bok-paper)', padding: '8px 16px',
            border: '2px solid var(--bok-ink)', borderRadius: 'var(--wr-md)',
            fontFamily: 'var(--f-body)', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <PinDoodle size={14} color="var(--bok-red-soft)" />
            {stores.length} stalls nearby
          </div>
        </div>
      )}

      {/* Store bottom sheet */}
      <div className={`bs-ovl${sel ? ' open' : ''}`} onClick={() => setSel(null)} />
      <div className={`bs-sheet${sel ? ' open' : ''}`}>
        <div className="bs-handle" />
        {sel && (
          <div style={{ padding: '0 18px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 32, fontWeight: 700, color: 'var(--bok-ink)', lineHeight: 1, marginBottom: 6 }}>{sel.name}</div>
                <div style={{ fontFamily: 'var(--f-body)', fontSize: 12, color: 'var(--bok-pencil)', fontWeight: 500 }}>{sel.address}, {sel.suburb}</div>
              </div>
              <button onClick={() => setSel(null)} style={{
                width: 36, height: 36, border: '2px solid var(--bok-ink)', borderRadius: '12px 14px 11px 13px',
                background: 'var(--bok-white)', boxShadow: 'var(--ink-2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--bok-ink)', flexShrink: 0,
              }}>
                <XDoodle size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' as const }}>
              <span className="stamp" style={{ transform: 'rotate(-1deg)' }}>{sel.opening_hours ?? 'Hours vary'}</span>
            </div>
            <Link href={`/store/${sel.slug}`} style={{ textDecoration: 'none' }}>
              <button className="btn-p">View all deals →</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
