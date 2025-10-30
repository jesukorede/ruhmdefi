'use client';
import { useState } from 'react';
import { DexSelector } from '../../components/DexSelector';
import { apiSimulate, apiDecision } from '../../lib/api';

export default function TraderPage() {
  type Dex = 'jupiter' | 'raydium' | 'orca' | 'openbook' | 'phoenix';
  const [dex, setDex] = useState<Dex>('jupiter');

  const simulate = async (payload: any) => {
    const data = await apiSimulate({ ...payload, dex });
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