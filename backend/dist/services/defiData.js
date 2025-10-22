"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopPools = getTopPools;
exports.getJupiterPrices = getJupiterPrices;
async function getTopPools(limit = 10) {
    try {
        const res = await fetch('https://yields.llama.fi/pools');
        const json = await res.json();
        // Wherever 'json' is produced (e.g., from fetch/parse), it's currently 'unknown'.
        // Fix property access by typing/casting the response shape:
        const pools = (json?.data) ?? [];
        return pools
            .filter((p) => p.chain?.toLowerCase() === 'solana' && Number.isFinite(p.apy))
            .sort((a, b) => (b.apy || 0) - (a.apy || 0))
            .slice(0, limit);
    }
    catch {
        // Fallback stub when network is unavailable
        return [
            { pool: 'stub-orca-sol-usdc', apy: 8.5, symbol: 'SOL/USDC', project: 'Orca', chain: 'solana' },
            { pool: 'stub-raydium-bonk-sol', apy: 12.3, symbol: 'BONK/SOL', project: 'Raydium', chain: 'solana' },
        ].slice(0, limit);
    }
}
async function getJupiterPrices(ids) {
    const url = 'https://price.jup.ag/v4/price?ids=' + ids.join(',');
    try {
        const res = await fetch(url);
        const json = await res.json();
        return (json?.data) ?? {};
    }
    catch {
        // Fallback when DNS/network fails
        return {};
    }
}
