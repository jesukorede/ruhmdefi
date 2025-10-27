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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <div>{connected ? "Live" : "Offline"}</div>
        <div suppressHydrationWarning>{new Date(Number(data.timestamp || Date.now())).toISOString()}</div>
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
