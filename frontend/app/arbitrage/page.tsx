'use client';

import { useAgentverse } from '../../hooks/useAgentverse';

export default function ArbitragePage() {
  const { loading, error, suggestions, runScan } = useAgentverse();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Arbitrage</h2>
        <button
          onClick={() => runScan('arbitrage')}
          className="rounded bg-black text-white px-4 py-2 hover:bg-gray-800"
        >
          Scan Arbitrage
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {loading && <div className="text-gray-600">Scanning...</div>}
      <ul className="space-y-2">
        {suggestions.map((s) => (
          <li key={s.trade_id} className="p-4 bg-white rounded shadow">
            <div className="font-medium">{s.token_pair}</div>
            <div className="text-sm text-gray-700">{s.strategy_summary}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}