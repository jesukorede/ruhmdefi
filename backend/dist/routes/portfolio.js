"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = portfolioRoutes;
const defiData_1 = require("../services/defiData");
const events_1 = require("../services/events");
async function portfolioRoutes(server) {
    server.get('/portfolio', async () => {
        const pools = await (0, defiData_1.getTopPools)(5);
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
        (0, events_1.broadcast)('portfolio', payload);
        return payload;
    });
}
