// SVG doodle library — all paths lifted verbatim from AsiaCart.html prototype.
// stroke="currentColor", intentionally imperfect beziers.

export function BokChoyDoodle({ size = 28, fill = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 28c-4 0-7-3-7-6 0-2 1-3 2-4-1-1-2-3-1-5 1-2 3-3 5-2 0-3 2-5 5-4 2 1 3 3 2 5 2-1 4 0 5 2 0 2-1 3-3 4 1 1 2 2 1 4-1 3-5 6-9 6Z" fill={fill ? 'var(--bok-leaf)' : 'none'} fillOpacity=".2"/>
      <path d="M16 28V12"/><path d="M13 18c-1-1-2-3-1-5"/><path d="M19 18c1-1 2-3 1-5"/>
    </svg>
  );
}

export function ChopsticksDoodle({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4c5 5 11 12 16 18"/><path d="M7 3c4 6 9 13 14 18"/><path d="M20 22l1.5 1"/>
    </svg>
  );
}

export function NoodleBowlDoodle({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 32c0 12 11 22 24 22s24-10 24-22"/><path d="M6 32h52"/>
      <path d="M16 38c2 1 4 1 6 0"/><path d="M28 40c2 1 5 1 7 0"/><path d="M40 38c2 1 4 1 6 0"/>
      <path d="M22 28c2-2 5-3 8-2"/><path d="M32 24c2-1 5-1 7 1"/>
      <g className="steam-anim" stroke="currentColor" strokeWidth="1.7">
        <path d="M22 18c1-2-1-4 0-6"/><path d="M32 16c1-3-1-5 0-7"/><path d="M42 18c1-2-1-4 0-6"/>
      </g>
    </svg>
  );
}

export function CameraDoodle({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10c0-1 1-2 2-2h4l2-3h8l2 3h4c1 0 2 1 2 2v14c0 1-1 2-2 2H6c-1 0-2-1-2-2Z"/>
      <path d="M16 22c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5Z"/><path d="M23 12h1"/>
    </svg>
  );
}

export function PinDoodle({ size = 32, color = 'var(--bok-red)' }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 32 42" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 2c7 0 13 5 13 12 0 9-13 26-13 26S3 23 3 14c0-7 6-12 13-12Z" fill={color}/>
      <path d="M16 18c-2 0-4-1-4-4s2-4 4-4 4 1 4 4-2 4-4 4Z" fill="white"/>
    </svg>
  );
}

export function HeartDoodle({ size = 20, filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'var(--bok-red)' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21c-1 0-9-6-10-12-1-4 2-7 5-7 2 0 4 1 5 3 1-2 3-3 5-3 3 0 6 3 5 7-1 6-9 12-10 12Z"/>
    </svg>
  );
}

export function SearchDoodle({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7Z"/><path d="M16 17c1 2 3 4 5 5"/>
    </svg>
  );
}

export function MapDoodle({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5l6-2 6 2 5-2v15l-5 2-6-2-6 2Z"/><path d="M9 3v18"/><path d="M15 5v18"/>
    </svg>
  );
}

export function HomeDoodle({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-7 9 7v9c0 1-1 2-2 2H5c-1 0-2-1-2-2Z"/><path d="M9 22v-6h6v6"/>
    </svg>
  );
}

export function ChiliDoodle({ size = 22, filled = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'var(--bok-red)' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 20c8 0 14-6 14-13 0-1-1-2-2-1-1 1-1 3-3 4-3 2-7 5-9 10Z"/><path d="M17 6c0-2 1-3 2-3"/>
    </svg>
  );
}

export function RiceDoodle({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22c0 8 6 13 14 13s14-5 14-13"/><path d="M4 22h32"/>
      <ellipse cx="14" cy="16" rx="2" ry="3" fill="currentColor" fillOpacity=".15"/>
      <ellipse cx="20" cy="14" rx="2" ry="3" fill="currentColor" fillOpacity=".15"/>
      <ellipse cx="26" cy="17" rx="2" ry="3" fill="currentColor" fillOpacity=".15"/>
      <ellipse cx="17" cy="19" rx="2" ry="3" fill="currentColor" fillOpacity=".15"/>
      <ellipse cx="23" cy="19" rx="2" ry="3" fill="currentColor" fillOpacity=".15"/>
    </svg>
  );
}

