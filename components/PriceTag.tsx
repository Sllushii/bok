'use client';

interface PriceTagProps {
  value: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  rotate?: number;
}

export default function PriceTag({ value, unit, size = 'md', rotate = -3 }: PriceTagProps) {
  const dollars = Math.floor(value);
  const cents = Math.round((value - dollars) * 100).toString().padStart(2, '0');
  const cls = size === 'sm' ? 'price-tag sm' : size === 'lg' ? 'price-tag lg' : 'price-tag';
  return (
    <div
      className={cls}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-label={`${dollars} dollars ${cents} cents${unit ? ' ' + unit : ''}`}
    >
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span className="currency">$</span>
        <span>{dollars}.{cents}</span>
      </div>
      {unit && <span className="unit">{unit}</span>}
    </div>
  );
}
