import type { Metadata } from 'next';
import './globals.css';
import BokNav from '@/components/BokNav';

export const metadata: Metadata = {
  title: 'Bok — Live deals from Asian grocers',
  description: 'Live deals from your local Asian grocers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Permanent+Marker&display=swap" rel="stylesheet"/>
      </head>
      <body>
        {/* Brand green background */}
        <div style={{
          minHeight: '100vh', width: '100%',
          background: '#3a5e28',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '32px 16px',
        }}>
          {/* Phone — 3px border, all content clipped inside */}
          <div style={{
            width: 393, height: 852, flexShrink: 0,
            border: '3px solid var(--bok-ink)',
            borderRadius: 52,
            overflow: 'hidden',
            position: 'relative',
            transform: 'translateZ(0)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.40), 6px 6px 0 rgba(0,0,0,0.20)',
          }}>
            {/* Scrollable content — padding-bottom clears the nav */}
            <main style={{
              position: 'absolute', inset: 0,
              overflowY: 'auto', overflowX: 'hidden',
              scrollbarWidth: 'none',
              paddingBottom: 96,
              background: 'var(--bok-paper)',
              backgroundImage: 'radial-gradient(circle, rgba(28,25,23,0.10) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}>
              {children}
            </main>

            {/* Nav — absolutely pinned inside the phone frame */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              display: 'flex', justifyContent: 'center',
              padding: '6px 0 12px',
              background: 'linear-gradient(to top, var(--bok-paper) 65%, transparent)',
              zIndex: 30,
            }}>
              <BokNav />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
