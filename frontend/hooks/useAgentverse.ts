'use client';

import { useCallback, useEffect, useState } from 'react';
import { openEvents, apiArbitrage, type Suggestion } from '../lib/api';

export function useAgentverse() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sub = openEvents({
      onOpen: () => { setConnected(true); setError(null); },
      onError: () => { setConnected(false); /* do not surface SSE status as error */ },
      onArbitrage: (data) => setSuggestions(data?.suggestions || []),
    });
    return () => { try { sub.close(); } catch {} };
  }, []);

  const runScan = useCallback(
    async (type: 'arbitrage' | 'portfolio' | 'yield' = 'arbitrage', opts?: { dex?: string }) => {
      try {
        setLoading(true);
        setError(null);
        // For now we only mock arbitrage; portfolio/yield could be wired similarly
        const data = await apiArbitrage(opts?.dex);
        setSuggestions(data.suggestions || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to scan');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, suggestions, error, runScan, connected };
}