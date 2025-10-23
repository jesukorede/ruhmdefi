import { API_BASE, IS_MOCK, mockSuggestions } from '../../lib/api';

export default async function PortfolioPage() {
  let data: any = null;
  try {
    if (IS_MOCK) {
      const sug = mockSuggestions(4);
      data = {
        allocation: sug.map((s) => ({ asset: s.token_pair.split(/[\/-]/)[0], pct: Math.round(10 + Math.random() * 40) })),
        summary: 'Mock portfolio allocation generated from heuristic suggestions.',
        timestamp: Date.now(),
      };
    } else {
      const res = await fetch(`${API_BASE}/portfolio`, { cache: 'no-store' });
      data = res.ok ? await res.json() : null;
    }
  } catch {}
  const allocation = data?.allocation || [];
  const summary = data?.summary || 'Portfolio recommendations are unavailable.';
  const ts = Number(data?.timestamp ?? Date.now());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Portfolio Optimization</h2>
        <span className="text-xs text-gray-500" suppressHydrationWarning>
          {new Date(ts).toISOString()}
        </span>
      </div>
      <p className="text-gray-700">{summary}</p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[var(--surface)] text-[var(--foreground)] rounded border border-[var(--border)] shadow-sm">
          {/* ... existing code ... */}
        </table>
      </div>
    </div>
  );
}