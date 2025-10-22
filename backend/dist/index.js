"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const env_1 = require("./utils/env");
const arbitrage_1 = __importDefault(require("./routes/arbitrage"));
const yield_1 = __importDefault(require("./routes/yield"));
const portfolio_1 = __importDefault(require("./routes/portfolio"));
const decision_1 = __importDefault(require("./routes/decision"));
const simulate_1 = __importDefault(require("./routes/simulate"));
const events_1 = __importDefault(require("./routes/events"));
const env = (0, env_1.getEnv)();
const server = (0, fastify_1.default)({ logger: true });
server.register(cors_1.default, {
    // keep your existing CORS config; ensure Fly/Vercel allowed
    origin: (origin, cb) => {
        const allowedExact = [
            'http://localhost:3000',
            'https://ruhmdefi-lbap.vercel.app',
            'https://ruhmdefi.onrender.com',
            'https://ruhmdefi-backend.fly.dev',
        ];
        const allowedSuffixes = ['.vercel.app', '.railway.app', '.netlify.app', '.fly.dev'];
        const normalized = origin ? origin.replace(/\/$/, '') : origin;
        const ok = !origin ||
            (normalized && allowedExact.includes(normalized)) ||
            (normalized && allowedSuffixes.some((suf) => normalized.endsWith(suf)));
        if (ok)
            cb(null, true);
        else {
            server.log.warn({ origin }, 'CORS blocked origin');
            cb(new Error('Not allowed'), false);
        }
    },
});
server.get("/health", async () => ({ ok: true }));
server.register(events_1.default, { prefix: "/" });
server.register(arbitrage_1.default, { prefix: "/" });
server.register(yield_1.default, { prefix: "/" });
server.register(portfolio_1.default, { prefix: "/" });
server.register(decision_1.default, { prefix: "/" });
server.register(simulate_1.default, { prefix: "/" });
(async () => {
    try {
        const port = Number(process.env.PORT) || 8080;
        await server.listen({ port, host: "0.0.0.0" });
        server.log.info(`API listening on :${port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();
