import { FastifyInstance } from 'fastify';
import { getTopPools } from '../services/defiData';
import { broadcast } from '../services/events';

export default async function yieldRoutes(server: FastifyInstance) {
  server.get('/yield', async () => {
    const pools = await getTopPools(10);
    const ts = Date.now();
    const suggestions = pools.map((p, i) => ({
      trade_id: `yield-${ts}-${i}`,
      token_pair: p.symbol || 'SOL/USDC',
      strategy_summary: `Yield opportunity: ${p.project} ${p.pool} with APY ${p.apy.toFixed(2)}%.`,
      confidence_score: Math.min(95, Math.max(50, Math.round(p.apy))),
      expected_apy: p.apy,
      timestamp: ts,
    }));
    broadcast('yield', { suggestions, timestamp: ts });
    return { suggestions };
  });
}