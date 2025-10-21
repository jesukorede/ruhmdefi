'use client';

import WalletConnect from './WalletConnect';

export default function Navbar() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="RuhmDeFi" className="h-6 w-6" />
          <span className="font-semibold">RuhmDeFi</span>
          <span className="ml-2 text-xs rounded px-2 py-0.5 border border-yellow-600/40 bg-yellow-600/20 text-yellow-300">devnet</span>
        </div>
        <WalletConnect />
      </div>
    </header>
  );
}