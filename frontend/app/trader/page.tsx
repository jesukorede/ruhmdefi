'use client';
import { useState } from 'react';
import { DexSelector } from '../../components/DexSelector';

export default function TraderPage() {
  type Dex = 'jupiter' | 'raydium' | 'orca' | 'openbook' | 'phoenix';
  const [dex, setDex] = useState<Dex>('jupiter');

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'https://ruhmdefi.onrender.com';

  const simulate = async (payload: any) => {
    const res = await fetch(`${apiBase}/simulate?dex=${dex}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    // handle response
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <DexSelector value={dex} onChange={setDex} compact />
        {/* wallet UI and approve/execute controls */}
      </div>
      {/* rest of trader UI */}
    </div>
  );
  // ... existing code ...
}