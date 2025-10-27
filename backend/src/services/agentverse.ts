import { ChatOpenAI } from '@langchain/openai';

type Inputs = {
  pools: Array<{ pool: string; apy: number; symbol: string }>;
  prices: Record<string, any>;
  dex?: string;
};

type Suggestion = {
  trade_id: string;
  token_pair: string;
  strategy_summary: string;
  confidence_score: number;
  expected_apy?: number;
  timestamp: number;
  routes?: any[];
};

export async function buildStrategyFromData(inputs: Inputs): Promise<Suggestion[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const modelName = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
  const now = Date.now();

  if (!apiKey) {
    // Fallback stub for local dev without AI key
    return inputs.pools.slice(0, 5).map((p, i) => ({
      trade_id: `dev-${now}-${i}`,
      token_pair: `${p.symbol}/SOL`,
      strategy_summary: `Stake in pool ${p.pool} with APY ${p.apy.toFixed(2)}%.`,
      confidence_score: Math.min(95, Math.max(50, Math.round(p.apy))),
      expected_apy: p.apy,
      timestamp: now,
    }));
  }

  const llm = new ChatOpenAI({
    apiKey,
    modelName,
    temperature: 0.2,
    maxTokens: 512,
    configuration: { baseURL: 'https://openrouter.ai/api/v1' },
  });

  const prompt = `You are a Solana DeFi strategist.
Given pool APYs and prices, propose 3 yield/arbitrage suggestions in JSON:
[{ "trade_id": "string", "token_pair": "string", "strategy_summary": "string", "confidence_score": 0-100, "expected_apy": float }]
Pools: ${JSON.stringify(inputs.pools.slice(0, 10))}
Prices: ${JSON.stringify(inputs.prices)}
Prefer routes and opportunities on DEX: ${inputs.dex || 'any'} when applicable.`;

  const res = await llm.invoke([{ role: 'user', content: prompt }]);
  try {
    const parsed = JSON.parse((res.content as any) || '[]');
    const ts = Date.now();
    return parsed.map((s: any, idx: number) => ({
      trade_id: s.trade_id || `ai-${ts}-${idx}`,
      token_pair: s.token_pair || 'SOL/USDC',
      strategy_summary: s.strategy_summary || 'N/A',
      confidence_score: Number(s.confidence_score ?? 50),
      expected_apy: Number(s.expected_apy ?? 0),
      timestamp: ts,
      routes: s.routes ?? [],
    }));
  } catch {
    const ts = Date.now();
    return inputs.pools.slice(0, 3).map((p, i) => ({
      trade_id: `fallback-${ts}-${i}`,
      token_pair: `${p.symbol}/SOL`,
      strategy_summary: `Stake in pool ${p.pool} with APY ${p.apy.toFixed(2)}%.`,
      confidence_score: Math.min(90, Math.round(p.apy)),
      expected_apy: p.apy,
      timestamp: ts,
    }));
  }
}