export function SoyBottleDoodle({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h8v6c2 1 3 3 3 5v18c0 1-1 2-2 2H15c-1 0-2-1-2-2V15c0-2 1-4 3-5Z" fill="currentColor" fillOpacity=".1"/>
      <path d="M14 22h12"/><path d="M14 22v8h12v-8"/><path d="M17 24v3"/>
    </svg>
  );
}

export function FishDoodle({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20c4-6 11-9 18-9 6 0 11 4 13 9-2 5-7 9-13 9-7 0-14-3-18-9Z" fill="currentColor" fillOpacity=".1"/>
      <path d="M35 20c2-2 3-3 3-5"/><path d="M35 20c2 2 3 3 3 5"/>
      <circle cx="11" cy="18" r="1.2" fill="currentColor"/>
      <path d="M15 23c2 1 4 1 6 0"/>
    </svg>
  );
}

export function DumplingDoodle({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 26c2-9 9-14 15-14s13 5 15 14c-4 4-9 6-15 6s-11-2-15-6Z" fill="currentColor" fillOpacity=".12"/>
      <path d="M8 25c2-1 4-1 6 0"/><path d="M14 25c2-1 4-1 6 0"/>
      <path d="M20 25c2-1 4-1 6 0"/><path d="M26 25c2-1 4-1 6 0"/>
    </svg>
  );
}

export function TeaCupDoodle({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 16h20v8c0 5-4 9-10 9s-10-4-10-9Z" fill="currentColor" fillOpacity=".1"/>
      <path d="M29 19c3 0 5 2 5 4s-2 4-5 4"/>
      <g className="steam-anim">
        <path d="M16 10c1-2-1-4 0-6"/><path d="M20 10c1-2-1-4 0-6"/><path d="M24 10c1-2-1-4 0-6"/>
      </g>
    </svg>
  );
}

export function SnackDoodle({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8h24l-2 26c0 1-1 2-2 2H12c-1 0-2-1-2-2Z" fill="currentColor" fillOpacity=".1"/>
      <path d="M10 14h20"/><path d="M16 20v8"/><path d="M24 20v8"/>
    </svg>
  );
}

export function DrinkDoodle({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 8h18l-2 24c0 2-2 4-4 4h-6c-2 0-4-2-4-4Z" fill="currentColor" fillOpacity=".1"/>
      <path d="M11 14h18"/><path d="M17 4v4M23 4v4"/>
    </svg>
  );
}

export function TofuDoodle({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12h28l-2 20c0 1-1 2-2 2H10c-1 0-2-1-2-2Z" fill="currentColor" fillOpacity=".1"/>
      <path d="M14 18v10M20 18v10M26 18v10"/>
    </svg>
  );
}

export function TakeoutBoxDoodle({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 22h52l-4 44c0 2-2 4-4 4H22c-2 0-4-2-4-4Z" fill="currentColor" fillOpacity=".06"/>
      <path d="M10 22c-1-3 1-6 4-8 5-3 28-3 32 0 3 2 5 5 4 8"/>
      <path d="M32 12c2 4 14 4 16 0"/><path d="M22 38l8 22"/><path d="M58 38l-8 22"/>
    </svg>
  );
}

export function SparkleDoodle({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="currentColor">
      <path d="M7 0l1.5 5.5L14 7l-5.5 1.5L7 14l-1.5-5.5L0 7l5.5-1.5Z"/>
    </svg>
  );
}

export function XDoodle({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  );
}

export function ScribbleUnderline({ color = 'var(--bok-red)' }: { color?: string }) {
  return (
    <svg className="scribble-u" viewBox="0 0 100 8" preserveAspectRatio="none">
      <path d="M2 5 Q 25 2 50 5 Q 75 8 98 4" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
