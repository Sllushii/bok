import {
  BokChoyDoodle, ChiliDoodle, RiceDoodle, SoyBottleDoodle, FishDoodle,
  DumplingDoodle, TeaCupDoodle, SnackDoodle, DrinkDoodle, TofuDoodle, NoodleBowlDoodle,
} from '@/components/doodles';

// Map DB categories → doodle component + tile bg class
const DOODLE_MAP: Record<string, { D: React.ComponentType<{ size?: number }>, bg: string }> = {
  'fresh-produce': { D: BokChoyDoodle,  bg: 'leaf' },
  'meat-seafood':  { D: FishDoodle,     bg: 'indigo' },
  'pantry':        { D: RiceDoodle,     bg: '' },
  'frozen':        { D: DumplingDoodle, bg: '' },
  'snacks':        { D: SnackDoodle,    bg: 'pink' },
  'drinks':        { D: DrinkDoodle,    bg: 'indigo' },
  'other':         { D: NoodleBowlDoodle, bg: '' },
  // prototype 'kind' aliases (used in hardcoded data)
  noodle:   { D: NoodleBowlDoodle, bg: '' },
  mayo:     { D: SoyBottleDoodle,  bg: 'mustard' },
  rice:     { D: RiceDoodle,       bg: '' },
  chili:    { D: ChiliDoodle,      bg: '' },
  bokchoy:  { D: BokChoyDoodle,    bg: 'leaf' },
  sauce:    { D: SoyBottleDoodle,  bg: '' },
  dashi:    { D: TeaCupDoodle,     bg: '' },
  fish:     { D: FishDoodle,       bg: 'indigo' },
  dumpling: { D: DumplingDoodle,   bg: '' },
  tofu:     { D: TofuDoodle,       bg: '' },
  oil:      { D: SoyBottleDoodle,  bg: 'mustard' },
  tea:      { D: TeaCupDoodle,     bg: '' },
  snack:    { D: SnackDoodle,      bg: 'pink' },
  drink:    { D: DrinkDoodle,      bg: 'indigo' },
  leaf:     { D: BokChoyDoodle,    bg: 'leaf' },
};

import React from 'react';

interface Props { kind: string; size?: number }

export default function CategoryDoodleTile({ kind, size = 88 }: Props) {
  const entry = DOODLE_MAP[kind] ?? { D: NoodleBowlDoodle, bg: '' };
  const { D, bg } = entry;
  return (
    <div className={`photo-tile ${bg}`} style={{ width: size, height: size, color: 'var(--bok-ink)' }}>
      <D size={Math.round(size * 0.62)} />
    </div>
  );
}
