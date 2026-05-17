'use client';

import dynamic from 'next/dynamic';

const StoreMap = dynamic(() => import('@/components/StoreMap'), { ssr: false });

export default function MapPage() {
  return (
    <div style={{ height: 'calc(852px - 96px)', width: '100%' }}>
      <StoreMap />
    </div>
  );
}
