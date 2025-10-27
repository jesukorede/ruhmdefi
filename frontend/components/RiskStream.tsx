"use client";

import { useEffect, useMemo, useState } from "react";
import { openEvents, type Suggestion } from "../lib/api";

type Props = {
  initial: Suggestion[];
};

export default function RiskStream({ initial }: Props) {
  const [items, setItems] = useState<Suggestion[]>(initial || []);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sub = openEvents({
      onOpen: () => setConnected(true),
      onError: () => setConnected(false),
      onYield: (data) => setItems(data?.suggestions || []),
    });
    return () => { try { sub.close(); } catch {} };
  }, []);

  const scored = useMemo(() => {
    const score = (apy: number, conf: number) => {
      const base = Math.min(100, Math.max(0, apy));
      const adj = 100 - Math.min(100, Math.max(0, conf));
      return Math.min(100, Math.round(base * 0.6 + adj * 0.4));
    };
    return (items || []).map((s) => ({
      ...s,
      riskScore: score(Number(s.expected_apy ?? 0), Number(s.confidence_score ?? 0) * 100),
    }));
  }, [items]);

  if (!scored?.length) {
    return (
      <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
        No risk analytics available yet. Trigger a scan or wait for realtime updates.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <div>{connected ? "Live" : "Offline"}</div>
        <div>Total: {scored.length}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {scored.map((s) => (
          <div key={s.trade_id} className="p-4 rounded border border-[var(--border)] bg-[var(--surface)]">
            <div className="font-semibold truncate" title={s.token_pair}>{s.token_pair}</div>
            <div className="text-sm text-[var(--foreground)]/80 mt-1">{s.strategy_summary}</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-green-600/20 text-green-300 border border-green-600/40">APY {Number(s.expected_apy ?? 0).toFixed(2)}%</span>
              <span className="px-2 py-0.5 rounded bg-[#2a2a2a] text-gray-300 border border-[#3a3a3a]">Conf {Math.round((Number(s.confidence_score ?? 0))*100)}%</span>
              <span className={`px-2 py-0.5 rounded border ${s.riskScore < 33 ? 'bg-green-600/20 text-green-300 border-green-600/40' : s.riskScore < 66 ? 'bg-yellow-600/20 text-yellow-300 border-yellow-600/40' : 'bg-red-600/20 text-red-300 border-red-600/40'}`}>Risk {s.riskScore}/100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
