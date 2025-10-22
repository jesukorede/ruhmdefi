"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = yieldRoutes;
const defiData_1 = require("../services/defiData");
const events_1 = require("../services/events");
async function yieldRoutes(server) {
    server.get('/yield', async () => {
        const pools = await (0, defiData_1.getTopPools)(10);
        const ts = Date.now();
        const suggestions = pools.map((p, i) => ({
            trade_id: `yield-${ts}-${i}`,
            token_pair: p.symbol || 'SOL/USDC',
            strategy_summary: `Yield opportunity: ${p.project} ${p.pool} with APY ${p.apy.toFixed(2)}%.`,
            confidence_score: Math.min(95, Math.max(50, Math.round(p.apy))),
            expected_apy: p.apy,
            timestamp: ts,
        }));
        (0, events_1.broadcast)('yield', { suggestions, timestamp: ts });
        return { suggestions };
    });
}
