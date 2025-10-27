import { API_BASE, IS_MOCK, mockSuggestions } from '../../lib/api';
import YieldStream from '../../components/YieldStream';

export default async function YieldPage() {
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
        <h2 className="text-xl font-semibold">Yield Opportunities</h2>
        <span className="text-xs text-gray-500" suppressHydrationWarning>
          {new Date(ts).toISOString()}
        </span>
      </div>
      {suggestions.length === 0 ? (
        <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
          No yield opportunities yet. Trigger a scan from Dashboard or wait for realtime updates.
        </div>
      ) : null}
      {/* Realtime stream (hydrates on client) */}
      <YieldStream initial={suggestions} />
    </div>
  );
}