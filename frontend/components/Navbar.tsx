'use client';

import WalletConnect from './WalletConnect';
import { Sun, Moon } from 'lucide-react';

type Props = {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
};

export default function Navbar({ theme = 'dark', onToggleTheme }: Props) {
  const deepLink =
    typeof window !== 'undefined'
      ? `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`
      : 'https://phantom.app/ul/browse/';

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--surface)]/75 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="RuhmDeFi" className="h-6 w-6" />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold">RuhmDeFi</span>
            <span className="text-xs text-[var(--muted)]">Autonomous trading on Solana (devnet)</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={deepLink}
            className="btn btn-ghost text-sm"
            title="Open this page in the Phantom app (mobile fallback)"
          >
            Open in Phantom
          </a>
          <button
            aria-label="Toggle theme"
            onClick={onToggleTheme}
            className="btn btn-ghost"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}