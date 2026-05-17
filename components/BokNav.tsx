'use client';
import { useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { HomeDoodle, MapDoodle, CameraDoodle, SearchDoodle } from '@/components/doodles';

const BOK_BASE = 40;
const BOK_MAG  = 62;
const BOK_DIST = 120;

const TABS = [
  { id: 'home',   href: '/',       label: 'Home',   Icon: HomeDoodle   },
  { id: 'map',    href: '/map',    label: 'Map',    Icon: MapDoodle    },
  { id: 'snap',   href: '/snap',   label: 'Snap',   Icon: CameraDoodle },
  { id: 'search', href: '/search', label: 'Search', Icon: SearchDoodle },
];

export default function BokNav() {
  const pathname = usePathname();
  const router = useRouter();
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scales, setScales] = useState([1, 1, 1, 1]);
  const [hoverIdx, setHoverIdx] = useState(-1);

  const activeTab = TABS.find(t =>
    t.href === '/' ? pathname === '/' : pathname.startsWith(t.href)
  )?.id ?? 'home';

  const onMouseMove = (e: React.MouseEvent) => {
    const next = itemRefs.current.map(el => {
      if (!el) return 1;
      const r = el.getBoundingClientRect();
      const cx = r.x + r.width / 2;
      const d = e.pageX - cx;
      const t = 1 - Math.min(1, Math.abs(d) / BOK_DIST);
      return 1 + (BOK_MAG / BOK_BASE - 1) * t;
    });
    setScales(next);
  };

  return (
    <nav className="bnav" onMouseMove={onMouseMove} onMouseLeave={() => setScales([1, 1, 1, 1])}
      style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none' }}
    >
      {TABS.map((t, i) => {
        const isActive = activeTab === t.id;
        const baseScale = scales[i];
        const finalScale = isActive ? Math.max(baseScale, 1.12) : baseScale;
        return (
          <div key={t.id} ref={el => { itemRefs.current[i] = el; }}>
            <button
              className={`bnav-tab${isActive ? ' on' : ''}`}
              onClick={() => router.push(t.href)}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(-1)}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className="bnav-icon"
                style={{
                  transform: `scale(${finalScale})`,
                  color: isActive ? 'white' : 'var(--bok-ink)',
                  transformOrigin: 'bottom center',
                  transition: 'transform 180ms cubic-bezier(.34,1.56,.64,1), background .18s, box-shadow .18s',
                }}
              >
                <t.Icon size={20} />
              </div>
              <span
                className="bnav-label"
                style={{
                  opacity: (isActive || hoverIdx === i) ? 1 : 0,
                  transform: (isActive || hoverIdx === i) ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'opacity .15s ease-out, transform .15s ease-out',
                }}
              >
                {t.label}
              </span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
