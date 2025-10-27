import { API_BASE, IS_MOCK, mockSuggestions } from '../../lib/api';
import RiskStream from '../../components/RiskStream';

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
  const ts = Number(data?.timestamp ?? Date.now());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Risk Analytics</h2>
        <span className="text-xs text-gray-500" suppressHydrationWarning>
          {new Date(ts).toISOString()}
        </span>
      </div>
      <p className="text-[var(--muted)]">Simple heuristic risk scores derived from yield suggestions.</p>
      {suggestions.length === 0 ? (
        <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
          No risk analytics yet. Trigger a scan from Dashboard or wait for realtime updates.
        </div>
      ) : null}
      {/* Realtime stream */}
      <RiskStream initial={suggestions} />
    </div>
  );
}