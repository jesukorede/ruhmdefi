import Link from 'next/link';
import MiniArea from '@/components/charts/MiniArea';

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Autonomous Solana DeFi — Optimize, Arbitrage, Assess Risk
              </h1>
              <p className="mt-4 text-[var(--muted)]">
                AgentVerse for reasoning, DeFiLlama for yields, Jupiter for atomic swaps, Helius for risk signals.
                Simulate now, execute on-chain later.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/arbitrage" className="btn btn-primary">Scan Arbitrage</Link>
                <Link href="/yield" className="btn btn-ghost">Explore Yield</Link>
                <Link href="/portfolio" className="btn btn-ghost">Optimize Portfolio</Link>
              </div>
              <div className="mt-3 text-xs text-[var(--muted)]">Devnet prototype • SSE live feed • Postgres caching</div>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded bg-[#1f1f1f] border border-[#2a2a2a]">
                  <div className="text-sm font-semibold">Portfolio Optimization</div>
                  <div className="text-xs text-gray-400 mt-1">AgentVerse + DeFiLlama + Smart Contracts</div>
                </div>
                <div className="p-4 rounded bg-[#1f1f1f] border border-[#2a2a2a]">
                  <div className="text-sm font-semibold">Arbitrage Trading</div>
                  <div className="text-xs text-gray-400 mt-1">AgentVerse + Jupiter API (atomic swaps)</div>
                </div>
                <div className="p-4 rounded bg-[#1f1f1f] border border-[#2a2a2a]">
                  <div className="text-sm font-semibold">DeFi Risk Assessment</div>
                  <div className="text-xs text-gray-400 mt-1">AgentVerse + Helius Webhooks</div>
                </div>
                <div className="p-4 rounded bg-[#1f1f1f] border border-[#2a2a2a]">
                  <div className="text-sm font-semibold">On-chain (Simulate first)</div>
                  <div className="text-xs text-gray-400 mt-1">Phantom + Solana devnet</div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4">
                  <div className="text-xs text-[var(--muted)]">24h Scan Yield</div>
                  <div className="text-lg font-semibold">+4.2%</div>
                  <MiniArea values={[10,12,9,13,15,16,14,18,20,19,21]} />
                </div>
                <div className="card p-4">
                  <div className="text-xs text-[var(--muted)]">Arb Confidence</div>
                  <div className="text-lg font-semibold">72%</div>
                  <MiniArea values={[40,42,45,43,47,50,49,51,55,53,57]} />
                </div>
                <div className="card p-4">
                  <div className="text-xs text-[var(--muted)]">Sim Success</div>
                  <div className="text-lg font-semibold">89%</div>
                  <MiniArea values={[60,58,61,63,65,66,70,69,71,73,74]} />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-400">Connect wallet (top-right) to simulate flows.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-xl md:text-2xl font-semibold">How It Works</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="rounded border border-[var(--border)] p-5 bg-[var(--surface)]">
              <div className="font-medium">1. Fetch & Cache</div>
              <div className="text-sm text-[var(--muted)] mt-1">DeFiLlama & Jupiter data; Postgres caching.</div>
            </div>
            <div className="rounded border border-[var(--border)] p-5 bg-[var(--surface)]">
              <div className="font-medium">2. Reason with AgentVerse</div>
              <div className="text-sm text-[var(--muted)] mt-1">Yield, arbitrage, and risk heuristics.</div>
            </div>
            <div className="rounded border border-[var(--border)] p-5 bg-[var(--surface)]">
              <div className="font-medium">3. Simulate → Execute</div>
              <div className="text-sm text-[var(--muted)] mt-1">Approve, simulate, then trigger Solana TXs.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}