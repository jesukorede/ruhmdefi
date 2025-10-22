"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = arbitrageRoutes;
const defiData_1 = require("../services/defiData");
const agentverse_1 = require("../services/agentverse");
const events_1 = require("../services/events");
async function arbitrageRoutes(server) {
    server.get('/arbitrage', async () => {
        const [pools, prices] = await Promise.all([(0, defiData_1.getTopPools)(15), (0, defiData_1.getJupiterPrices)(['SOL', 'USDC', 'BONK'])]);
        const suggestions = await (0, agentverse_1.buildStrategyFromData)({ pools, prices });
        (0, events_1.broadcast)('arbitrage', { suggestions });
        return { suggestions };
    });
}
