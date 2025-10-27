import { FastifyInstance, FastifyRequest } from 'fastify';
import { getTopPools, getJupiterPrices } from '../services/defiData';
import { buildStrategyFromData } from '../services/agentverse';
import { broadcast } from '../services/events';

export default async function arbitrageRoutes(server: any) {
    server.get('/arbitrage', async (req: any, reply: any) => {
        try {
            const dex = (req?.query?.dex as string) || 'jupiter';
            const [pools, prices] = await Promise.all([
                getTopPools(15),
                getJupiterPrices(['SOL', 'USDC', 'BONK']),
            ]);
            const suggestions = await buildStrategyFromData({ pools, prices });
            broadcast('arbitrage', { suggestions, dex });
            return { suggestions, dex };
        } catch (err) {
            server.log.error({ err }, 'arbitrage scan failed');
            reply.code(500);
            return { error: 'Arbitrage scan failed' };
        }
    });
}