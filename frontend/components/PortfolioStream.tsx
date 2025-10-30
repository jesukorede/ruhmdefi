"use client";

import { useEffect, useState } from "react";
import { openEvents } from "../lib/api";

type Allocation = { asset?: string; token_pair?: string; pool?: string; project?: string; apy?: number; weight?: number };

type Props = {
  initial: { allocation: Allocation[]; summary: string; timestamp: number } | null;
};

export default function PortfolioStream({ initial }: Props) {
  const [data, setData] = useState<{ allocation: Allocation[]; summary: string; timestamp: number } | null>(initial);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sub = openEvents({
      onOpen: () => setConnected(true),
      onError: () => setConnected(false),
      onPortfolio: (payload) => setData(payload as any),
    });
    return () => { try { sub.close(); } catch {} };
  }, []);

  if ((!data || !data.allocation?.length) && !connected) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] animate-pulse">
            <div className="h-4 w-1/3 bg-[var(--surface-2)] rounded"></div>
            <div className="h-3 w-5/6 bg-[var(--surface-2)] rounded mt-3"></div>
            <div className="h-3 w-4/6 bg-[var(--surface-2)] rounded mt-2"></div>
            <div className="flex gap-2 mt-3">
              <div className="h-5 w-20 bg-[var(--surface-2)] rounded"></div>
              <div className="h-5 w-24 bg-[var(--surface-2)] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (!data || !data.allocation?.length) {
    return (
      <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
        No portfolio recommendations yet. Trigger a scan or wait for realtime updates.
      </div>
    );
  }

  const alloc = data.allocation;
  const fmtPct = (x?: number) => `${Math.round((Number(x ?? 0)) * 100)}%`;
  const fmtApy = (x?: number) => `${Number(x ?? 0).toFixed(2)}%`;

  const exportCsv = () => {
    try {
      const rows = [
        ['pool', 'project', 'token_pair', 'asset', 'weight_pct', 'apy_pct'],
        ...alloc.map((a) => [
          a.pool || '',
          a.project || '',
          a.token_pair || '',
          a.asset || '',
          Math.round((Number(a.weight ?? 0)) * 100),
          Number(a.apy ?? 0).toFixed(2),
        ]),
      ];
      const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-allocation-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2">
          {connected ? (
            <span className="inline-flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex rounded-full h-2 w-2 bg-red-400"></span>
              Offline
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCsv} className="text-xs px-2 py-1 rounded border border-[var(--border)] bg-[var(--surface)] hover:bg-[#1f1f1f]">Export CSV</button>
          <span suppressHydrationWarning>{new Date(Number(data.timestamp || Date.now())).toISOString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {alloc.map((a, idx) => (
          <div key={idx} className="p-4 rounded border border-[var(--border)] bg-[var(--surface)]">
            <div className="font-semibold truncate" title={a.pool || a.token_pair || a.asset || "Pool"}>
              {a.pool || a.token_pair || a.asset || "Pool"}
            </div>
            {a.project && <div className="text-xs text-[var(--muted)] mt-0.5">{a.project}</div>}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 border border-blue-600/40">Weight {fmtPct(a.weight)}</span>
              <span className="px-2 py-0.5 rounded bg-green-600/20 text-green-300 border border-green-600/40">APY {fmtApy(a.apy)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
