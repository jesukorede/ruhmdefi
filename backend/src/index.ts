import Fastify from "fastify";
import cors from '@fastify/cors';
import { getEnv } from './utils/env';
import arbitrageRoutes from './routes/arbitrage';
import yieldRoutes from './routes/yield';
import portfolioRoutes from './routes/portfolio';
import decisionRoutes from './routes/decision';
import simulateRoutes from './routes/simulate';
import eventsRoutes from './routes/events';
import { getStatus } from './services/events';

const env = getEnv();
const server = Fastify({ logger: true });

server.register(cors, {
  origin: (origin, cb) => {
    const allowedExact = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://ruhmdefi-lbap.vercel.app',
      'https://ruhmdefi.onrender.com',
      'https://ruhmdefi-backend.fly.dev',
    ];
    const allowedSuffixes = ['.vercel.app', '.railway.app', '.netlify.app', '.fly.dev', '.onrender.com'];
    const normalized = origin ? origin.replace(/\/$/, '') : origin;
    const localhostOk = normalized ? /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized) : false;
    const ok =
      !origin ||
      (normalized && allowedExact.includes(normalized)) ||
      (normalized && allowedSuffixes.some((suf) => normalized.endsWith(suf))) ||
      localhostOk;

    if (ok) cb(null, true);
    else {
      server.log.warn({ origin }, 'CORS blocked origin');
      cb(new Error('Not allowed'), false);
    }
  },
});

server.get("/health", async () => ({ ok: true }));
server.get("/", async () => ({ ok: true, service: "ruhmdefi-backend" }));
server.get('/status', async () => getStatus());

server.register(eventsRoutes, { prefix: "/" });
server.register(arbitrageRoutes, { prefix: "/" });
server.register(yieldRoutes, { prefix: "/" });
server.register(portfolioRoutes, { prefix: "/" });
server.register(decisionRoutes, { prefix: "/" });
server.register(simulateRoutes, { prefix: "/" });

(async () => {
  try {
    const port = env.PORT;
    await server.listen({ port, host: "0.0.0.0" });
    server.log.info(`API listening on :${port}`);
  } catch (err) {
    server.log.error(err as Error);
    process.exit(1);
  }
})();