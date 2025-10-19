type Pool = {
  pool: string;
  apy: number;
  symbol: string;
  project: string;
  chain: string;
};

export async function getTopPools(limit = 10): Promise<Pool[]> {
  const res = await fetch('https://yields.llama.fi/pools');
  const json = await res.json();
  const pools = (json?.data || []) as Pool[];
  return pools
    .filter((p) => p.chain?.toLowerCase() === 'solana' && Number.isFinite(p.apy))
    .sort((a, b) => (b.apy || 0) - (a.apy || 0))
    .slice(0, limit);
}

export async function getJupiterPrices(ids: string[]) {
  const url = 'https://price.jup.ag/v4/price?ids=' + ids.join(',');
  const res = await fetch(url);
  const json = await res.json();
  return json?.data || {};
}