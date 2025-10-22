'use client';

import { useAgentverse } from '../../hooks/useAgentverse';
import Card from '../../components/Card';

function DashboardPage() {
  const { loading, error, suggestions, runScan } = useAgentverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">RuhmDeFi Dashboard</h1>
        <button
          onClick={() => runScan('arbitrage')}
          className="rounded bg-black text-white px-4 py-2 hover:bg-gray-800"
        >
          Run AI Scan
        </button>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {loading && <div className="text-gray-600">Scanning markets...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {suggestions.map((sug) => (
          <Card key={sug.trade_id} title={`${sug.token_pair} • ${Math.round(sug.confidence_score)}%`}>
            <p className="text-sm text-gray-700">{sug.strategy_summary}</p>
            <p className="text-xs text-gray-500 mt-2">Expected APY: {sug.expected_apy?.toFixed(2)}%</p>
            <p className="text-xs text-gray-500">Timestamp: {new Date(sug.timestamp).toLocaleString()}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
export default DashboardPage