'use client';

import WalletConnect from './WalletConnect';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { API_BASE } from '../lib/api';

type Props = {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
};

export default function Navbar({ theme = 'dark', onToggleTheme }: Props) {
  // Hydration-safe initial value; updated on client after mount
  const [phantomHref, setPhantomHref] = useState('https://phantom.app/ul/browse/');
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerIn, setDrawerIn] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLElement | null>(null);
  const [sseClients, setSseClients] = useState<number | null>(null);
  const isDev = useMemo(() => process.env.NODE_ENV !== 'production', []);
  const agentAddress = useMemo(() => (process.env.NEXT_PUBLIC_AGENT_ADDRESS || '').trim(), []);
  const truncatedAgent = useMemo(() => {
    const a = agentAddress;
    if (!a) return '';
    if (a.length <= 12) return a;
    return `${a.slice(0, 7)}…${a.slice(-6)}`;
  }, [agentAddress]);

  useEffect(() => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : '';
      if (url) {
        setPhantomHref(`https://phantom.app/ul/browse/${encodeURIComponent(url)}`);
      }
    } catch {
      // no-op
    }
  }, []);
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const cls = 'overflow-hidden';
    if (menuOpen) document.body.classList.add(cls);
    else document.body.classList.remove(cls);
    return () => document.body.classList.remove(cls);
  }, [menuOpen]);

  // Dev-only: poll /status for SSE client count
  useEffect(() => {
    if (!isDev) return;
    let timer: any;
    const tick = async () => {
      try {
        const res = await fetch(`${API_BASE}/status`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setSseClients(Number(json?.sse_clients ?? 0));
        }
      } catch {}
      timer = setTimeout(tick, 10000);
    };
    tick();
    return () => { if (timer) clearTimeout(timer); };
  }, [isDev]);

  // Focus trap & ESC close when drawer opens
  useEffect(() => {
    if (!menuOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    // Focus first focusable element
    const focusables = drawer.querySelectorAll<HTMLElement>(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (first) first.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setDrawerIn(false);
        setTimeout(() => setMenuOpen(false), 300);
      } else if (e.key === 'Tab' && focusables.length) {
        // Trap focus within drawer
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (last || first).focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          (first || last).focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Restore focus to opener when menu fully closes
  useEffect(() => {
    if (!menuOpen && openerRef.current) {
      try { openerRef.current.focus(); } catch {}
    }
  }, [menuOpen]);

  // Close drawer if viewport grows to md+
  useEffect(() => {
    const onResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 768 && menuOpen) {
        setDrawerIn(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [menuOpen]);

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--surface)]/75 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile: back + menu */}
          <div className="flex md:hidden items-center gap-2 mr-1">
            <button
              onClick={() => { try { history.back(); } catch {} }}
              className="btn btn-ghost text-sm px-2 py-1"
              aria-label="Go back"
              title="Back"
            >
              ←
            </button>
            <button
              ref={openerRef}
              onClick={() => { setMenuOpen(true); setTimeout(() => setDrawerIn(true), 0); }}
              className="btn btn-ghost text-sm px-2 py-1"
              aria-label="Open menu"
              title="Menu"
              aria-controls="mobile-menu-drawer"
              aria-expanded={menuOpen}
            >
              ☰
            </button>
          </div>
          <img src="/logo.svg" alt="RuhmDeFi" className="h-6 w-6" />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold">RuhmDeFi</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {/* Agent address pill (hidden if not set) */}
          {agentAddress && (
            <button
              onClick={async () => { try { await navigator.clipboard.writeText(agentAddress); } catch {} }}
              className="hidden sm:inline-flex items-center gap-2 text-xs px-2 py-1 rounded border border-[var(--border)] bg-[var(--surface)] hover:bg-[#1f1f1f]"
              title="Copy agent address"
            >
              <span className="opacity-70">Agent</span>
              <span className="font-mono">{truncatedAgent}</span>
            </button>
          )}
          {/* Dev-only status chip */}
          {isDev && (
            <span className="hidden md:inline-flex items-center text-xs px-2 py-1 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]" title="SSE clients connected">
              SSE {sseClients ?? '-'}
            </span>
          )}
          {/* Combined Wallet + Phantom group (sm+) */}
          <div className="hidden sm:flex items-stretch rounded overflow-hidden border border-[var(--border)]">
            <WalletConnect />
            <a
              href={phantomHref}
              className="inline-flex items-center px-3 text-sm bg-[var(--surface)] hover:bg-[#1f1f1f] whitespace-nowrap"
              title="Open this page in the Phantom app"
            >
              Open in Phantom
            </a>
          </div>
          {/* On xs screens, keep only wallet button for space */}
          <div className="sm:hidden"><WalletConnect /></div>
          <button
            aria-label="Toggle theme"
            onClick={onToggleTheme}
            className="btn btn-ghost"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${drawerIn ? 'opacity-100' : 'opacity-0'} bg-black/60`}
            onClick={() => { setDrawerIn(false); setTimeout(() => setMenuOpen(false), 300); }}
            aria-hidden="true"
            role="presentation"
            tabIndex={-1}
          />
          <nav
            ref={drawerRef as any}
            id="mobile-menu-drawer"
            aria-labelledby="mobile-menu-title"
            className={`absolute left-0 top-0 h-full w-[80vw] max-w-72 bg-[var(--surface)] border-r border-[var(--border)] p-4 overflow-y-auto transform transition-transform duration-300 shadow-xl ${drawerIn ? 'translate-x-0' : '-translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div id="mobile-menu-title" className="font-semibold">Menu</div>
              <button className="btn btn-ghost" onClick={() => { setDrawerIn(false); setTimeout(() => setMenuOpen(false), 300); }} aria-label="Close menu">✕</button>
            </div>
            <div className="space-y-2">
              <Link href="/" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]" onClick={() => { setDrawerIn(false); setTimeout(() => setMenuOpen(false), 300); }}>Home</Link>
              <Link href="/dashboard" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]" onClick={() => { setDrawerIn(false); setTimeout(() => setMenuOpen(false), 300); }}>Dashboard</Link>
              <Link href="/portfolio" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]" onClick={() => { setDrawerIn(false); setTimeout(() => setMenuOpen(false), 300); }}>Portfolio Optimizer</Link>
              <Link href="/arbitrage" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]" onClick={() => { setDrawerIn(false); setTimeout(() => setMenuOpen(false), 300); }}>Arbitrage Trader</Link>
              <Link href="/risk" className="block px-3 py-2 rounded text-[var(--foreground)] hover:bg-[#1f1f1f]" onClick={() => { setDrawerIn(false); setTimeout(() => setMenuOpen(false), 300); }}>Risk Assessment</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}