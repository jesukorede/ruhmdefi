'use client';

import WalletConnect from './WalletConnect';

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="RuhmDeFi" className="h-6 w-6" />
          <span className="font-semibold">RuhmDeFi</span>
          <span className="ml-2 text-xs rounded bg-yellow-100 px-2 py-0.5 text-yellow-700">devnet</span>
        </div>
        <WalletConnect />
      </div>
    </header>
  );
}