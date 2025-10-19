import Fastify from 'fastify';
import cors from '@fastify/cors';
import { getEnv } from './utils/env';
import arbitrageRoutes from './routes/arbitrage';

const env = getEnv();
const server = Fastify({ logger: true });

server.register(cors, { origin: true });

server.get('/health', async () => ({ ok: true }));

server.register(arbitrageRoutes, { prefix: '/' });

const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    server.log.info(`API listening on :${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();