import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] p-4 hidden md:block">
      <nav className="space-y-2">
        {/* Icons kept lightweight; swap for an icon pack later if desired */}
        <Link href="/" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]">Home</Link>
        <Link href="/dashboard" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]">Dashboard</Link>
        <Link href="/portfolio" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]">Portfolio Optimizer</Link>
        <Link href="/arbitrage" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]">Arbitrage Trader</Link>
        <Link href="/risk" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]">Risk Assessment</Link>
        {/* Removed separate Landing link since Home (/) now shows it */}
      </nav>
      <div className="mt-6 p-3 rounded border border-[var(--border)] bg-[#1b1b1b]">
        <div className="text-xs text-[var(--muted)]">Network</div>
        <div className="mt-1 text-sm">Solana Devnet</div>
        <div className="text-xs text-[var(--muted)]">Endpoint: env</div>
      </div>
    </aside>
  );
}