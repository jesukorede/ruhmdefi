import { FastifyInstance } from 'fastify';
import { getTopPools, getJupiterPrices } from '../services/defiData';
import { buildStrategyFromData } from '../services/agentverse';
import { broadcast } from '../services/events';

export default async function arbitrageRoutes(server: FastifyInstance) {
  server.get('/arbitrage', async () => {
    const [pools, prices] = await Promise.all([getTopPools(15), getJupiterPrices(['SOL', 'USDC', 'BONK'])]);

    const suggestions = await buildStrategyFromData({ pools, prices });

    broadcast('arbitrage', { suggestions });
    return { suggestions };
  });
}