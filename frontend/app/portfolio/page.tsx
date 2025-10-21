import { API_BASE } from '../../lib/api';

export default async function PortfolioPage() {
  const res = await fetch(`${API_BASE}/portfolio`, { cache: 'no-store' });
  const data = await res.json();
  const allocation = data?.allocation || [];
  const summary = data?.summary || 'Portfolio recommendations are unavailable.';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Portfolio Optimization</h2>
        <span className="text-xs text-gray-500">{new Date(data?.timestamp || Date.now()).toLocaleString()}</span>
      </div>
      <p className="text-gray-700">{summary}</p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[var(--surface)] text-[var(--foreground)] rounded border border-[var(--border)] shadow-sm">
            <thead>
                <tr className="text-left border-b border-[var(--border)]">
                    <th className="px-4 py-2">Pool</th>
                    <th className="px-4 py-2">Project</th>
                    <th className="px-4 py-2">Pair</th>
                    <th className="px-4 py-2">APY</th>
                    <th className="px-4 py-2">Weight</th>
                </tr>
            </thead>
            {/* rows render as usual */}
        </table>
      </div>
    </div>
  );
}