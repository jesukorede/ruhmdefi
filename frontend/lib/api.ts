export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
export const IS_MOCK = !API_BASE || API_BASE === 'mock';

export type Suggestion = {
  trade_id: string;
  token_pair: string;
  strategy_summary: string;
  confidence_score: number; // 0..1
  expected_apy?: number;
  timestamp: number;
};

type ArbitrageEvent = { suggestions: Suggestion[] };

// ---------- Mock data helpers ----------
export function mockSuggestions(n = 6): Suggestion[] {
  const pairs = ['SOL/USDC', 'BONK/SOL', 'JTO/SOL', 'WIF/USDC', 'PYTH/USDC', 'JUP/SOL'];
  const now = Date.now();
  return Array.from({ length: n }).map((_, i) => {
    const pair = pairs[i % pairs.length];
    const apy = Number((5 + Math.random() * 20).toFixed(2));
    const conf = Math.round(50 + Math.random() * 45); // 50..95
    return {
      trade_id: `mock-${now}-${i}`,
      token_pair: pair,
      strategy_summary: `Heuristic opportunity detected for ${pair}.`,
      confidence_score: conf / 100,
      expected_apy: apy,
      timestamp: now,
    } as Suggestion;
  });
}

export function mockPlan(input: Partial<Suggestion> = {}) {
  const ts = Date.now();
  const token_pair = input.token_pair || 'SOL/USDC';
  const [from, to] = (token_pair.split(/[\/-]/) as [string, string]);
  return {
    plan_id: `plan-${ts}-${input.trade_id || 'mock'}`,
    trade_id: input.trade_id || `mock-${ts}`,
    status: 'proposed',
    token_pair,
    steps: [
      { type: 'swap', via: 'jupiter', from: from || 'SOL', to: to || 'USDC', amount: 'auto', slippage_bps: 50 },
      { type: 'stake', protocol: 'raydium', pool_hint: 'auto-select-top-apy', amount: 'auto' },
    ],
    risk: { slippage_pct: 0.5, volatility: 'medium', liquidity: 'adequate' },
    estimate: { net_apy: Number(input.expected_apy ?? 8.5), fees_pct: 0.02, confidence: Math.round((input.confidence_score ?? 0.75) * 100) },
    notes: input.strategy_summary || 'Sample plan',
    timestamp: ts,
  };
}

export function mockSimulate(payload: any) {
  const amount = Number(payload?.amount ?? 100);
  const slippage_bps = Number(payload?.slippage_bps ?? 50); // 0.50%
  const expected_apy = Number(payload?.plan?.estimate?.net_apy ?? payload?.expected_apy ?? 10);
  const confidence = Number(payload?.plan?.estimate?.confidence ?? payload?.confidence_score ?? 70);
  const fees_pct = 0.02;
  const slippage_pct = (slippage_bps / 10000) * 100;
  let net_apy = expected_apy * (confidence / 100) - fees_pct - slippage_pct;
  net_apy = Math.max(0, net_apy);
  const projected_day_profit = amount * (net_apy / 100) / 365;
  const projected_30d_profit = amount * (net_apy / 100) * (30 / 365);
  return {
    inputs: { amount, slippage_bps, expected_apy, confidence },
    outputs: { net_apy, projected_day_profit, projected_30d_profit },
    assumptions: { fees_pct, slippage_pct },
    timestamp: Date.now(),
  };
}

// ---------- API wrappers with graceful fallback ----------
export async function apiArbitrage(dex?: string): Promise<ArbitrageEvent> {
  if (IS_MOCK) return { suggestions: mockSuggestions() };
  try {
    const qs = dex ? `?dex=${encodeURIComponent(dex)}` : '';
    const res = await fetch(`${API_BASE}/arbitrage${qs}`, { cache: 'no-store' });
    if (!res.ok) return { suggestions: mockSuggestions() };
    const data = await res.json();
    return { suggestions: data?.suggestions ?? [] };
  } catch {
    return { suggestions: mockSuggestions() };
  }
}

export async function apiDecision(body: Partial<Suggestion>): Promise<{ plan: any }> {
  if (IS_MOCK) return { plan: mockPlan(body) };
  try {
    const res = await fetch(`${API_BASE}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { plan: mockPlan(body) };
    return await res.json();
  } catch {
    return { plan: mockPlan(body) };
  }
}

export async function apiSimulate(payload: any): Promise<{ simulation: any }> {
  if (IS_MOCK) return { simulation: mockSimulate(payload) };
  try {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { simulation: mockSimulate(payload) };
    return await res.json();
  } catch {
    return { simulation: mockSimulate(payload) };
  }
}

export function openEvents(handlers: {
  onOpen?: () => void;
  onError?: (err?: any) => void;
  onArbitrage?: (data: ArbitrageEvent) => void;
  onYield?: (data: { suggestions: Suggestion[]; timestamp?: number }) => void;
  onPortfolio?: (data: { allocation: any[]; summary: string; timestamp: number }) => void;
}) {
  if (IS_MOCK || typeof window === 'undefined') {
    const id = setInterval(() => handlers.onArbitrage?.({ suggestions: mockSuggestions() }), 5000);
    // mock "open" right away
    setTimeout(() => handlers.onOpen?.(), 0);
    return { close: () => clearInterval(id) };
  }
  let es: EventSource | null = null;
  let closed = false;
  let retry = 0;

  const attach = () => {
    if (closed) return;
    try {
      es = new EventSource(`${API_BASE}/events`);
      const onArb = (evt: MessageEvent) => {
        try { handlers.onArbitrage?.(JSON.parse(evt.data)); } catch {}
      };
      const onYield = (evt: MessageEvent) => {
        try { handlers.onYield?.(JSON.parse(evt.data)); } catch {}
      };
      const onPortfolio = (evt: MessageEvent) => {
        try { handlers.onPortfolio?.(JSON.parse(evt.data)); } catch {}
      };
      const onPing = () => { try { handlers.onOpen?.(); } catch {} };
      es.addEventListener('arbitrage', onArb as any);
      es.addEventListener('yield', onYield as any);
      es.addEventListener('portfolio', onPortfolio as any);
      es.addEventListener('ping', onPing as any);
      es.onopen = () => { retry = 0; handlers.onOpen?.(); };
      es.onerror = (e) => {
        handlers.onError?.(e);
        try { es?.removeEventListener('arbitrage', onArb as any); } catch {}
        try { es?.removeEventListener('yield', onYield as any); } catch {}
        try { es?.removeEventListener('portfolio', onPortfolio as any); } catch {}
        try { es?.removeEventListener('ping', onPing as any); } catch {}
        try { es?.close(); } catch {}
        es = null;
        if (!closed) {
          const delay = Math.min(30000, 1000 * Math.pow(2, retry++));
          setTimeout(attach, delay);
        }
      };
    } catch (e) {
      handlers.onError?.(e);
      const delay = Math.min(30000, 1000 * Math.pow(2, ++retry));
      setTimeout(attach, delay);
    }
  };

  attach();
  return { close: () => { closed = true; try { es?.close(); } catch {} } };
}