'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    href: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--p)' : 'none'} stroke={active ? 'var(--p)' : 'var(--t3)'} strokeWidth="2.2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/snap',
    label: 'Snap',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--p)' : 'none'} stroke={active ? 'var(--p)' : 'var(--t3)'} strokeWidth="2.2">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    href: '/map',
    label: 'Map',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--pl)' : 'none'} stroke={active ? 'var(--p)' : 'var(--t3)'} strokeWidth="2.2">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      paddingBottom: 8, zIndex: 50, pointerEvents: 'none',
    }}>
      <div style={{
        pointerEvents: 'all',
        display: 'flex', gap: 8,
        background: 'rgba(255,255,255,0.97)',
        border: '1px solid var(--bs)',
        borderRadius: 24,
        padding: '0 20px 10px',
        boxShadow: '0 8px 32px rgba(0,0,0,.12), 0 4px 12px rgba(0,0,0,.06), 0 -1px 0 rgba(0,0,0,.04)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        minWidth: 240,
      }}>
        {tabs.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3,
                width: 64, height: 56,
                borderRadius: 16,
                background: active ? 'var(--pl)' : 'var(--sf)',
                border: `1px solid ${active ? 'var(--p)' : 'var(--bd)'}`,
                boxShadow: active
                  ? '0 2px 12px rgba(26,107,240,.18), 0 1px 4px rgba(26,107,240,.12)'
                  : 'var(--ssm)',
                marginTop: 10,
                textDecoration: 'none',
                transition: 'background .15s, border-color .15s',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {icon(active)}
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? 'var(--p)' : 'var(--t3)',
                lineHeight: 1, letterSpacing: '.01em',
              }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
