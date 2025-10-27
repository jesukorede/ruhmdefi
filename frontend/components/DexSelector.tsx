'use client';
import React from 'react';

type DexOption = 'jupiter' | 'raydium' | 'orca' | 'openbook' | 'phoenix';

export function DexSelector({
  value,
  onChange,
  compact = false,
}: {
  value: DexOption;
  onChange: (v: DexOption) => void;
  compact?: boolean;
}) {
  const options = [
    { label: 'Jupiter (Aggregator)', value: 'jupiter' },
    { label: 'Raydium', value: 'raydium' },
    { label: 'Orca', value: 'orca' },
    { label: 'OpenBook', value: 'openbook' },
    { label: 'Phoenix', value: 'phoenix' },
  ] as const;

  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'p-2 rounded border border-[var(--border)] bg-[var(--surface)]'}`}>
      <label className="text-sm opacity-80">DEX</label>
      <select
        aria-label="Select DEX"
        value={value}
        onChange={(e) => onChange(e.target.value as DexOption)}
        className="bg-transparent border border-[var(--border)] rounded px-2 py-1 text-sm text-[var(--foreground)]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}