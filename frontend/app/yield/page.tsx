import { API_BASE } from '../../lib/api';

export default async function YieldPage() {
  const res = await fetch(`${API_BASE}/yield`, { cache: 'no-store' });
  const data = await res.json();
  const suggestions = data?.suggestions || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Yield Opportunities</h2>
        <span className="text-xs text-gray-500">{new Date(data?.timestamp || Date.now()).toLocaleString()}</span>
      </div>
      <ul className="space-y-2">
        {suggestions.map((s: any) => (
          <li key={s.trade_id} className="p-4 bg-white rounded shadow">
            <div className="font-medium">{s.token_pair}</div>
            <div className="text-sm text-gray-700">{s.strategy_summary}</div>
            <div className="text-xs text-gray-500 mt-1">Expected APY: {Number(s.expected_apy).toFixed(2)}%</div>
          </li>
        ))}
      </ul>
    </div>
  );
}