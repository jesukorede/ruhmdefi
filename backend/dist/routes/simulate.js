"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = simulateRoutes;
async function simulateRoutes(server) {
    server.post('/simulate', async (request) => {
        const body = request.body || {};
        const amount = Number(body.amount ?? 100);
        const slippage_bps = Number(body.slippage_bps ?? 50); // 0.50%
        const expected_apy = Number(body?.plan?.estimate?.net_apy ?? body?.expected_apy ?? 0);
        const confidence = Number(body?.plan?.estimate?.confidence ?? body?.confidence_score ?? 50);
        const fees_pct = Number(body?.fees_pct ?? 0.02); // example protocol/network fees
        const slippage_pct = slippage_bps / 10000 * 100; // bps to percent
        // Adjust APY by confidence and subtract fees/slippage
        let net_apy = expected_apy * (confidence / 100) - fees_pct - slippage_pct;
        net_apy = Math.max(0, net_apy);
        const projected_day_profit = amount * (net_apy / 100) / 365;
        const projected_30d_profit = amount * (net_apy / 100) * (30 / 365);
        const result = {
            inputs: { amount, slippage_bps, expected_apy, confidence },
            outputs: {
                net_apy,
                projected_day_profit,
                projected_30d_profit,
            },
            assumptions: { fees_pct, slippage_pct },
            timestamp: Date.now(),
        };
        return { simulation: result };
    });
}
