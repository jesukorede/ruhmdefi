import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] p-4 hidden md:block">
      <nav className="space-y-2">
        <Link href="/" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]">Dashboard</Link>
        <Link href="/arbitrage" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]">Arbitrage</Link>
        <Link href="/yield" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]">Yield</Link>
        <Link href="/portfolio" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]">Portfolio</Link>
        <Link href="/risk" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]">Risk</Link>
      </nav>
    </aside>
  );
}