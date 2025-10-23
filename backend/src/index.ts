import Fastify from "fastify";
import cors from '@fastify/cors';
import { getEnv } from './utils/env';
import arbitrageRoutes from './routes/arbitrage';
import yieldRoutes from './routes/yield';
import portfolioRoutes from './routes/portfolio';
import decisionRoutes from './routes/decision';
import simulateRoutes from './routes/simulate';
import eventsRoutes from './routes/events';

const env = getEnv();
const server = Fastify({ logger: true });

server.register(cors, {
  // keep your existing CORS config; ensure Fly/Vercel allowed
  origin: (origin, cb) => {
    const allowedExact = [
      'http://localhost:3000',
      'https://ruhmdefi-lbap.vercel.app',
      'https://ruhmdefi.onrender.com',
    ];
    const allowedSuffixes = ['.vercel.app', '.railway.app', '.netlify.app', '.fly.dev', '.onrender.com'];
    const normalized = origin ? origin.replace(/\/$/, '') : origin;
    const ok =
      !origin ||
      (normalized && allowedExact.includes(normalized)) ||
      (normalized && allowedSuffixes.some((suf) => normalized.endsWith(suf)));
    if (ok) cb(null, true);
    else {
      server.log.warn({ origin }, 'CORS blocked origin');
      cb(new Error('Not allowed'), false);
    }
  },
});

server.get("/health", async () => ({ ok: true }));
server.get("/", async () => ({ ok: true, service: "ruhmdefi-backend" }));

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