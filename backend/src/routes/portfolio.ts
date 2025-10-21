import { FastifyInstance } from 'fastify';
import { getTopPools } from '../services/defiData';
import { broadcast } from '../services/events';

export default async function portfolioRoutes(server: FastifyInstance) {
  server.get('/portfolio', async () => {
    const pools = await getTopPools(5);
    const totalApy = pools.reduce((sum, p) => sum + Math.max(0, p.apy), 0) || 1;
    const allocation = pools.map((p) => ({
      pool: p.pool,
      project: p.project,
      token_pair: p.symbol || 'SOL/USDC',
      apy: p.apy,
      weight: (Math.max(0, p.apy) / totalApy),
    }));
    const summary = 'Recommended allocation weights proportional to APY across top pools.';
    const payload = { allocation, summary, timestamp: Date.now() };
    broadcast('portfolio', payload);
    return payload;
  });
}