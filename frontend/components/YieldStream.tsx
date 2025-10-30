"use client";

import { useEffect, useState } from "react";
import { openEvents, type Suggestion } from "../lib/api";

type Props = {
  initial: Suggestion[];
};

export default function YieldStream({ initial }: Props) {
  const [items, setItems] = useState<Suggestion[]>(initial || []);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sub = openEvents({
      onOpen: () => setConnected(true),
      onError: () => setConnected(false),
      onYield: (data) => setItems(data?.suggestions || []),
    });
    return () => {
      try {
        sub.close();
      } catch {}
    };
  }, []);

  if (!items?.length && !connected) {
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
  if (!items?.length) {
    return (
      <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
        No yield opportunities yet. Trigger a scan from the dashboard or wait for realtime updates.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-[var(--muted)] flex items-center gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((s) => (
          <div key={s.trade_id} className="p-4 rounded border border-[var(--border)] bg-[var(--surface)]">
            <div className="font-semibold truncate" title={s.token_pair}>{s.token_pair}</div>
            <div className="text-sm text-[var(--foreground)]/80 mt-1">{s.strategy_summary}</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-green-600/20 text-green-300 border border-green-600/40">APY {Number(s.expected_apy ?? 0).toFixed(2)}%</span>
              <span className="px-2 py-0.5 rounded bg-[#2a2a2a] text-gray-300 border border-[#3a3a3a]">Conf {Math.round((Number(s.confidence_score ?? 0))*100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
