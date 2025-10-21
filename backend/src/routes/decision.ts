import { FastifyInstance } from 'fastify';

function parsePair(token_pair: string) {
  const parts = token_pair.split(/[\/-]/);
  return { from: parts[0] || 'SOL', to: parts[1] || 'USDC' };
}

export default async function decisionRoutes(server: FastifyInstance) {
  server.post('/decision', async (request) => {
    const body: any = request.body || {};
    const trade_id = body.trade_id || `unknown-${Date.now()}`;
    const token_pair = body.token_pair || 'SOL/USDC';
    const summary = body.strategy_summary || 'No summary provided';
    const expected_apy = Number(body.expected_apy ?? 0);
    const confidence = Number(body.confidence_score ?? 0);

    const { from, to } = parsePair(token_pair);
    const ts = Date.now();

    const plan = {
      plan_id: `plan-${ts}-${trade_id}`,
      trade_id,
      status: 'proposed',
      token_pair,
      steps: [
        { type: 'swap', via: 'jupiter', from, to, amount: 'auto', slippage_bps: 50 },
        { type: 'stake', protocol: 'raydium', pool_hint: 'auto-select-top-apy', amount: 'auto' },
      ],
      risk: { slippage_pct: 0.5, volatility: 'medium', liquidity: 'adequate' },
      estimate: { net_apy: expected_apy, fees_pct: 0.02, confidence },
      notes: summary,
      timestamp: ts,
    };

    return { plan };
  });
}