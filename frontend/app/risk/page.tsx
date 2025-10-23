import { API_BASE, IS_MOCK, mockSuggestions } from '../../lib/api';

export default async function RiskPage() {
  let data: any = null;
  try {
    if (IS_MOCK) {
      data = { suggestions: mockSuggestions(), timestamp: Date.now() };
    } else {
      const res = await fetch(`${API_BASE}/yield`, { cache: 'no-store' });
      data = res.ok ? await res.json() : null;
    }
  } catch {}
  const suggestions = data?.suggestions || [];

  const score = (apy: number, conf: number) => {
    const base = Math.min(100, Math.max(0, apy));
    const adj = 100 - Math.min(100, Math.max(0, conf));
    return Math.min(100, Math.round(base * 0.6 + adj * 0.4));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Risk Analytics</h2>
      <p className="text-gray-600">Simple heuristic risk scores derived from yield suggestions.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suggestions.map((s: any) => (
          <div key={s.trade_id} className="p-4 bg-white rounded shadow">
            <div className="font-medium">{s.token_pair}</div>
            <div className="text-sm text-gray-700">{s.strategy_summary}</div>
            <div className="mt-2 text-sm text-gray-600">APY: {Number(s.expected_apy).toFixed(2)}% • Confidence: {Number(s.confidence_score).toFixed(0)}%</div>
            <div className="mt-1">
              <span className="text-xs font-semibold">Risk Score: </span>
              <span className="text-xs">{score(Number(s.expected_apy), Number(s.confidence_score))}/100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}