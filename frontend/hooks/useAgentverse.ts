'use client';

import { useCallback, useEffect, useState } from 'react';
import { API_BASE } from '../lib/api';

type Suggestion = {
  trade_id: string;
  token_pair: string;
  strategy_summary: string;
  confidence_score: number;
  expected_apy?: number;
  timestamp: number;
};

export function useAgentverse() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const es = new EventSource(`${API_BASE}/events`);
    const onArbitrage = (evt: MessageEvent) => {
      try {
        const data = JSON.parse(evt.data);
        setSuggestions(data?.suggestions || []);
      } catch {}
    };
    es.addEventListener('arbitrage', onArbitrage);
    es.onopen = () => setError(null);
    es.onerror = () => setError('Realtime connection interrupted');
    return () => {
      es.removeEventListener('arbitrage', onArbitrage as any);
      es.close();
    };
  }, []);

  const runScan = useCallback(
    async (type: 'arbitrage' | 'portfolio' | 'yield' = 'arbitrage') => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/${type}`, { cache: 'no-store' });
        const data = await res.json();
        setSuggestions(data?.suggestions || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to scan');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, suggestions, error, runScan };
}