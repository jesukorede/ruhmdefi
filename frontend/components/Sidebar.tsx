import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4 hidden md:block">
      <nav className="space-y-2">
        <Link href="/" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
        <Link href="/arbitrage" className="block px-3 py-2 rounded hover:bg-gray-100">Arbitrage</Link>
        <Link href="/portfolio" className="block px-3 py-2 rounded hover:bg-gray-100">Portfolio</Link>
        <Link href="/risk" className="block px-3 py-2 rounded hover:bg-gray-100">Risk</Link>
      </nav>
    </aside>
  );
}