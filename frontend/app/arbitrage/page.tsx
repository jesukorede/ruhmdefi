'use client';

import { useAgentverse } from '../../hooks/useAgentverse';
import { useState, useEffect } from 'react';
import { apiDecision, apiSimulate } from '../../lib/api';
import Toast, { ToastMsg } from '../../components/Toast';
import JsonModal from '../../components/JsonModal';
 

export default function ArbitragePage() {
  const { loading, error, suggestions, runScan, connected } = useAgentverse();
  const [plans, setPlans] = useState<Record<string, any>>({});
  const [simResults, setSimResults] = useState<Record<string, any>>({});
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [slippages, setSlippages] = useState<Record<string, number>>({});
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [jsonOpen, setJsonOpen] = useState<{ id: string; data: any } | null>(null);
  const [wasLoading, setWasLoading] = useState(false);
  // Add filters and helpers
  const [minApy, setMinApy] = useState<string>('0');
  const [minConf, setMinConf] = useState<string>('0');
  const [maxRisk, setMaxRisk] = useState<string>('100');
  const [sortBy, setSortBy] = useState<'apy' | 'confidence' | 'risk'>('apy');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [dex, setDex] = useState<string>('Raydium');

 

 
  const computeApy = (s: any) => Number((s?.expected_apy ?? plans[s.trade_id]?.estimate?.net_apy ?? 0));
  const computeRiskScore = (s: any) => {
    const apy = computeApy(s);
    const conf = Number(s?.confidence_score ?? 0);
    const score = Math.max(0, Math.min(100, 100 - conf * 100 + apy * 0.3));
    return score;
  };
  const riskLevel = (score: number) => (score < 33 ? 'low' : score < 66 ? 'medium' : 'high');
  const riskBadgeClass = (score: number) => {
    const lvl = riskLevel(score);
    return lvl === 'low'
      ? 'bg-green-600/20 text-green-300 border border-green-600/40'
      : lvl === 'medium'
      ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/40'
      : 'bg-red-600/20 text-red-300 border border-red-600/40';
  };
  const apyBadgeClass = (apy: number) =>
    apy >= 20
      ? 'bg-green-600/20 text-green-300 border border-green-600/40'
      : apy >= 10
      ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/40'
      : 'bg-gray-700 text-gray-300 border border-gray-600';

  const pushToast = (msg: Omit<ToastMsg, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const t = { id, ...msg } as ToastMsg;
    setToasts((prev) => [...prev, t]);
    setTimeout(() => dismissToast(id), 3500);
  };
  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const approve = async (s: any) => {
    try {
      const data = await apiDecision(s);
      setPlans((prev) => ({ ...prev, [s.trade_id]: data.plan }));
      pushToast({ type: 'success', text: 'Plan proposed' });
    } catch (e: any) {
      console.error(e);
      pushToast({ type: 'error', text: e?.message || 'Approve failed' });
    }
  };

  const simulate = async (s: any) => {
    try {
      const amt = amounts[s.trade_id] ?? 100;
      const slip = slippages[s.trade_id] ?? 50;
      const payload = plans[s.trade_id]
        ? { plan: plans[s.trade_id], amount: amt, slippage_bps: slip }
        : { ...s, amount: amt, slippage_bps: slip };
      const data = await apiSimulate(payload);
      setSimResults((prev) => ({ ...prev, [s.trade_id]: data.simulation }));
      pushToast({ type: 'success', text: 'Simulation complete' });
    } catch (e: any) {
      console.error(e);
      pushToast({ type: 'error', text: e?.message || 'Simulate failed' });
    }
  };

  const exportPlan = (s: any) => {
    try {
      const content = plans[s.trade_id] || s;
      const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${plans[s.trade_id] ? 'plan' : 'suggestion'}-${s.trade_id}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      pushToast({ type: 'info', text: 'Exported JSON' });
    } catch (e: any) {
      console.error(e);
      pushToast({ type: 'error', text: e?.message || 'Export failed' });
    }
  };

  useEffect(() => {
    if (error) {
      try {
        const msg = typeof error === 'string' ? error : String(error);
        pushToast({ type: 'error', text: msg });
      } catch (e) {
        pushToast({ type: 'error', text: 'Scan error' });
      }
    }
  }, [error]);
  useEffect(() => {
    if (loading) {
      setWasLoading(true);
    } else if (wasLoading) {
      setWasLoading(false);
      if (!error) {
        pushToast({ type: 'success', text: 'Scan complete' });
      }
    }
  }, [loading]);
  useEffect(() => {
    try {
      if (suggestions?.length) {
        setAmounts((prev) => {
          const next = { ...prev };
          suggestions.forEach((s: any) => {
            const key = `arb_amt_${s.trade_id}`;
            const val = localStorage.getItem(key);
            if (val !== null && next[s.trade_id] === undefined) next[s.trade_id] = Number(val);
          });
          return next;
        });
        setSlippages((prev) => {
          const next = { ...prev };
          suggestions.forEach((s: any) => {
            const key = `arb_slip_${s.trade_id}`;
            const val = localStorage.getItem(key);
            if (val !== null && next[s.trade_id] === undefined) next[s.trade_id] = Number(val);
          });
          return next;
        });
      }
    } catch {}
  }, [suggestions]);

  useEffect(() => {
    try {
      const a = localStorage.getItem('arb_filter_min_apy');
      const c = localStorage.getItem('arb_filter_min_conf');
      const r = localStorage.getItem('arb_filter_max_risk');
      if (a !== null) setMinApy(a);
      if (c !== null) setMinConf(c);
      if (r !== null) setMaxRisk(r);
      const sb = localStorage.getItem('arb_sort_by');
      const sd = localStorage.getItem('arb_sort_dir');
      if (sb === 'apy' || sb === 'confidence' || sb === 'risk') setSortBy(sb as any);
      if (sd === 'asc' || sd === 'desc') setSortDir(sd as any);
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem('arb_filter_min_apy', String(minApy)); } catch {} }, [minApy]);
  useEffect(() => { try { localStorage.setItem('arb_filter_min_conf', String(minConf)); } catch {} }, [minConf]);
  useEffect(() => { try { localStorage.setItem('arb_filter_max_risk', String(maxRisk)); } catch {} }, [maxRisk]);

  // Parse strings to numbers safely for filtering
  const toNum = (v: string, fallback: number) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const filteredSuggestions = suggestions.filter((s: any) => {
    const apy = computeApy(s);
    const confPct = Number(s?.confidence_score ?? 0) * 100;
    const risk = computeRiskScore(s);
    return apy >= toNum(minApy, 0) && confPct >= toNum(minConf, 0) && risk <= toNum(maxRisk, 100);
  });
  const sortedSuggestions = [...filteredSuggestions].sort((a: any, b: any) => {
    const getVal = (s: any) =>
      sortBy === 'apy'
        ? computeApy(s)
        : sortBy === 'confidence'
        ? Number(s?.confidence_score ?? 0) * 100
        : computeRiskScore(s);
    const va = getVal(a);
    const vb = getVal(b);
    const diff = va - vb;
    if (isNaN(diff)) return 0;
    return sortDir === 'asc' ? diff : -diff;
  });

  const renderSuggestion = (s: any) => {
    const apy = computeApy(s);
    const confPct = Number(s?.confidence_score ?? 0) * 100;
    const risk = computeRiskScore(s);
    return (
      <li key={s.trade_id} className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{s.token_pair}</div>
            <div className="text-sm text-gray-300">{s.strategy_summary}</div>
            <div className="flex items-center gap-2 mt-1">
              <span title={`Expected APY: ${apy.toFixed(2)}%`} className={`text-xs px-2 py-0.5 rounded ${apyBadgeClass(apy)}`}>APY {apy.toFixed(2)}%</span>
              <span title={`Risk: ${riskLevel(risk)} (score ${risk.toFixed(0)}/100). Derived from confidence and APY.`} className={`text-xs px-2 py-0.5 rounded ${riskBadgeClass(risk)}`}>Risk {riskLevel(risk)}</span>
              <span title={`Confidence: ${confPct.toFixed(0)}%`} className="text-xs px-2 py-0.5 rounded bg-[#2a2a2a] text-gray-300 border border-[#3a3a3a]">Conf {confPct.toFixed(0)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => approve(s)}
              className="rounded bg-[#119611] text-white px-3 py-1 hover:brightness-110"
            >
              Approve
            </button>
            <input
              type="number"
              min={1}
              value={amounts[s.trade_id] ?? 100}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAmounts((prev) => ({ ...prev, [s.trade_id]: val }));
                try { localStorage.setItem(`arb_amt_${s.trade_id}`, String(val)); } catch {}
              }}
              className="w-24 border border-[var(--border)] bg-[var(--surface)] rounded px-2 py-1 text-sm text-[var(--foreground)] placeholder-gray-500 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
              aria-label="Amount"
            />
            <input
              type="number"
              min={0}
              value={slippages[s.trade_id] ?? 50}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSlippages((prev) => ({ ...prev, [s.trade_id]: val }));
                try { localStorage.setItem(`arb_slip_${s.trade_id}`, String(val)); } catch {}
              }}
              className="w-20 border border-[var(--border)] bg-[var(--surface)] rounded px-2 py-1 text-sm text-[var(--foreground)] placeholder-gray-500 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
              aria-label="Slippage bps"
            />
            <button
              onClick={() => simulate(s)}
              className="rounded bg-[#262626] text-[var(--foreground)] px-3 py-1 hover:bg-[#2e2e2e] border border-[var(--border)]"
            >
              Simulate
            </button>
            <button
              onClick={() => exportPlan(s)}
              className="rounded border border-[var(--border)] px-3 py-1 text-sm hover:bg-[#1f1f1f]"
            >
              Export JSON
            </button>
            <button
              onClick={() => setJsonOpen({ id: s.trade_id, data: plans[s.trade_id] || s })}
              className="rounded border border-[var(--border)] px-3 py-1 text-sm hover:bg-[#1f1f1f]"
            >
              View JSON
            </button>
          </div>
        </div>
        {plans[s.trade_id] && (
          <div className="mt-3 text-xs text-gray-400">
            <div className="font-semibold">Plan: {plans[s.trade_id].status}</div>
            <div>Est. APY: {Number(plans[s.trade_id]?.estimate?.net_apy ?? 0).toFixed(2)}%</div>
            <div>Risk: slippage {Number(plans[s.trade_id]?.risk?.slippage_pct ?? 0)}%, {plans[s.trade_id]?.risk?.volatility}</div>
            <div className="mt-1">Steps:</div>
            <ul className="list-disc ml-5">
              {(plans[s.trade_id]?.steps || []).map((step: any, idx: number) => (
                <li key={idx}>{step.type} via {step.via || step.protocol} {step.from ? `${step.from}->${step.to}` : ''}</li>
              ))}
            </ul>
          </div>
        )}
        {simResults[s.trade_id] && (
          <div className="mt-3 text-xs text-gray-300">
            <div className="font-semibold">Simulation</div>
            <div>Net APY: {Number(simResults[s.trade_id]?.outputs?.net_apy ?? 0).toFixed(2)}%</div>
            <div>Daily Profit: ${Number(simResults[s.trade_id]?.outputs?.projected_day_profit ?? 0).toFixed(4)}</div>
            <div>30d Profit: ${Number(simResults[s.trade_id]?.outputs?.projected_30d_profit ?? 0).toFixed(2)}</div>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-[var(--muted)]">
        <label className="flex items-center gap-2">
          <span>DEX</span>
          <select
            className="border border-[var(--border)] bg-[var(--surface)] rounded px-2 py-1 text-[var(--foreground)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            value={dex}
            onChange={(e) => setDex(e.target.value)}
          >
            <option>Raydium</option>
            <option>Orca</option>
            <option>Jupiter</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span>Min APY (%)</span>
          <input
            type="number"
            className="w-20 border border-[var(--border)] bg-[var(--surface)] rounded px-2 py-1 text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            value={minApy}
            onChange={(e) => setMinApy(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Min Confidence (%)</span>
          <input
            type="number"
            className="w-24 border border-[var(--border)] bg-[var(--surface)] rounded px-2 py-1 text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            value={minConf}
            onChange={(e) => setMinConf(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Max Risk</span>
          <input
            type="number"
            className="w-20 border border-[var(--border)] bg-[var(--surface)] rounded px-2 py-1 text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            value={maxRisk}
            onChange={(e) => setMaxRisk(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Sort by</span>
          <select className="border border-[var(--border)] bg-[var(--surface)] rounded px-2 py-1 text-[var(--foreground)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="apy">APY</option>
            <option value="confidence">Confidence</option>
            <option value="risk">Risk</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span>Direction</span>
          <select className="border border-[var(--border)] bg-[var(--surface)] rounded px-2 py-1 text-[var(--foreground)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={sortDir} onChange={(e) => setSortDir(e.target.value as any)}>
            <option value="desc">High to Low</option>
            <option value="asc">Low to High</option>
          </select>
        </label>
        <button
          onClick={() => runScan('arbitrage', { dex })}
          className="ml-auto rounded bg-[#119611] text-white px-4 py-2 hover:brightness-110"
        >
          Scan Arbitrage
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {loading && <div className="text-gray-400">Scanning...</div>}
      <ul className="space-y-2">
        {sortedSuggestions.map(renderSuggestion)}
      </ul>
      {jsonOpen && (
        <JsonModal
          open={true}
          title={`JSON: ${jsonOpen!.id}`}
          data={jsonOpen!.data}
          onClose={() => setJsonOpen(null)}
          onCopy={() => pushToast({ type: 'info', text: 'Copied JSON' })}
        />
      )}
    </div>
  );
}