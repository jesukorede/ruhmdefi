import { FastifyInstance } from 'fastify';
import { getTopPools, getJupiterPrices } from '../services/defiData';
import { buildStrategyFromData } from '../services/agentverse';
import { prisma } from '../services/postgres';

export default async function arbitrageRoutes(server: FastifyInstance) {
  server.get('/arbitrage', async () => {
    const [pools, prices] = await Promise.all([getTopPools(15), getJupiterPrices(['SOL', 'USDC', 'BONK'])]);

    const suggestions = await buildStrategyFromData({ pools, prices });

    await prisma.aISuggestion.createMany({
      data: suggestions.map((s) => ({
        trade_id: s.trade_id,
        token_pair: s.token_pair,
        strategy_summary: s.strategy_summary,
        confidence_score: s.confidence_score,
        expected_apy: s.expected_apy ?? 0,
        routes: s.routes ? JSON.stringify(s.routes) : '[]'
      }))
    });

    return { suggestions };
  });
}